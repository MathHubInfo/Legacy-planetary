<?php
/**
 * @file
 * project_generation_feature.features.inc
 */

/**
 * Implements hook_views_api().
 */
function project_generation_feature_views_api() {
  return array("version" => "3.0");
}

/**
 * Implements hook_node_info().
 */
function project_generation_feature_node_info() {
  $items = array(
    'page' => array(
      'name' => t('Basic page'),
      'base' => 'node_content',
      'description' => t('Use <em>basic pages</em> for your static content, such as an \'About us\' page.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'pageimagetextrightdown' => array(
      'name' => t('PageImageTextRightDown'),
      'base' => 'node_content',
      'description' => t('Page with an Image on the left with a text of the right followed by a body.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'project_creation_form' => array(
      'name' => t('Project Creation Form'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Project Name'),
      'help' => '',
    ),
    'project_description' => array(
      'name' => t('Project Description'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'project_group' => array(
      'name' => t('Project Group'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
  );
  return $items;
}
