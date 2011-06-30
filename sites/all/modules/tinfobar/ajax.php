<?php
// Copyright (C) 2010-2011, Planetary System Developer Group. All rights reserved.

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>
	require_once('dbinfo.php');
	
	if(!isset($_GET['action']) || $_GET['action'] == '') exit();
	
	switch($_GET['action']){
		case 'getIDs':
		
			$context = '';
			if(isset($_GET['context']))
				$context = "WHERE context='".$_GET['context']."'";
				
			$q = mysql_query("SELECT DISTINCT wordID FROM `$table_comments` $context");
			
			$a = array();
			while($r = mysql_fetch_assoc($q))
			   $a[] = $r['wordID'];
		   
		   returnJSON( $a );
		break;
		case 'comment':
			$context	= $_GET['context'];
			$wordID	= $_GET['wordID'];
			$user		= $_GET['user'];
			$text		= $_GET['text'];
			$q 		= "INSERT INTO `$table_comments`(context, wordID, user, text) VALUES ('$context', '$wordID', '$user', '$text')";
			returnJSON( mysql_query($q) ? array('result' => true) : array( 'result' => mysql_error() ) );
		break;
		case 'getComments':
			$wordID	= $_GET['wordID'];
			$q			= mysql_query("SELECT * FROM `$table_comments` WHERE wordID='$wordID'");
			
			$a       = array();
			while($r = mysql_fetch_assoc($q)){
				$a[] = array(
				   'user'   => $r['user'],
				   'text'   => htmlspecialchars( $r['text'] )
				);
			}
			returnJSON( $a );
		break;
	}

   function returnJSON( $arr ){
      if( !headers_sent() ){
         header('Cache-Control: no-cache, must-revalidate');
         header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
         header('Content-type: application/json');
      }
      echo json_encode( $arr );
      
      exit();
   }
?>
