<?php
/**
 * @file
 * course_creation_features.features.og_features_role.inc
 */

/**
 * Implements hook_og_features_default_roles().
 */
function course_creation_features_og_features_default_roles() {
  $roles = array();

  // Exported OG Role: 'node:course_group:Instructor'.
  $roles['node:course_group:Instructor'] = array(
    'gid' => 0,
    'group_type' => 'node',
    'group_bundle' => 'course_group',
    'name' => 'Instructor',
  );

  // Exported OG Role: 'node:course_group:Student'.
  $roles['node:course_group:Student'] = array(
    'gid' => 0,
    'group_type' => 'node',
    'group_bundle' => 'course_group',
    'name' => 'Student',
  );

  // Exported OG Role: 'node:course_group:TA'.
  $roles['node:course_group:TA'] = array(
    'gid' => 0,
    'group_type' => 'node',
    'group_bundle' => 'course_group',
    'name' => 'TA',
  );

  // Exported OG Role: 'node:general_course_group:Instructor'.
  $roles['node:general_course_group:Instructor'] = array(
    'gid' => 0,
    'group_type' => 'node',
    'group_bundle' => 'general_course_group',
    'name' => 'Instructor',
  );

  // Exported OG Role: 'node:general_course_group:Student'.
  $roles['node:general_course_group:Student'] = array(
    'gid' => 0,
    'group_type' => 'node',
    'group_bundle' => 'general_course_group',
    'name' => 'Student',
  );

  // Exported OG Role: 'node:general_course_group:TA'.
  $roles['node:general_course_group:TA'] = array(
    'gid' => 0,
    'group_type' => 'node',
    'group_bundle' => 'general_course_group',
    'name' => 'TA',
  );

  return $roles;
}
