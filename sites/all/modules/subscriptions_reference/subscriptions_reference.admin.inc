<?php

/**
 * @file
 * Subscriptions Content module (admin functions).
 */


/**
 * Build the Categories subscription form at user/UID/subscriptions/REFERENCE.
 *
 * @param array $form
 *   form array
 * @param int $uid 
 *   ID of a user for whom we will show the form 
 * @param array $vocabularies
 *   ID of a user if >0 or of a role if <0.
 *
 * @return array
 *   form array
 *
 * @ingroup form
 */
function _subscriptions_reference_form(array $form, $uid) {
  $tr = 't';
  $subscriptions = array();
  $query = db_select('node', 'n');
  $query->join('subscriptions', 's', 'n.nid = s.value');
  $result = $query
    ->fields('n', array(
      'nid',
      'uid',
      'title',
      'status',
      'changed',
      ))
    ->fields('s', array(
      'send_interval',
      'author_uid',
      'send_comments',
      'send_updates',
      ))
    ->condition('s.module', 'node')
    ->condition('s.field', $form['field']['#value'])
    ->condition('s.recipient_uid', $uid)
    ->addTag('node_access')
    ->extend('PagerDefault')
    ->limit(50)
    ->execute();
  while ($s = $result->fetchAssoc()) {
    $subscriptions[$s['nid']][$s['author_uid']] = $s;
  }

  $form[0] = array(
    '#type' => 'item',
    '#title' => '',
    '#tree' => TRUE,
    '#theme' => 'subscriptions_form_table',
  );
  $defaults = array();
  foreach ($subscriptions as $nid => $bundle) {
    foreach ($bundle as $author_uid => $subscription) {
      $title = l($subscription['title'], 'node/' . $nid);
      subscriptions_form_helper($form[0], $defaults, $author_uid, $nid, $title, $subscription);
    }
  }
  unset($form[0]['author']);

  if (count(element_children($form[0]))) {
    $form[0]['defaults'] = array(
      '#type' => 'value',
      '#value' => $defaults,
    );
    subscriptions_form_column_filter($form[0], $uid);
    $form['note'] = array(
      '#type' => 'item',
      '#description' => '<div>' . t('Note: Deactivated subscriptions will be removed from the list.') . '</div>',
    );
    $form['pager'] = array(
      '#markup' => theme('pager', array(
        'tags' => NULL,
        'element' => 0,
        'quantity' => 50,)),
    );
  }
  else {
    $form = array(array('#markup' => t('There are no available subscribed pages.')));
  }
  return $form;

}
