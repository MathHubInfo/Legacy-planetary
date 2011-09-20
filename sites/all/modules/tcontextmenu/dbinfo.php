<?php
	$table_comments = "GDN_tInfoBar_comments";

	$db_host 	= 'localhost';
	$db_user		= 'tak3r';
	$db_pass		= 'mestefan';
	$db_database= 'math';

	$con = mysql_connect($db_host, $db_user, $db_pass) or die ("Could not connect to Data Base!");
	mysql_select_db($db_database, $con) or die ("Failed to select Data Base");
?>
