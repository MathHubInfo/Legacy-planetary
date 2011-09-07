<?php

include_once("config.php");
include_once("functions.php");

abstract class AbstractSFB {
	
	protected $sConnBse = "../../";
	protected $aValidate = array();
	protected $sAction = '';
	protected $sSFile = '';
	protected $aFiles = array();

	protected $aReturn = array('error'=>'','msg'=>'','data'=>array());

	public function __construct() {
		$aVldt = $this->validateInput($this->aValidate);
		$this->sAction =	$aVldt["action"];
		$this->sSFile =		$aVldt["file"];
		$this->aFiles =		$aVldt["files"];
		if (($this->aReturn['error'] = $aVldt["error"])!='') die(json_encode($this->aReturn));
	}

	//////////////////////////////////////////////////////

	private function validateInput($aGPF) {
		$sErr = "";
		$sAction = "";
		// check input
		if (isset($_POST["a"])||isset($_GET["a"])) {
			$sAction = isset($_POST["a"])?$_POST["a"]:$_GET["a"];
			if (isset($aGPF[$sAction])) {
				$aChck = $aGPF[$sAction];
				if (!(count($_GET)==$aChck[0]&&count($_POST)==$aChck[1]&&count($_FILES)==$aChck[2])) $sErr .= $this->sterf("input does not match action");
			} else {
				$sErr .= $this->sterf("action does not exist");
			}
		//} else {
		//	$sErr .= $this->sterf("no action set");
		}
		// check files
		$sSFile = "";
		if (isset($_POST["file"])) $sSFile = $_POST["file"];
		else if (isset($_GET["file"])) $sSFile = $_GET["file"];
		else if (isset($_FILES["fileToUpload"])) $sSFile = $_FILES["fileToUpload"]["name"];
		//
		$aFiles = explode(",",$sSFile);
		$bFiles = count($aFiles)>0;
		//
		$bFld = isset($_POST["folder"]);
		if ($sSFile!="") {
			if ($bFld) {
				$sSFile = $this->sConnBse.$_POST["folder"].$sSFile;
				if ($bFiles) {
					for ($i=0;$i<count($aFiles);$i++) {
						$aFiles[$i] = $this->sConnBse.$_POST["folder"].$aFiles[$i];
					}
				}
			}
			if (strstr($sSFile,"sfbrowser")!==false||!preg_match('/[^:\*\?<>\|(\.\/)]+\/[^:\*\?<>\|(\.\/)]/',$sSFile)) $sErr .= $this->sterf("not a valid path");
			// $$todo: maybe check SFB_DENY here as well
			// check if path within base path
			if (!$this->pathWithin($sSFile,($bFld?$this->sConnBse:"").SFB_BASE)) $sErr .= $this->sterf("file not within base: [".$sSFile."] [".SFB_BASE."]");
		} else if ($bFld&&!$this->pathWithin($_POST["folder"],SFB_BASE)) {
			$sErr .= $this->sterf("path not within base");
		}
		// log
		if (SFB_DEBUG) {
			$sP = "POST: [";
			$sG = "GET:  [";
			$sF = "FILE: [";
			foreach($_POST as  $k=>$v)	$sP .= $k.":".$v.",";
			foreach($_GET as   $k=>$v)	$sG .= $k.":".$v.",";
			foreach($_FILES as $k=>$v)	$sF .= $k.":".$v.",";
			$sP .= "]";
			$sG .= "]";
			$sF .= "]";
			$sLog  = date("j-n-Y H:i")."\t\t";
			$sLog .= "ip:".$_SERVER["REMOTE_ADDR"]."\t\t";
			$sLog .= "a:".$sAction."(".$sSFile.")\t\t";
			$sLog .= "error:".$sErr;
			$sLog .= "\n\t\t".$sP."\n\t\t".$sG."\n\t\t".$sF;
			trace($sLog);
		}
		$aReturn = array("action"=>$sAction,"file"=>$sSFile,"error"=>$sErr);
		if ($bFiles) $aReturn["files"] = $aFiles;
		return $aReturn;
	}

	// fileInfo
	protected function getFileInfo($sFile) { // todo: check wp_ext2type
		$aRtr = array();
		$type = $sFile["type"];
		$aRtr["type"] = $sFile["type"];
		$aRtr["file"] = $sFile["file"];
		
		$aRtr["time"] = 1290090852;
		$aRtr["date"] = "18-11-2010 16:34";
		$aRtr["size"] = "1";
		if ($type=="directory") {
		  $aRtr["mime"] = "folder";
		  $aRtr["type"] = "dir";
		}
		else {
		  $aRtr["mime"] = "file";
		  $aRtr["type"] = "file";
		}
		$aRtr["width"] = 0;
		$aRtr["height"] = 0;
		$aRtr["rsize"] = 104;
		
		return $aRtr;
	}

