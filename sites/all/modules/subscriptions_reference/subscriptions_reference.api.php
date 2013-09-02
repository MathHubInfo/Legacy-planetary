<?php

/**
 * @file
 * subscriptions_reference.api.php
 */

/**
 * Gets attributes of the reference field.
 * 
 * @return array 
 *   information about the reference based subscription
 */
function hook_subscriptions_reference_info() {
  return array(
    // Reference_id should be unique accross modules that implement this hook.
    'reference_id' => array(
      // Parent defines content type that is being referenced.
      'parent' => 'parent_content_type',
      // Child defines content type that contains the reference field.
      'child' => 'child_content_type',
      // Name of the reference field field.
      'field' => 'my_reference_field',
      // Name of the item in the reference field array that contains nid
      // target_id in entity_reference, nid in node_reference
      'ref_item' => 'target_id',
    ),
  );
}
