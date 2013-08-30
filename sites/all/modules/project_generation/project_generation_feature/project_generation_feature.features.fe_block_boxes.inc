<?php
/**
 * @file
 * project_generation_feature.features.fe_block_boxes.inc
 */

/**
 * Implements hook_default_fe_block_boxes().
 */
function project_generation_feature_default_fe_block_boxes() {
  $export = array();

  $fe_block_boxes = new stdClass();
  $fe_block_boxes->info = 'Projects(old and new)';
  $fe_block_boxes->format = 'full_html';
  $fe_block_boxes->machine_name = 'projects_old_new';
  $fe_block_boxes->body = '<p><a href="http://localhost/test.kwarc.info/projects" style="color: rgb(0, 113, 179); font-family: Georgia, \'Times New Roman\', Times, serif; font-size: 14.44444465637207px; line-height: 23.33333396911621px;">Current Projects</a></p><p><a href="http://localhost/test.kwarc.info/former-projects" style="color: rgb(0, 113, 179); font-family: Georgia, \'Times New Roman\', Times, serif; font-size: 14.44444465637207px; line-height: 23.33333396911621px;">Former Projects</a></p>';

  $export['projects_old_new'] = $fe_block_boxes;

  return $export;
}
