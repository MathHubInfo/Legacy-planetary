<?php
/**
 * @file
 * planetmath_encyclopedia.features.menu_links.inc
 */

/**
 * Implementation of hook_menu_default_menu_links().
 */
function planetmath_encyclopedia_menu_default_menu_links() {
  $menu_links = array();

  // Exported menu link: main-menu:<front>
  $menu_links['main-menu:<front>'] = array(
    'menu_name' => 'main-menu',
    'link_path' => '<front>',
    'router_path' => '',
    'link_title' => 'Home',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => '0',
    'external' => '1',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '-1',
  );
  // Exported menu link: main-menu:articles
  $menu_links['main-menu:articles'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'articles',
    'router_path' => 'articles',
    'link_title' => 'Articles',
    'options' => array(
      'attributes' => array(
        'title' => 'Articles',
      ),
    ),
    'module' => 'menu',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: main-menu:forum
  $menu_links['main-menu:forum'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'forum',
    'router_path' => 'forum',
    'link_title' => 'Forums',
    'options' => array(
      'attributes' => array(
        'title' => 'General discussions',
      ),
    ),
    'module' => 'menu',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: main-menu:people
  $menu_links['main-menu:people'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'people',
    'router_path' => 'people',
    'link_title' => 'People',
    'options' => array(
      'attributes' => array(
        'title' => 'Math for the people, by the people.',
      ),
    ),
    'module' => 'menu',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: main-menu:problem
  $menu_links['main-menu:problem'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'problem',
    'router_path' => 'problem',
    'link_title' => 'Problems',
    'options' => array(
      'attributes' => array(
        'title' => 'Manage problems',
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
  t('Articles');
  t('Forums');
  t('Home');
  t('People');
  t('Problems');


  return $menu_links;
}
