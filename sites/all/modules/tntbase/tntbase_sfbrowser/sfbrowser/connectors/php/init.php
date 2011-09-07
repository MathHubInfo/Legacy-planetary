<?php // this file needs to be called in the header of your document because it adds css and js

include("sfbrowser.php");

$sCache = SFB_DEBUG?"?".rand(0,999):"";
$sMin = SFB_DEBUG?"":".min";
$T = SFB_DEBUG?"\t":"";
$N = SFB_DEBUG?"\n":"";

// test lang files
$oSFBrowser->testLatestLang();

if (!file_exists(SFB_PATH."lang/".SFB_LANG.".js")) echo $T.$T."<script type=\"text/javascript\">alert('SFBrowser warning: please check your language settings. Either you have inadvertently set your language to \'".SFB_LANG."\' or the file \'".SFB_LANG.".po\' is missing in the folder \'lang\' (and check the SFBrowser plugin folder as well).');</script>".$N; 

// retreive browser html data
$sSfbHtml = $oSFBrowser->getBody(SFB_PATH."browser.html");

// retreive plugins
if (SFB_PLUGINS!="") $aPlugins = preg_split("/,/",SFB_PLUGINS);

// add javascript to header
echo $N.$T.$T."<!-- SFBrowser init ".(SFB_DEBUG?'-debug mode- ':'')."-->".$N;
echo $T.$T."<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"".SFB_PATH."css/sfbrowser".$sMin.".css\" />".$N;
echo $T.$T."<script type=\"text/javascript\" src=\"".SFB_PATH."SWFObject.js\"></script>".$N;
echo $T.$T."<script type=\"text/javascript\" src=\"".SFB_PATH."jquery.tinysort.min.js\"></script>".$N;
echo $T.$T."<script type=\"text/javascript\" src=\"".SFB_PATH."jquery.sfbrowser".$sMin.".js".$sCache."\"></script>".$N;
echo $T.$T."<script type=\"text/javascript\" src=\"".SFB_PATH."lang/".SFB_LANG.".js\"></script>".$N;
echo $T.$T."<script type=\"text/javascript\">".$N;
echo $T.$T.$T."jQuery.sfbrowser.defaults.connector = \"php\";".$N;
echo $T.$T.$T."jQuery.sfbrowser.defaults.sfbpath = \"".SFB_PATH."\";".$N;
echo $T.$T.$T."jQuery.sfbrowser.defaults.base = \"".SFB_BASE."\";".$N;
echo $T.$T.$T."jQuery.sfbrowser.defaults.previewbytes = ".PREVIEW_BYTES.";".$N;
echo $T.$T.$T."jQuery.sfbrowser.defaults.deny = (\"".SFB_DENY."\").split(\",\");".$N;
echo $T.$T.$T."jQuery.sfbrowser.defaults.browser = \"".$sSfbHtml."\";".$N;
echo $T.$T.$T."jQuery.sfbrowser.defaults.debug = ".(SFB_DEBUG?"true":"false").";".$N;
echo $T.$T.$T."jQuery.sfbrowser.defaults.maxsize = ".$oSFBrowser->getUploadMaxFilesize().";".$N;
if (SFB_PLUGINS!="") echo $T.$T.$T."jQuery.sfbrowser.defaults.plugins = ['".implode("','",$aPlugins)."'];".$N;
echo $T.$T."</script>".$N; // $$ todo: check this

// initialize plugins via connectors
echo $T.$T."<!-- SFBrowser plugins -->".$N;
foreach ($aPlugins as $sPlugin) {
	$sPpth = SFB_PATH."plugins/".$sPlugin;
	$sConf = $sPpth."/connectors/php/config.php";
	$sInit = $sPpth."/connectors/php/init.php";
	$bConf = file_exists($sConf);
	$bInit = file_exists($sInit);
	echo $T.$T."<!-- plugin: ".$sPlugin.($bConf?" c":"").($bInit?" i":"")." -->".$N;
	$bConf&&include($sConf);
	if ($bInit) {
		include($sInit);
	} else { // no init.php so automate initialisation
		// lang
		$sPlang = $sPpth."/lang/".SFB_LANG.".js";
		if (file_exists($sPlang)) echo $T.$T."<script type=\"text/javascript\" src=\"".$sPlang."\"></script>".$N;
		// js
		$sPlug = $sPpth."/jquery.sfbrowser.".$sPlugin.$sMin.".js";
		if (file_exists($sPlug)) echo $T.$T."<script type=\"text/javascript\" src=\"".$sPlug."\"></script>".$N;
		// css
		$sCsss = $sPpth."/css/screen".$sMin.".css";
		if (file_exists($sCsss)) echo $T.$T."<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"".$sCsss."\" />".$N;
		// html
		$sPhtml = $sPpth."/browser.html";
		if (file_exists($sPhtml)) {
			echo $T.$T."<script type=\"text/javascript\">".$N;
			echo $T.$T.$T."jQuery.sfbrowser.defaults.".$sPlugin." = \"".$oSFBrowser->getBody($sPhtml)."\";".$N;
			echo $T.$T."</script>".$N;
		}
	}
}
echo $T.$T."<!-- SFBrowser end -->\n".$N;
?>