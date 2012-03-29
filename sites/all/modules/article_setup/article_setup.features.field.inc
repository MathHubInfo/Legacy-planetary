<?php
/**
 * @file
 * article_setup.features.field.inc
 */

/**
 * Implements hook_field_default_fields().
 */
function article_setup_field_default_fields() {
  $fields = array();

  // Exported field: 'node-article-field_latex'
  $fields['node-article-field_latex'] = array(
    'field_config' => array(
      'active' => '1',
      'cardinality' => '1',
      'deleted' => '0',
      'entity_types' => array(),
      'field_name' => 'field_latex',
      'foreign keys' => array(),
      'indexes' => array(),
      'module' => 'latex_field',
      'settings' => array(
        'filter' => 'latex',
      ),
      'translatable' => '0',
      'type' => 'field_latex',
    ),
    'field_instance' => array(
      'bundle' => 'article',
      'default_value' => NULL,
      'deleted' => '0',
      'description' => 'A multi-part field for LaTeX documents (source and preamble).',
      'display' => array(
        'default' => array(
          'label' => 'hidden',
          'module' => 'latex_field',
          'settings' => array(),
          'type' => 'latex_formatter',
          'weight' => '11',
        ),
        'teaser' => array(
          'label' => 'hidden',
          'settings' => array(),
          'type' => 'hidden',
          'weight' => '0',
        ),
      ),
      'entity_type' => 'node',
      'field_name' => 'field_latex',
      'label' => 'LaTeX',
      'required' => 0,
      'settings' => array(
        'user_register_form' => FALSE,
      ),
      'widget' => array(
        'active' => 1,
        'module' => 'latex_field',
        'settings' => array(
          'filter' => 'tex_editor',
        ),
        'type' => 'latex_widget',
        'weight' => 0,
      ),
    ),
  );

  // Translatables
  // Included for use with string extractors like potx.
  t('A multi-part field for LaTeX documents (source and preamble).');
  t('LaTeX');

  return $fields;
}
