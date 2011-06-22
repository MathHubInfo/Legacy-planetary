<?php
/**
 * @file
 * lectures.ds.inc
 */

/**
 * Implementation of hook_ds_layout_settings_info().
 */
function lectures_ds_layout_settings_info() {
  $export = array();

  $ds_layout = new stdClass;
  $ds_layout->api_version = 1;
  $ds_layout->id = 'node|lecture|default';
  $ds_layout->entity_type = 'node';
  $ds_layout->bundle = 'lecture';
  $ds_layout->view_mode = 'default';
  $ds_layout->layout = 'ds_2col';
  $ds_layout->settings = array(
    'hide_empty_regions' => 0,
    'regions' => array(
      'right' => array(
        0 => 'body',
      ),
      'left' => array(
        0 => 'field_pic',
        1 => 'field_video',
        2 => 'field_writeup',
      ),
    ),
    'fields' => array(
      'body' => 'right',
      'field_pic' => 'left',
      'field_video' => 'left',
      'field_writeup' => 'left',
    ),
    'classes' => array(),
  );
  $export['node|lecture|default'] = $ds_layout;

  return $export;
}
