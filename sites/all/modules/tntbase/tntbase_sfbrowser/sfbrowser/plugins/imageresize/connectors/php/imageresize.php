<?php
include('../../../../connectors/php/config.php');
include_once('../../../../connectors/php/AbstractSFB.php');
class ImageResize extends AbstractSFB {
	
	protected $sConnBse = "../../../../";
	protected $aValidate = array(
		 "bar"=>	array(0,9,0)
	);
	
	// ImageResize
	function __construct() {
		//
		parent::__construct();
		//
//		include($this->sConnBse."connectors/php/config.php");
		//
		switch ($this->sAction) {
			case "bar": // image resize
				$iScW = intval($_POST["w"]);
				$iScH = intval($_POST["h"]);
				$iCrX = intval($_POST["cx"]);
				$iCrY = intval($_POST["cy"]);
				$iCrW = intval($_POST["cw"]);
				$iCrH = intval($_POST["ch"]);
				list($iW,$iH) = getimagesize($this->sSFile);
				$fScl = $iW/$iScW;
				$iFrX = intval($fScl*$iCrX);
				$iFrY = intval($fScl*$iCrY);
				$iFrW = intval($fScl*$iCrW);
				$iFrH = intval($fScl*$iCrH);
				$oImgN = imagecreatetruecolor($iCrW,$iCrH);
				$oImg = imagecreatefromjpeg($this->sSFile);
				imagecopyresampled($oImgN,$oImg, 0,0, $iFrX,$iFrY, $iCrW,$iCrH, $iFrW,$iFrH );
				if (imagejpeg($oImgN, $this->sSFile)) $this->aReturn['msg'] .= "imgResized";
				else							$this->aReturn['error'] .= "imgNotresized";
				$this->returnJSON($this->aReturn);
			break;
		}
	}
}
$oImageResize = new ImageResize;