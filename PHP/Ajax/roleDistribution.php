<?php
	//include_once "../Includes/LOLApi.php";
	include_once "../Includes/database.php";
	//include_once "../Includes/util.php";
	//include_once "../Includes/simple_html_dom.php";
		
	$db = new Database();

	// On récupère les informations des champions
	$sql = "SELECT champions.id, champions.staticID, champions.name, champions.nameKR, r.name as role1, r2.name as role2 FROM champions INNER JOIN roles as r ON champions.role1 = r.id INNER JOIN roles as r2 ON champions.role2 = r2.id ORDER BY champions.name ASC";
	$champions = array();

	if($result = mysqli_query($db->getConnexionData(),$sql))
	{
		while($champion = mysqli_fetch_assoc($result))
		{
			array_push($champions, $champion);
		}
		mysqli_free_result($result);
	}	// END SQL


	// On récupère les roles
	$sql = "SELECT name FROM roles";
	$roleDistribution = array();
	if($result = mysqli_query($db->getConnexionData(),$sql))
	{
		while($role = mysqli_fetch_assoc($result))
		{
			if($role["name"] != "N/A")
				$roles[] = $role["name"];
		}
		mysqli_free_result($result);
	}	// END SQL

	// Résultats
	$response_array['status'] = "success";
	$response_array['data'] = array("champions"=>$champions, "roles"=>$roles);
	echo json_encode($response_array);


	/*if(isset($_GET["summonerID"]) && isset($_GET["type"]))
	{		
		$LOLApi = new LOLApi();
		$LOLApi->setSummonerID($_GET["summonerID"]);
		
		$sumID = $_GET["summonerID"];
		$type = $_GET["type"];
		
		// On récupère les informations des champions
		$sql = "SELECT champions.id, champions.staticID, champions.name, champions.nameKR, r.name as role1, r2.name as role2 FROM champions INNER JOIN roles as r ON champions.role1 = r.id INNER JOIN roles as r2 ON champions.role2 = r2.id ORDER BY champions.name ASC";
		$champions = array();
		
		//if($result = mysqli_query($connexion,$sql))
		if($result = mysqli_query($db->getConnexionData(),$sql))
		{
			while($champion = mysqli_fetch_assoc($result))
			{
				array_push($champions, $champion);
			}
			mysqli_free_result($result);
		}	// END SQL

		
		// On récupère les roles
		$sql = "SELECT name FROM roles";
		$roleDistribution = array();
		if($result = mysqli_query($db->getConnexionData(),$sql))
		{
			while($role = mysqli_fetch_assoc($result))
			{
				if($role["name"] != "N/A")
					$roleDistribution[$role["name"]] = ["games"=>0,"wins"=>0,"losses"=>0];
			}
			mysqli_free_result($result);
		}	// END SQL
				
		// On récupère l'historique du joueur
		$url = "https://euw.api.pvp.net/api/lol/euw/v2.2/matchlist/by-summoner/".$sumID."?rankedQueues=TEAM_BUILDER_DRAFT_RANKED_5x5,RANKED_SOLO_5x5,RANKED_TEAM_5x5&api_key=84437920-ce89-4491-97bd-df592330ab93";		
		$json = json_decode(@file_get_contents($url), true);
		if(!empty($json))
		{
			$historique = array();
			$winlose = array(); // Tableau de 'int' avec : '0' = defeat, '1' = victory
			$i = 0;
			foreach($json["matches"] as $match)
			{
				array_push($historique, $match["champion"]);
				
				$url_match = "https://euw.api.pvp.net/api/lol/euw/v2.2/match/".$match["matchId"]."?api_key=84437920-ce89-4491-97bd-df592330ab93";
				$json_match = json_decode(@file_get_contents($url_match), true);
				if(!empty($json_match)) {
					echo (int)$json_match["teams"][0]["winner"]."<br/>";
					array_push($winlose, (int)$json_match["teams"][0]["winner"]);
				}else
					continue;
					
				// handle iteration
				$i++;
				
				switch($type) 
				{
					case "10last": 
						if($i>=10)
							break 2;
						else
							break;
					case "overall":
						break;
					default: 
						// Résultats
						$response_array['status'] = "error";
						$response_array['message'] = "Bad parameter (\"type\")";
						echo json_encode($response_array);
					break 2;
				}
			}
			
			$j = 0;
			foreach($historique as $game)
			{
				foreach($champions as $champion)
				{
					if($champion["staticID"] == $game)
					{
						$roleDistribution[$champion["role1"]]["games"]++;
						if($winlose[$j] == 1)
							$roleDistribution[$champion["role1"]]["wins"]++;
						else
							$roleDistribution[$champion["role1"]]["losses"]++;
						if($champion["role2"] != "N/A")
						{
							$roleDistribution[$champion["role2"]]["games"]++;
							if($winlose[$j] == 1)
								$roleDistribution[$champion["role2"]]["wins"]++;
							else
								$roleDistribution[$champion["role2"]]["losses"]++;
						}
					}
				}
				$j++;
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
		$response_array['roles'] = $roleDistribution;
		echo json_encode($response_array);
	}
	else
	{
		// Résultats
		$response_array['status'] = "error";
		$response_array['message'] = "Missing parameters";
		echo json_encode($response_array);
	}*/
?>