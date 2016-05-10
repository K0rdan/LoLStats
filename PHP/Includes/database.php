<?php
	$response_array = array();
	
	class Database{
		// CONSTANTS {
			const Url = "db621921322.db.1and1.com";
			const User = "dbo621921322";
			const Password = "vprhhhdk9";
			const BDD = "db621921322";
		// }
		
		// PROPERTIES {
			private $isConnected = false;
			private $Connexion;
		// }
		
		// METHODS {
			// Constructor
			public function Database()
			{
				$this->Connexion = mysqli_connect(self::Url, self::User, self::Password, self::BDD);
				if(mysqli_connect_errno() == 0)
				{
					$this->isConnected = true;
				}
			}
			
			// Getters & Setters
			public function isConnected() 
			{ 
				if($this->isConnected)
					return true;
				else
					return false;
			}
			//
			public function getConnexionData() 
			{ 
				if($this->isConnected)
					return $this->Connexion; 
				else
					return null;
			}
		// }
	}
	
	// Variables liées à la base de données
	$url 		= "db621921322.db.1and1.com";
	$user		= "dbo621921322";
	$password	= "vprhhhdk9";
	$bdd		= "db621921322";
	$isConnected = false;
	
	// on se connecte à MySQL 
	$connexion = mysqli_connect($url, $user, $password, $bdd); 
	// Gestion des erreurs de connexion
	if(mysqli_connect_errno())
	{
		$response_array['status'] = "error";
		$response_array['message'] = "error while connecting DB";
		echo json_encode($response_array);
		exit();
	}
	else
		$isConnected = true;
?>