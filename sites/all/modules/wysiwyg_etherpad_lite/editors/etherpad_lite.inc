<?php
// $Id: wysiwyg_codemirror.module,v 1.1 2010/03/17 16:48:12 drifter Exp $
/**
 * @file
 * wysiwyg_codemirror is an plugin for adding syntax highlighting to the tinyMCE editor
 * Zoltan Varady/FARM 2010
 */

/**
 * Implementation of hook_editor().
 */
function wysiwyg_etherpad_lite_etherpad_lite_editor() {
   $editor['etherpad_lite'] = array(
    'title' => 'etherpad_lite editor',
    'vendor url' => 'https://github.com/Pita/etherpad-lite',
    'download url' => 'git clone https://github.com/Pita/etherpad-lite.git',
    'library path' => wysiwyg_get_path('etherpad-lite-jquery-plugin'),
    'libraries' => array(
      'src' => array(
        'title' => 'Source',
        'files' => array(
          'js/etherpad.js',
        ),
      ),
    ),
    'version callback' => 'wysiwyg_etherpad_lite_etherpad_lite_version',
    'themes callback' => 'wysiwyg_etherpad_lite_etherpad_lite_themes',
    'load callback' => 'wysiwyg_etherpad_lite_etherpad_lite_load',
    'settings callback' => 'wysiwyg_etherpad_lite_etherpad_lite_settings',
    'plugin callback' => 'wysiwyg_etherpad_lite_etherpad_lite_plugins',
    'versions' => array(
      '0.4' => array(
        'js files' => array('wysiwyg_etherpad_lite-0.4.js'),
      ),
    ),
  );
  return $editor;
}

/**
* Detect editor version.
*
* @param $editor
*   An array containing editor properties as returned from hook_editor().
*
* @return
*   The installed editor version.
*/
function wysiwyg_etherpad_lite_etherpad_lite_version($editor) {
	$library = $editor['library path'] . '/js/etherpad.js';
	if (!file_exists($library)) {
		return;
	}
	/**
	 * TODO: No real way to do this so just returning something
	 */ 
	return "0.4";
}

/**
* Determine available editor themes or check/reset a given one.
*
* @param $editor
*   A processed hook_editor() array of editor properties.
* @param $profile
*   A wysiwyg editor profile.
*
* @return
*   An array of theme names. The first returned name should be the default
*   theme name.
*/
function wysiwyg_etherpad_lite_etherpad_lite_themes($editor, $profile) {
	$ether_mod = drupal_get_path("module", "wysiwyg_etherpad_lite");
	drupal_add_css($ether_mod."/css/wysiwyg_etherpad_lite.css", array("absolute"=>true));
	$js = $ether_mod."/etherpad-lite-jquery-plugin/js/etherpad.js";
	drupal_add_js($js);	
	/**
	 * TODO: just a STUB 
	 */
	return array('default');
}

/**
* Perform additional actions upon loading this editor.
*
* @param $editor
*   A processed hook_editor() array of editor properties.
* @param $library
*   The internal library name (array key) to use.
*/
function wysiwyg_etherpad_lite_etherpad_lite_load($editor, $library) {
}

/**
* Return runtime editor settings for a given wysiwyg profile.
*
* @param $editor
*   A processed hook_editor() array of editor properties.
* @param $config
*   An array containing wysiwyg editor profile settings.
* @param $theme
*   The name of a theme/GUI/skin to use.
*
* @return
*   A settings array to be populated in
*   Drupal.settings.wysiwyg.configs.{editor}
*/
function wysiwyg_etherpad_lite_etherpad_lite_settings($editor, $config, $theme) {
	$settings = array();
	$settings["jspath"]=url("<front>").$editor['library path'];
	
	$settings["host"]=variable_get('etherpad_base_url');
	global $user;
	$settings["user"]=$user->name;
	
	return $settings;
}

function wysiwyg_etherpad_lite_etherpad_lite_plugins($editor) {
  return array(
    'default' => array(
      //'buttons' => $plugins,
      'internal' => TRUE,
    ),
  );
}