<?php if (!defined('APPLICATION')) exit("Error: No Application!!!");

	require_once(PATH_PLUGINS.DS.'tInfoBar'.DS.'class.tInfoBarModule.php');

	$tInfoBar	= new tInfoBarModule();

	$tInfoBar->add('getUsername', function( $Sender ){
		$Session = Gdn::Session();
		echo $Session->User->Name;
		
		return $this;
	});

?>
