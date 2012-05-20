<?php
/**
 * @file
 * organic_groups_content_type.features.inc
 */

/**
 * Implements hook_node_info().
 */
function organic_groups_content_type_node_info() {
  $items = array(
    'group' => array(
      'name' => t('Group'),
      'base' => 'node_content',
      'description' => t('Groups as they come from Organic Groups.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  return $items;
}
