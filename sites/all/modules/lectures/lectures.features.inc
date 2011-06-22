<?php
/**
 * @file
 * lectures.features.inc
 */

/**
 * Implementation of hook_ctools_plugin_api().
 */
function lectures_ctools_plugin_api() {
  list($module, $api) = func_get_args();
  if ($module == "ds" && $api == "ds") {
    return array("version" => "1");
  }
}

/**
 * Implementation of hook_views_api().
 */
function lectures_views_api() {
  list($module, $api) = func_get_args();
  if ($module == "views" && $api == "views_default") {
    return array("version" => "3.0");
  }
}

/**
 * Implementation of hook_node_info().
 */
function lectures_node_info() {
  $items = array(
    'lecture' => array(
      'name' => t('Lecture'),
      'base' => 'node_content',
      'description' => t('This content type describes a lecture with video and transcript attached to it'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  return $items;
}
