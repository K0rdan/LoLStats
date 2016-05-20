<?php
	session_start();
?>
<!DOCTYPE html>
<html>
	<head>
		<title>LOLStats</title>
		<meta charset="UTF-8" />
		
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
		<link rel="stylesheet" type="text/css" href="./CSS/main.css">
		
		<script type="text/javascript" src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
		<script src="http://ajax.aspnetcdn.com/ajax/globalize/0.1.1/globalize.min.js"></script>
		<script type="text/javascript" src="http://cdn3.devexpress.com/jslib/14.1.6/js/dx.chartjs.js"></script>
		<script type="text/javascript" src="http://cdn3.devexpress.com/jslib/15.2.9/js/dx.chartjs.js"></script>
		<script type="text/javascript" src="./JS/node_modules/socket.io-client/socket.io.js"></script>
		<script type="text/javascript" src="./JS/main.js"></script>
	</head>
	<body>
		<div id="Search_Container">
			<div id="Search_BG"></div>
			<div id="Search" class="row">
				<form>
					<input type="text" id="SummonerName" class="col-md-10" placeholder="Enter a summoner name">
					<input type="submit" id="SearchValidation" class="col-md-2" value="Search">
				</form>
			</div>	
		</div>
		<div id="RoleCharts" class="block">
			<div class="blockTitle">Role distribution<span class="collapser"></span></div>
			<div class="blockContent">
				<div id="Chart10LastRanked" class="Chart">
					<div class="ChartTitle">10 Last ranked solo</div>
					<div class="ChartContent">
						<div class="ChartInfo">
							<span class="SelectedValue"></span>
							<img class="SelectedIcon" src="" alt="" />
						</div>
						<div class="RoleDistribution"></div>
						<div class="WinRate"></div>
					</div>
				</div>
				<div id="ChartOverall" class="Chart">
					<div class="ChartTitle">Over all ranked games</div>
					<div class="ChartContent">
						<div class="ChartInfo">
							<span class="SelectedValue"></span>
							<img class="SelectedIcon" src="" alt="" />
						</div>
						<div class="RoleDistribution"></div>
						<div class="WinRate"></div>
					</div>
				</div>
				
				<div id="ChartLegend">
					<div class="col-md-2">
						<div class="ChartLegendItem">
							<img class="ChartLegend_Image" src="./Images/Role_Assassin_Legend.png" alt="" />
							<span class="ChartLegend_Value">Assassin</span>
						</div>
					</div>
					<div class="col-md-2">
						<div class="ChartLegendItem">
							<img class="ChartLegend_Image" src="./Images/Role_Fighter_Legend.png" alt="" />
							<span class="ChartLegend_Value">Fighter</span>
						</div>
					</div>
					<div class="col-md-2">
						<div class="ChartLegendItem">
							<img class="ChartLegend_Image" src="./Images/Role_Mage_Legend.png" alt="" />
							<span class="ChartLegend_Value">Mage</span>
						</div>
					</div>
					<div class="col-md-2">
						<div class="ChartLegendItem">
							<img class="ChartLegend_Image" src="./Images/Role_Marksman_Legend.png" alt="" />
							<span class="ChartLegend_Value">Marksman</span>
						</div>
					</div>
					<div class="col-md-2">
						<div class="ChartLegendItem">
							<img class="ChartLegend_Image" src="./Images/Role_Support_Legend.png" alt="" />
							<span class="ChartLegend_Value">Support</span>
						</div>
					</div>
					<div class="col-md-2">
						<div class="ChartLegendItem">
							<img class="ChartLegend_Image" src="./Images/Role_Tank_Legend.png" alt="" />
							<span class="ChartLegend_Value">Tank</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="list" class="block row">
			<div class="blockTitle">
				Outils
			</div>
			<div id="list_content" class="col-xs-12 col-sm-12">
				<div id="block1" class="list_block col-xs-4 col-sm-4">
					<div class="thumb">
						<div class="thumb_title">Lane occupation<span class="exp"></span></div>
						<div class="thumb_content">
							<div class="thumb_snapshot">
								<img src="./Images/Map.png" alt="" />
								<span class="comingsoon">Coming soon...</span>
							</div>
						</div>
					</div>
				</div>
				<div id="block2" class="list_block col-xs-4 col-sm-4">
					<div class="thumb">
						<div class="thumb_title">Test<span class="exp"></span></div>
						<div class="thumb_content">TEST</div>
					</div>
				</div>
				<div id="block3" class="list_block col-xs-4 col-sm-4">
					<div class="thumb">
						<div class="thumb_title">Test<span class="exp"></span></div>
						<div class="thumb_content">TEST</div>
					</div>
				</div>
				<div id="block4" class="list_block col-xs-4 col-sm-4">
					<div class="thumb">
						<div class="thumb_title">Test<span class="exp"></span></div>
						<div class="thumb_content">TEST</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>