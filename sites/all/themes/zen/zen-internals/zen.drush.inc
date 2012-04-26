<?php
/**
 * @file
 * Contains functions only needed for drush integration.
 */

/**
 * Implementation of hook_drush_command().
 */
function zen_drush_command() {
  $items = array();

  $items['zen'] = array(
    'description' => 'Create a theme using Zen.',
    'arguments' => array(
      'name'         => 'A name for your theme.',
      'machine_name' => '[optional] A machine-readable name for your theme.',
    ),
    'options' => array(
      'name'         => 'A name for your theme.',
      'machine-name' => '[a-z, 0-9] A machine-readable name for your theme.',
      'description'  => 'A description of your theme.',
      'without-rtl'  => 'Remove all RTL stylesheets.',
      // @TODO: Add these options:
      // 'layout'       => '[fixed,fluid,960gs] Choose the page layout method.',
    ),
    'examples' => array(
      'drush zen "My theme name"' => 'Create a sub-theme, using the default options.',
      'drush zen "My theme name" my_theme' => 'Create a sub-theme with a specific machine name.',
    ),
  );

  return $items;
}

/**
 * Create a Zen sub-theme using the starter kit.
 */
function drush_zen($name = NULL, $machine_name = NULL) {
  // Determine the theme name.
  if (!isset($name)) {
    $name = drush_get_option('name');
  }

  // Determine the machine name.
  if (!isset($machine_name)) {
    $machine_name = drush_get_option('machine-name');
  }
  if (!$machine_name) {
    $machine_name = $name;
  }
  $machine_name = str_replace(' ', '_', strtolower($machine_name));
  $search = array(
    '/[^a-z0-9_]/', // Remove characters not valid in function names.
    '/^[^a-z]+/',   // Functions must begin with an alpha character.
  );
  $machine_name = preg_replace($search, '', $machine_name);

  // Determine the path to the new subtheme by finding the path to Zen.
  $zen_path = drush_locate_root() . '/' . drupal_get_path('theme', 'zen');
  $subtheme_path = explode('/', $zen_path);
  array_pop($subtheme_path);
  $subtheme_path = implode('/', $subtheme_path) . '/' . str_replace('_', '-', $machine_name);

  // Make a fresh copy of the original starter kit.
  drush_op('zen_copy', $zen_path . '/STARTERKIT', $subtheme_path);

  // Rename the .info file.
  $subtheme_info_file = $subtheme_path . '/' . $machine_name . '.info';
  drush_op('rename', $subtheme_path . '/STARTERKIT.info.txt', $subtheme_info_file);

  // Alter the contents of the .info file based on the command options.
  $alterations = array(
    '= Zen Sub-theme Starter Kit' => '= ' . $name,
  );
  if ($description = drush_get_option('description')) {
    $alterations['Read the <a href="http://drupal.org/node/873778">online docs</a> or the included README.txt on how to create a theme with Zen.'] = $description;
  }
  drush_op('zen_file_str_replace', $subtheme_info_file, array_keys($alterations), $alterations);

  // Replace all occurrences of 'STARTERKIT' with the machine name of our sub theme.
  drush_op('zen_file_str_replace', $subtheme_path . '/theme-settings.php', 'STARTERKIT', $machine_name);
  drush_op('zen_file_str_replace', $subtheme_path . '/template.php', 'STARTERKIT', $machine_name);

  // Remove all RTL stylesheets.
  if ($without_rtl = drush_get_option('without-rtl')) {
    foreach (array('forms', 'html-reset', 'layout-fixed', 'layout-liquid', 'navigation', 'pages', 'tabs') as $file) {
      // Remove the RTL stylesheet.
      drush_op('unlink', $subtheme_path . '/css/' . $file . '-rtl.css');
      drush_op('zen_file_str_replace', $subtheme_path . '/css/' . $file . '.css', ' /* LTR */', '');
    }
  }

  // Notify user of the newly created theme.
  drush_print(dt('Starter kit for "!name" created in: !path', array(
    '!name' => $name,
    '!path' => $subtheme_path,
  )));
}

/**
 * Copy a directory recursively.
 */
function zen_copy($source_dir, $target_dir, $ignore = '/^(\.(\.)?|CVS|\.svn|\.git|\.DS_Store)$/') {
  if (!is_dir($source_dir)) {
    drush_die(dt('The directory "!directory" was not found.', array('!directory' => $source_dir)));
  }
  $dir = opendir($source_dir);
  @mkdir($target_dir);
  while($file = readdir($dir)) {
    if (!preg_match($ignore, $file)) {
      if (is_dir($source_dir . '/' . $file)) {
        zen_copy($source_dir . '/' . $file, $target_dir . '/' . $file, $ignore);
      }
      else {
        copy($source_dir . '/' . $file, $target_dir . '/' . $file);
      }
    }
  }
  closedir($dir);
}

/**
 * Replace strings in a file.
 */
function zen_file_str_replace($file_path, $find, $replace) {
  $file_contents = file_get_contents($file_path);
  $file_contents = str_replace($find, $replace, $file_contents);
  file_put_contents($file_path, $file_contents);
}
