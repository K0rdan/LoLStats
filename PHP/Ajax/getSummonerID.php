<?php
	include_once "../Includes/LOLApi.php";
	include_once "../Includes/database.php";
	include_once "../Includes/util.php";
	include_once "../Includes/simple_html_dom.php";
	
	session_start();
	
	if(isset($_GET["summonerName"]))
	{
		$LOLApi = new LOLApi();
		$ID = $LOLApi->getSummonerIDbyName($_GET["summonerName"]);
		
		// Résultats
		$response_array['status'] = "success";
		$response_array['ID'] = $ID;

		// Save data in session for reuse.
		$_SESSION['LOLApi'] = $LOLApi;

		echo json_encode($response_array);
	}
	else
	{
		// Résultats
		$response_array['status'] = "error";
		$response_array['message'] = "Missing parameters";
		echo json_encode($response_array);
	}
	
	// if(isset($_GET["summonerName"]))
	// {		
		// $sumName = $_GET["summonerName"];
		// $ID;
		
		// // On récupère l'historique du joueur
		// $url = $LOLApi["SummonerUri"].$sumName."?api_key=".$LOLApi["Key"];
		// $json = json_decode(file_get_contents($url));
		
		// foreach ($json as $key => $value) {
			// $ID = $value->id;
		// }
		
		// // Résultats
		// $response_array['status'] = "success";
		// $response_array['ID'] = $ID;
		// echo json_encode($response_array);
	// }
	// else
	// {
		// // Résultats
		// $response_array['status'] = "error";
		// $response_array['message'] = "Missing parameters";
		// echo json_encode($response_array);
	// }
?>