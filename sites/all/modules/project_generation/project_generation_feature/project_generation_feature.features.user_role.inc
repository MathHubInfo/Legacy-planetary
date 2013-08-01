<?php
/**
 * @file
 * project_generation_feature.features.user_role.inc
 */

/**
 * Implements hook_user_default_roles().
 */
function project_generation_feature_user_default_roles() {
  $roles = array();

  // Exported role: KWARC Member.
  $roles['KWARC Member'] = array(
    'name' => 'KWARC Member',
    'weight' => '3',
  );

  // Exported role: administrator.
  $roles['administrator'] = array(
    'name' => 'administrator',
    'weight' => '2',
  );

  return $roles;
}
