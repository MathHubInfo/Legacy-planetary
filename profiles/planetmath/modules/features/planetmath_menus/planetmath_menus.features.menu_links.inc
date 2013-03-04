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
    'weight' => '-50',
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
    'has_children' => '1',
    'expanded' => '0',
    'weight' => '-49',
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
    'weight' => '-50',
    'parent_path' => 'articles',
  );
  // Exported menu link: main-menu:forum
  $menu_links['main-menu:forum'] = array(
    'menu_name' => 'main-menu',
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
    'weight' => '-1',
    'parent_path' => 'sysstats',
  );
  // Exported menu link: main-menu:groups
  $menu_links['main-menu:groups'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'groups',
    'router_path' => 'groups',
    'link_title' => 'Groups',
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
    'parent_path' => 'sysstats',
  );
  // Exported menu link: main-menu:orphanage
  $menu_links['main-menu:orphanage'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'orphanage',
    'router_path' => 'orphanage',
    'link_title' => 'Orphanage',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
    'parent_path' => 'articles',
  );
  // Exported menu link: main-menu:problems
  $menu_links['main-menu:problems'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'problems',
    'router_path' => 'problems',
    'link_title' => 'Problems',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '1',
    'expanded' => '0',
    'weight' => '-47',
  );
  // Exported menu link: main-menu:questions
  $menu_links['main-menu:questions'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'questions',
    'router_path' => 'questions',
    'link_title' => 'Questions',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '1',
    'expanded' => '0',
    'weight' => '-48',
  );
  // Exported menu link: main-menu:site-docs
  $menu_links['main-menu:site-docs'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'site-docs',
    'router_path' => 'site-docs',
    'link_title' => 'Site Docs',
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
    'parent_path' => 'questions',
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
    'weight' => '1',
    'parent_path' => 'problems',
  );
  // Exported menu link: main-menu:sysstats
  $menu_links['main-menu:sysstats'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'sysstats',
    'router_path' => 'sysstats',
    'link_title' => 'Overview',
    'options' => array(),
    'module' => 'planetmath_sysstats',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '1',
    'expanded' => '0',
    'weight' => '1',
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
  // Exported menu link: navigation:forum/1
  $menu_links['navigation:forum/1'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/1',
    'router_path' => 'forum/%',
    'link_title' => 'PlanetMath System Updates and News',
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
    'weight' => '-38',
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/10
  $menu_links['navigation:forum/10'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/10',
    'router_path' => 'forum/%',
    'link_title' => 'The Math Pub',
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
    'weight' => '-34',
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/11
  $menu_links['navigation:forum/11'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/11',
    'router_path' => 'forum/%',
    'link_title' => 'Graduate/Advanced',
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
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/12
  $menu_links['navigation:forum/12'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/12',
    'router_path' => 'forum/%',
    'link_title' => 'Research Topics',
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
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/13
  $menu_links['navigation:forum/13'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/13',
    'router_path' => 'forum/%',
    'link_title' => 'Industry/Practice',
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
    'weight' => '-45',
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/14
  $menu_links['navigation:forum/14'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/14',
    'router_path' => 'forum/%',
    'link_title' => 'Math History',
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
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/15
  $menu_links['navigation:forum/15'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/15',
    'router_path' => 'forum/%',
    'link_title' => 'Strategic Communications Development',
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
    'weight' => '-35',
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/16
  $menu_links['navigation:forum/16'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/16',
    'router_path' => 'forum/%',
    'link_title' => 'PlanetMath.ORG',
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
    'weight' => '-36',
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/17
  $menu_links['navigation:forum/17'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/17',
    'router_path' => 'forum/%',
    'link_title' => 'Planetary Bugs',
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
    'weight' => '-49',
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/2
  $menu_links['navigation:forum/2'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/2',
    'router_path' => 'forum/%',
    'link_title' => 'PlanetMath Comments',
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
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/3
  $menu_links['navigation:forum/3'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/3',
    'router_path' => 'forum/%',
    'link_title' => 'Math Comptetitions',
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
    'weight' => '-42',
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/4
  $menu_links['navigation:forum/4'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/4',
    'router_path' => 'forum/%',
    'link_title' => 'HS/Secondary',
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
    'weight' => '-48',
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/5
  $menu_links['navigation:forum/5'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/5',
    'router_path' => 'forum/%',
    'link_title' => 'Math Humor',
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
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/6
  $menu_links['navigation:forum/6'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/6',
    'router_path' => 'forum/%',
    'link_title' => 'University/Tertiary',
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
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/7
  $menu_links['navigation:forum/7'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/7',
    'router_path' => 'forum/%',
    'link_title' => 'Testing messages (ignore)',
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
    'weight' => '18',
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/8
  $menu_links['navigation:forum/8'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/8',
    'router_path' => 'forum/%',
    'link_title' => 'LaTeX help',
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
    'weight' => '-43',
    'parent_path' => 'forum',
  );
  // Exported menu link: navigation:forum/9
  $menu_links['navigation:forum/9'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'forum/9',
    'router_path' => 'forum/%',
    'link_title' => 'PlanetMath help',
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
    'weight' => '-37',
    'parent_path' => 'forum',
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
        'title' => 'Use <em>articles</em> for encyclopedia content.',
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
  // Exported menu link: navigation:node/add/collection
  $menu_links['navigation:node/add/collection'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/collection',
    'router_path' => 'node/add/collection',
    'link_title' => 'Collection',
    'options' => array(),
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
    'options' => array(
      'attributes' => array(
        'title' => 'Content type to handle corrections.',
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
  // Exported menu link: navigation:node/add/forum/0
  $menu_links['navigation:node/add/forum/0'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/forum/0',
    'router_path' => 'node/add/forum',
    'link_title' => 'New Forum Post',
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
    'weight' => '-50',
    'parent_path' => 'forum',
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
        'title' => 'Use <em>images</em> in the gallery.',
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
    'options' => array(
      'attributes' => array(
        'title' => 'Use <em>news</em> for updates on site, organization, or community activity.',
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
  // Exported menu link: navigation:node/add/page
  $menu_links['navigation:node/add/page'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/page',
    'router_path' => 'node/add/page',
    'link_title' => 'Basic page',
    'options' => array(
      'attributes' => array(
        'title' => 'Use <em>basic pages</em> for your static content, like the \'About us\' page.',
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
    'options' => array(
      'attributes' => array(
        'title' => 'Exercises for learning purposes.',
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
  // Exported menu link: navigation:node/add/question
  $menu_links['navigation:node/add/question'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/question',
    'router_path' => 'node/add/question',
    'link_title' => 'Question',
    'options' => array(
      'attributes' => array(
        'title' => 'Questions as they come up.',
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
  // Exported menu link: navigation:node/add/review
  $menu_links['navigation:node/add/review'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'node/add/review',
    'router_path' => 'node/add/review',
    'link_title' => 'Review',
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
  // Exported menu link: navigation:sysstats
  $menu_links['navigation:sysstats'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'sysstats',
    'router_path' => 'sysstats',
    'link_title' => 'System Stats',
    'options' => array(),
    'module' => 'planetmath_sysstats',
    'hidden' => '1',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '-46',
  );
  // Exported menu link: navigation:userpoints
  $menu_links['navigation:userpoints'] = array(
    'menu_name' => 'navigation',
    'link_path' => 'userpoints',
    'router_path' => 'userpoints',
    'link_title' => 'Users by !points',
    'options' => array(),
    'module' => 'system',
    'hidden' => '1',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '-45',
  );
  // Exported menu link: user-menu:messages
  $menu_links['user-menu:messages'] = array(
    'menu_name' => 'user-menu',
    'link_path' => 'messages',
    'router_path' => 'messages',
    'link_title' => 'Messages',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: user-menu:myuserpoints
  $menu_links['user-menu:myuserpoints'] = array(
    'menu_name' => 'user-menu',
    'link_path' => 'myuserpoints',
    'router_path' => 'myuserpoints',
    'link_title' => 'My !points',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '1',
    'expanded' => '0',
    'weight' => '0',
  );
  // Exported menu link: user-menu:user
  $menu_links['user-menu:user'] = array(
    'menu_name' => 'user-menu',
    'link_path' => 'user',
    'router_path' => 'user',
    'link_title' => 'User account',
    'options' => array(
      'alter' => TRUE,
    ),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '1',
    'expanded' => '0',
    'weight' => '-10',
  );
  // Exported menu link: user-menu:user/logout
  $menu_links['user-menu:user/logout'] = array(
    'menu_name' => 'user-menu',
    'link_path' => 'user/logout',
    'router_path' => 'user/logout',
    'link_title' => 'Log out',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '10',
  );
  // Exported menu link: user-menu:user/watcher
  $menu_links['user-menu:user/watcher'] = array(
    'menu_name' => 'user-menu',
    'link_path' => 'user/watcher',
    'router_path' => 'user/watcher',
    'link_title' => 'My Watched Posts',
    'options' => array(),
    'module' => 'system',
    'hidden' => '0',
    'external' => '0',
    'has_children' => '0',
    'expanded' => '0',
    'weight' => '0',
    'parent_path' => 'user',
  );
  // Translatables
  // Included for use with string extractors like potx.
  t('Add content');
  t('Article');
  t('Articles');
  t('Basic page');
  t('Collection');
  t('Compose tips');
  t('Correction');
  t('Corrections');
  t('Feed aggregator');
  t('Forum topic');
  t('Forums');
  t('Graduate/Advanced');
  t('Group');
  t('Groups');
  t('HS/Secondary');
  t('Home');
  t('Image');
  t('Industry/Practice');
  t('LaTeX help');
  t('Log out');
  t('Math Comptetitions');
  t('Math History');
  t('Math Humor');
  t('Messages');
  t('My !points');
  t('My Watched Posts');
  t('New Forum Post');
  t('News');
  t('Orphanage');
  t('Overview');
  t('PlanetMath Comments');
  t('PlanetMath System Updates and News');
  t('PlanetMath help');
  t('PlanetMath.ORG');
  t('Planetary Bugs');
  t('Poll');
  t('Polls');
  t('Problem');
  t('Problems');
  t('Question');
  t('Questions');
  t('Research Topics');
  t('Review');
  t('Search');
  t('Site Docs');
  t('Solution');
  t('Solutions');
  t('Sources');
  t('Strategic Communications Development');
  t('System Stats');
  t('Testing messages (ignore)');
  t('The Math Pub');
  t('University/Tertiary');
  t('User account');
  t('Users by !points');


  return $menu_links;
}
