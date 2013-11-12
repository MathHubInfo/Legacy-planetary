<?php

/**
 * @file
 * Subscriptions Content module (admin functions).
 */


/**
 * Implements hook_form_alter().
 *
 * Add the Content Settings part to admin/settings/subscriptions.
 *
 * @param array $form
 * @param array $form_state
 *
 * @ingroup hooks
 * @ingroup form
 */
function _subscriptions_content_form_subscriptions_settings_form_alter(array &$form, array &$form_state) {
  $tr = 't';

  // General content settings
  $select = array();
  $select[0] = '<' . t('none') . '>';
  $nodetypes = node_type_get_types();
  foreach ($nodetypes as $ntype => $nname) {
    $select[$ntype] = $nname->name;
  }
  $form['content'] = array(
    '#type' => 'fieldset',
    '#title' => t('Content settings'),
    '#collapsible' => TRUE,
    '#weight' => -10,
  );
  $form['content']['subscriptions_unlisted_content_types'] = array(
    '#type'          => 'select',
    '#title'         => t('Unlisted content types'),
    '#default_value' => variable_get('subscriptions_unlisted_content_types', array()),
    '#options'       => $select,
    '#description'   => t('Select the content types which should be <strong>removed from subscriptions listings</strong>.<br />The content may still be available for subscribing via different kinds of subscriptions, but subscribing by content type will be unavailable for the selected types.'),
    '#multiple'      => TRUE,
  );
  $form['content']['subscriptions_blocked_content_types'] = array(
    '#type'          => 'select',
    '#title'         => t('Blocked content types'),
    '#default_value' => variable_get('subscriptions_blocked_content_types', array()),
    '#options'       => $select,
    '#description'   => t('Select the content types which should be <strong>completely unavailable for subscribing</strong>, i.e. content of the selected types will never trigger notifications for regular users.'),
    '#multiple'      => TRUE,
  );
  $form['content']['subscriptions_blocked_content_types_note'] = array(
    '#type'          => 'item',
    '#title'         => t('Note'),
    '#markup'        => t("The %permission permission grants normal access to unlisted and blocked content types; this is intended as an administrative function, and the content types and links will be marked with a '!symbol' symbol (and appear !red_ON like this !red_OFF in the case of blocked types).", array('%permission' => t('subscribe to all content types'), '!symbol' => SUBSCRIPTIONS_UNAVAILABLE, '!red_ON' => '<span class="error">', '!red_OFF' => '</span>')),
  );
  $form['content']['subscriptions_blocked_nodes'] = array(
    '#type'          => 'textfield',
    '#title'         => t('Blocked nodes'),
    '#size'          => 100,
    '#maxlength'     => 1000,
    '#default_value' => variable_get('subscriptions_blocked_nodes', ''),
    '#description'   => t('Enter the IDs of nodes that should be <strong>completely unavailable for subscribing</strong>, separated by spaces.'),
  );
  $form['#validate'][] = '_subscriptions_content_validate_blocked_nodes';

  $statics = variable_get('subscriptions_static_content_types', array());
  $avoid_empty_subscribe_links = variable_get('subscriptions_avoid_empty_subscribe_links', 0);
  $form['content']['static_content'] = array(
    '#type' => 'fieldset',
    '#title' => t('Static content'),
    '#collapsible' => TRUE,
    '#collapsed' => (empty($statics) || (count($statics) == 1 && isset($statics[0]))) && !$avoid_empty_subscribe_links,
  );
  $form['content']['static_content']['subscriptions_static_content_types'] = array(
    '#type'          => 'select',
    '#title'         => t('Static content types'),
    '#default_value' => $statics,
    '#options'       => $select,
    '#description'   => t('Select the content types which do not change nor receive comments and thus should not have the %option option.', array('%option' => t('Subscribe to this page'))),
    '#multiple'      => TRUE,
  );
  $form['content']['static_content']['subscriptions_avoid_empty_subscribe_links'] = array(
    '#type'          => 'checkbox',
    '#title'         => t('Avoid empty %Subscribe links', array('%Subscribe' => t('Subscribe'))),
    '#default_value' => $avoid_empty_subscribe_links,
    '#description'   => t('Nodes of %Static_content_types may end up with no %Subscribe options at all. Turn this option on to avoid displaying %Subscribe links in this case. The default is OFF, because this option causes processing overhead for each node view operation.', array('%Static_content_types' => t('Static content types'), '%Subscribe' => t('Subscribe'))),
  );
}

