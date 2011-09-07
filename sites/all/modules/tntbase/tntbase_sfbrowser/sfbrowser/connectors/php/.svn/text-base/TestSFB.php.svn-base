<?php
include_once('AbstractSFB.php');
class TestSFB extends AbstractSFB {
	
	protected $sConnBse = "../../";
	protected $aValidate = array();
	
	// WpDb
	function __construct() {
		echo $this->clean_uri('qwer/asdf.jpg<br/>');
		echo $this->clean_uri('/qwer/asdf.jpg<br/>');
		echo $this->clean_uri('//////qwer/asdf.jpg<br/>');
		echo 'WP_SFB_DEBUG '.(WP_SFB_DEBUG?1:0).'<br/>';
		echo 'SFB_DEBUG '.(SFB_DEBUG?1:0).'<br/>';
		//
		parent::__construct();
	}
}
new TestSFB;