	// fileInfo
	protected function fileInfo($sFile) { // todo: check wp_ext2type
		$aRtr = array();
		$aRtr["type"] = filetype($sFile);
		$sFileName = array_pop(preg_split("/\//",$sFile));
		if ($aRtr["type"]=="file") {
			$aRtr["time"] = filemtime($sFile);
			$aRtr["date"] = date(FILETIME,$aRtr["time"]);
			$aRtr["size"] = filesize($sFile);
			$aRtr["mime"] = array_pop(preg_split("/\./",$sFile));//mime_content_type($sFile);
			//
			$aRtr["width"] = 0;
			$aRtr["height"] = 0;
			$aImgNfo = ($aRtr["mime"]=="jpeg"||$aRtr["mime"]=="jpg"||$aRtr["mime"]=="gif"||$aRtr["mime"]=="png") ? getimagesize($sFile) : "";
			if (is_array($aImgNfo)) {
				list($width, $height, $type, $attr) = $aImgNfo;
				$aRtr["width"] = $width;
				$aRtr["height"] = $height;
			}
			$aRtr["file"] = $sFileName;
			$aRtr["rsize"] = filesize($sFile);
			$aRtr["size"] = $this->formatSize($aRtr["rsize"]);
		} else if ($aRtr["type"]=="dir"&&$sFileName!="."&&$sFileName!=".."&&!preg_match("/^\./",$sFileName)) {
			$aRtr["mime"] = "folder";
			$aRtr["time"] = filemtime($sFile);
			$aRtr["date"] = date(FILETIME,$aRtr["time"]);
			$aRtr["size"] = filesize($sFile);
			$aRtr["rsize"] = 0;
			$aRtr["size"] = '-';
			$aRtr["file"] = $sFileName;
		}
		$aDeny = explode(",",SFB_DENY);
		if (!isset($aRtr["mime"])||in_array($aRtr["mime"],$aDeny)) return null;
		return $aRtr;
	}

	//////////////////////////////////////////////////////
	//////////////////////////////////////////////////////
	//////////////////////////////////////////////////////


	// getUriContents
	private function getUriContents($sUri) {
		$sExt = array_pop(explode(".", $sUri));
		if ($sExt=="pdf")	$sContents = pdf2txt($sUri);
		else				$sContents = file_get_contents($sUri);
		$sContents = $this->strip_html_tags($sContents);
		$sContents = preg_replace(
			array(
				"/(\r\n)|(\n|\r)/"
				,"/(\n){3,}/"
				,"/(?<=.)(\n)(?=.)/"
				,"/\|}/"
			), array(
				"\n"
				,"\n\n"
				," "
				,"!"
			), $sContents);

		return nl2br($sContents);
	}

	//////////////////////////////////////////////////////
	//	path functions //////////////////////////////////

	// cleanUri
	protected function clean_uri($s) {
		$s = preg_replace(array('/(?<!:)(\/+)/','/^\//'),array('/',''),$s);
		while (true) {
			$i = strlen($s);
			$s = preg_replace('/[\w_-]+\/\.\.\//','',$s); // todo: check valid folder name
			if ($i===strlen($s)) break;
		}
		return $s;
	}

	// pathWithin
	protected function pathWithin($path,$inpath) {
		$sRegFld = "/(\w+\/+\.\.\/+)/";
		$sRegDbl = "/\/+/";
		$sRegWht = "/\s+/";
		$aFind = array($sRegWht,$sRegFld,$sRegDbl);
		$aRepl = array("","","/");
		$path = preg_replace($aFind,$aRepl,$path);
		$inpath = preg_replace($aFind,$aRepl,$inpath);
		return substr($path,0,strlen($inpath))===$inpath;
	}

	//////////////////////////////////////////////////////
	//	language functions //////////////////////////////

