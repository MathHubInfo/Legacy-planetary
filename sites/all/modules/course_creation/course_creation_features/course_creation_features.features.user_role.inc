<?php
/**
 * @file
 * course_creation_features.features.user_role.inc
 */

/**
 * Implements hook_user_default_roles().
 */
function course_creation_features_user_default_roles() {
  $roles = array();

  // Exported role: Course Instructor.
  $roles['Course Instructor'] = array(
    'name' => 'Course Instructor',
    'weight' => 4,
  );

  // Exported role: General Course Admin.
  $roles['General Course Admin'] = array(
    'name' => 'General Course Admin',
    'weight' => 6,
  );

  // Exported role: Student.
  $roles['Student'] = array(
    'name' => 'Student',
    'weight' => 7,
  );

  // Exported role: Teacher Assistant.
  $roles['Teacher Assistant'] = array(
    'name' => 'Teacher Assistant',
    'weight' => 5,
  );

  // Exported role: administrator.
  $roles['administrator'] = array(
    'name' => 'administrator',
    'weight' => 2,
  );

  return $roles;
}
