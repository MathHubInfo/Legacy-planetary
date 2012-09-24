<?php
// $Id: wysiwyg_ace.module,v 1.1 2010/03/17 16:48:12 drifter Exp $
/**
* @file
* wysiwyg_ace is an plugin for adding syntax highlighting to the tinyMCE editor
* Zoltan Varady/FARM 2010
*/

/**
* Implementation of hook_editor().
*/
function wysiwyg_ace_ace_editor() {
	$editor['ace'] = array(
		'title' => 'ACE Editor',
		'vendor url' => 'http://ace.ajax.org/',
		'download url' => 'https://github.com/ajaxorg/ace/',
		'library path' => wysiwyg_get_path('ace'),
		'libraries' => array(
			'src' => array(
				'title' => 'Source',
				'files' => array(
					'build/src-min-noconflict/ace.js',
					'build/src-min-noconflict/keybinding-emacs.js',
					),
				),
			),
		'version callback' => 'wysiwyg_ace_ace_version',
		'themes callback' => 'wysiwyg_ace_ace_themes',
		'load callback' => 'wysiwyg_ace_ace_load',
		'settings callback' => 'wysiwyg_ace_ace_settings',
		'plugin callback' => 'wysiwyg_ace_ace_plugins',
		'versions' => array(
			'0.2' => array(
				'js files' => array('async.js', 'ace_toolbar.js', 'ace0-2.js', 
				  					'underscore.js', 'jsonform.js'),
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
function wysiwyg_ace_ace_version($editor) {
	$library = $editor['library path'] . '/package.json';
	if (!file_exists($library)) {
		return;
	}
	// TODO: Return the version
	return "0.2";
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
function wysiwyg_ace_ace_themes($editor, $profile) {
	/**
	* TODO: just a STUB 
	*/
	$plugins = $profile->settings["buttons"]["default"];
	drupal_add_css(drupal_get_path("module", "wysiwyg_ace")."/css/ace.css", 
		array(
			"type" => "internal"
			));
	#foreach ($plugins as $plugin=>$p) {
	#	drupal_add_css($editor['library path'] . '/mode/'.$plugin.'/'.$plugin.'.css');
	#	drupal_add_js($editor['library path'] . '/mode/'.$plugin.'/'.$plugin.'.js');
	#}
	$cpath = url("", array("absolute"=>true)).drupal_get_path("module", "wysiwyg_ace")."/editors/js/";
	drupal_add_library('system', 'ui.button');
	drupal_add_library('system', 'ui.dialog');
	drupal_add_js($cpath."exhibit/exhibit-api.js?autoCreate=false", array("external"=>true));
	drupal_add_js($cpath."text-prefix-complete.js", array("external"=>true));
	drupal_add_js($cpath."emacs.js", array("external"=>true));
	drupal_add_html_head_link(array(
      'rel' => 'exhibit-data',
      'type' => 'application/json',
      'href' => $cpath."/environments.js",
    ));


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
function wysiwyg_ace_ace_load($editor, $library) {
	drupal_add_css($editor['library path'] . '/lib/ace.css');
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
function wysiwyg_ace_ace_settings($editor, $config, $theme) {
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

function ace_getMode($name) {
	
	if (!preg_match("/_highlight_rules|_test|_worker|xml_util|_outdent|behaviour/", $name) && preg_match("/(.*)\.js$/", $name, $matches))
		return $matches[1];
	else
		return null;
}

function wysiwyg_ace_ace_plugins($editor) {
	$library = $editor['library path'] . '/lib/ace/mode/';
	$handler = opendir($library);
	$plugins = array();
	$plugins = array();
	while ($file = readdir($handler)) {
		// if file isn't this directory or its parent, add it to the results
		if ($file != "." && $file != ".." && $file) {
			$mode = ace_getMode($file);
			if ($mode!=null) {
				$plugins["mode_".$mode] = $mode;
			}
		}	
		
	}
	$plugins["ShareJS_true"] = "ShareJS Services";
	return array(
		'default' => array(
			'buttons' => $plugins,
			'internal' => TRUE,
			),
		);
}
