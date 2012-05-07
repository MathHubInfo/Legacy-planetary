<?php
/**
 * @file
 * planetmath_menus.features.menu_links.inc
 */

/**
 * Implements hook_menu_default_menu_links().
 */
function planetmath_menus_menu_default_menu_links() {
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
  // Exported menu link: main-menu:corrections
  $menu_links['main-menu:corrections'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'corrections',
    'router_path' => 'corrections',
    'link_title' => 'Corrections',
    'options' => array(
      'attributes' => array(
        'title' => 'Corrections to articles',
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
  // Exported menu link: main-menu:gallery
  $menu_links['main-menu:gallery'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'gallery',
    'router_path' => 'gallery',
    'link_title' => 'Gallery',
    'options' => array(
      'attributes' => array(
        'title' => 'Images',
      ),
    ),
    'module' => 'menu',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: main-menu:groups
  $menu_links['main-menu:groups'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'groups',
    'router_path' => 'groups',
    'link_title' => 'Groups',
    'options' => array(
      'attributes' => array(
        'title' => 'Coauthor groups',
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
  // Exported menu link: main-menu:problems
  $menu_links['main-menu:problems'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'problems',
    'router_path' => 'problems',
    'link_title' => 'Problems',
    'options' => array(
      'attributes' => array(
        'title' => 'Solve \'em here.',
      ),
    ),
    'module' => 'menu',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: main-menu:solutions
  $menu_links['main-menu:solutions'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'solutions',
    'router_path' => 'solutions',
    'link_title' => 'Solutions',
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
  // Exported menu link: management:admin
  $menu_links['management:admin'] = array(
    'menu_name' => 'management',
    'link_path' => 'admin',
    'router_path' => 'admin',
    'link_title' => 'Administration',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '1',
    'expanded' => '0',
    'weight' => '9',
  );
  // Exported menu link: menu-main-menu:<front>
  $menu_links['menu-main-menu:<front>'] = array(
    'menu_name' => 'menu-main-menu',
    'link_path' => '<front>',
    'router_path' => '',
    'link_title' => 'Feedback',
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
    'weight' => '-38',
  );
  // Exported menu link: menu-main-menu:aggregator
  $menu_links['menu-main-menu:aggregator'] = array(
    'menu_name' => 'menu-main-menu',
    'link_path' => 'aggregator',
    'router_path' => 'aggregator',
    'link_title' => 'Feed Aggregator',
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
    'weight' => '-46',
  );
  // Exported menu link: menu-main-menu:articles
  $menu_links['menu-main-menu:articles'] = array(
    'menu_name' => 'menu-main-menu',
    'link_path' => 'articles',
    'router_path' => 'articles',
    'link_title' => 'Encyclopedia',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '1',
    'expanded' => '1',
    'weight' => '-50',
  );
  // Exported menu link: menu-main-menu:corrections
  $menu_links['menu-main-menu:corrections'] = array(
    'menu_name' => 'menu-main-menu',
    'link_path' => 'corrections',
    'router_path' => 'corrections',
    'link_title' => 'Corrections',
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
    'weight' => '-41',
  );
  // Exported menu link: menu-main-menu:forum
  $menu_links['menu-main-menu:forum'] = array(
    'menu_name' => 'menu-main-menu',
    'link_path' => 'forum',
    'router_path' => 'forum',
    'link_title' => 'Forums',
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
    'weight' => '-39',
  );
  // Exported menu link: menu-main-menu:gallery
  $menu_links['menu-main-menu:gallery'] = array(
    'menu_name' => 'menu-main-menu',
    'link_path' => 'gallery',
    'router_path' => 'gallery',
    'link_title' => 'Gallery',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '1',
    'expanded' => '1',
    'weight' => '-48',
  );
  // Exported menu link: menu-main-menu:node/add/article
  $menu_links['menu-main-menu:node/add/article'] = array(
    'menu_name' => 'menu-main-menu',
    'link_path' => 'node/add/article',
    'router_path' => 'node/add/article',
    'link_title' => 'Add article',
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
    'parent_path' => 'articles',
  );
  // Exported menu link: menu-main-menu:node/add/image
  $menu_links['menu-main-menu:node/add/image'] = array(
    'menu_name' => 'menu-main-menu',
    'link_path' => 'node/add/image',
    'router_path' => 'node/add/image',
    'link_title' => 'Add image',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '1',
    'weight' => '0',
    'parent_path' => 'gallery',
  );
  // Exported menu link: menu-main-menu:poll
  $menu_links['menu-main-menu:poll'] = array(
    'menu_name' => 'menu-main-menu',
    'link_path' => 'poll',
    'router_path' => 'poll',
    'link_title' => 'Polls',
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
    'weight' => '-40',
  );
  // Exported menu link: menu-main-menu:squery
  $menu_links['menu-main-menu:squery'] = array(
    'menu_name' => 'menu-main-menu',
    'link_path' => 'squery',
    'router_path' => 'squery',
    'link_title' => 'SPARQL queries',
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
    'weight' => '-47',
  );
  // Exported menu link: menu-main-menu:userpoints
  $menu_links['menu-main-menu:userpoints'] = array(
    'menu_name' => 'menu-main-menu',
    'link_path' => 'userpoints',
    'router_path' => 'userpoints',
    'link_title' => 'Userpoints',
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
    'weight' => '-44',
  );
  // Exported menu link: navigation:aggregator
  $menu_links['navigation:aggregator'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'aggregator',
    'router_path' => 'aggregator',
    'link_title' => 'Feed aggregator',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '1',
    'expanded' => '0',
    'weight' => '5',
  );
  // Exported menu link: navigation:aggregator/categories
  $menu_links['navigation:aggregator/categories'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'aggregator/categories',
    'router_path' => 'aggregator/categories',
    'link_title' => 'Categories',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '1',
    'expanded' => '0',
    'weight' => '0',
    'parent_path' => 'aggregator',
  );
  // Exported menu link: navigation:aggregator/categories/1
  $menu_links['navigation:aggregator/categories/1'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'aggregator/categories/1',
    'router_path' => 'aggregator/categories/%',
    'link_title' => 'New Forum Threads',
    'options' => array(),
    'module' => 'aggregator',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: navigation:aggregator/categories/2
  $menu_links['navigation:aggregator/categories/2'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'aggregator/categories/2',
    'router_path' => 'aggregator/categories/%',
    'link_title' => 'General Aggregator',
    'options' => array(),
    'module' => 'aggregator',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: navigation:aggregator/sources
  $menu_links['navigation:aggregator/sources'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'aggregator/sources',
    'router_path' => 'aggregator/sources',
    'link_title' => 'Sources',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '1',
    'expanded' => '0',
    'weight' => '0',
    'parent_path' => 'aggregator',
  );
  // Exported menu link: navigation:connectors/php
  $menu_links['navigation:connectors/php'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'connectors/php',
    'router_path' => 'connectors/php',
    'link_title' => 'TNTBase Browser',
    'options' => array(
      'attributes' => array(
        'title' => 'Broser TNTBase repository',
      ),
    ),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: navigation:corrections
  $menu_links['navigation:corrections'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'corrections',
    'router_path' => 'corrections',
    'link_title' => 'Corrections',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: navigation:drutexml
  $menu_links['navigation:drutexml'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'drutexml',
    'router_path' => 'drutexml',
    'link_title' => 'LaTeX filter implemented via LaTeXML',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: navigation:filter/tips
  $menu_links['navigation:filter/tips'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'filter/tips',
    'router_path' => 'filter/tips',
    'link_title' => 'Compose tips',
    'options' => array(),
    'module' => 'system',
    'hidden' => '1',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: navigation:forum
  $menu_links['navigation:forum'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum',
    'router_path' => 'forum',
    'link_title' => 'Forums',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '1',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: navigation:node/add
  $menu_links['navigation:node/add'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add',
    'router_path' => 'node/add',
    'link_title' => 'Add content',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '1',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: navigation:node/add/article
  $menu_links['navigation:node/add/article'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/article',
    'router_path' => 'node/add/article',
    'link_title' => 'Article',
    'options' => array(
      'attributes' => array(
        'title' => 'Use <em>articles</em> for time-sensitive content like news, press releases or blog posts.',
      ),
    ),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
    'parent_path' => 'node/add',
  );
  // Exported menu link: navigation:node/add/correction
  $menu_links['navigation:node/add/correction'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/correction',
    'router_path' => 'node/add/correction',
    'link_title' => 'Correction',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
    'parent_path' => 'node/add',
  );
  // Exported menu link: navigation:node/add/forum
  $menu_links['navigation:node/add/forum'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/forum',
    'router_path' => 'node/add/forum',
    'link_title' => 'Forum topic',
    'options' => array(
      'attributes' => array(
        'title' => 'A <em>forum topic</em> starts a new discussion thread within a forum.',
      ),
    ),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
    'parent_path' => 'node/add',
  );
  // Exported menu link: navigation:node/add/group
  $menu_links['navigation:node/add/group'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/group',
    'router_path' => 'node/add/group',
    'link_title' => 'Group',
    'options' => array(
      'attributes' => array(
        'title' => 'Groups as they come from Organic Groups.',
      ),
    ),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
    'parent_path' => 'node/add',
  );
  // Exported menu link: navigation:node/add/image
  $menu_links['navigation:node/add/image'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/image',
    'router_path' => 'node/add/image',
    'link_title' => 'Image',
    'options' => array(
      'attributes' => array(
        'title' => 'Use <em>images</em> for adding new entries to the gallery.',
      ),
    ),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
    'parent_path' => 'node/add',
  );
  // Exported menu link: navigation:node/add/news
  $menu_links['navigation:node/add/news'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/news',
    'router_path' => 'node/add/news',
    'link_title' => 'News',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
    'parent_path' => 'node/add',
  );
  // Exported menu link: navigation:node/add/page
  $menu_links['navigation:node/add/page'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/page',
    'router_path' => 'node/add/page',
    'link_title' => 'Basic page',
    'options' => array(
      'attributes' => array(
        'title' => 'Use <em>basic pages</em> for your static content, such as an \'About us\' page.',
      ),
    ),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
    'parent_path' => 'node/add',
  );
  // Exported menu link: navigation:node/add/poll
  $menu_links['navigation:node/add/poll'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/poll',
    'router_path' => 'node/add/poll',
    'link_title' => 'Poll',
    'options' => array(
      'attributes' => array(
        'title' => 'A <em>poll</em> is a question with a set of possible responses. A <em>poll</em>, once created, automatically provides a simple running count of the number of votes received for each response.',
      ),
    ),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
    'parent_path' => 'node/add',
  );
  // Exported menu link: navigation:node/add/problem
  $menu_links['navigation:node/add/problem'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/problem',
    'router_path' => 'node/add/problem',
    'link_title' => 'Problem',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
    'parent_path' => 'node/add',
  );
  // Exported menu link: navigation:node/add/request
  $menu_links['navigation:node/add/request'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/request',
    'router_path' => 'node/add/request',
    'link_title' => 'Request',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
    'parent_path' => 'node/add',
  );
  // Exported menu link: navigation:node/add/solution
  $menu_links['navigation:node/add/solution'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/solution',
    'router_path' => 'node/add/solution',
    'link_title' => 'Solution',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
    'parent_path' => 'node/add',
  );
  // Exported menu link: navigation:poll
  $menu_links['navigation:poll'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'poll',
    'router_path' => 'poll',
    'link_title' => 'Polls',
    'options' => array(),
    'module' => 'system',
    'hidden' => '1',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: navigation:search
  $menu_links['navigation:search'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'search',
    'router_path' => 'search',
    'link_title' => 'Search',
    'options' => array(),
    'module' => 'system',
    'hidden' => '1',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: navigation:squery
  $menu_links['navigation:squery'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'squery',
    'router_path' => 'squery',
    'link_title' => 'Issue queries and view results to a SPARQL endpoint',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: navigation:userpoints
  $menu_links['navigation:userpoints'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'userpoints',
    'router_path' => 'userpoints',
    'link_title' => 'Users by !points',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Translatables
  // Included for use with string extractors like potx.
  t('Add article');
  t('Add content');
  t('Add image');
  t('Administration');
  t('Article');
  t('Articles');
  t('Basic page');
  t('Categories');
  t('Compose tips');
  t('Correction');
  t('Corrections');
  t('Encyclopedia');
  t('Feed Aggregator');
  t('Feed aggregator');
  t('Feedback');
  t('Forum topic');
  t('Forums');
  t('Gallery');
  t('General Aggregator');
  t('Group');
  t('Groups');
  t('Home');
  t('Image');
  t('Issue queries and view results to a SPARQL endpoint');
  t('LaTeX filter implemented via LaTeXML');
  t('New Forum Threads');
  t('News');
  t('People');
  t('Poll');
  t('Polls');
  t('Problem');
  t('Problems');
  t('Request');
  t('SPARQL queries');
  t('Search');
  t('Solution');
  t('Solutions');
  t('Sources');
  t('TNTBase Browser');
  t('Userpoints');
  t('Users by !points');


  return $menu_links;
}
