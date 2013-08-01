<?php
/**
 * @file
 * project_generation_feature.features.og_features_role.inc
 */

/**
 * Implements hook_og_features_default_roles().
 */
function project_generation_feature_og_features_default_roles() {
  $roles = array();

  // Exported OG Role: 'node:course_group:Instructor'.
  $roles['node:course_group:Instructor'] = array(
    'gid' => 0,
    'group_type' => 'node',
    'group_bundle' => 'course_group',
    'name' => 'Instructor',
  );

  return $roles;
}