/**
 * Validates the 'subscriptions_blocked_nodes' input.
 *
 * @param array $form
 * @param array $form_state
 */
function _subscriptions_content_validate_blocked_nodes(array $form, array $form_state) {
  $form_values = $form_state['values'];
  $values = $form_values['subscriptions_blocked_nodes'];
  if (!empty($values)) {
    $values = explode(' ', $values);
    foreach ($values as $v) {
      if (!empty($v) && !is_numeric($v)) {
        form_set_error('subscriptions_blocked_nodes', t('Enter a series of numbers, separated by spaces.'));
        break;
      }
    }
  }
}

/**
 * Build the Thread subscriptions form at user/UID/subscriptions/node.
 *
 * @param array $form
 * @param int $uid
 *   ID of a user if >0 or of a role if <0.
 *
 * @return array
 *
 * @ingroup form
 */
function _subscriptions_content_node_form(array $form, $uid) {
  $tr = 't';
  $subscriptions = array();
  $query = db_select('node', 'n', array('fetch' => PDO::FETCH_ASSOC))
    ->extend('PagerDefault')
    ->limit(50);
  $query
    ->fields('n', array('nid', 'uid', 'title', 'status', 'changed'))
    ->join('subscriptions', 's', (db_driver() != 'pgsql' ? 'n.nid = s.value' : 'CAST(n.nid AS VARCHAR) = s.value'));
  $query
    ->fields('s', array('send_interval', 'author_uid', 'send_comments', 'send_updates'));
  if (module_exists('comment')) {
    $query
      ->leftJoin('node_comment_statistics', 'ncs', 'n.nid = ncs.nid');
    $query
      ->fields('ncs', array('last_comment_timestamp'));
    $query->addExpression('CASE WHEN s.send_comments + s.send_updates = 0 THEN n.created
                                WHEN s.send_comments + s.send_updates = 2 THEN
                                     CASE WHEN n.changed > ncs.last_comment_timestamp THEN n.changed ELSE ncs.last_comment_timestamp END
                                WHEN s.send_comments = 1 THEN ncs.last_comment_timestamp
                                ELSE n.changed END', 'latest_activity');
  }
  else {
    $query->addExpression('IF(s.send_updates = 0, n.created, n.changed)', 'latest_activity');
  }
  $query
    ->condition('s.module', 'node')
    ->condition('s.field', 'nid')
    ->condition('s.recipient_uid', $uid)
    ->orderBy('latest_activity', 'desc')
    ->addTag('node_access');
  foreach ($query->execute() as $s) {
    $subscriptions[$s['nid']][$s['author_uid']] = $s;
  }

  if (module_exists('comment')) {
    // check whether we've commented:
    if (db_driver() == 'pgsql') {
      $select = db_select('subscriptions', 's');
      $select->addExpression('CAST(s.value AS decimal)', 'value');
      $select = $select
        ->condition('s.module', 'node')
        ->condition('s.field', 'nid')
        ->condition('s.recipient_uid', $uid);
    }
    else {
      $select = db_select('subscriptions', 's')
        ->fields('s', array('value'))
        ->condition('s.module', 'node')
        ->condition('s.field', 'nid')
        ->condition('s.recipient_uid', $uid);
    }
    $result = db_select('comment', 'c')
      ->fields('c', array('nid'))
      ->condition('c.nid', $select, 'IN')
      ->condition('c.uid', $uid)
      ->groupBy('c.nid')
      ->execute();
    foreach ($result as $c) {
      if (isset($subscriptions[$c->nid])) {
        foreach ($subscriptions[$c->nid] as $author_uid => $subscription) {
          $subscriptions[$c->nid][$author_uid]['commented'] = TRUE;
        }
      }
    }
    $fields = t('@latest_activity, @authored, @commented');
  }
  else {
    $fields = t('@latest_activity, @authored');
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
      $title = truncate_utf8($subscription['title'], 40);
      if ($title != $subscription['title']) {
        $title .= '...';
      }
      $title = l($title, 'node/' . $subscription['nid']);
      if (!$subscription['status']) {
        if (user_access('administer nodes')) {
          $title = SUBSCRIPTIONS_UNAVAILABLE . '&nbsp;' . $title;
        }
        else {
          continue;
        }
      }
      $subscription['extra_info'] = $tr($fields, array(
        '@latest_activity' => format_interval(time() - $subscription['latest_activity']),
        '@authored' => ($subscription['uid'] == $uid ? $tr('Yes') : $tr('No')),
        '@commented' => (!empty($subscription['commented']) ? $tr('Yes') : $tr('No')),
      ));
      subscriptions_form_helper($form[0], $defaults, $author_uid, $subscription['nid'], $title, $subscription);
    }
  }
  unset($form[0]['author']);

  if (count(element_children($form[0]))) {
    $form[0]['extra_info']['#title'] = $tr($fields, array('@latest_activity' => 'Latest activity', '@authored' => 'authored', '@commented' => 'commented'));
    $form[0]['defaults'] = array(
      '#type' => 'value',
      '#value' => $defaults,
    );
    subscriptions_form_column_filter($form[0], $uid);
    $form['note'] = array('#type' => 'item', '#description' => '<div>' . t('Note: Deactivated subscriptions will be removed from the list.') . '</div>' );
    $form['pager'] = array('#markup' => theme('pager', array('tags' => NULL, 'element' => 0, 'quantity' => 50)));
  }
  else {
    $form = array(array('#markup' => t('There are no available subscribed pages.')));
  }
  return $form;
}

