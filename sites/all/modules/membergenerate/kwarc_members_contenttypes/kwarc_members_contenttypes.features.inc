<?php
/**
 * @file
 * kwarc_members_contenttypes.features.inc
 */

/**
 * Implements hook_node_info().
 */
function kwarc_members_contenttypes_node_info() {
  $items = array(
    'content_group' => array(
      'name' => t('Content Group'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'general_info_page' => array(
      'name' => t('General Info Page'),
      'base' => 'node_content',
      'description' => t('Please provide your personal info'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'member_profile' => array(
      'name' => t('Member Profile'),
      'base' => 'node_content',
      'description' => t('This content type gives information about the members'),
      'has_title' => '1',
      'title_label' => t('Full Name'),
      'help' => '',
    ),
  );
  return $items;
}
