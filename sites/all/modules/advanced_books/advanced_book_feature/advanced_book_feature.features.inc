<?php
/**
 * @file
 * advanced_book_feature.features.inc
 */

/**
 * Implementation of hook_node_info().
 */
function advanced_book_feature_node_info() {
  $items = array(
    'advanced_book' => array(
      'name' => t('Advanced book'),
      'base' => 'node_content',
      'description' => t('Advanced book'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  return $items;
}
