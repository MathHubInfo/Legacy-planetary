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
function wysiwyg_codemirror_codemirror_editor() {
   $editor['codemirror2'] = array(
    'title' => 'Code Mirror 2 editor',
    'vendor url' => 'http://codemirror.net/',
    'download url' => 'http://codemirror.net/',
    'library path' => wysiwyg_get_path('codemirror2'),
    'libraries' => array(
      'src' => array(
        'title' => 'Source',
        'files' => array(
          'lib/codemirror.js',
        ),
      ),
    ),
    'version callback' => 'wysiwyg_codemirror_codemirror_version',
    'themes callback' => 'wysiwyg_codemirror_codemirror_themes',
    'load callback' => 'wysiwyg_codemirror_codemirror_load',
    'settings callback' => 'wysiwyg_codemirror_codemirror_settings',
    'plugin callback' => 'wysiwyg_codemirror_codemirror_plugins',
    'versions' => array(
      '2.1.0' => array(
        'js files' => array('codemirror2-1.js'),
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
function wysiwyg_codemirror_codemirror_version($editor) {
	$library = $editor['library path'] . '/lib/codemirror.js';
	if (!file_exists($library)) {
		return;
	}
	/**
	 * TODO: No real way to do this so just returning something
	 */ 
	return "2.1.0";
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
function wysiwyg_codemirror_codemirror_themes($editor, $profile) {
	/**
	 * TODO: just a STUB 
	 */
	$plugins = $profile->settings["buttons"]["default"];
	drupal_add_css(drupal_get_path("module", "wysiwyg_codemirror")."/css/codemirror.css", 
	array(
		"type" => "internal"
	));
	foreach ($plugins as $plugin=>$p) {
		drupal_add_css($editor['library path'] . '/mode/'.$plugin.'/'.$plugin.'.css');
		drupal_add_js($editor['library path'] . '/mode/'.$plugin.'/'.$plugin.'.js');
	}
	
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
function wysiwyg_codemirror_codemirror_load($editor, $library) {
	drupal_add_css($editor['library path'] . '/lib/codemirror.css');
	drupal_add_css($editor['library path'] . '/theme/default.css');
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
function wysiwyg_codemirror_codemirror_settings($editor, $config, $theme) {
	$settings = array();
	if (isset($config) && isset($config["buttons"]) && isset($config["buttons"]["default"])) {
		$result = array();
		foreach ($config["buttons"]["default"] as $plugin=>$p) {
			array_push($result, $plugin);
		}
		$settings["enabled"] = $result;				
	}
	return $settings;
}

function wysiwyg_codemirror_codemirror_plugins($editor) {
	$library = $editor['library path'] . '/mode/';
	$handler = opendir($library);
	$plugins = array();
	while ($file = readdir($handler)) {
	
		// if file isn't this directory or its parent, add it to the results
		if ($file != "." && $file != "..") {
			$plugins[$file] = $file;
		}	
	}
  return array(
    'default' => array(
      'buttons' => $plugins,
      'internal' => TRUE,
    ),
  );
}