	// test folders for .po files and generates their js equivalent
	public function testLatestLang() {
		// test main sfb lang
		$sDir = SFB_PATH.'lang/';
		if ($oDir = opendir($sDir)) {
			while (false!==($sPoFilename=readdir($oDir))) {
				$sExt = array_pop(explode(".",$sPoFilename));
				if ($sExt=='po') {
					$this->po2js($sDir.$sPoFilename,"// js generated from ".$sPoFilename."\n".'jQuery.sfbrowser.defaults.lang = ',';');
				}
			}
			closedir($oDir);
		}
		// test plugins lang
		$sPlugins = SFB_PATH.'plugins/';
		if ($oPluginsDir = opendir($sPlugins)) {
			while (false!==($sPluginDirname=readdir($oPluginsDir))) {
				if (is_dir($sPluginDir = $sPlugins.$sPluginDirname)&&$sPluginDirname!='..'&&$sPluginDirname!='.') {
					// check if there is a lang dir in the plugin dir
					if (file_exists($sPluginLangDir = $sPluginDir.'/lang/')) {
						if ($oPluginsLangDir = opendir($sPluginLangDir)) {
							while (false!==($sPluginLangname=readdir($oPluginsLangDir))) {
								$sExt = array_pop(explode(".",$sPluginLangname));
								if ($sExt=='po') {
									$this->po2js($sPluginLangDir.$sPluginLangname,'jQuery.sfbrowser.addLang(',');');
								}
							}
						}
					}
				}
			}
		}
	}

	// if po file is newer we convert it to js
	private function po2js($sPoFile,$sPrepend,$sAppend) {
		$sJsFile = str_replace('.po','.js',$sPoFile);
		if (!file_exists($sJsFile)||$this->fileIsNewer($sPoFile,$sJsFile)) {
			$oPoFile = fopen($sPoFile, "r");
			$sContents = fread($oPoFile, filesize($sPoFile));
			fclose($oPoFile);
			// regex po contents
			preg_match_all('/(?<=msgid\s\"|msgstr\s\")[^\"]*/', $sContents, $matches);
			$iNumLines = count($matches[0]);
			$aTranslation = array();
			for ($i=0;$i<$iNumLines;$i++) {
				if ($i%2===0) {
					$sKey = $matches[0][$i];
					$sVal = $matches[0][$i+1];
					if ($sKey!=''&&$sVal!='') $aTranslation[$sKey] = $sVal;
				}
			}
			$sJsFileContents = $sPrepend.json_encode($aTranslation).$sAppend;
			if (is_writable($sJsFile)) {
				$oJsFile = fopen($sJsFile, 'w');
				fwrite($oJsFile, $sJsFileContents);
				fclose($oJsFile);
			}
		}
	}

	// gettext
	protected function gettext($s) {
		return $s;
	}

	//////////////////////////////////////////////////////
	//	html functions //////////////////////////////////

	// getBody
	public function getBody($path) {
		$oHtBrowser = fopen($path,"r");
		$sBrowser = fread($oHtBrowser,filesize($path));
		fclose($oHtBrowser);
		if (preg_match('@<body[^>]*>(.*)</body>@Usi', $sBrowser, $regs)) $sCnt = preg_replace(array("/\n/","/\r/","/\t/","/\"/"),array("","","","\\\""),$regs[1]);
		return $sCnt;
	}

	// strip_html_tags
	private function strip_html_tags($text) {
		$text = preg_replace(
			array(
			  // Remove invisible content
				'@<head[^>]*?>.*?</head>@siu',
				'@<style[^>]*?>.*?</style>@siu',
				'@<script[^>]*?.*?</script>@siu',
				'@<object[^>]*?.*?</object>@siu',
				'@<embed[^>]*?.*?</embed>@siu',
				'@<applet[^>]*?.*?</applet>@siu',
				'@<noframes[^>]*?.*?</noframes>@siu',
				'@<noscript[^>]*?.*?</noscript>@siu',
				'@<noembed[^>]*?.*?</noembed>@siu',
			  // Add line breaks before and after blocks
				'@</?((address)|(blockquote)|(center)|(del))@iu',
				'@</?((div)|(h[1-9])|(ins)|(isindex)|(p)|(pre))@iu',
				'@</?((dir)|(dl)|(dt)|(dd)|(li)|(menu)|(ol)|(ul))@iu',
				'@</?((table)|(th)|(td)|(caption))@iu',
				'@</?((form)|(button)|(fieldset)|(legend)|(input))@iu',
				'@</?((label)|(select)|(optgroup)|(option)|(textarea))@iu',
				'@</?((frameset)|(frame)|(iframe))@iu',
			),
			array(
				' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',
				"\n\$0", "\n\$0", "\n\$0", "\n\$0", "\n\$0", "\n\$0",
				"\n\$0", "\n\$0",
			),
			$text );
		return strip_tags($text);
	}

	//////////////////////////////////////////////////////
	//	misc utils //////////////////////////////////////

