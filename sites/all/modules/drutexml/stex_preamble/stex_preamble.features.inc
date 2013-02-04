<?php
/**
 * @file
 * stex_preamble.features.inc
 */

/**
 * Implements hook_node_info().
 */
function stex_preamble_node_info() {
  $items = array(
    'stex_preamble' => array(
      'name' => t('sTeX Preamble'),
      'base' => 'node_content',
      'description' => t('sTeX Preamble'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  return $items;
}
