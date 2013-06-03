<?php
/**
 * @file
 * pantabase.features.og_features_role.inc
 */

/**
 * Implements hook_og_features_default_roles().
 */
function pantabase_og_features_default_roles() {
  $roles = array();

  // Exported OG Role: 'node:course:passive member'.
  $roles['node:course:passive member'] = array(
    'gid' => 0,
    'group_type' => 'node',
    'group_bundle' => 'course',
    'name' => 'passive member',
  );

  return $roles;
}