	// getUploadMaxFilesize
	public function getUploadMaxFilesize() {
		$iMaxBytes = 0;
		$sMxSz = ini_get("upload_max_filesize");
		$iLen = strlen($sMxSz);
		if ($iLen>1) {
			$sLast = substr($sMxSz, $iLen-1, 1);
			$iRest = intVal(substr($sMxSz, 0, $iLen-1));
			switch ($sLast) {
				case "K": $iMaxBytes = $iRest*1024; break;
				case "M": $iMaxBytes = $iRest*1048576; break;
				case "G": $iMaxBytes = $iRest*1073741824; break;
				default: $iMaxBytes = intVal($sMxSz);
			}
		} else {
			$iMaxBytes = intVal($sMxSz);
		}
		return $iMaxBytes;
	}

	// returnJSON
	protected function returnJSON($a) {
		header('Cache-Control: no-cache, must-revalidate');
		header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
		header('Content-type: application/json');
		echo json_encode($a);
	}

	// sterf
	private function sterf($sErr) {
		//return $sErr;
		if (SFB_DEBUG) return $sErr;
		else exit(SFB_ERROR_RETURN);
	}

	// fileIsNewer
	private function fileIsNewer($file,$newerThan) {
		return filemtime($file)>filemtime($newerThan);
	}

	//formatSize
	private function formatSize($size, $round = 0) {
		$sizes = array('B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
		for ($i=0; $size > 1024 && isset($sizes[$i+1]); $i++) $size /= 1024;
		return round($size,$round).$sizes[$i];
	}

	/* obsolete

	private function testSession() {
		if (!isset($_SESSION)) session_start();
		$this->aReturn['msg'] .= '[SFB_DEBUG:'.($_SESSION['SFB_DEBUG']?1:0).'][SFB_DEBUG:'.(SFB_DEBUG?1:0).']';
		$this->aReturn['msg'] .= $_SESSION['SFB_LANG'].' ';
		$this->aReturn['msg'] .= '[SFB_DEBUG:'.SFB_DEBUG.']';
		$this->aReturn['msg'] .= '[SFB_LANG:'.SFB_LANG.']';
	}

	// numToAZ
	protected function numToAZ($i) {
		$s = "";
		if ($i==85) $s = "i_";
		else for ($j=0;$j<strlen((string)$i);$j++) $s .= chr((int)substr((string)$i, $j, 1)%26+97);
		return $s;
	}

	// getFilePath
	// The function returns the absolute path to the file to be included. 
	// This path can be used as argument to include() and resolves the problem of nested inclusions.
	private function getFilePath($relative_path) { 
		// $abs_path is the current absolute path (replace "\\" to "/" for windows platforms) 
		$abs_path=str_replace("\\", "/", dirname($_SERVER['SCRIPT_FILENAME']));
		$relative_array=explode("/",$relative_path);
		$abs_array=explode("/",$abs_path);
		// for each "../" at the beginning of $relative_path
		// removes this 1st item from $relative_path and the last item from $abs_path
		while ($relative_array and ($relative_array[0]=="..")) {
			array_shift($relative_array);
			array_pop($abs_array);
		}
		// and implodes both arrays 
		return implode("/", $abs_array) . "/" . implode("/", $relative_array);   
	}

	// errorHandler
	protected function errorHandler($errno, $errstr, $errfile, $errline) {
		throw new Exception($errstr, $errno);
	}

	// camelCase
	private function camelCase($in) {
		$out = "";
		foreach(explode("_", $in) as $n => $chunk) $out .= ucfirst(strtolower($chunk));
		return $out;
	}

	// constantsToJs
	function constantsToJs($a) {
		foreach ($a as $s) {
			$oVal = @constant($s);
			$sPrefix = substr(gettype($oVal),0,1);
			$sIsString = $sPrefix=="s"?"\"":"";
			$sVal = 0;
			switch ($sPrefix) {
				case "s": $sVal = "\"".str_replace("\\","\\\\",$oVal)."\""; break;
				case "b": $sVal = $oVal?"true":"false"; break;
				case "d": $sPrefix = "f";
				default: $sVal = $oVal;
			}
			if ($sPrefix!="N") echo "\t\t\tvar ".$sPrefix.camelCase($s)." = ".$sVal.";\n";
			else  echo "\t\t\t// ".$s." could not be found or contains a null value.\n";
		}
	}

	// simplify_path
	function simplify_path($path) {
		$oldcwd = getcwd();
		chdir($path);
		return gstr_replace('\\', '/', getcwd());
		chdir($oldcwd);
	}

	*/
}