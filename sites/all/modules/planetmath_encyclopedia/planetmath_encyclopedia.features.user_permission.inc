<?php
/**
 * @file
 * planetmath_encyclopedia.features.user_permission.inc
 */

/**
 * Implements hook_user_default_permissions().
 */
function planetmath_encyclopedia_user_default_permissions() {
  $permissions = array();

  // Exported permission: access administration pages
  $permissions['access administration pages'] = array(
    'name' => 'access administration pages',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'system',
  );

  // Exported permission: access all views
  $permissions['access all views'] = array(
    'name' => 'access all views',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'views',
  );

  // Exported permission: access comments
  $permissions['access comments'] = array(
    'name' => 'access comments',
    'roles' => array(
      0 => 'administrator',
      1 => 'anonymous user',
      2 => 'authenticated user',
    ),
    'module' => 'comment',
  );

  // Exported permission: access content
  $permissions['access content'] = array(
    'name' => 'access content',
    'roles' => array(
      0 => 'administrator',
      1 => 'anonymous user',
      2 => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: access content overview
  $permissions['access content overview'] = array(
    'name' => 'access content overview',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: access contextual links
  $permissions['access contextual links'] = array(
    'name' => 'access contextual links',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'contextual',
  );

  // Exported permission: access dashboard
  $permissions['access dashboard'] = array(
    'name' => 'access dashboard',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'dashboard',
  );

  // Exported permission: access devel information
  $permissions['access devel information'] = array(
    'name' => 'access devel information',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'devel',
  );

  // Exported permission: access news feeds
  $permissions['access news feeds'] = array(
    'name' => 'access news feeds',
    'roles' => array(
      0 => 'administrator',
      1 => 'anonymous user',
      2 => 'authenticated user',
    ),
    'module' => 'aggregator',
  );

  // Exported permission: access site in maintenance mode
  $permissions['access site in maintenance mode'] = array(
    'name' => 'access site in maintenance mode',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'system',
  );

  // Exported permission: access site reports
  $permissions['access site reports'] = array(
    'name' => 'access site reports',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'system',
  );

  // Exported permission: access toolbar
  $permissions['access toolbar'] = array(
    'name' => 'access toolbar',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'toolbar',
  );

  // Exported permission: access user profiles
  $permissions['access user profiles'] = array(
    'name' => 'access user profiles',
    'roles' => array(
      0 => 'administrator',
      1 => 'anonymous user',
      2 => 'authenticated user',
    ),
    'module' => 'user',
  );

  // Exported permission: administer Terms and Conditions
  $permissions['administer Terms and Conditions'] = array(
    'name' => 'administer Terms and Conditions',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'legal',
  );

  // Exported permission: administer actions
  $permissions['administer actions'] = array(
    'name' => 'administer actions',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'system',
  );

  // Exported permission: administer blocks
  $permissions['administer blocks'] = array(
    'name' => 'administer blocks',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'block',
  );

  // Exported permission: administer comments
  $permissions['administer comments'] = array(
    'name' => 'administer comments',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'comment',
  );

  // Exported permission: administer content types
  $permissions['administer content types'] = array(
    'name' => 'administer content types',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: administer features
  $permissions['administer features'] = array(
    'name' => 'administer features',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'features',
  );

  // Exported permission: administer filters
  $permissions['administer filters'] = array(
    'name' => 'administer filters',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'filter',
  );

  // Exported permission: administer forums
  $permissions['administer forums'] = array(
    'name' => 'administer forums',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'forum',
  );

  // Exported permission: administer group
  $permissions['administer group'] = array(
    'name' => 'administer group',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'og',
  );

  // Exported permission: administer image styles
  $permissions['administer image styles'] = array(
    'name' => 'administer image styles',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'image',
  );

  // Exported permission: administer languages
  $permissions['administer languages'] = array(
    'name' => 'administer languages',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'locale',
  );

  // Exported permission: administer menu
  $permissions['administer menu'] = array(
    'name' => 'administer menu',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'menu',
  );

  // Exported permission: administer modules
  $permissions['administer modules'] = array(
    'name' => 'administer modules',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'system',
  );

  // Exported permission: administer news feeds
  $permissions['administer news feeds'] = array(
    'name' => 'administer news feeds',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'aggregator',
  );

  // Exported permission: administer nodes
  $permissions['administer nodes'] = array(
    'name' => 'administer nodes',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: administer pathauto
  $permissions['administer pathauto'] = array(
    'name' => 'administer pathauto',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'pathauto',
  );

  // Exported permission: administer permissions
  $permissions['administer permissions'] = array(
    'name' => 'administer permissions',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'user',
  );

  // Exported permission: administer profile types
  $permissions['administer profile types'] = array(
    'name' => 'administer profile types',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'profile2',
  );

  // Exported permission: administer profiles
  $permissions['administer profiles'] = array(
    'name' => 'administer profiles',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'profile2',
  );

  // Exported permission: administer relation types
  $permissions['administer relation types'] = array(
    'name' => 'administer relation types',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'relation',
  );

  // Exported permission: administer reroute email
  $permissions['administer reroute email'] = array(
    'name' => 'administer reroute email',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'reroute_email',
  );

  // Exported permission: administer search
  $permissions['administer search'] = array(
    'name' => 'administer search',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'search',
  );

  // Exported permission: administer shadowbox
  $permissions['administer shadowbox'] = array(
    'name' => 'administer shadowbox',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'shadowbox',
  );

  // Exported permission: administer shortcuts
  $permissions['administer shortcuts'] = array(
    'name' => 'administer shortcuts',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'shortcut',
  );

  // Exported permission: administer site configuration
  $permissions['administer site configuration'] = array(
    'name' => 'administer site configuration',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'system',
  );

  // Exported permission: administer software updates
  $permissions['administer software updates'] = array(
    'name' => 'administer software updates',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'system',
  );

  // Exported permission: administer taxonomy
  $permissions['administer taxonomy'] = array(
    'name' => 'administer taxonomy',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'taxonomy',
  );

  // Exported permission: administer themes
  $permissions['administer themes'] = array(
    'name' => 'administer themes',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'system',
  );

  // Exported permission: administer url aliases
  $permissions['administer url aliases'] = array(
    'name' => 'administer url aliases',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'path',
  );

  // Exported permission: administer users
  $permissions['administer users'] = array(
    'name' => 'administer users',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'user',
  );

  // Exported permission: administer views
  $permissions['administer views'] = array(
    'name' => 'administer views',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'views',
  );

  // Exported permission: block IP addresses
  $permissions['block IP addresses'] = array(
    'name' => 'block IP addresses',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'system',
  );

  // Exported permission: bypass node access
  $permissions['bypass node access'] = array(
    'name' => 'bypass node access',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: cancel account
  $permissions['cancel account'] = array(
    'name' => 'cancel account',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'user',
  );

  // Exported permission: change own username
  $permissions['change own username'] = array(
    'name' => 'change own username',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'user',
  );

  // Exported permission: create article content
  $permissions['create article content'] = array(
    'name' => 'create article content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: create correction content
  $permissions['create correction content'] = array(
    'name' => 'create correction content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: create forum content
  $permissions['create forum content'] = array(
    'name' => 'create forum content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: create group content
  $permissions['create group content'] = array(
    'name' => 'create group content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: create image content
  $permissions['create image content'] = array(
    'name' => 'create image content',
    'roles' => array(),
  );

  // Exported permission: create page content
  $permissions['create page content'] = array(
    'name' => 'create page content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: create problem content
  $permissions['create problem content'] = array(
    'name' => 'create problem content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: create relations
  $permissions['create relations'] = array(
    'name' => 'create relations',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'relation',
  );

  // Exported permission: create request content
  $permissions['create request content'] = array(
    'name' => 'create request content',
    'roles' => array(),
  );

  // Exported permission: create solution content
  $permissions['create solution content'] = array(
    'name' => 'create solution content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: create url aliases
  $permissions['create url aliases'] = array(
    'name' => 'create url aliases',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'path',
  );

  // Exported permission: customize shortcut links
  $permissions['customize shortcut links'] = array(
    'name' => 'customize shortcut links',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'shortcut',
  );

  // Exported permission: delete any article content
  $permissions['delete any article content'] = array(
    'name' => 'delete any article content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: delete any correction content
  $permissions['delete any correction content'] = array(
    'name' => 'delete any correction content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: delete any forum content
  $permissions['delete any forum content'] = array(
    'name' => 'delete any forum content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: delete any group content
  $permissions['delete any group content'] = array(
    'name' => 'delete any group content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: delete any image content
  $permissions['delete any image content'] = array(
    'name' => 'delete any image content',
    'roles' => array(),
  );

  // Exported permission: delete any page content
  $permissions['delete any page content'] = array(
    'name' => 'delete any page content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: delete any problem content
  $permissions['delete any problem content'] = array(
    'name' => 'delete any problem content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: delete any request content
  $permissions['delete any request content'] = array(
    'name' => 'delete any request content',
    'roles' => array(),
  );

  // Exported permission: delete any solution content
  $permissions['delete any solution content'] = array(
    'name' => 'delete any solution content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: delete own article content
  $permissions['delete own article content'] = array(
    'name' => 'delete own article content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: delete own correction content
  $permissions['delete own correction content'] = array(
    'name' => 'delete own correction content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: delete own forum content
  $permissions['delete own forum content'] = array(
    'name' => 'delete own forum content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: delete own group content
  $permissions['delete own group content'] = array(
    'name' => 'delete own group content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: delete own image content
  $permissions['delete own image content'] = array(
    'name' => 'delete own image content',
    'roles' => array(),
  );

  // Exported permission: delete own page content
  $permissions['delete own page content'] = array(
    'name' => 'delete own page content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: delete own problem content
  $permissions['delete own problem content'] = array(
    'name' => 'delete own problem content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: delete own request content
  $permissions['delete own request content'] = array(
    'name' => 'delete own request content',
    'roles' => array(),
  );

  // Exported permission: delete own solution content
  $permissions['delete own solution content'] = array(
    'name' => 'delete own solution content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: delete relations
  $permissions['delete relations'] = array(
    'name' => 'delete relations',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'relation',
  );

  // Exported permission: delete revisions
  $permissions['delete revisions'] = array(
    'name' => 'delete revisions',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: delete terms in 1
  $permissions['delete terms in 1'] = array(
    'name' => 'delete terms in 1',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'taxonomy',
  );

  // Exported permission: delete terms in 2
  $permissions['delete terms in 2'] = array(
    'name' => 'delete terms in 2',
    'roles' => array(),
  );

  // Exported permission: edit any article content
  $permissions['edit any article content'] = array(
    'name' => 'edit any article content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: edit any correction content
  $permissions['edit any correction content'] = array(
    'name' => 'edit any correction content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: edit any forum content
  $permissions['edit any forum content'] = array(
    'name' => 'edit any forum content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: edit any group content
  $permissions['edit any group content'] = array(
    'name' => 'edit any group content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: edit any image content
  $permissions['edit any image content'] = array(
    'name' => 'edit any image content',
    'roles' => array(),
  );

  // Exported permission: edit any main profile
  $permissions['edit any main profile'] = array(
    'name' => 'edit any main profile',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'profile2',
  );

  // Exported permission: edit any page content
  $permissions['edit any page content'] = array(
    'name' => 'edit any page content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: edit any problem content
  $permissions['edit any problem content'] = array(
    'name' => 'edit any problem content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: edit any request content
  $permissions['edit any request content'] = array(
    'name' => 'edit any request content',
    'roles' => array(),
  );

  // Exported permission: edit any solution content
  $permissions['edit any solution content'] = array(
    'name' => 'edit any solution content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: edit own article content
  $permissions['edit own article content'] = array(
    'name' => 'edit own article content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: edit own comments
  $permissions['edit own comments'] = array(
    'name' => 'edit own comments',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'comment',
  );

  // Exported permission: edit own correction content
  $permissions['edit own correction content'] = array(
    'name' => 'edit own correction content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: edit own forum content
  $permissions['edit own forum content'] = array(
    'name' => 'edit own forum content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: edit own group content
  $permissions['edit own group content'] = array(
    'name' => 'edit own group content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: edit own image content
  $permissions['edit own image content'] = array(
    'name' => 'edit own image content',
    'roles' => array(),
  );

  // Exported permission: edit own main profile
  $permissions['edit own main profile'] = array(
    'name' => 'edit own main profile',
    'roles' => array(
      0 => 'administrator',
      1 => 'authenticated user',
    ),
    'module' => 'profile2',
  );

  // Exported permission: edit own page content
  $permissions['edit own page content'] = array(
    'name' => 'edit own page content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: edit own problem content
  $permissions['edit own problem content'] = array(
    'name' => 'edit own problem content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: edit own request content
  $permissions['edit own request content'] = array(
    'name' => 'edit own request content',
    'roles' => array(),
  );

  // Exported permission: edit own solution content
  $permissions['edit own solution content'] = array(
    'name' => 'edit own solution content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: edit relations
  $permissions['edit relations'] = array(
    'name' => 'edit relations',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'relation',
  );

  // Exported permission: edit terms in 1
  $permissions['edit terms in 1'] = array(
    'name' => 'edit terms in 1',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'taxonomy',
  );

  // Exported permission: edit terms in 2
  $permissions['edit terms in 2'] = array(
    'name' => 'edit terms in 2',
    'roles' => array(),
  );

  // Exported permission: execute php code
  $permissions['execute php code'] = array(
    'name' => 'execute php code',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'devel',
  );

  // Exported permission: export relation types
  $permissions['export relation types'] = array(
    'name' => 'export relation types',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'relation',
  );

  // Exported permission: manage features
  $permissions['manage features'] = array(
    'name' => 'manage features',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'features',
  );

  // Exported permission: migration information
  $permissions['migration information'] = array(
    'name' => 'migration information',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'migrate_ui',
  );

  // Exported permission: notify of path changes
  $permissions['notify of path changes'] = array(
    'name' => 'notify of path changes',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'pathauto',
  );

  // Exported permission: post comments
  $permissions['post comments'] = array(
    'name' => 'post comments',
    'roles' => array(
      0 => 'administrator',
      1 => 'authenticated user',
    ),
    'module' => 'comment',
  );

  // Exported permission: revert revisions
  $permissions['revert revisions'] = array(
    'name' => 'revert revisions',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: search content
  $permissions['search content'] = array(
    'name' => 'search content',
    'roles' => array(
      0 => 'administrator',
      1 => 'anonymous user',
      2 => 'authenticated user',
    ),
    'module' => 'search',
  );

  // Exported permission: select account cancellation method
  $permissions['select account cancellation method'] = array(
    'name' => 'select account cancellation method',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'user',
  );

  // Exported permission: skip comment approval
  $permissions['skip comment approval'] = array(
    'name' => 'skip comment approval',
    'roles' => array(
      0 => 'administrator',
      1 => 'authenticated user',
    ),
    'module' => 'comment',
  );

  // Exported permission: switch shortcut sets
  $permissions['switch shortcut sets'] = array(
    'name' => 'switch shortcut sets',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'shortcut',
  );

  // Exported permission: switch users
  $permissions['switch users'] = array(
    'name' => 'switch users',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'devel',
  );

  // Exported permission: translate interface
  $permissions['translate interface'] = array(
    'name' => 'translate interface',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'locale',
  );

  // Exported permission: use PHP for settings
  $permissions['use PHP for settings'] = array(
    'name' => 'use PHP for settings',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'php',
  );

  // Exported permission: use advanced search
  $permissions['use advanced search'] = array(
    'name' => 'use advanced search',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'search',
  );

  // Exported permission: use text format filtered_html
  $permissions['use text format filtered_html'] = array(
    'name' => 'use text format filtered_html',
    'roles' => array(
      0 => 'administrator',
      1 => 'anonymous user',
      2 => 'authenticated user',
    ),
    'module' => 'filter',
  );

  // Exported permission: use text format full_html
  $permissions['use text format full_html'] = array(
    'name' => 'use text format full_html',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'filter',
  );

  // Exported permission: use text format php_code
  $permissions['use text format php_code'] = array(
    'name' => 'use text format php_code',
    'roles' => array(),
  );

  // Exported permission: use text format tex_editor
  $permissions['use text format tex_editor'] = array(
    'name' => 'use text format tex_editor',
    'roles' => array(
      0 => 'administrator',
      1 => 'authenticated user',
    ),
    'module' => 'filter',
  );

  // Exported permission: view Terms and Conditions
  $permissions['view Terms and Conditions'] = array(
    'name' => 'view Terms and Conditions',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'legal',
  );

  // Exported permission: view any main profile
  $permissions['view any main profile'] = array(
    'name' => 'view any main profile',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'profile2',
  );

  // Exported permission: view devel_node_access information
  $permissions['view devel_node_access information'] = array(
    'name' => 'view devel_node_access information',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'devel_node_access',
  );

  // Exported permission: view own main profile
  $permissions['view own main profile'] = array(
    'name' => 'view own main profile',
    'roles' => array(
      0 => 'administrator',
      1 => 'authenticated user',
    ),
    'module' => 'profile2',
  );

  // Exported permission: view own unpublished content
  $permissions['view own unpublished content'] = array(
    'name' => 'view own unpublished content',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: view revisions
  $permissions['view revisions'] = array(
    'name' => 'view revisions',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: view the administration theme
  $permissions['view the administration theme'] = array(
    'name' => 'view the administration theme',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'system',
  );

  return $permissions;
}
