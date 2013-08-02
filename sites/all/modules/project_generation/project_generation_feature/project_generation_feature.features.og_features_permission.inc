<?php
/**
 * @file
 * project_generation_feature.features.og_features_permission.inc
 */

/**
 * Implements hook_og_features_default_permissions().
 */
function project_generation_feature_og_features_default_permissions() {
  $permissions = array();

  // Exported og permission: 'node:content_group:add user'
  $permissions['node:content_group:add user'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:content_group:administer group'
  $permissions['node:content_group:administer group'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:content_group:administer og menu'
  $permissions['node:content_group:administer og menu'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:content_group:approve and deny subscription'
  $permissions['node:content_group:approve and deny subscription'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:content_group:create page content'
  $permissions['node:content_group:create page content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:content_group:create pageimagetextrightdown content'
  $permissions['node:content_group:create pageimagetextrightdown content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:content_group:create project_description content'
  $permissions['node:content_group:create project_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:content_group:delete any page content'
  $permissions['node:content_group:delete any page content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:content_group:delete any pageimagetextrightdown content'
  $permissions['node:content_group:delete any pageimagetextrightdown content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:content_group:delete any project_description content'
  $permissions['node:content_group:delete any project_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:content_group:delete own page content'
  $permissions['node:content_group:delete own page content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:content_group:delete own pageimagetextrightdown content'
  $permissions['node:content_group:delete own pageimagetextrightdown content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:content_group:delete own project_description content'
  $permissions['node:content_group:delete own project_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:content_group:manage members'
  $permissions['node:content_group:manage members'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:content_group:manage permissions'
  $permissions['node:content_group:manage permissions'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:content_group:manage roles'
  $permissions['node:content_group:manage roles'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:content_group:subscribe'
  $permissions['node:content_group:subscribe'] = array(
    'roles' => array(
      'non-member' => 'non-member',
    ),
  );

  // Exported og permission: 'node:content_group:subscribe without approval'
  $permissions['node:content_group:subscribe without approval'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:content_group:unsubscribe'
  $permissions['node:content_group:unsubscribe'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:content_group:update any page content'
  $permissions['node:content_group:update any page content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:content_group:update any pageimagetextrightdown content'
  $permissions['node:content_group:update any pageimagetextrightdown content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:content_group:update any project_description content'
  $permissions['node:content_group:update any project_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:content_group:update group'
  $permissions['node:content_group:update group'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:content_group:update own page content'
  $permissions['node:content_group:update own page content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:content_group:update own pageimagetextrightdown content'
  $permissions['node:content_group:update own pageimagetextrightdown content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:content_group:update own project_description content'
  $permissions['node:content_group:update own project_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:add user'
  $permissions['node:course_group:add user'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
    ),
  );

  // Exported og permission: 'node:course_group:administer group'
  $permissions['node:course_group:administer group'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:administer og menu'
  $permissions['node:course_group:administer og menu'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:approve and deny subscription'
  $permissions['node:course_group:approve and deny subscription'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
    ),
  );

  // Exported og permission: 'node:course_group:create page content'
  $permissions['node:course_group:create page content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
    ),
  );

  // Exported og permission: 'node:course_group:create pageimagetextrightdown content'
  $permissions['node:course_group:create pageimagetextrightdown content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:create project_description content'
  $permissions['node:course_group:create project_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete any page content'
  $permissions['node:course_group:delete any page content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
    ),
  );

  // Exported og permission: 'node:course_group:delete any pageimagetextrightdown content'
  $permissions['node:course_group:delete any pageimagetextrightdown content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete any project_description content'
  $permissions['node:course_group:delete any project_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete own page content'
  $permissions['node:course_group:delete own page content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
    ),
  );

  // Exported og permission: 'node:course_group:delete own pageimagetextrightdown content'
  $permissions['node:course_group:delete own pageimagetextrightdown content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete own project_description content'
  $permissions['node:course_group:delete own project_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:manage members'
  $permissions['node:course_group:manage members'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
    ),
  );

  // Exported og permission: 'node:course_group:manage permissions'
  $permissions['node:course_group:manage permissions'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
    ),
  );

  // Exported og permission: 'node:course_group:manage roles'
  $permissions['node:course_group:manage roles'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
    ),
  );

  // Exported og permission: 'node:course_group:subscribe'
  $permissions['node:course_group:subscribe'] = array(
    'roles' => array(
      'non-member' => 'non-member',
    ),
  );

  // Exported og permission: 'node:course_group:subscribe without approval'
  $permissions['node:course_group:subscribe without approval'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:unsubscribe'
  $permissions['node:course_group:unsubscribe'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:course_group:update any page content'
  $permissions['node:course_group:update any page content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
    ),
  );

  // Exported og permission: 'node:course_group:update any pageimagetextrightdown content'
  $permissions['node:course_group:update any pageimagetextrightdown content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:update any project_description content'
  $permissions['node:course_group:update any project_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:update group'
  $permissions['node:course_group:update group'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
    ),
  );

  // Exported og permission: 'node:course_group:update own page content'
  $permissions['node:course_group:update own page content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
    ),
  );

  // Exported og permission: 'node:course_group:update own pageimagetextrightdown content'
  $permissions['node:course_group:update own pageimagetextrightdown content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:update own project_description content'
  $permissions['node:course_group:update own project_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:project_group:add user'
  $permissions['node:project_group:add user'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:administer group'
  $permissions['node:project_group:administer group'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:administer og menu'
  $permissions['node:project_group:administer og menu'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:project_group:approve and deny subscription'
  $permissions['node:project_group:approve and deny subscription'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:create page content'
  $permissions['node:project_group:create page content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:create pageimagetextrightdown content'
  $permissions['node:project_group:create pageimagetextrightdown content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:create project_description content'
  $permissions['node:project_group:create project_description content'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:delete any page content'
  $permissions['node:project_group:delete any page content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:delete any pageimagetextrightdown content'
  $permissions['node:project_group:delete any pageimagetextrightdown content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:delete any project_description content'
  $permissions['node:project_group:delete any project_description content'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:delete own page content'
  $permissions['node:project_group:delete own page content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:delete own pageimagetextrightdown content'
  $permissions['node:project_group:delete own pageimagetextrightdown content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:delete own project_description content'
  $permissions['node:project_group:delete own project_description content'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:manage members'
  $permissions['node:project_group:manage members'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:manage permissions'
  $permissions['node:project_group:manage permissions'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:manage roles'
  $permissions['node:project_group:manage roles'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:subscribe'
  $permissions['node:project_group:subscribe'] = array(
    'roles' => array(
      'non-member' => 'non-member',
    ),
  );

  // Exported og permission: 'node:project_group:subscribe without approval'
  $permissions['node:project_group:subscribe without approval'] = array(
    'roles' => array(
      'non-member' => 'non-member',
    ),
  );

  // Exported og permission: 'node:project_group:unsubscribe'
  $permissions['node:project_group:unsubscribe'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:update any page content'
  $permissions['node:project_group:update any page content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:update any pageimagetextrightdown content'
  $permissions['node:project_group:update any pageimagetextrightdown content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:update any project_description content'
  $permissions['node:project_group:update any project_description content'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:update group'
  $permissions['node:project_group:update group'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:update own page content'
  $permissions['node:project_group:update own page content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:update own pageimagetextrightdown content'
  $permissions['node:project_group:update own pageimagetextrightdown content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:project_group:update own project_description content'
  $permissions['node:project_group:update own project_description content'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:ta_group:add user'
  $permissions['node:ta_group:add user'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:ta_group:administer group'
  $permissions['node:ta_group:administer group'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:administer og menu'
  $permissions['node:ta_group:administer og menu'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:approve and deny subscription'
  $permissions['node:ta_group:approve and deny subscription'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:ta_group:create page content'
  $permissions['node:ta_group:create page content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:ta_group:create pageimagetextrightdown content'
  $permissions['node:ta_group:create pageimagetextrightdown content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:create project_description content'
  $permissions['node:ta_group:create project_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete any page content'
  $permissions['node:ta_group:delete any page content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:ta_group:delete any pageimagetextrightdown content'
  $permissions['node:ta_group:delete any pageimagetextrightdown content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete any project_description content'
  $permissions['node:ta_group:delete any project_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete own page content'
  $permissions['node:ta_group:delete own page content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:ta_group:delete own pageimagetextrightdown content'
  $permissions['node:ta_group:delete own pageimagetextrightdown content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete own project_description content'
  $permissions['node:ta_group:delete own project_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:manage members'
  $permissions['node:ta_group:manage members'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:ta_group:manage permissions'
  $permissions['node:ta_group:manage permissions'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:ta_group:manage roles'
  $permissions['node:ta_group:manage roles'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:ta_group:subscribe'
  $permissions['node:ta_group:subscribe'] = array(
    'roles' => array(
      'non-member' => 'non-member',
    ),
  );

  // Exported og permission: 'node:ta_group:subscribe without approval'
  $permissions['node:ta_group:subscribe without approval'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:unsubscribe'
  $permissions['node:ta_group:unsubscribe'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:ta_group:update any page content'
  $permissions['node:ta_group:update any page content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:ta_group:update any pageimagetextrightdown content'
  $permissions['node:ta_group:update any pageimagetextrightdown content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update any project_description content'
  $permissions['node:ta_group:update any project_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update group'
  $permissions['node:ta_group:update group'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update own page content'
  $permissions['node:ta_group:update own page content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:ta_group:update own pageimagetextrightdown content'
  $permissions['node:ta_group:update own pageimagetextrightdown content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update own project_description content'
  $permissions['node:ta_group:update own project_description content'] = array(
    'roles' => array(),
  );

  return $permissions;
}
