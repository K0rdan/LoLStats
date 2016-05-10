<?php	
	include_once "../Includes/database.php";
	
	class LOLApi{
		// CONSTANTS {
			const Key = "84437920-ce89-4491-97bd-df592330ab93";
			const QueryRateLimit = 500; // 500 queries per 10min
			const QueryTimeOut = 60; // 60s
		// }
		
		// PROPERTIES {
			private $Location = "euw";
			private $baseUri;
			private $MatchHistoryUri;
			private $SummonerUri;
			
			public $Index = 0;
			public $SummonerID = 0;
		// }
		
		// METHODS {
			// Constructor
			public function LOLApi()
			{
				$this->baseUri = "https://".$this->Location.".api.pvp.net/api/lol/".$this->Location;
				$this->MatchHistoryUri = $this->baseUri."/v2.2/matchhistory/";
				$this->SummonerUri = $this->baseUri."/v1.4/summoner/by-name/";
			}

			// getSummonerID2
			// 		Description: Return the summoner's ID 
			//		Parameters:
			//			$summonerName - [STRING] summoner's Name
			public function getSummonerIDbyName($summonerName)
			{
				$url = ($this->SummonerUri).$summonerName."?api_key=".self::Key;
				$started = false;
				$startTime = time();
				
				do {
					if($started)
					{
						if((time()-$startTime) > self::QueryTimeOut)
							return -1;	// TimeOut
						else
							sleep(round(self::QueryRateLimit/600));
					}
					else
						$started = true;
						
					$data = @file_get_contents($url);
				} while($data === FALSE);
				
				foreach (json_decode($data) as $key => $value) {
					$this->SummonerID = $value->id;
				}
				
				return $this->SummonerID;
			}
			
			// getData
			// 		Description: Return JSON data following $type required.
			//		Parameters:
			//			$type - ['RANKED_SOLO_5x5']
			public function getData($type)
			{
				$started = false;
				$startTime = time();
				$url = null;
				
				if($this->SummonerID == 0)
					return -1;	// SummonerID undefined
				else
				{
					switch($type)
					{
						case "RANKED_SOLO_5x5": 
							$url = ($this->MatchHistoryUri).($this->SummonerID)."?rankedQueues=".$type."&beginIndex=".$this->Index."&api_key=".self::Key; break;
						default: return -2;	// Invalid Parameter
					}			
					
					do {
						if($started)
						{
							if((time()-$startTime) > self::QueryTimeOut)
								return -3;	// TimeOut
							else
								sleep(round(self::QueryRateLimit/600));
						}
						else
							$started = true;
							
						$data = @file_get_contents($url);
					} while($data === FALSE);		
					return $data;
				}
			}
			
			// getLastAccess
			// 		Description: Return last access date to LOLApi
			private function getLastAccess()
			{
				
			}
			
			// setLastAccess
			//		Description: Save last access date to LOLApi
			public function setLastAccess()
			{
				$db = new DataBase();
				if($db->isConnected())
				{
					$date = new DateTime("NOW");
					$sql = "INSERT INTO lastQuery VALUES (STR_TO_DATE(\"".$date->format("Y-m-d")."\",\"%Y-%m-%d\"));";
										
					if(mysqli_query($db->getConnexionData(),$sql) === FALSE)
					{
						return -4;
					}
				}
			}
		
			// Getters & Setters
			public function getLocation(){ return $this->Location; }
			public function setLoction($value){ $this->Location = $value; }
			//
			public function getSummonerID(){ return $this->SummonerID; }
			public function setSummonerID($value){ $this->SummonerID = $value; }
			//
			public function getIndex(){ return $this->Index; }
			public function setIndex($value){ $this->Index = $value; }
		// }
	}
	
	
	///////////////////////////////////////////////////////////////
	$LOLApi["Location"] = "euw";
	$LOLApi["baseUri"] = "https://".$LOLApi["Location"].".api.pvp.net/api/lol/".$LOLApi["Location"];
	$LOLApi["MatchHistoryUri"] = $LOLApi["baseUri"]."/v2.2/matchhistory/";
	$LOLApi["SummonerUri"] = $LOLApi["baseUri"]."/v1.4/summoner/by-name/";
	$LOLApi["Key"] = "84437920-ce89-4491-97bd-df592330ab93";
	$LOLApi["QueryRateLimit"] = round(500/600); // 500 queries per 10min
	$LOLApi["QueryTimeOut"] = 60; // 60s
?>