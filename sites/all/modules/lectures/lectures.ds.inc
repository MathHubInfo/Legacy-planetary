<?php
/**
 * @file
 * lectures.ds.inc
 */

/**
 * Implementation of hook_ds_field_settings_info().
 */
function lectures_ds_field_settings_info() {
  $export = array();

  $ds_fieldsetting = new stdClass;
  $ds_fieldsetting->api_version = 1;
  $ds_fieldsetting->id = 'node|lecture|teaser';
  $ds_fieldsetting->entity_type = 'node';
  $ds_fieldsetting->bundle = 'lecture';
  $ds_fieldsetting->view_mode = 'teaser';
  $ds_fieldsetting->settings = array(
    'title' => array(
      'weight' => '0',
      'label' => 'hidden',
      'format' => 'default',
      'formatter_settings' => array(
        'link' => '1',
        'wrapper' => 'h2',
        'class' => '',
      ),
    ),
  );
  $export['node|lecture|teaser'] = $ds_fieldsetting;

  return $export;
}

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
      'left' => array(
        0 => 'field_speaker',
        1 => 'field_pic',
        2 => 'field_video',
        3 => 'field_writeup',
      ),
      'right' => array(
        0 => 'field_affiliation',
        1 => 'body',
      ),
    ),
    'fields' => array(
      'field_speaker' => 'left',
      'field_pic' => 'left',
      'field_video' => 'left',
      'field_writeup' => 'left',
      'field_affiliation' => 'right',
      'body' => 'right',
    ),
    'classes' => array(),
  );
  $export['node|lecture|default'] = $ds_layout;

  $ds_layout = new stdClass;
  $ds_layout->api_version = 1;
  $ds_layout->id = 'node|lecture|full';
  $ds_layout->entity_type = 'node';
  $ds_layout->bundle = 'lecture';
  $ds_layout->view_mode = 'full';
  $ds_layout->layout = 'lecture_layout';
  $ds_layout->settings = array(
    'hide_empty_regions' => 0,
    'regions' => array(
      'profile_left' => array(
        0 => 'field_speaker',
        1 => 'field_pic',
      ),
      'content' => array(
        0 => 'field_video',
        1 => 'field_writeup',
      ),
      'profile_right' => array(
        0 => 'field_affiliation',
        1 => 'body',
      ),
    ),
    'fields' => array(
      'field_speaker' => 'profile_left',
      'field_pic' => 'profile_left',
      'field_video' => 'content',
      'field_writeup' => 'content',
      'field_affiliation' => 'profile_right',
      'body' => 'profile_right',
    ),
    'classes' => array(),
  );
  $export['node|lecture|full'] = $ds_layout;

  $ds_layout = new stdClass;
  $ds_layout->api_version = 1;
  $ds_layout->id = 'node|lecture|teaser';
  $ds_layout->entity_type = 'node';
  $ds_layout->bundle = 'lecture';
  $ds_layout->view_mode = 'teaser';
  $ds_layout->layout = 'ds_3col_equal_width';
  $ds_layout->settings = array(
    'hide_empty_regions' => 0,
    'regions' => array(
      'left' => array(
        0 => 'title',
      ),
      'middle' => array(
        0 => 'field_speaker',
      ),
      'right' => array(
        0 => 'field_affiliation',
      ),
    ),
    'fields' => array(
      'title' => 'left',
      'field_speaker' => 'middle',
      'field_affiliation' => 'right',
    ),
    'classes' => array(),
  );
  $export['node|lecture|teaser'] = $ds_layout;

  return $export;
}
