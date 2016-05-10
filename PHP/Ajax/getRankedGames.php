<?php
	include_once "../Includes/LOLApi.php";
	include_once "../Includes/database.php";
	include_once "../Includes/util.php";
	include_once "../Includes/simple_html_dom.php";
	
	if(isset($_GET["summonerID"]) && isset($_GET["type"]))
	{
		$sumID = $_GET["summonerID"];
		$type = $_GET["type"];
		//
		$LOLApi = new LOLApi();
		$LOLApi->setSummonerID($_GET["summonerID"]);

		$champions = array();
		
		switch($type)
		{
			case "SOLO":
				echo $LOLApi->setLastAccess();
				// do
				// {
					// $data = $LOLApi->getData("RANKED_SOLO_5x5");
					// if($data < 0)
					// {
						// echo $data;
						// break;
					// }
					// else
					// {
						// $json = json_decode($data, true);
						// if(!empty($json))
						// {
							// // Mise à jour de l'index de recherche
							// $LOLApi->setIndex($LOLApi->getIndex() + count($json["matches"]));
							
							// foreach($json["matches"] as $match)
							// {
								// $matchInfo = $match["participants"][0];
								
								// // Recherche du champions courant dans la tableau de résultats
								// $found = false;
								// $i=0;
								// foreach($champions as $champ)
								// {
									// if($champ["id"] == $match["participants"][0]["championId"])
									// {
										// $found = true;
										// break;
									// }
									// $i++;
								// }
								
								// if($found)
								// {
									// $champions[$i]["games"]++;
									// $champions[$i]["wins"]+= (int)$matchInfo["stats"]["winner"];
								// }
								// else
									// array_push($champions, ["id"=>$matchInfo["championId"],
															// "games"=>1, 
															// "wins"=>(int)$matchInfo["stats"]["winner"]]);
							// }
						// }
					// }
				// } while(!empty($json));
				
				result(0,$champions);
				break;
			case "TEAM5":
				break;
			default :
				result(-2);
		}
	}
	else
		result(-1);
	
	
	/////////////////////////////////////////////
	// Résultats - $code (Erreur si <0), OPTIONNAL $data = donnée à retourner
	function result($code, $data = NULL)
	{
		if($code < 0)
			$response_array['status'] = "error";
		else
			$response_array['status'] = "success";
			
		switch($code)
		{
			case -4: $response_array['message'] = "setLastAccess error"; break;
			case -3: $response_array['message'] = "getData timeout"; break;
			case -2: $response_array['message'] = "Invalid parameter"; break;
			case -1: $response_array['message'] = "Missing parameters";	break;
			case 0: $response_array['champions'] = $data;	break;
		}
		
		echo json_encode($response_array);
	}
?>