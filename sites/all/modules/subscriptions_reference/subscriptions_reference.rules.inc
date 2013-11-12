<?php

/**
 * @file
 * subscriptions_reference.rules.inc
 * Contains rules actions for subscribing to nodes via reference fields
 */

/**
 * Implements hook_rules_action_info().
 */
function subscriptions_reference_rules_action_info() {
  $base = array(
    'type' => 'subscriptions',
    'parameter' => array(
      'node' => array('type' => 'node', 'label' => t('Node')),
      'user' => array('type' => 'user', 'label' => t('User')),
    ),
    'group' => t('Subscriptions'),
    'access callback' => 'subscriptions_reference_subscribe_access',
  );

  // Action subsribe a user to a content.
  $items['subscriptions_reference_subscribe_action'] = array(
    'label' => t('Subscribe user to referencing nodes'),
    'base' => 'subscriptions_reference_subscribe',
  ) + $base;

  // Action unsubsribe a user to a content.
  $items['subscriptions_reference_unsubscribe_action'] = array(
    'label' => t('Unsubscribe user from referencing nodes'),
    'base' => 'subscriptions_reference_unsubscribe',
  ) + $base;

  return $items;
}