/**
 * Build the Content Types subscriptions form at user/UID/subscriptions/type.
 *
 * @param array $form
 * @param int $uid
 *   ID of a user if >0 or of a role if <0.
 *
 * @return array
 *
 * @ingroup form
 */
function _subscriptions_content_type_form(array $form, $uid) {
  $subscriptions = array();
  $bulk_op = (empty($_SESSION['subscriptions']['bulk_op']) ? '' : $_SESSION['subscriptions']['bulk_op']);
  if ($bulk_op) {
    // No initialization for bulk subscription.
    $uid = -DRUPAL_AUTHENTICATED_RID;
  }
  else {
    $query = db_select('subscriptions', 's', array('fetch' => PDO::FETCH_ASSOC));
    $nt_alias = $query->join('node_type', 'nt', 's.value = nt.type');
    $result = $query
      ->fields('s', array('value', 'send_interval', 'author_uid', 'send_comments', 'send_updates'))
      ->fields($nt_alias, array('type', 'name'))
      ->condition('s.module', 'node')
      ->condition('s.field', 'type')
      ->condition('s.recipient_uid', $uid)
      ->addTag('node_type_access')
      ->orderBy('s.author_uid')
      ->execute();
    foreach ($result as $s) {
      $subscriptions[$s['value']][$s['author_uid']] = $s;
    }
  }
  $unlisteds = variable_get('subscriptions_unlisted_content_types', array());
  /** @var $blockeds array */
  $blockeds = variable_get('subscriptions_blocked_content_types', array());
  $omits = array_merge($unlisteds, $blockeds);
  $form[0] = array(
    '#theme' => 'subscriptions_form_table',
  );
  $defaults = array();
  $tr = 't';
  foreach (node_type_get_types() as $type) {
    // add the active subscriptions
    $type_name = check_plain($type->name);
    if (in_array($type->type, $omits)) {
      if (user_access('subscribe to all content types') || user_access('administer site configuration')) {
        if (in_array($type->type, $blockeds)) {
          $type_name = '<span class="error" title="' . t('This content type is blocked.') . '">' . $type_name . '</span>&nbsp;' . SUBSCRIPTIONS_UNAVAILABLE;
        }
        else {
          $type_name = $type_name . '&nbsp;' . SUBSCRIPTIONS_UNAVAILABLE;
        }
      }
      else {
        continue;
      }
    }
    if (!isset($subscriptions[$type->type][-1])) {
      // author-less item is missing -- add it here:
      $subscriptions[$type->type][-1] = array(
        'send_interval' => _subscriptions_get_setting('send_interval', $uid),
        'send_comments' => _subscriptions_get_setting('send_comments', $uid),
        'send_updates' => _subscriptions_get_setting('send_updates', $uid),
        'author_uid' => FALSE,
      );
    }
    foreach ($subscriptions[$type->type] as $author_uid => $subscription) {
      subscriptions_form_helper($form[0], $defaults, $author_uid, $type->type, $type_name, $subscription);
    }
  }

  if (isset($form[0]['checkboxes'])) {
    $form[0]['defaults'] = array(
      '#type' => 'value',
      '#value' => $defaults,
    );
    subscriptions_form_column_filter($form[0], $uid);
  }
  else {
    $form = array(array('#markup' => t('There are no available content types.')));
  }
  return $form;
}

