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
function wysiwyg_ymacs_ymacs_editor() {
   $editor['ymacs'] = array(
    'title' => 'Ymacs editor',
    'vendor url' => 'http://www.ymacs.org/',
    'download url' => 'http://www.ymacs.org/ymacs/ymacs-latest.tar.gz',
    'library path' => wysiwyg_get_path('ymacs'),
    'libraries' => array(
      'src' => array(
        'title' => 'Source',
        'files' => array(
          'src/js/ymacs.js',
        ),
      ),
    ),
    'version callback' => 'wysiwyg_ymacs_ymacs_version',
    'themes callback' => 'wysiwyg_ymacs_ymacs_themes',
    'load callback' => 'wysiwyg_ymacs_ymacs_load',
    'settings callback' => 'wysiwyg_ymacs_ymacs_settings',
    'plugin callback' => 'wysiwyg_ymacs_ymacs_plugins',
    'versions' => array(
      '0.4' => array(
        'js files' => array('ymacs-0.4.js'),
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
function wysiwyg_ymacs_ymacs_version($editor) {
	$library = $editor['library path'] . '/src/js/ymacs.js';
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
function wysiwyg_ymacs_ymacs_themes($editor, $profile) {
	/**
	 * TODO: just a STUB 
	 */
	drupal_add_css(drupal_get_path("module", "wysiwyg_ymacs")."/css/wysiwyg_ymacs.css");
	if (isset($profile->settings["buttons"]) && isset($profile->settings["buttons"]["default"])) {
	  $plugins = $profile->settings["buttons"]["default"];
	  foreach ($plugins as $plugin=>$p) {
	    drupal_add_css($editor['library path'] . '/mode/'.$plugin.'/'.$plugin.'.css');
	    drupal_add_js($editor['library path'] . '/mode/'.$plugin.'/'.$plugin.'.js');
	  }
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
function wysiwyg_ymacs_ymacs_load($editor, $library) {
	drupal_add_css($editor['library path'] . '/test/dl/new-theme/default.css');
	drupal_add_css($editor['library path'] . '/src/css/ymacs.css');
	drupal_add_js($editor['library path']. '/test/dl/js/thelib.js');
	drupal_add_js(drupal_get_path("module", "wysiwyg_ymacs"). '/js/jquery.timeout.interval.idle.js');
	
	$result = db_select("mathkeywords", "m")->
					fields("m", array("id", "class", "syn", "title", "defines", "url"))->
					execute();

	$send = array();
	foreach ($result as $row) {
		$row = (array)$row;
		$send["syn"][]=$row["syn"];		
		$send["id"][]=$row["id"];		
		$send["title"][]=$row["title"];		
		$send["defines"][]=$row["defines"];		
		$send["url"][]=$row["defines"];
	}
	dd(json_encode($send));
		
	$ymacsJS = array(
		"ymacs.js", "ymacs-keyboard.js", "ymacs-regexp.js", "ymacs-frame.js",
		"ymacs-textprop.js", "ymacs-exception.js", "ymacs-interactive.js",
		"ymacs-buffer.js", "ymacs-marker.js", "ymacs-commands.js", "ymacs-commands-utils.js",
		"ymacs-keymap.js", "ymacs-keymap-emacs.js", "ymacs-keymap-isearch.js",
		"ymacs-minibuffer.js", "ymacs-tokenizer.js", "ymacs-mode-paren-match.js",
		"ymacs-mode-lisp.js", "ymacs-mode-js.js", "ymacs-mode-xml.js", "ymacs-mode-css.js",
		"ymacs-mode-markdown.js",
	); 	
	
	foreach ($ymacsJS as $file) {
		drupal_add_js($editor['library path']. '/src/js/'.$file);
	}
	
	$js_root = drupal_get_path("module", "wysiwyg_ymacs")."/js/";
	foreach (array("trie.js", "aho.js", "porter.js", "ymacs-autolinker.js", "ymacs-mode-stex.js", "ymacs-math-preview.js") as $jsfile) {
		drupal_add_js($js_root.$jsfile);
	}
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
function wysiwyg_ymacs_ymacs_settings($editor, $config, $theme) {
	$settings = array();
	$settings["jspath"]=url("<front>").$editor['library path'];
	if (isset($config) && isset($config["buttons"]) && isset($config["buttons"]["default"])) {
		$result = array();
		foreach ($config["buttons"]["default"] as $plugin=>$p) {
			array_push($result, $plugin);
		}
		$settings["enabled"] = $result;				
	}
	return $settings;
}

function wysiwyg_ymacs_ymacs_plugins($editor) {
/*	$library = $editor['library path'] . '/mode/';
	$handler = opendir($library);
	$plugins = array();
	while ($file = readdir($handler)) {
	
		// if file isn't this directory or its parent, add it to the results
		if ($file != "." && $file != "..") {
			$plugins[$file] = $file;
		}	
	} */
  return array(
    'default' => array(
      //'buttons' => $plugins,
      'internal' => TRUE,
    ),
  );
}