<?php
include_once('../../../../connectors/php/AbstractSFB.php');
class CreateAscii extends AbstractSFB {
	
	protected $sConnBse = "../../../../";
	protected $aValidate = array(
		 "new"=>	array(0,4,0)
		,"edit"=>	array(0,4,0)
		,"cont"=>	array(0,3,0)
	);
	
	// CreateAscii
	function __construct() {
		//
		parent::__construct();
		//
		if (isset($_POST["contents"])) $sContents = $_POST["contents"];//$aVldt["contents"];//$_POST["contents"];
		//
		switch ($this->sAction) {
			case "new":
				if (file_exists($this->sSFile)) {
					$this->aReturn['error'] .= "File exists";
				} else {
					$oFile = fopen($this->sSFile, "w");
					fputs ($oFile, stripslashes($sContents) );
					fclose($oFile);
					chmod($this->sSFile,0644);
					$this->aReturn['data'] = $this->fileInfo($this->sSFile);
					$this->aReturn['msg'] .= "new file created ... almost that is ... ";
				}
			break;
			case "edit":
				if (file_exists($this->sSFile)) {
					$oFile = fopen($this->sSFile, "w");
					fputs ($oFile, stripslashes($sContents) );
					fclose($oFile);
					$this->aReturn['msg'] .= "File edited";
				} else {
					$this->aReturn['error'] .= "File could not be found";
				}
			break;
			case "cont":
				$oHnd = fopen($this->sSFile, "r");
				$sCnt = preg_replace(array("/\n/","/\r/","/\t/"),array("\\n","\\r","\\t"),addslashes(fread($oHnd, max(1,filesize($this->sSFile)) )));
				fclose($oHnd);
				$this->aReturn['data']['text'] = $sCnt;
				$this->aReturn['msg'] .= "contentsSucces";
			break;
		}
		$this->returnJSON($this->aReturn);
	}
}
$oCreateAscii = new CreateAscii;