<?php
/**
 * @file
 * subscriptions_reference_test.features.field_instance.inc
 */

/**
 * Implements hook_field_default_field_instances().
 */
function subscriptions_reference_test_field_default_field_instances() {
  $field_instances = array();

  // Exported field_instance: 'node-test_child-field_test_parent'
  $field_instances['node-test_child-field_test_parent'] = array(
    'bundle' => 'test_child',
    'default_value' => NULL,
    'deleted' => 0,
    'description' => '',
    'display' => array(
      'default' => array(
        'label' => 'above',
        'module' => 'entityreference',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 1,
      ),
      'teaser' => array(
        'label' => 'above',
        'settings' => array(),
        'type' => 'hidden',
        'weight' => 0,
      ),
    ),
    'entity_type' => 'node',
    'field_name' => 'field_test_parent',
    'label' => 'Test Parent',
    'required' => 0,
    'settings' => array(
      'user_register_form' => FALSE,
    ),
    'widget' => array(
      'active' => 1,
      'module' => 'options',
      'settings' => array(),
      'type' => 'options_select',
      'weight' => -3,
    ),
  );
  // Translatables
  // Included for use with string extractors like potx.
  t('Test Parent');

  return $field_instances;
}
