<?php
	include_once "../Includes/util.php";
	include_once "../Includes/simple_html_dom.php";
		
	if(isset($_GET["matchID"]))
	{		
		$matchID = $_GET["matchID"];
		$match = array();
		
		// On récupère l'historique du joueur
		$url = "https://euw.api.pvp.net/api/lol/euw/v2.2/match/".$matchID."?api_key=84437920-ce89-4491-97bd-df592330ab93";
		$json = json_decode(@file_get_contents($url), true);
		if(!empty($json)) {
			echo($json);
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