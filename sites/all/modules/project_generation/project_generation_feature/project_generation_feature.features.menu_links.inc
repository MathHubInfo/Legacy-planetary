<?php
/**
 * @file
 * project_generation_feature.features.menu_links.inc
 */

/**
 * Implements hook_menu_default_menu_links().
 */
function project_generation_feature_menu_default_menu_links() {
  $menu_links = array();

  // Exported menu link: main-menu:project-list
  $menu_links['main-menu:project-list'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'project-list',
    'router_path' => 'project-list',
    'link_title' => 'Projects',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Translatables
  // Included for use with string extractors like potx.
  t('Projects');


  return $menu_links;
}
