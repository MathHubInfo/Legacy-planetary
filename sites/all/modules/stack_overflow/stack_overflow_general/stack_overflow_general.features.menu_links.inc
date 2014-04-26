<?php
/**
 * @file
 * stack_overflow_general.features.menu_links.inc
 */

/**
 * Implements hook_menu_default_menu_links().
 */
function stack_overflow_general_menu_default_menu_links() {
  $menu_links = array();

  // Exported menu link: main-menu:stack-overflow
  $menu_links['main-menu:stack-overflow'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'stack-overflow',
    'router_path' => 'stack-overflow',
    'link_title' => 'Stack Overflow',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '-44',
  );
  // Translatables
  // Included for use with string extractors like potx.
  t('Stack Overflow');


  return $menu_links;
}
