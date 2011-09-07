<?php // this file needs to be called in the header of your document because it adds css and js

include("sfbrowser.php");

$sCache = SFB_DEBUG?"?".rand(0,999):"";
$sMin = SFB_DEBUG?"":".min";
$T = SFB_DEBUG?"\t":"";
$N = SFB_DEBUG?"\n":"";
$header = "";

// test lang files
$oSFBrowser->testLatestLang();

if (!file_exists(SFB_PATH."lang/".SFB_LANG.".js")) {
	drupal_set_message('please check your language settings. Either you have inadvertently set your language to \'".SFB_LANG."\' or the file \'".SFB_LANG.".po\' is missing in the folder \'lang\' (and check the SFBrowser plugin folder as well).','warning');
}
// retreive browser html data
$sSfbHtml = $oSFBrowser->getBody(SFB_PATH."browser.html");

$aPlugins = array();
// retreive plugins
if (SFB_PLUGINS!="")    $aPlugins = preg_split("/,/",SFB_PLUGINS);
$WebRoot = url("<front>");

// add javascript to header
$header.=$N.$T.$T."<!-- SFBrowser init ".(SFB_DEBUG?'-debug mode- ':'')."-->".$N;
$header.=$T.$T."<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"".$WebRoot."/".SFB_PATH."css/sfbrowser".$sMin.".css\" />".$N;

drupal_add_js($WebRoot."/".SFB_PATH."SWFObject.js");
drupal_add_js($WebRoot."/".SFB_PATH."jquery.tinysort.min.js");
drupal_add_js($WebRoot."/".SFB_PATH."jquery.tinysort.min.js");
drupal_add_js($WebRoot."/".SFB_PATH."jquery.sfbrowser".$sMin.".js".$sCache);
drupal_add_js($WebRoot."/".SFB_PATH."lang/".SFB_LANG.".js");


$inlinejs= $T.$T.$T."jQuery.sfbrowser.defaults.connector = \"php\";".$N;
$inlinejs.= $T.$T.$T."jQuery.sfbrowser.defaults.sfbpath = \"".$WebRoot."?q=\";".$N;
$inlinejs.= $T.$T.$T."jQuery.sfbrowser.defaults.base = \"".SFB_BASE."\";".$N;
$inlinejs.= $T.$T.$T."jQuery.sfbrowser.defaults.previewbytes = ".PREVIEW_BYTES.";".$N;
$inlinejs.= $T.$T.$T."jQuery.sfbrowser.defaults.deny = (\"".SFB_DENY."\").split(\",\");".$N;
$inlinejs.= $T.$T.$T."jQuery.sfbrowser.defaults.browser = \"".$sSfbHtml."\";".$N;
$inlinejs.= $T.$T.$T."jQuery.sfbrowser.defaults.debug = ".(SFB_DEBUG?"true":"false").";".$N;
$inlinejs.= $T.$T.$T."jQuery.sfbrowser.defaults.maxsize = ".$oSFBrowser->getUploadMaxFilesize().";".$N;
if (SFB_PLUGINS!="") $inlinejs.= $T.$T.$T."jQuery.sfbrowser.defaults.plugins = ['".implode("','",$aPlugins)."'];".$N;
drupal_add_js($inlinejs, "inline");

// initialize plugins via connectors
$header.= $T.$T."<!-- SFBrowser plugins -->".$N;
foreach ($aPlugins as $sPlugin) {
	$sPpth = SFB_PATH."plugins/".$sPlugin;
	$sConf = $sPpth."/connectors/php/config.php";
	$sInit = $sPpth."/connectors/php/init.php";
	$bConf = file_exists($sConf);
	$bInit = file_exists($sInit);
	$header.= $T.$T."<!-- plugin: ".$sPlugin.($bConf?" c":"").($bInit?" i":"")." -->".$N;
	$bConf&&include($sConf);
	if ($bInit) {
		include($sInit);
	} else { // no init.php so automate initialisation
		// lang
		$sPlang = $sPpth."/lang/".SFB_LANG.".js";
		if (file_exists($sPlang)) $header.= $T.$T."<script type=\"text/javascript\" src=\"".$sPlang."\"></script>".$N;
		// js
		$sPlug = $sPpth."/jquery.sfbrowser.".$sPlugin.$sMin.".js";
		if (file_exists($sPlug)) $header.= $T.$T."<script type=\"text/javascript\" src=\"".$sPlug."\"></script>".$N;
		// css
		$sCsss = $sPpth."/css/screen".$sMin.".css";
		if (file_exists($sCsss)) $header.= $T.$T."<link rel=\"stylesheet\" type=\"text/css\" media=\"screen\" href=\"".$sCsss."\" />".$N;
		// html
		$sPhtml = $sPpth."/browser.html";
		if (file_exists($sPhtml)) {
			$header.= $T.$T."<script type=\"text/javascript\">".$N;
			$header.= $T.$T."//<![CDATA[".$N;
			$header.= $T.$T.$T."jQuery.sfbrowser.defaults.".$sPlugin." = \"".$oSFBrowser->getBody($sPhtml)."\";".$N;
			$header.= $T.$T."//]]>".$N;
			$header.= $T.$T."</script>".$N;
		}
	}
}
$header.= $T.$T."<!-- SFBrowser end -->\n".$N;
 $element = array(
    '#type' => 'markup',
    '#markup' => $header,
 );

drupal_add_html_head($element, "sfbrowser");
?>