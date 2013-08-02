<?php
/**
 * @file
 * project_generation_feature.features.user_permission.inc
 */

/**
 * Implements hook_user_default_permissions().
 */
function project_generation_feature_user_default_permissions() {
  $permissions = array();

  // Exported permission: administer blocks.
  $permissions['administer blocks'] = array(
    'name' => 'administer blocks',
    'roles' => array(
      0 => 'administrator',
    ),
    'module' => 'block',
  );

  return $permissions;
}
