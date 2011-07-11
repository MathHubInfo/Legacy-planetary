<?php
/**
 * @file
 * planetmath_encyclopedia.features.inc
 */

/**
 * Implementation of hook_views_api().
 */
function planetmath_encyclopedia_views_api() {
  list($module, $api) = func_get_args();
  if ($module == "views" && $api == "views_default") {
    return array("version" => "3.0");
  }
}

/**
 * Implementation of hook_node_info().
 */
function planetmath_encyclopedia_node_info() {
  $items = array(
    'problem' => array(
      'name' => t('Problem'),
      'base' => 'node_content',
      'description' => t('Basically the same as an article, but can have one or more solutions attached.'),
      'has_title' => '1',
      'title_label' => t('Problem'),
      'help' => '',
    ),
  );
  return $items;
}
