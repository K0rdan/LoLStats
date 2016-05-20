$(document).ready(function(){
	var static_data = null;
	var statistics = {};

	const WS_HOST = "localhost";
	const WS_PORT = "8080";
	var socket = null;

	// Functions
	function getMatches(matchList) {
		if(summonerID != 0){
			$.ajax({
				type: "GET",
				url: "./PHP/Ajax/roleDistribution.php",
				dataType: "json",
				async: true,
				success: function (data) {
					static_data = data.data.champions;
					$.each(data.data.roles, function(index, obj){
						statistics[obj] = {
							games: 0,
							wins: 0,
							losses: 0
						};
					});

					pieData = getPieData(statistics);
					pie10Last.pieData = pieData;
					pie10Last.max = getMaxPieData(pieData);
					gaugeData10Last = getGaugeData(statistics);

					var selectedData10Last;

					// Affichage du graphe '10Last'
					$("#Chart10LastRanked > .ChartContent > .RoleDistribution").dxPieChart({
						dataSource: pie10Last.pieData,
						commonSeriesSettings: {
							hoverStyle: { hatching: { opacity: 0.9 } },
							selectionStyle: { hatching: { opacity: 0.75 } }
						},
						series: {
							type: 'doughnut',
							innerRadius: 0.75,
							argumentField: 'Role',
							valueField: 'Value',
							border: {
								visible: true,
								color: '#121212'
							},
							selectionStyle: {
								border: {
									visible: true,
									color: '#121212'
								}
							}
						},
						pointClick: function (clickedPoint) {
							clickedPoint.fullState & 2 ? clickedPoint.clearSelection() : clickedPoint.select();
							$("#Chart10LastRanked > .ChartContent > .ChartInfo > span.SelectedValue").html(Math.round(clickedPoint.percent*100)+"%");
							$("#Chart10LastRanked > .ChartContent > .ChartInfo > span.SelectedValue").css("margin-left", "-"+parseInt($("#Chart10LastRanked > .ChartContent > .ChartInfo > span.SelectedValue").css("width"))/2+"px");
							$("#Chart10LastRanked > .ChartContent > .ChartInfo > img.SelectedIcon").attr("src","./Images/Role_"+clickedPoint.argument+".png");

							$.each(gaugeData10Last, function(index, obj){
								if(gaugeData10Last[index].Role == clickedPoint.argument)
								{
									$('#Chart10LastRanked > .ChartContent > .WinRate').dxCircularGauge("instance").value(gaugeData10Last[index].WinRate);
									$('#Chart10LastRanked > .ChartContent > .WinRate').dxCircularGauge("instance").subvalues(gaugeData10Last[index].WinRate);

									var couleur;
									if(gaugeData10Last[index].WinRate < 60)
									{
										if(gaugeData10Last[index].WinRate < 50)
										{
											if(gaugeData10Last[index].WinRate < 40)
												couleur="red";
											else
												couleur="orange";
										}
										else
											couleur="yellow";
									}
									else
										couleur="green";

									$('#Chart10LastRanked > .ChartContent > .WinRate').dxCircularGauge("instance").option({
										valueIndicator: {
											text: {
												font: {
													color: couleur
												}
											}
										},
										subValueIndicator: {
											color: couleur
										}
									});
								}
							});
						},
						legend: { visible: false },
						palette: [paletteRoles.Assassin, paletteRoles.Fighter, paletteRoles.Mage, paletteRoles.Marksman, paletteRoles.Support, paletteRoles.Tank]
					});

					$.each($("#Chart10LastRanked > .ChartContent > .RoleDistribution").dxPieChart("instance").series[0]._points, function(_, point){
						if(point.originalValue == pie10Last.max)
						{
							$("#Chart10LastRanked > .ChartContent > .ChartInfo > span.SelectedValue").html(Math.round(point.percent*100)+"%");
							$("#Chart10LastRanked > .ChartContent > .ChartInfo > img.SelectedIcon").attr("src","./Images/Role_"+point.argument+".png");
							$("#Chart10LastRanked > .ChartContent > .ChartInfo").css("display","block");
							point.select();

							$.each(gaugeData10Last, function(index, obj){
								if(gaugeData10Last[index].Role == point.argument)
									selectedData10Last = gaugeData10Last[index];
							});
						}
					});

					// Affichage du graphe 'Winrate 10Last'
					$('#Chart10LastRanked > .ChartContent > .WinRate').dxCircularGauge({
						scale: {
							startValue: 0,
							endValue: 100,
							majorTick: {
								tickInterval: 10
							},
							label: {
								visible:true,
								precision:0,
								indentFromTick:2,
								font: {
									size: 10
								}
							}
						},
						rangeContainer: {
							ranges: [
								{ startValue: 0, endValue: 40, color: 'red' },
								{ startValue: 40, endValue: 50, color: 'orange' },
								{ startValue: 50, endValue: 60, color: 'yellow' },
								{ startValue: 60, endValue: 100, color: 'green' }
							]
						},
						valueIndicator: {
							type: "rangeBar",
							color:"transparent",
							offset:5,
							size:5,
							text: {
								indent: 15,
								format: 'fixedPoint',
								precision: 0,
								font: {
									color: function(){
										if(selectedData10Last.WinRate < 60)
										{
											if(selectedData10Last.WinRate < 50)
											{
												if(selectedData10Last.WinRate < 40)
													return "red";
												else
													return "orange";
											}
											else
												return "yellow";
										}
										else
											return "green";
									}
								}
							}
						},
						subvalueIndicator: {
							width:8,
							length:8,
							offset:0,
							color: function(){
								if(selectedData10Last.WinRate < 60)
								{
									if(selectedData10Last.WinRate < 50)
									{
										if(selectedData10Last.WinRate < 40)
											return "red";
										else
											return "orange";
									}
									else
										return "yellow";
								}
								else
									return "green";
							},
						},
						subvalues: selectedData10Last.WinRate,
						value: selectedData10Last.WinRate
					});

					// GET matches details
					console.log("[WS] Connectecting to " + WS_HOST + ":" + WS_PORT);
					socket = io.connect(WS_HOST+":"+WS_PORT);
					socket.emit('setSummonerID', summonerID);
					socket.emit('getMatchesDetails',matchList);
					socket.on('message', function(msg){
						console.log("[WS][Server] ", msg);
					});
					socket.on('LOLApi_MatchDetails', function(matchStats){
						console.log("[WS][Server] match details : ",matchStats);
						$.each(static_data, function(index, champion){
							if(matchStats.champion == champion.staticID){
								statistics[champion["role1"]].games++;
								if(champion["role2"] != "N/A")
									statistics[champion["role2"]].games++;
								if(matchStats["win"])
								{
									statistics[champion["role1"]].wins++;
									if(champion["role2"] != "N/A")
										statistics[champion["role2"]].wins++;
								}
								else
								{
									statistics[champion["role1"]].losses++;
									if(champion["role2"] != "N/A")
										statistics[champion["role2"]].losses++;
								}
							}
						});

						pieData = getPieData(statistics);
						pie10Last.pieData = pieData;
						pie10Last.max = getMaxPieData(pieData);
						gaugeData10Last = getGaugeData(statistics);

						$("#Chart10LastRanked > .ChartContent > .RoleDistribution").dxPieChart("instance").option('dataSource', pie10Last.pieData);
						$('#Chart10LastRanked > .ChartContent > .WinRate').dxCircularGauge("instance").option('value', selectedData10Last.WinRate);
					});
				}
			});
		}
		else
			console.log("SummonerID not defined");
		/*$.each(matchList, function(i, matchInfo) {
			getMatch(matchInfo.matchId);
		});*/
	}
	function getMatch(matchId) {
		$.ajax({
			type: "GET",
			url: "./PHP/Ajax/getMatchDetails?matchID="+matchId,
			dataType: "json",
			beforeSend: function (xhr) {
				$("#RoleCharts > .blockContent").append("<div class=\"loader_container\"><div class=\"loader\">Chargement...</div></div>");
			},
			success: function(data) {
				$("#RoleCharts > .blockContent > .loader_container").remove();
				
				if (data.status == "success") {
					console.log(data);
				}
				else
					console.log(data.message);
			}
		});
	}
	
	function getPieData(data){
		var pieData = new Array();
		$.each(data, function(name, value){
			var role = new Object();
				role["Role"] = name;
				role["Value"] = value.games;
			pieData.push(role);
		});
		
		return pieData;
	}
	
	function getMaxPieData(pieData){
		var max = 0;
		for(var i=0;i<pieData.length;i++)
		{
			if(max < pieData[i]["Value"])
				max = pieData[i]["Value"];
		}
		return max;
	}
	
	function getGaugeData(data) {
		var gaugeData = new Array();
		$.each(data, function(name, value){
			var role = new Object();
				role["Role"] = name;
				if((value.wins+value.losses) > 0)
					role["WinRate"] = parseInt(value.wins/(value.wins+value.losses)*100);
				else
					role["WinRate"] = 0;
			gaugeData.push(role);
		});
		return gaugeData;		
	}
	
	function loadRoleDistribution() {
		var result = 0, pieData, gaugeData;	

		// Affichage de la zone du graphe
		// if($("#RoleCharts > .blockContent").css("display") == "none")
		// {
			// $("#RoleCharts > .blockContent").slideDown();
			$("#RoleCharts > .blockTitle > .collapser").css("display","block");
		// }	
		
		$.ajax({
			type: "GET",
			url: "./PHP/Ajax/getMatchList?summonerID="+summonerID,
			dataType: "json",
			beforeSend: function (xhr) {
				$("#RoleCharts > .blockContent").append("<div class=\"loader_container\"><div class=\"loader\">Chargement...</div></div>");
			},
			success: function(data) {
				/*
					data : [
						{ matchId: (int), champion: (int), lane: (string), role: (string) }, ...
					]
				*/
				$("#RoleCharts > .blockContent > .loader_container").remove();
				
				if (data.status == "success") {
					getMatches(data.matches);
				}
				else
					console.log("MatchListError : " + data.message);
			}
		});
		
		/*$.ajax({
			type: "GET",
			url: "./PHP/Ajax/roleDistribution.php?type=10last&summonerID="+summonerID,
			dataType:"json",
			async: true,
			beforeSend: function (xhr){
				$("#RoleCharts > .blockContent").append("<div class=\"loader_container\"><div class=\"loader\">Chargement...</div></div>");
			},
			success: 
				function(data){
					$("#RoleCharts > .blockContent > .loader_container").remove();
				
					if(data.status == "success")
					{
						pieData = getPieData(data);
						pie10Last.pieData = pieData;
						pie10Last.max = getMaxPieData(pieData);
						gaugeData10Last = getGaugeData(data);
						
						var selectedData10Last;
						
						// Affichage du graphe '10Last'
						$("#Chart10LastRanked > .ChartContent > .RoleDistribution").dxPieChart({
							dataSource: pie10Last.pieData,
							commonSeriesSettings: { 
								hoverStyle: { hatching: { opacity: 0.9 } }, 
								selectionStyle: { hatching: { opacity: 0.75 } }
							},
							series: { 
								type: 'doughnut',
								innerRadius: 0.75, 
								argumentField: 'Role', 
								valueField: 'Value', 
								border: { 
									visible: true, 
									color: '#121212' 
								},
								selectionStyle: { 
									border: { 
										visible: true,
										color: '#121212' 
									} 
								} 
							},
							pointClick: function (clickedPoint) {
								clickedPoint.fullState & 2 ? clickedPoint.clearSelection() : clickedPoint.select();
								$("#Chart10LastRanked > .ChartContent > .ChartInfo > span.SelectedValue").html(Math.round(clickedPoint.percent*100)+"%");
								$("#Chart10LastRanked > .ChartContent > .ChartInfo > span.SelectedValue").css("margin-left", "-"+parseInt($("#Chart10LastRanked > .ChartContent > .ChartInfo > span.SelectedValue").css("width"))/2+"px");
								$("#Chart10LastRanked > .ChartContent > .ChartInfo > img.SelectedIcon").attr("src","./Images/Role_"+clickedPoint.argument+".png");
								
								$.each(gaugeData10Last, function(index, obj){
									if(gaugeData10Last[index].Role == clickedPoint.argument)
									{
										$('#Chart10LastRanked > .ChartContent > .WinRate').dxCircularGauge("instance").value(gaugeData10Last[index].WinRate);
										$('#Chart10LastRanked > .ChartContent > .WinRate').dxCircularGauge("instance").subvalues(gaugeData10Last[index].WinRate);
										
										var couleur;
										if(gaugeData10Last[index].WinRate < 60)
										{
											if(gaugeData10Last[index].WinRate < 50)
											{
												if(gaugeData10Last[index].WinRate < 40)
													couleur="red";
												else
													couleur="orange";
											}
											else
												couleur="yellow";
										}
										else
											couleur="green";
										
										$('#Chart10LastRanked > .ChartContent > .WinRate').dxCircularGauge("instance").option({
											valueIndicator: {
												text: {
													font: {
														color: couleur
													}
												}
											},
											subValueIndicator: {
												color: couleur
											}
										});
									}
								});
							},
							legend: { visible: false },
							palette: [paletteRoles.Assassin, paletteRoles.Fighter, paletteRoles.Mage, paletteRoles.Marksman, paletteRoles.Support, paletteRoles.Tank]
						});

						$.each($("#Chart10LastRanked > .ChartContent > .RoleDistribution").dxPieChart("instance").series[0]._points, function(_, point){
							if(point.originalValue == pie10Last.max)
							{
								$("#Chart10LastRanked > .ChartContent > .ChartInfo > span.SelectedValue").html(Math.round(point.percent*100)+"%");							
								$("#Chart10LastRanked > .ChartContent > .ChartInfo > img.SelectedIcon").attr("src","./Images/Role_"+point.argument+".png");
								$("#Chart10LastRanked > .ChartContent > .ChartInfo").css("display","block");
								point.select();
								
								$.each(gaugeData10Last, function(index, obj){
									if(gaugeData10Last[index].Role == point.argument)
										selectedData10Last = gaugeData10Last[index];
								});
							}
						});
						
						// Affichage du graphe 'Winrate 10Last'
						$('#Chart10LastRanked > .ChartContent > .WinRate').dxCircularGauge({
							scale: {
								startValue: 0,
								endValue: 100,
								majorTick: {
									tickInterval: 10
								},
								label: {
									visible:true,
									precision:0,
									indentFromTick:2,
									font: {
										size: 10
									}
								}
							},
							rangeContainer: {
								ranges: [
									{ startValue: 0, endValue: 40, color: 'red' },
									{ startValue: 40, endValue: 50, color: 'orange' },
									{ startValue: 50, endValue: 60, color: 'yellow' },
									{ startValue: 60, endValue: 100, color: 'green' }
								]
							},
							valueIndicator: {
								type: "rangeBar",
								color:"transparent",
								offset:5,
								size:5,
								text: {
									indent: 15,
									format: 'fixedPoint',
									precision: 0,
									font: {
										color: function(){
											if(selectedData10Last.WinRate < 60)
											{
												if(selectedData10Last.WinRate < 50)
												{
													if(selectedData10Last.WinRate < 40)
														return "red";
													else
														return "orange";
												}
												else
													return "yellow";
											}
											else
												return "green";
										}
									}
								}
							},
							subvalueIndicator: {
								width:8,
								length:8,
								offset:0,
								color: function(){
									if(selectedData10Last.WinRate < 60)
									{
										if(selectedData10Last.WinRate < 50)
										{
											if(selectedData10Last.WinRate < 40)
												return "red";
											else
												return "orange";
										}
										else
											return "yellow";
									}
									else
										return "green";
								},
							},
							subvalues: selectedData10Last.WinRate,
							value: selectedData10Last.WinRate
						});
						
						// Récupération des données pour le 2nd graphe
						$.ajax({
							type: "GET",
							url: "./PHP/Ajax/roleDistribution.php?type=overall&summonerID="+summonerID,
							dataType:"json",
							async:true,
							success: 
								function(data){
									if(data.status == "success")
									{
										pieData = getPieData(data);
										pieOverall.pieData = pieData;
										pieOverall.max = getMaxPieData(pieData);
										gaugeDataOverall = getGaugeData(data);
										
										var selectedDataOverall;
										
										$("#ChartOverall > .ChartContent > .RoleDistribution").dxPieChart({
											dataSource: pieOverall.pieData,
											commonSeriesSettings: {	
												hoverStyle: { hatching: { opacity: 0.9 } },
												selectionStyle: { hatching: { opacity: 0.75 } }
											},
											series: {
												type: 'doughnut',
												innerRadius: 0.75,
												argumentField: 'Role',
												valueField: 'Value',
												border: {
													visible: true,
													color: '#121212'
												},
												selectionStyle: {
													border: {
														visible: true,
														color: '#121212'
													}
												}
											},
											pointClick: function (clickedPoint) {
												clickedPoint.fullState & 2 ? clickedPoint.clearSelection() : clickedPoint.select();
												$("#ChartOverall > .ChartContent > .ChartInfo > span.SelectedValue").html(Math.round(clickedPoint.percent*100)+"%");
												$("#ChartOverall > .ChartContent > .ChartInfo > span.SelectedValue").css("margin-left", "-"+parseInt($("#ChartOverall > .ChartContent > .ChartInfo > span.SelectedValue").css("width"))/2+"px");
												$("#ChartOverall > .ChartContent > .ChartInfo > img.SelectedIcon").attr("src","./Images/Role_"+clickedPoint.argument+".png");
												
												$.each(gaugeDataOverall, function(index, obj){
													if(gaugeDataOverall[index].Role == clickedPoint.argument)
													{
														$('#ChartOverall > .ChartContent > .WinRate').dxCircularGauge("instance").value(gaugeDataOverall[index].WinRate);
														$('#ChartOverall > .ChartContent > .WinRate').dxCircularGauge("instance").subvalues(gaugeDataOverall[index].WinRate);
														
														var couleur;
														if(gaugeDataOverall[index].WinRate < 60)
														{
															if(gaugeDataOverall[index].WinRate < 50)
															{
																if(gaugeDataOverall[index].WinRate < 40)
																	couleur="red";
																else
																	couleur="orange";
															}
															else
																couleur="yellow";
														}
														else
															couleur="green";
														
														$('#ChartOverall > .ChartContent > .WinRate').dxCircularGauge("instance").option({
															valueIndicator: {
																text: {
																	font: {
																		color: couleur
																	}
																}
															},
															subValueIndicator: {
																color: couleur
															}
														});
													}
												});
											},
											legend: { visible: false },
											palette: [paletteRoles.Assassin, paletteRoles.Fighter, paletteRoles.Mage, paletteRoles.Marksman, paletteRoles.Support, paletteRoles.Tank]
										});
										
										$.each($("#ChartOverall > .ChartContent > .RoleDistribution").dxPieChart("instance").series[0]._points, function(_, point){
											if(point.originalValue == pieOverall.max)
											{
												$("#ChartOverall > .ChartContent > .ChartInfo > span.SelectedValue").html(Math.round(point.percent*100)+"%");					
												$("#ChartOverall > .ChartContent > .ChartInfo > img.SelectedIcon").attr("src","./Images/Role_"+point.argument+".png");
												$("#ChartOverall > .ChartContent > .ChartInfo").css("display","block");
												point.select();
												
												$.each(gaugeDataOverall, function(index, obj){
													if(gaugeDataOverall[index].Role == point.argument)
														selectedDataOverall = gaugeDataOverall[index];
												});
											}
										});
										
										// Affichage du graphe 'Winrate 10Last'
										$('#ChartOverall > .ChartContent > .WinRate').dxCircularGauge({
											scale: {
												startValue: 0,
												endValue: 100,
												majorTick: {
													tickInterval: 10
												},
												label: {
													visible:true,
													precision:0,
													indentFromTick:2,
													font: {
														size: 10
													}
												}
											},
											rangeContainer: {
												ranges: [
													{ startValue: 0, endValue: 40, color: 'red' },
													{ startValue: 40, endValue: 50, color: 'orange' },
													{ startValue: 50, endValue: 60, color: 'yellow' },
													{ startValue: 60, endValue: 100, color: 'green' }
												]
											},
											valueIndicator: {
												type: "rangeBar",
												color:"transparent",
												offset:5,
												size:5,
												text: {
													indent: 15,
													format: 'fixedPoint',
													precision: 0,
													font: {
														color: function(){
															if(selectedDataOverall.WinRate < 60)
															{
																if(selectedDataOverall.WinRate < 50)
																{
																	if(selectedDataOverall.WinRate < 40)
																		return "red";
																	else
																		return "orange";
																}
																else
																	return "yellow";
															}
															else
																return "green";
														}
													}
												}
											},
											subvalueIndicator: {
												width:8,
												length:8,
												offset:0,
												color: function(){
													if(selectedDataOverall.WinRate < 60)
													{
														if(selectedDataOverall.WinRate < 50)
														{
															if(selectedDataOverall.WinRate < 40)
																return "red";
															else
																return "orange";
														}
														else
															return "yellow";
													}
													else
														return "green";
												},
											},
											subvalues: selectedDataOverall.WinRate,
											value: selectedDataOverall.WinRate
										});
									}
									else
									{
										alert(data.message);
									}
								}
						});
					}
					else
					{
						result = -1; // 'No ranked games found'
						console.log(data.message);
					}
				}
		});*/
		
		return result;
	}
	
	function toggle_block(block){
		$(block).toggleClass("col-xs-12 col-xs-4");
		$(block).toggleClass("col-sm-12 col-sm-4");
		$(block).find(".thumb_title > span").toggleClass("exp col");
		$(block).find(".thumb_snapshot").toggle();
		$(".list_block").not(block).toggle();
	}
	
	// Variables
	var summonerName = "", summonerID = 0;
	var paletteRoles = {"Assassin":"#d9534f","Fighter":"#f0ad4e","Mage":"#428bca","Marksman":"#449d44","Support":"#5bc0de","Tank":"#9e9e9e"};
	var pie10Last = { "pieData" : "", "max" : "" }, pieOverall = { "pieData" : "", "max" : "" };
	
	// Init 
	$("body").addClass("body_init");
	
	// Events
	$("#SearchValidation").click(function(e){
		if($("#SummonerName").val() != "")
		{	
			summonerName = $("#SummonerName").val();
			
			var searchTop = $("#Search").css("top").replace("px","");
			if(parseFloat(searchTop) != 0) {
				$("#Search_BG").fadeTo(1000, 0);
				$("#Search").animate({ top:35 }, 1000, function(){
					$("body").removeClass("body_init");
					$(this).css("position","relative");
					$(this).css("top","0");
					$(this).css("left","0");				
					$(this).css("margin","10px auto");
				});
			}
			
			$.ajax({
				type: "GET",
				url: "./PHP/Ajax/getSummonerID.php?summonerName="+summonerName,
				dataType:"json",
				async:true,
				success: 
					function(data){
						if(data.status == "success")
						{
							summonerID = data.ID;
							loadRoleDistribution();
							
							$("#RoleCharts").css("display","block");
							$("#list").css("display","block");
						}
						else
						{
							console.log(data.message);
						}
					}
			});
		}
		e.preventDefault();
	});
	
	$(".blockTitle > span.collapser").click(function(){
		if(summonerName != "")
		{
			$(this).closest(".block").find(".blockContent").slideToggle();
			$(this).toggleClass("up");
		}
		else
		{
			
		}
	});
				
	$(".list_block").mousemove(function(){
		if($(this).attr("class") == "list_block col-xs-4 col-sm-4")
		{
			$(this).css("cursor","pointer");
		}
		else
		{
			$(this).css("cursor","default");
		}
	});
	$(".list_block").click(function(){
		if($(this).attr("class") == "list_block col-xs-4 col-sm-4")
		{
			toggle_block(this);
		}
	});
	
	$(".thumb_title > span").click(function(e){
		e.stopPropagation();
		toggle_block($(this).closest(".list_block"));
	});
});