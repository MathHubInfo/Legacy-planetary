<?php
/**
 * @file
 * course_creation_features.features.og_features_permission.inc
 */

/**
 * Implements hook_og_features_default_permissions().
 */
function course_creation_features_og_features_default_permissions() {
  $permissions = array();

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

  // Exported og permission: 'node:course_group:create answer content'
  $permissions['node:course_group:create answer content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
      'Student' => 'Student',
      'TA' => 'TA',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:course_group:create course_description content'
  $permissions['node:course_group:create course_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:create instructor_general_info content'
  $permissions['node:course_group:create instructor_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:create question content'
  $permissions['node:course_group:create question content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
      'Student' => 'Student',
      'TA' => 'TA',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:course_group:create ta_general_info content'
  $permissions['node:course_group:create ta_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:create ta_group content'
  $permissions['node:course_group:create ta_group content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:create teacher_assistant content'
  $permissions['node:course_group:create teacher_assistant content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete any answer content'
  $permissions['node:course_group:delete any answer content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete any course_description content'
  $permissions['node:course_group:delete any course_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete any instructor_general_info content'
  $permissions['node:course_group:delete any instructor_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete any question content'
  $permissions['node:course_group:delete any question content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete any ta_general_info content'
  $permissions['node:course_group:delete any ta_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete any ta_group content'
  $permissions['node:course_group:delete any ta_group content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete any teacher_assistant content'
  $permissions['node:course_group:delete any teacher_assistant content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete own answer content'
  $permissions['node:course_group:delete own answer content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
      'Student' => 'Student',
      'TA' => 'TA',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:course_group:delete own course_description content'
  $permissions['node:course_group:delete own course_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete own instructor_general_info content'
  $permissions['node:course_group:delete own instructor_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete own question content'
  $permissions['node:course_group:delete own question content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
      'Student' => 'Student',
      'TA' => 'TA',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:course_group:delete own ta_general_info content'
  $permissions['node:course_group:delete own ta_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete own ta_group content'
  $permissions['node:course_group:delete own ta_group content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:delete own teacher_assistant content'
  $permissions['node:course_group:delete own teacher_assistant content'] = array(
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

  // Exported og permission: 'node:course_group:update any answer content'
  $permissions['node:course_group:update any answer content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:update any course_description content'
  $permissions['node:course_group:update any course_description content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
    ),
  );

  // Exported og permission: 'node:course_group:update any instructor_general_info content'
  $permissions['node:course_group:update any instructor_general_info content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
    ),
  );

  // Exported og permission: 'node:course_group:update any question content'
  $permissions['node:course_group:update any question content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:update any ta_general_info content'
  $permissions['node:course_group:update any ta_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:update any ta_group content'
  $permissions['node:course_group:update any ta_group content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:update any teacher_assistant content'
  $permissions['node:course_group:update any teacher_assistant content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:update group'
  $permissions['node:course_group:update group'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
    ),
  );

  // Exported og permission: 'node:course_group:update own answer content'
  $permissions['node:course_group:update own answer content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
      'Student' => 'Student',
      'TA' => 'TA',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:course_group:update own course_description content'
  $permissions['node:course_group:update own course_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:update own instructor_general_info content'
  $permissions['node:course_group:update own instructor_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:update own question content'
  $permissions['node:course_group:update own question content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
      'Student' => 'Student',
      'TA' => 'TA',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:course_group:update own ta_general_info content'
  $permissions['node:course_group:update own ta_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:update own ta_group content'
  $permissions['node:course_group:update own ta_group content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:course_group:update own teacher_assistant content'
  $permissions['node:course_group:update own teacher_assistant content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:add user'
  $permissions['node:general_course_group:add user'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:general_course_group:administer group'
  $permissions['node:general_course_group:administer group'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:administer og menu'
  $permissions['node:general_course_group:administer og menu'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:approve and deny subscription'
  $permissions['node:general_course_group:approve and deny subscription'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:general_course_group:create answer content'
  $permissions['node:general_course_group:create answer content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
      'Student' => 'Student',
      'TA' => 'TA',
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:general_course_group:create course_description content'
  $permissions['node:general_course_group:create course_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:create instructor_general_info content'
  $permissions['node:general_course_group:create instructor_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:create question content'
  $permissions['node:general_course_group:create question content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
      'Student' => 'Student',
      'TA' => 'TA',
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:general_course_group:create ta_general_info content'
  $permissions['node:general_course_group:create ta_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:create ta_group content'
  $permissions['node:general_course_group:create ta_group content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:create teacher_assistant content'
  $permissions['node:general_course_group:create teacher_assistant content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:delete any answer content'
  $permissions['node:general_course_group:delete any answer content'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:general_course_group:delete any course_description content'
  $permissions['node:general_course_group:delete any course_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:delete any instructor_general_info content'
  $permissions['node:general_course_group:delete any instructor_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:delete any question content'
  $permissions['node:general_course_group:delete any question content'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:general_course_group:delete any ta_general_info content'
  $permissions['node:general_course_group:delete any ta_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:delete any ta_group content'
  $permissions['node:general_course_group:delete any ta_group content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:delete any teacher_assistant content'
  $permissions['node:general_course_group:delete any teacher_assistant content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:delete own answer content'
  $permissions['node:general_course_group:delete own answer content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
      'Student' => 'Student',
      'TA' => 'TA',
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:general_course_group:delete own course_description content'
  $permissions['node:general_course_group:delete own course_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:delete own instructor_general_info content'
  $permissions['node:general_course_group:delete own instructor_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:delete own question content'
  $permissions['node:general_course_group:delete own question content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
      'Student' => 'Student',
      'TA' => 'TA',
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:general_course_group:delete own ta_general_info content'
  $permissions['node:general_course_group:delete own ta_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:delete own ta_group content'
  $permissions['node:general_course_group:delete own ta_group content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:delete own teacher_assistant content'
  $permissions['node:general_course_group:delete own teacher_assistant content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:manage members'
  $permissions['node:general_course_group:manage members'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:general_course_group:manage permissions'
  $permissions['node:general_course_group:manage permissions'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:general_course_group:manage roles'
  $permissions['node:general_course_group:manage roles'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:general_course_group:subscribe'
  $permissions['node:general_course_group:subscribe'] = array(
    'roles' => array(
      'non-member' => 'non-member',
    ),
  );

  // Exported og permission: 'node:general_course_group:subscribe without approval'
  $permissions['node:general_course_group:subscribe without approval'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:unsubscribe'
  $permissions['node:general_course_group:unsubscribe'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:general_course_group:update any answer content'
  $permissions['node:general_course_group:update any answer content'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:general_course_group:update any course_description content'
  $permissions['node:general_course_group:update any course_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:update any instructor_general_info content'
  $permissions['node:general_course_group:update any instructor_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:update any question content'
  $permissions['node:general_course_group:update any question content'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:general_course_group:update any ta_general_info content'
  $permissions['node:general_course_group:update any ta_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:update any ta_group content'
  $permissions['node:general_course_group:update any ta_group content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:update any teacher_assistant content'
  $permissions['node:general_course_group:update any teacher_assistant content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:update group'
  $permissions['node:general_course_group:update group'] = array(
    'roles' => array(
      'administrator member' => 'administrator member',
    ),
  );

  // Exported og permission: 'node:general_course_group:update own answer content'
  $permissions['node:general_course_group:update own answer content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
      'Student' => 'Student',
      'TA' => 'TA',
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:general_course_group:update own course_description content'
  $permissions['node:general_course_group:update own course_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:update own instructor_general_info content'
  $permissions['node:general_course_group:update own instructor_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:update own question content'
  $permissions['node:general_course_group:update own question content'] = array(
    'roles' => array(
      'Instructor' => 'Instructor',
      'Student' => 'Student',
      'TA' => 'TA',
      'administrator member' => 'administrator member',
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:general_course_group:update own ta_general_info content'
  $permissions['node:general_course_group:update own ta_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:update own ta_group content'
  $permissions['node:general_course_group:update own ta_group content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:general_course_group:update own teacher_assistant content'
  $permissions['node:general_course_group:update own teacher_assistant content'] = array(
    'roles' => array(),
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

  // Exported og permission: 'node:ta_group:create answer content'
  $permissions['node:ta_group:create answer content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:create course_description content'
  $permissions['node:ta_group:create course_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:create instructor_general_info content'
  $permissions['node:ta_group:create instructor_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:create question content'
  $permissions['node:ta_group:create question content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:create ta_general_info content'
  $permissions['node:ta_group:create ta_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:create ta_group content'
  $permissions['node:ta_group:create ta_group content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:create teacher_assistant content'
  $permissions['node:ta_group:create teacher_assistant content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete any answer content'
  $permissions['node:ta_group:delete any answer content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete any course_description content'
  $permissions['node:ta_group:delete any course_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete any instructor_general_info content'
  $permissions['node:ta_group:delete any instructor_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete any question content'
  $permissions['node:ta_group:delete any question content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete any ta_general_info content'
  $permissions['node:ta_group:delete any ta_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete any ta_group content'
  $permissions['node:ta_group:delete any ta_group content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete any teacher_assistant content'
  $permissions['node:ta_group:delete any teacher_assistant content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete own answer content'
  $permissions['node:ta_group:delete own answer content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete own course_description content'
  $permissions['node:ta_group:delete own course_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete own instructor_general_info content'
  $permissions['node:ta_group:delete own instructor_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete own question content'
  $permissions['node:ta_group:delete own question content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete own ta_general_info content'
  $permissions['node:ta_group:delete own ta_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete own ta_group content'
  $permissions['node:ta_group:delete own ta_group content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:delete own teacher_assistant content'
  $permissions['node:ta_group:delete own teacher_assistant content'] = array(
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

  // Exported og permission: 'node:ta_group:update any answer content'
  $permissions['node:ta_group:update any answer content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update any course_description content'
  $permissions['node:ta_group:update any course_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update any instructor_general_info content'
  $permissions['node:ta_group:update any instructor_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update any question content'
  $permissions['node:ta_group:update any question content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update any ta_general_info content'
  $permissions['node:ta_group:update any ta_general_info content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:ta_group:update any ta_group content'
  $permissions['node:ta_group:update any ta_group content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update any teacher_assistant content'
  $permissions['node:ta_group:update any teacher_assistant content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update group'
  $permissions['node:ta_group:update group'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update own answer content'
  $permissions['node:ta_group:update own answer content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update own course_description content'
  $permissions['node:ta_group:update own course_description content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update own instructor_general_info content'
  $permissions['node:ta_group:update own instructor_general_info content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update own question content'
  $permissions['node:ta_group:update own question content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update own ta_general_info content'
  $permissions['node:ta_group:update own ta_general_info content'] = array(
    'roles' => array(
      'member' => 'member',
    ),
  );

  // Exported og permission: 'node:ta_group:update own ta_group content'
  $permissions['node:ta_group:update own ta_group content'] = array(
    'roles' => array(),
  );

  // Exported og permission: 'node:ta_group:update own teacher_assistant content'
  $permissions['node:ta_group:update own teacher_assistant content'] = array(
    'roles' => array(),
  );

  return $permissions;
}
