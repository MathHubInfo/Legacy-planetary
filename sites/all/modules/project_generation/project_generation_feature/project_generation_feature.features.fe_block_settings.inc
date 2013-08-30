<?php
/**
 * @file
 * project_generation_feature.features.fe_block_settings.inc
 */

/**
 * Implements hook_default_fe_block_settings().
 */
function project_generation_feature_default_fe_block_settings() {
  $export = array();

  $export['version'] = '2.0';

  $export['block-projects_old_new'] = array(
    'cache' => -1,
    'custom' => '0',
    'machine_name' => 'projects_old_new',
    'module' => 'block',
    'node_types' => array(),
    'pages' => 'projects
projects/architectural-layer
projects/domain
projects/funding-agency
former-projects
former-projects/architectural-layer
former-projects/domain
former-projects/funding-agency',
    'roles' => array(),
    'themes' => array(
      'bartik' => array(
        'region' => 'sidebar_first',
        'status' => '1',
        'theme' => 'bartik',
        'weight' => '-36',
      ),
      'seven' => array(
        'region' => '',
        'status' => 0,
        'theme' => 'seven',
        'weight' => '0',
      ),
    ),
    'title' => 'Projects',
    'visibility' => '1',
  );

  return $export;
}
