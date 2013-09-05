<?php
/**
 * @file
 * stack_overflow_general.features.user_permission.inc
 */

/**
 * Implements hook_user_default_permissions().
 */
function stack_overflow_general_user_default_permissions() {
  $permissions = array();

  // Exported permission: 'administer user subscriptions'.
  $permissions['administer user subscriptions'] = array(
    'name' => 'administer user subscriptions',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'subscriptions',
  );

  // Exported permission: 'administer voting api'.
  $permissions['administer voting api'] = array(
    'name' => 'administer voting api',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'votingapi',
  );

  // Exported permission: 'bulk-administer user subscriptions'.
  $permissions['bulk-administer user subscriptions'] = array(
    'name' => 'bulk-administer user subscriptions',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'subscriptions',
  );

  // Exported permission: 'create answer content'.
  $permissions['create answer content'] = array(
    'name' => 'create answer content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'create question content'.
  $permissions['create question content'] = array(
    'name' => 'create question content',
    'roles' => array(
      'authenticated user' => 'authenticated user',
    ),
    'module' => 'node',
  );

  // Exported permission: 'delete any answer content'.
  $permissions['delete any answer content'] = array(
    'name' => 'delete any answer content',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: 'delete any question content'.
  $permissions['delete any question content'] = array(
    'name' => 'delete any question content',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: 'delete own answer content'.
  $permissions['delete own answer content'] = array(
    'name' => 'delete own answer content',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: 'delete own question content'.
  $permissions['delete own question content'] = array(
    'name' => 'delete own question content',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: 'edit any answer content'.
  $permissions['edit any answer content'] = array(
    'name' => 'edit any answer content',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: 'edit any question content'.
  $permissions['edit any question content'] = array(
    'name' => 'edit any question content',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: 'edit own answer content'.
  $permissions['edit own answer content'] = array(
    'name' => 'edit own answer content',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: 'edit own question content'.
  $permissions['edit own question content'] = array(
    'name' => 'edit own question content',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'node',
  );

  // Exported permission: 'subscribe to all content types'.
  $permissions['subscribe to all content types'] = array(
    'name' => 'subscribe to all content types',
    'roles' => array(),
    'module' => 'subscriptions',
  );

  // Exported permission: 'subscribe to content'.
  $permissions['subscribe to content'] = array(
    'name' => 'subscribe to content',
    'roles' => array(
      'Course Instructor' => 'Course Instructor',
      'General Course Admin' => 'General Course Admin',
      'Student' => 'Student',
      'Teacher Assistant' => 'Teacher Assistant',
      'administrator' => 'administrator',
    ),
    'module' => 'subscriptions',
  );

  // Exported permission: 'subscribe to content types'.
  $permissions['subscribe to content types'] = array(
    'name' => 'subscribe to content types',
    'roles' => array(),
    'module' => 'subscriptions',
  );

  // Exported permission: 'subscribe to taxonomy terms'.
  $permissions['subscribe to taxonomy terms'] = array(
    'name' => 'subscribe to taxonomy terms',
    'roles' => array(),
    'module' => 'subscriptions',
  );

  // Exported permission: 'suspend own subscriptions'.
  $permissions['suspend own subscriptions'] = array(
    'name' => 'suspend own subscriptions',
    'roles' => array(
      'Course Instructor' => 'Course Instructor',
      'General Course Admin' => 'General Course Admin',
      'Student' => 'Student',
      'Teacher Assistant' => 'Teacher Assistant',
      'administrator' => 'administrator',
    ),
    'module' => 'subscriptions',
  );

  // Exported permission: 'view rate results page'.
  $permissions['view rate results page'] = array(
    'name' => 'view rate results page',
    'roles' => array(
      'administrator' => 'administrator',
    ),
    'module' => 'rate',
  );

  return $permissions;
}
