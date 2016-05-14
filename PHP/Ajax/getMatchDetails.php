<?php
	include_once "../Includes/LOLApi.php";
	include_once "../Includes/database.php";
	include_once "../Includes/util.php";
	include_once "../Includes/simple_html_dom.php";

	session_start();

	if(isset($_GET["matchID"]))
	{		
		$matchID = $_GET["matchID"];
		$match = array();
		
		// On récupère l'historique du joueur
		$url = "https://euw.api.pvp.net/api/lol/euw/v2.2/match/".$matchID."?api_key=84437920-ce89-4491-97bd-df592330ab93";
		$json = json_decode(@file_get_contents($url), true);
		if(!empty($json)) {

			if(isset($_SESSION['LOLApi'])){
				$LOLApi = new LOLApi($_SESSION['LOLApi']);

				$match_playerID = null;
				$win = null;
				foreach ($json['participantIdentities'] as $key => $value) {
					if($value["player"]["summonerId"] == $LOLApi->getSummonerID())
						$match_playerID = $value["participantId"];
				}

				foreach ($json['participants'] as $key => $value) {
					if($value["participantId"] == $match_playerID)
						$win = $value["stats"]["winner"];
				}

				$match["win"] = $win;

				// Résultats
				$response_array['status'] = "success";
				$response_array['match'] = $match;
				echo json_encode($response_array);
			}
			else
			{
				// Résultats
				$response_array['status'] = "error";
				$response_array['message'] = "Session error";
				echo json_encode($response_array);
				exit();
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
	}
	else
	{
		// Résultats
		$response_array['status'] = "error";
		$response_array['message'] = "Missing parameters";
		echo json_encode($response_array);
	}
?>