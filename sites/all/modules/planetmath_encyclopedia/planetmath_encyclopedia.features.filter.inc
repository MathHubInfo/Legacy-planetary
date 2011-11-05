<?php
/**
 * @file
 * planetmath_encyclopedia.features.filter.inc
 */

/**
 * Implements hook_filter_default_formats().
 */
function planetmath_encyclopedia_filter_default_formats() {
  $formats = array();

  // Exported format: TeX Editor
  $formats['tex_editor'] = array(
    'format' => 'tex_editor',
    'name' => 'TeX Editor',
    'cache' => '1',
    'status' => '1',
    'weight' => '0',
    'filters' => array(
      'latex' => array(
        'weight' => '0',
        'status' => '1',
        'settings' => array(
          'latexml_url' => 'http://127.0.0.1:3000/convert',
          'latexml_preamable' => '',
          'latexml_preamble' => '%%% nothing for now',
        ),
      ),
      'filter_url' => array(
        'weight' => '0',
        'status' => '1',
        'settings' => array(
          'filter_url_length' => '720',
        ),
      ),
    ),
  );

  return $formats;
}
