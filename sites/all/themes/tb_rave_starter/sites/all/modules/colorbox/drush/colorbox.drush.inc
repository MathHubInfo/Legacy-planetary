<?php

/**
 * @file
 *   drush integration for colorbox.
 */

/**
 * The Colorbox plugin URI.
 */
define('COLORBOX_DOWNLOAD_URI', 'http://www.jacklmoore.com/colorbox/colorbox.zip');

/**
 * Implementation of hook_drush_command().
 *
 * In this hook, you specify which commands your
 * drush module makes available, what it does and
 * description.
 *
 * Notice how this structure closely resembles how
 * you define menu hooks.
 *
 * See `drush topic docs-commands` for a list of recognized keys.
 *
 * @return
 *   An associative array describing your command(s).
 */
function colorbox_drush_command() {
  $items = array();

  // the key in the $items array is the name of the command.
  $items['colorbox-plugin'] = array(
    'callback' => 'drush_colorbox_plugin',
    'description' => dt('Download and install the Colorbox plugin.'),
    'bootstrap' => DRUSH_BOOTSTRAP_DRUSH, // No bootstrap.
    'arguments' => array(
      'path' => dt('Optional. A path where to install the Colorbox plugin. If omitted Drush will use the default location.'),
    ),
    'aliases' => array('colorboxplugin'),
  );

  return $items;
}

/**
 * Implementation of hook_drush_help().
 *
 * This function is called whenever a drush user calls
 * 'drush help <name-of-your-command>'
 *
 * @param
 *   A string with the help section (prepend with 'drush:')
 *
 * @return
 *   A string with the help text for your command.
 */
function colorbox_drush_help($section) {
  switch ($section) {
    case 'drush:colorbox-plugin':
      return dt('Download and install the Colorbox plugin from jacklmoore.com/colorbox, default location is sites/all/libraries.');
  }
}

/**
 * Implements drush_MODULE_post_pm_enable().
 */
// function drush_colorbox_post_pm_enable() {
//   $modules = func_get_args();
//   if (in_array('colorbox', $modules)) {
//     drush_colorbox_plugin();
//   }
// }

/**
 * Command to download the Colorbox plugin.
 */
function drush_colorbox_plugin() {
  $args = func_get_args();
  if (!empty($args[0])) {
    $path = $args[0];
  }
  else {
    $path = 'sites/all/libraries';
  }

  // Create the path if it does not exist.
  if (!is_dir($path)) {
    drush_op('mkdir', $path);
    drush_log(dt('Directory @path was created', array('@path' => $path)), 'notice');
  }

  // Set the directory to the download location.
  $olddir = getcwd();
  chdir($path);

  $filename = basename(COLORBOX_DOWNLOAD_URI);
  $dirname = basename(COLORBOX_DOWNLOAD_URI, '.zip');

  // Remove any existing Colorbox plugin directory
  if (is_dir($dirname)) {
    drush_delete_dir($dirname, TRUE);
    drush_log(dt('A existing Colorbox plugin was deleted from @path', array('@path' => $path)), 'notice');
  }
  // Remove any existing Colorbox plugin zip archive
  if (is_file($filename)) {
    drush_delete_dir($filename, TRUE);
  }

  // Download the zip archive
  drush_download_file(COLORBOX_DOWNLOAD_URI);


  if (is_file($filename)) {
    // Decompress the zip archive
    drush_tarball_extract($filename);
  }


  if (is_dir($dirname)) {
    drush_log(dt('Colorbox plugin has been installed in @path', array('@path' => $path)), 'success');
  }
  else {
    drush_log(dt('Drush was unable to install the Colorbox plugin to @path', array('@path' => $path)), 'error');
  }

  // Set working directory back to the previous working directory.
  chdir($olddir);
}
