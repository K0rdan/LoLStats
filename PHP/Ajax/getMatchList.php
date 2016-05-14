<?php
	include_once "../Includes/LOLApi.php";
	include_once "../Includes/util.php";
	include_once "../Includes/simple_html_dom.php";
		
	if(isset($_GET["summonerID"]))
	{		
		$LOLApi = new LOLApi();
		$LOLApi->setSummonerID($_GET["summonerID"]);
		
		$sumID = $_GET["summonerID"];
		
		$matches = array();
		
		// On récupère l'historique du joueur
		$url = "https://euw.api.pvp.net/api/lol/euw/v2.2/matchlist/by-summoner/".$sumID."?rankedQueues=TEAM_BUILDER_DRAFT_RANKED_5x5,RANKED_SOLO_5x5,RANKED_TEAM_5x5&api_key=84437920-ce89-4491-97bd-df592330ab93";		
		$json = json_decode(@file_get_contents($url), true);
		if(!empty($json))
		{
			foreach($json["matches"] as $m)
			{
				$match["matchId"] = $m["matchId"];
				$match["champion"] = $m["champion"];
				$match["lane"] = $m["lane"];
				$match["role"] = $m["role"];
				
				array_push($matches, $match);
			}
		}
		else
		{
			// Résultats
			$response_array['status'] = "error";
			$response_array['message'] = "No ranked games found";
			echo json_encode($response_array);
			exit();
		}
		
		// Résultats
		$response_array['status'] = "success";
		$response_array['matches'] = $matches;
		echo json_encode($response_array);
	}
	else
	{
		// Résultats
		$response_array['status'] = "error";
		$response_array['message'] = "Missing parameters";
		echo json_encode($response_array);
	}
?>