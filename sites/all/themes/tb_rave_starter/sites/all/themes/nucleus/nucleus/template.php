<?php
/**
 * @file
 * controls load theme.
 */

// Split funtions and stuff into seperate files for eaiser house keeping.
include_once(drupal_get_path('theme', 'nucleus') . '/inc/override_functions.inc');
include_once(drupal_get_path('theme', 'nucleus') . '/inc/custom_functions.inc');
include_once(drupal_get_path('theme', 'nucleus') . '/inc/grid_functions.inc');

/**
 * Implements hook_theme().
 */
function nucleus_theme() {
  $items = array();
  $items ['fieldset'] = array(
    'arguments' => array(
      'element' => array()
    ),
    'template' => 'fieldset',
    'path' => drupal_get_path('theme', 'nucleus') . '/tpl',
  );
  // Split out pager list into separate theme function.
  $items ['pager_list'] = array(
    'arguments' => array(
      'tags' => array(),
      'limit' => 10,
      'element' => 0,
      'parameters' => array(),
      'quantity' => 9,
    ),
  );

  $items['render_panel'] = array(
    "variables" => array(
      'page' => array(),
      'panels_list' => array(),
      'panel_regions_width' => array(),
    ),
    'preprocess functions' => array(
      'nucleus_preprocess_render_panel'
    ),
    'template' => 'panel',
    'path' => drupal_get_path('theme', 'nucleus') . '/tpl',
  );
  return $items;
}
