<?php

/**
 * @file
 * Subscriptions module (load-on-demand admin functions).
 */

/**
 * Site Settings form at admin/settings/subscriptions.
 *
 * Other submodules contribute additional parts to this form.
 *
 * @param array $form
 * @param array $form_state
 *
 * @return array
 */
function subscriptions_settings_form(array $form, array &$form_state) {
  global $user;
  $form = array();
  $tr = 't';

  $form['links'] = array(
    '#type' => 'fieldset',
    '#title' => t('Links'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#weight' => -100,
  );
  $form['links'][] = array(
    '#markup' => '<div>' . l($tr('Permissions'), 'admin/people/permissions', array('fragment' => 'module-subscriptions')) . '</div>',
    '#weight' => -20,
    );
  if (module_exists('subscriptions_mail')) {
    $form['links'][] = array(
      '#markup' => '<div>' . l($tr('Mail templates'), 'admin/config/system/mail-edit') . '</div>',
      '#weight' => -10,
    );
  }
  $form['links'][] = array(
    '#markup' => '<div>' . l(t('Bulk subscribing/unsubscribing'), 'admin/people') . '</div>',
    '#weight' => 0,
  );
  $form['links'][] = array(
    '#markup' => '<div>' . l(t('Run cron manually!'), 'admin/reports/status/run-cron') . '</div>',
    '#weight' => 0,
  );
  $form['links'][] = array(
    '#markup' => '<div>' . l(t('My subscriptions'), 'user/' . $user->uid . '/subscriptions') . '</div>',
    '#weight' => 10,
  );


  //$form['sub_settings'] = array(
  //    '#type' => 'fieldset',
  //    '#title' => t('General settings'),
  //    '#weight' => -3,
  //);
  //$form['sub_settings']['subscriptions_testpost'] = array(
  //  '#type'          => 'checkbox',
  //  '#title'         => t('Test held posts prior to sending'),
  //  '#default_value' => variable_get('subscriptions_testpost', 0),
  //  '#description'   => t('Tests to see if a post about to be sent by cron is still active.  Adds a small amount of overhead.  Default is OFF.'),
  //);
  //$form['sub_settings']['subscriptions_link_teaser'] = array(
  //  '#type'          => 'checkbox',
  //  '#title'         => t('Show subscribe link with teaser'),
  //  '#default_value' => variable_get('subscriptions_link_teaser', 1),
  //  '#description'   => t('Uncheck to show link only in node view.'),
  //);

  if (variable_get('subscriptions_show_install_info', 1) && (
        !module_exists('subscriptions_ui') ||
        !module_exists('subscriptions_mail') ||
        !module_exists('subscriptions_content') ||
        !module_exists('subscriptions_taxonomy'))) {
    if (empty($_POST)) {
      drupal_set_message(t('Note: For standard Subscriptions functionality you need to enable the following modules:')
                         . '<ul><li>' . $tr('Subscriptions UI') . '</li><li>' . $tr('Subscriptions Mail ')
                         . '</li><li>' . $tr('Content Subscriptions') . '</li><li>' . $tr('Taxonomy Subscriptions') . '</li></ul>', 'warning', FALSE);
    }
    $form['subscriptions_show_install_info'] = array(
      '#type'          => 'checkbox',
      '#title'         => t('Keep showing the installation reminder above.'),
      '#default_value' => variable_get('subscriptions_show_install_info', 1),
      '#description'   => t('Uncheck this box to permanently remove the reminder, if you have a reason for not enabling the standard selection of Subscriptions modules.'),
      '#weight'        => -101,
    );
  }

  return system_settings_form($form);
}

/* ******************************************************* */
/*  user screens: display, edit functions                  */
/* ******************************************************* */

/**
 * Theme subscriptions page controls table.
 *
 * @param array $variables
 * @return string
 *
 * @ingroup themeable
 */
function theme_subscriptions_form_table(array $variables) {
  $element = $variables['element'];
  $output = '';
  $rows = array();
  drupal_add_js(drupal_get_path('module', 'subscriptions') . '/subscriptions_tableselect.js', array('preprocess' => FALSE));
  $columns['checkboxes']      = array('data' => '', 'width' => '1%', 'class' => 'subscriptions-table select-all');
  $columns['labels']          = array('data' => t('Subscription'), 'width' => '18%');
  if (isset($element['send_interval']) && $element['send_interval']['#access']) {
    $columns['send_interval'] = array('data' => t('Send interval'), 'width' => '20%');
  }
  if (isset($element['send_updates']) && $element['send_updates']['#access']) {
    $columns['send_updates']  = array('data' => t('On&nbsp;updates'), 'width' => '10%');
  }
  if (isset($element['send_comments']) && $element['send_comments']['#access'] && module_exists('comment')) {
    $columns['send_comments'] = array('data' => t('On&nbsp;comments'), 'width' => '10%');
  }

  // check whether we have an Author column
  if (isset($element['author'])) {
    foreach (element_children($element['checkboxes']) as $key) {
      foreach (element_children($element['checkboxes'][$key]) as $key1) {
        if ($key1 != -1) {
          $tr = 't';
          $columns['author'] = array('data' => $tr('Author'), 'width' => '20%');
        }
      }
    }
  }
  if (isset($element['extra_info'])) {
    $columns['extra_info']['data'] = $element['extra_info']['#title'];
  }
  $column_keys = array_keys($columns);
  unset($columns[end($column_keys)]['width']);  // let the last column grow

  if (isset($element['checkboxes'])) {
    foreach (element_children($element['checkboxes']) as $key) {
      foreach (element_children($element['checkboxes'][$key]) as $key1) {
        if (empty($element['checkboxes'][$key][$key1]['#disabled'])) {
          $element['checkboxes'][$key][$key1]['#attributes']['class'] = array('select-row');
        }
        $row = array();
        foreach ($column_keys as $colkey) {
          $row[] = drupal_render($element[$colkey][$key][$key1]);
        }
        $rows[] = $row;
      }
    }
  }
  if ($rows) {
    $output .= theme('table', array('header' => array_values($columns), 'rows' => $rows));
    //$output .= drupal_render($element);
  }
  return $output;
}


/**
 * Subscriptions page submit handler.
 *
 * @param array $form
 * @param array $form_state
 *
 * @ingroup form
 */
function subscriptions_page_form_submit(array $form, array &$form_state) {
  $form_values = &$form_state['values'];
  if (isset($form_values['header']['role']['roles'])) {
    $rid0 = current($form_values['header']['role']['roles']);
  }
  if ($form_values['op'] == $form['submit']['#value']) {
    // If we have rids, then they are >0, but we'll have to store them as
    // negative numbers below; if we have uids, we use the negative values
    // so they will end up positive in the database.
    if ($bulk_op = (empty($_SESSION['subscriptions']['bulk_op']) ? '' : $_SESSION['subscriptions']['bulk_op'])) {
      $rids = array();
      foreach (unserialize($form_values['uid']) as $uid) {
        $rids[] = -$uid;
      }
      $form_state['redirect'] = SUBSCRIPTIONS_CONFIG_PATH . '/userdefaults/bulk';
    }
    else {
      $rids = (empty($rid0) ? array(-$form_values['uid']) : $form_values['header']['role']['roles']);
    }
    $module = $form_values['module'];
    $field = $form_values['field'];
    $access_key = (isset($form_values['access_key']) ? $form_values['access_key'] : $module);
    foreach ($form_values as $element_values) {
      if (is_array($element_values) && isset($element_values[0])) {
        $element_values = $element_values[0];
      }
      if (isset($element_values['defaults']['send_interval'])) {
        $defaults = &$element_values['defaults'];
        foreach ($element_values['checkboxes'] as $value => $bundle) {
          foreach ($bundle as $author_uid => $set_to_enabled) {
            if ($set_to_enabled && $bulk_op != 'unsub' && (
                count($rids) > 1 ||
                !isset($defaults['checkboxes'][$value][$author_uid]) ||
                $element_values['send_interval'][$value][$author_uid] != $defaults['send_interval'][$value][$author_uid] ||
                empty($element_values['send_updates'][$value][$author_uid]) != empty($defaults['send_updates'][$value][$author_uid]) ||
                empty($element_values['send_comments'][$value][$author_uid]) != empty($defaults['send_comments'][$value][$author_uid]))) {
              // Something has changed, or we have more than one rid,
              // which means we can't know whether something has changed.
              $send_updates = (empty($element_values['send_updates'][$value][$author_uid]) ? 0 : 1);
              $send_comments = (empty($element_values['send_comments'][$value][$author_uid]) ? 0 : 1);
              foreach ($rids as $rid) {
                subscriptions_write($access_key, $module, $field, $value, $author_uid, -$rid, $element_values['send_interval'][$value][$author_uid], $send_updates, $send_comments);
              }
              $changed = TRUE;
            }
            elseif ($bulk_op == 'unsub' && $set_to_enabled ||
                    empty($bulk_op) && !$set_to_enabled && (
                      count($rids) > 1 ||
                      isset($defaults['checkboxes'][$value][$author_uid]))) {
              // It was bulk-unsubscribed, or it was enabled but now it is not. Delete.
              foreach ($rids as $rid) {
                subscriptions_delete(-$rid, $module, $field, $value, ($bulk_op == 'unsub' ? NULL : $author_uid));
              }
              $changed = TRUE;
            }
          }
        }
      }
    }
    if (!empty($changed)) {
      drupal_set_message(t('Your subscriptions were updated.'));
    }
  }
  if (!empty($rid0)) {
    $subs_type = subscriptions_arg(SUBSCRIPTIONS_CONFIG_PATH_LEVEL + 1);
    $form_state['redirect'] = SUBSCRIPTIONS_CONFIG_PATH . '/userdefaults/' . $subs_type;
    if ($rid0 != DRUPAL_AUTHENTICATED_RID) {
      $form_state['redirect'] .= '/' . $rid0;
    }
  }
}

/**
 * Display subscribed content data on the user and site subscriptions pages.
 * @ TODO clean up all of these parts
 *
 * @param $form
 * @param $form_state
 * @param object|null $account
 * @param string $stype
 *
 * @return array|null
 *
 * @ingroup form
 */
function subscriptions_page_form($form, &$form_state, $account, $stype) {
  $stypes = subscriptions_types();
  if (!isset($stypes[$stype])) {
    drupal_not_found();
    return NULL;
  }

  if (subscriptions_arg(0) == 'admin') {
    $form['header'] = array(
      '#type'          => 'fieldset',
      '#title'         => t('Admin Information'),
      '#attributes'    => array('class' => array('error')),
      '#collapsible'   => TRUE,
      '#collapsed'     => FALSE,
      '#weight'        => -2,
    );
    if (empty($_SESSION['subscriptions']['bulk_op'])) {
      $form['header'][] = array(
        '#markup'        => '<div>' . t('The selected subscriptions will be given to <b>newly created</b> users.') . '</div>',
      );

      $tr = 't';
      $rid = subscriptions_arg(SUBSCRIPTIONS_CONFIG_PATH_LEVEL + 2);
      $form['header']['role'] = array(
        '#type'          => 'fieldset',
        '#title'         => check_plain($tr('Roles')),
        '#collapsible'   => TRUE,
        '#collapsed'     => !is_numeric($rid),
      );
      $form['header']['role']['header'] = array(
        '#markup'        => '<div>' . t('If a user has one or more roles assigned at creation time, then she will receive the additional subscriptions defined for these roles.') . '</div>',
        '#weight'        => -5,
      );
      $rid = (is_numeric($rid) ? $rid : DRUPAL_AUTHENTICATED_RID);
      $form['header']['role']['roles'] = array(
        '#type'          => 'select',
        '#title'         => t('Role(s)'),
        '#default_value' => array($rid),
        '#options'       => user_roles(TRUE),
        '#description'   => t('Select the role to load or role(s) to save.'),
        '#multiple'      => TRUE,
      );
      $form['header']['role']['load'] = array(
        '#type'          => 'submit',
        '#value'         => t('Load'),
      );
    }
    else {
      $bulk_op = $_SESSION['subscriptions']['bulk_op'];
      $variables = _subscriptions_page_user_bulk_variables();
      $output = $variables['info'] . '<br />';
      $output .= t('Select the subscriptions to !change and click [@Save] to perform the action for the selected users.', $variables);
      if ($bulk_op == 'unsub') {
        $output .= '<br /><strong>' . t('This action cannot be undone!') . '</strong>';
      }
      $form['header']['info'] = array(
        '#markup' => $output,
      );
    }
  }
  else {
    subscriptions_suspended(subscriptions_arg(1, 'uid'), TRUE);
    //if (variable_get('subscriptions_hide_overview_page', 0)) {
    //  $dummy_form_state = NULL;
    //  $form = subscriptions_user_suspend_form($dummy_form_state, $account);
    //}
    $form['header'][] = array(
      '#markup'        => t('Current subscriptions:'),
      '#weight'        => -2,
      );
  }

  $uid = (empty($account) ? -DRUPAL_AUTHENTICATED_RID : (is_object($account) ? $account->uid : -$account));
  $bulk_uids = (empty($_SESSION['subscriptions']['bulk_op']) ? NULL : $_SESSION['subscriptions']['uids']);
  $form['#tree']      = TRUE;
  $form['uid']        = array('#type' => 'value', '#value' => (isset($bulk_uids) ? $bulk_uids : $uid));
  $form['access_key'] = array('#type' => 'value', '#value' => $stype);
  $form['module']     = array('#type' => 'value', '#value' => $stypes[$stype]['fields'][0]);
  $form['field']      = array('#type' => 'value', '#value' => $stypes[$stype]['fields'][1]);
  $form['submit']     = array('#type' => 'submit', '#value' => t('Save'), '#weight' => 10);
  $form['#submit'][]  = 'subscriptions_page_form_submit';

  $form['footer'] = array(
    '#type'        => 'item',
    '#description' => t('The master checkboxes in the left-most column turn the given subscription on or off. To turn a range of subscriptions on or off, click and Shift-click.') . '<br />' . t('Depending on the setup of the site, you may have additional options for active subscriptions.'),
    '#weight'      => 4,
    );

  $callback = $stypes[$stype]['page'];
  if (!empty($callback) && function_exists($callback)) {
    $form = $callback($form, (isset($bulk_uids) ? 0 : $uid));
    if (is_string($form)) {
      $form = array(
        'message' => array(
          '#type' => 'item',
          '#markup' => '<br /><br />' . $form,
        ),
      );
    }
  }
  //$form = function_exists($callback) ? $callback($account, $form) : NULL;
  //drupal_add_link(array(
  //  'rel' => 'alternate',
  //  'type' => 'application/rss+xml',
  //  'title' => t('!name Subscriptions', array('!name' => $user->name)),
  //  'href' => url('subscriptions/feed'),
  //));
  drupal_set_title(empty($account->name) ? t('Subscriptions') : format_username($account));
  return $form;
}

/**
 * Construct the overview page, which displays a summary of subscriptions per
 * type as well as the user settings at user/UID/subscriptions.
 * This form is also used for admin/settings/subscriptions/userdefaults.
 *
 * @param array $form
 * @param array $form_state
 * @param object|null $account
 *   Must be a valid user account from user_load() or NULL (for the admin form).
 *
 * @return array|null
 */
function subscriptions_page_user_overview(array $form, array &$form_state, $account) {
  // Build summary
  $uid = (!empty($account) ? $account->uid : -DRUPAL_AUTHENTICATED_RID);
  $counts = array();
  $result = db_query("SELECT module, field, COUNT(1) AS number FROM {subscriptions} WHERE recipient_uid = :recipient_uid GROUP BY module, field", array(':recipient_uid' => $uid));
  foreach ($result as $subs) {
    if (!empty($subs->module)) {
      $counts[$subs->module][$subs->field] = $subs->number;
    }
  }
  // Give other modules a chance to add their count(s).
  drupal_alter('subscriptions_counts', $counts, $uid);

  $tr = 't';
  $header = array(array('data' => $tr('Type'), 'width' => '20%'), t('Number'));
  $types = subscriptions_types();
  if ($uid < 0) {
    unset($types['node']);
  }
  uasort($types, '_subscriptions_cmp_by_weight');
  $rows = array();
  foreach ($types as $stype => $type) {
    $has_access = ($uid < 0 && user_access('administer site configuration')) || user_access($type['access'], $account);
    if (($has_access || user_access('administer user subscriptions')) && isset($type['fields'])) {
      $rows[] = array(
        ($has_access ? l($tr($type['title']), ($uid < 0 ? SUBSCRIPTIONS_CONFIG_PATH . "/userdefaults/$stype" : "user/$uid/subscriptions/$stype")) : $type['title']),
        (isset($type['fields'][2]) && isset($counts[$type['fields'][0]][$type['fields'][2]])) ? $counts[$type['fields'][0]][$type['fields'][2]] :
        (isset($counts[$type['fields'][0]][$type['fields'][1]]) ? $counts[$type['fields'][0]][$type['fields'][1]] : 0),
      );
    }
  }
  $form['overview']['table'] = array(
    '#theme' => 'table',
    '#header' => $header,
    '#rows' => $rows,
  );
  $form['overview']['note'] = array(
    '#type' => 'item',
    '#description' => t('Note: The counts on this page may differ from the ones on the detail pages for various technical reasons.'),
    '#suffix' => '<br />',
  );
  $form['#submit'] = array();
  if ($uid > 0) {
    subscriptions_user_suspend_form($form, $form_state, $account);
  }
  $form = subscriptions_user_settings_form($form, $form_state, $account);
  drupal_set_title($uid < 0 ? t('Subscriptions') : format_username($account));
  return $form;
}

/**
 * Returns the form definition for the suspend part of the overview page.
 *
 * @param array $form
 * @param array $form_state
 * @param object|null $account
 *   Must be a valid user account from user_load().
 *
 * @ingroup form
 */
function subscriptions_user_suspend_form(array &$form, array &$form_state, $account) {
  global $user;

  if (!isset($account)) {
    return;
  }
  $uid = $account->uid;
  $suspended = subscriptions_suspended($uid, TRUE);

  if (!user_access('administer user subscriptions') && !($user->uid == $uid && (user_access('suspend own subscriptions') || $suspended))) {
    return;
  }

  $form['suspend'] = array(
    '#type'          => 'fieldset',
    '#title'         => t('Delivery of notifications'),
    '#weight'        => 5,
    '#collapsible'   => TRUE,
    '#collapsed'     => !$suspended,
  );
  $count = 0;
  if ($suspended) {
    $count = db_query("SELECT COUNT(*) FROM {subscriptions_queue} WHERE uid = :uid AND suspended <> 0", array(':uid' => $uid))->fetchField();
  }
  $tr = 't';
  $options[] = $tr('Yes');
  if ($count > 0) {
    $form['suspend']['queued'] = array(
      '#markup'      => '<div>' . t('You have %count items queued for delivery. (The number of resulting notifications will typically be much smaller.)', array('%count' => $count)) . '</div>',
    );
    $options[-1] = t('!Yes, but drop the queued items', array('!Yes' => $tr('Yes')));
  }
  $options[] = $tr('No');
  if (user_access('administer user subscriptions')) {
    $options[2] = t('!No, and alert user to bad email address (administrator option)', array('!No' => $tr('No')));
  }
  $description = user_access('suspend own subscriptions', $account)
                 ? t('You can temporarily suspend notifications from being sent, e.g. during a vacation. They will be retained and sent after you reenable notifications.')
                 : t('Select %Yes to send all queued notifications and resume normal delivery.', array('%Yes' => $tr('Yes')));
  $form['suspend']['state'] = array(
    '#type'          => 'radios',
    '#title'         => t('Receive notifications'),
    '#description'   => filter_xss($description),
    '#default_value' => ( user_access('administer user subscriptions') ? $suspended : min($suspended, 1) ),
    '#options'       => $options,
  );
  $form['suspend']['uid'] = array(
    '#type'          => 'value',
    '#value'         => $uid,
  );
  $form['suspend']['save_notifications'] = array(
    '#type'          => 'submit',
    '#value'         => t('Save notifications'),
  );
  $form['#submit'][] = '_subscriptions_user_suspend_form_submit';
}

/**
 * User suspend subform submit handler.
 *
 * @param array $form
 * @param array $form_state
 *
 * @ingroup form
 */
function _subscriptions_user_suspend_form_submit(array $form, array &$form_state) {
  $form_values = $form_state['values'];
  if ($form_values['op'] == $form_values['save_notifications']) {
    $uid = $form_values['uid'];
    $suspended = $form_values['state'];
    if ($suspended == -1) {
      db_delete('subscriptions_queue')
        ->condition('uid', $uid)
        ->condition('suspended', 0, '<>')
        ->execute();
      $suspended = 0;
    }
    db_update('subscriptions_user')
      ->fields(array(
          'suspended' => $suspended,
        ))
      ->condition('uid', $uid)
      ->execute();
    db_update('subscriptions_queue')
      ->fields(array(
          'suspended' => $suspended,
        ))
      ->condition('uid', $uid)
      ->execute();
    drupal_set_message(t('The changes have been saved.'));
  }
}

/**
 * Helper function to display a message to the user if notifications
 * are suspended.
 *
 * @param int $uid
 * @param bool $suspended
 */
function _subscriptions_suspended_alert($uid, $suspended) {
  $path2 = url("user/$uid/subscriptions/overview", array('fragment' => 'edit-suspend'));
  switch ($suspended) {
    case 2:
      $msg = t('Your subscriptions have been suspended because your e-mail address did not work anymore!');
      if (!(subscriptions_arg(0) == 'user' && subscriptions_arg(1, 'uid') == $uid && subscriptions_arg(2) == 'edit')) {
        drupal_set_message($msg . '<br />' . t('Please go <a href="@path1">here</a> to update your e-mail address and then <a href="@path2">here</a> to resume delivery of your notifications.', array('@path1' => url("user/$uid/edit"), '@path2' => $path2)), 'error', FALSE);
      }
      else {
        drupal_set_message($msg . '<br />' . t('Please correct/verify your e-mail address below and then go <a href="@path2">here</a> to resume delivery of your notifications.', array('@path2' => $path2)), 'error', FALSE);
      }
      break;
    case 1:
      drupal_set_message(t('Your subscriptions are suspended. Please go <a href="@path2">here</a> to resume delivery of your notifications.', array('@path2' => $path2)), 'warning', FALSE);
      break;
  }
}

/**
 * Returns the form definition for the settings part of the overview page.
 *
 * This subform is also used for admin/settings/subscriptions/userdefaults.
 *
 * @param array $form
 * @param array $form_state
 * @param object|null $account
 *   Must be a valid user account from user_load() or NULL (for the admin form).
 *
 * @return array
 *
 * @ingroup form
 */
function subscriptions_user_settings_form(array $form, array &$form_state, $account) {
  global $user;

  $uid = (!empty($account) ? $account->uid : -DRUPAL_AUTHENTICATED_RID);
  $tr = 't';
  $form['settings'] = array(
    '#type'          => 'fieldset',
    '#title'         => check_plain($tr('Settings')),
    '#weight'        => 10,
    '#collapsible'   => !empty($account),
    '#collapsed'     => !empty($account),
  );
  if ($uid < 0) {
    $form['settings']['info'] = array(
      '#type'          => 'fieldset',
      '#title'         => t('Admin Information'),
      '#attributes'    => array('class' => array('error')),
      '#collapsible'   => TRUE,
      '#collapsed'     => FALSE,
    );
    $form['settings']['info'][] = array(
      '#markup'        => '<div>' . t("The subtabs here under %User_defaults mirror those found at !My_account_Subscriptions, except that the fieldsets here come up already expanded. Please go there now and familiarize yourself with what's there!",
        array(
          '%User_defaults' => $tr('User defaults'),
          '!My_account_Subscriptions' => l($tr('My account') . '|' . $tr('Subscriptions'), 'user/' . $user->uid . '/subscriptions'),
          '%Settings' => $tr('Settings'),
        )
      ) . '</div>',
    );
    $form['settings']['info'][] = array(
      '#markup'        => '<div>' . t("The default settings that you define here are used for those users that haven't (yet) saved their own settings.",
        array(
          '%User_defaults' => $tr('User defaults'),
          '!My_account_Subscriptions' => l($tr('My account') . '|' . $tr('Subscriptions'), 'user/' . $user->uid . '/subscriptions'),
          '%Settings' => $tr('Settings'),
        )
      ) . '</div>',
    );
    $description = '<span class="error">' . t("If you hide this page, your users won't be able to change any of these settings. The default is OFF.") . '<br />' . t('Also, you must give your users the %subscribe_to_content permission, so that they have access to the %Pages_Threads page!', array('%subscribe_to_content' => $tr('Subscribe to content'), '%Pages_Threads' => $tr('Pages/Threads'))) . '</span>';
    $form['settings']['info']['hide_overview_page'] = array(
      '#type'          => 'checkbox',
      '#title'         => t('Hide the %Overview page from your users', array('%Overview' => t('Overview'))),
      '#default_value' => variable_get('subscriptions_hide_overview_page', 0),
      '#description'   => filter_xss($description, array('span', 'br', 'em')),
      '#prefix'        => '<div style="height: 1ex;">&nbsp;</div>',
    );
  }
  $form['settings']['autosub'] = array(
    '#type'          => 'fieldset',
    '#title'         => t('Auto-subscribe'),
    '#access'        => empty($account) || user_access('subscribe to content', $account),
  );
  $form['settings']['autosub']['autosub_post'] = array(
    '#type'          => 'checkbox',
    '#title'         => t('Auto-subscribe to new content'),
    '#default_value' => _subscriptions_get_setting('autosub_on_post', $account),
    '#description'   => t('Automatically subscribes you to items that you create.'),
  );
  $form['settings']['autosub']['autosub_update'] = array(
    '#type'          => 'checkbox',
    '#title'         => t('Auto-subscribe to updated content'),
    '#default_value' => _subscriptions_get_setting('autosub_on_update', $account),
    '#description'   => t('Automatically subscribes you to items that you update (if you have that permission).'),
  );
  $form['settings']['autosub']['autosub_comment'] = array(
    '#type'          => 'checkbox',
    '#title'         => t('Auto-subscribe to comments'),
    '#default_value' => _subscriptions_get_setting('autosub_on_comment', $account),
    '#description'   => t('Automatically subscribes you to items that you comment on (or where you update a comment, if you have that permission).'),
    '#access'        => module_exists('comment') && ((empty($account) || user_access('post comments', $account) || user_access('post comments without approval', $account))),
  );
  $form['settings']['sendself'] = array(
    '#type'          => 'checkbox',
    '#title'         => t('Notify poster of own posts'),
    '#default_value' => _subscriptions_get_setting('send_self', $account),
    '#description'   => t("Sends you notifications about your own posts (if you're subscribed)."),
  );
  $form['settings']['digest'] = array(
    '#type'          => 'checkbox',
    '#title'         => t('Digest mode'),
    '#default_value' => _subscriptions_get_setting('digest', $account),
    '#description'   => t("Merges your notifications into a single email, sent at the interval you specify."),
  );
  if (_subscriptions_get_setting('send_interval_visible', $account) == -2) {
    $intervals = _subscriptions_send_intervals();
    $interval = $intervals[_subscriptions_get_setting('send_interval', $account)];
    $form['settings']['digest']['#description'] = t('Merges your notifications into a single email, sent at regular intervals (%interval).', array('%interval' => $interval));
  }
  $form['settings']['preferences'] = array(
    '#type'          => 'fieldset',
    '#title'         => t('Preferences'),
    '#access'        => FALSE,
  );
  $form['settings']['preferences']['send_interval'] = array(
    '#title'         => t('Send interval'),
    '#type'          => 'select',
    '#options'       => _subscriptions_send_intervals(),
    '#default_value' => _subscriptions_get_setting('send_interval', $account),
    '#description'   => t('The frequency of notifications; it may take longer, but notifications will not be sent more frequently than indicated.'),
  );
  $form['settings']['preferences']['send_updates'] = array(
    '#title'         => t('On updates'),
    '#type'          => 'checkbox',
    '#default_value' => _subscriptions_get_setting('send_updates', $account),
    '#description'   => t('Sends a notification when an item is updated.'),
  );
  $form['settings']['preferences']['send_comments'] = array(
    '#title'         => t('On comments'),
    '#type'          => 'checkbox',
    '#default_value' => _subscriptions_get_setting('send_comments', $account),
    '#description'   => t('Sends a notification when an item receives a comment or reply.'),
  );
  $form['settings']['preferences']['description'] = array(
    '#markup'        => t('Any changes you make here will only apply to newly created subscriptions.'),
  );
  $form['settings']['visibility'] = array(
    '#type'          => 'fieldset',
    '#title'         => t('Visibility of controls'),
    '#collapsible'   => !empty($account),
    '#collapsed'     => !empty($account),
    '#access'        => FALSE,
  );
  $form['settings']['visibility'][] = array(
    '#type'          => 'item',
    '#description'   => t('The control(s) mentioned below appear(s) as one or more columns<br /> a) in the %Subscribe subform of node pages and<br /> b) on the sibling subtabs of this %Overview page.<br /> After you have set your %Preferences right above, you may want to hide the corresponding column(s), if you never change those values anyway.', array('%Subscribe' => $tr('Subscribe'), '%Overview' => $tr('Overview'), '%Preferences' => $tr('Preferences'))),
  );
  $visibility_options = array(t('Visible'), t('Hidden'));
  if (empty($account)) {
    $visibility_options[] = t('Permanently hidden, except for the %preferences', array('%preferences' => 'Preferences'));
    $visibility_options[] = t('Completely inaccessible to the user');
    $form['settings']['visibility']['info'] = array(
      '#type'          => 'fieldset',
      '#title'         => t('Admin Information'),
      '#attributes'    => array('class' => array('error')),
      '#collapsible'   => TRUE,
      '#collapsed'     => FALSE,
      );
    $form['settings']['visibility']['info'][] = array(
      '#markup'        =>
        t("Beyond defining the %Visible/%Hidden defaults for your users, you can",
          array(
            '%Visible' => $tr('Visible'),
            '%Hidden' => $tr('Hidden'),
          )) .
        '<ul><li>' . t("permanently hide the columns (and the corresponding visibility controls), so that the users cannot make them visible anymore (they can still change their %Preferences though), or",
          array(
            '%Preferences' => $tr('Preferences'),
          )) . '</li>' .
        '<li>' . t("you can even hide the %Preferences, so that what you've set right above is cast in stone.",
          array(
            '%Preferences' => $tr('Preferences'),
          )) . '</li></ul>',
    );
  }
  foreach (array('interval', 'updates', 'comments') as $parm ) {
    $site_setting = _subscriptions_get_setting('send_' . $parm . '_visible', 0);
    $suppress_comment_controls = ($parm == 'comments' && !module_exists('comment'));
    $pref_access = (empty($account) || $site_setting >= -1) && !$suppress_comment_controls;
    $control_access = (empty($account) || $site_setting >= 0) && !$suppress_comment_controls;
    $form['settings']['visibility']['send_' . $parm . '_visible'] = array(
      '#title'         => filter_xss(($parm == 'interval' ? t('Send interval') :
                                     ($parm == 'updates' ? t('On updates') : t('On comments')))),
      '#type'          => 'radios',
      '#options'       => $visibility_options,
      '#default_value' => 1 - _subscriptions_get_setting('send_' . $parm . '_visible', $account),
      '#access'        => $control_access,
    );
    if ($control_access) {
      $form['settings']['visibility']['#access'] = TRUE;
    }
    $form['settings']['preferences']['send_' . $parm]['#access'] = $pref_access;
    if ($pref_access) {
      $form['settings']['preferences']['#access'] = TRUE;
    }
  }
  $form['settings']['save_settings'] = array(
    '#type'          => 'submit',
    '#value'         => t('Save settings'),
  );
  if ($uid > 0 && !_subscriptions_get_setting('uses_defaults', $account)) {
    $form['settings']['reset'] = array(
      '#type'        => 'submit',
      '#value'       => t('Reset to site defaults'),
    );
  }
  $form['#submit'][] = '_subscriptions_user_settings_form_submit';
  return $form;
}

/**
 * User settings subform submit handler.
 *
 * @param array $form
 * @param array $form_state
 *
 * @ingroup form
 */
function _subscriptions_user_settings_form_submit(array $form, array &$form_state) {
  $uid = subscriptions_arg(1, 'uid');
  if (isset($form_state['values']['reset']) && $form_state['values']['op'] == $form_state['values']['reset']) {
    if ($uid > 0) {
      db_update('subscriptions_user')
        ->fields(array(
          'digest' => -1,
          'send_interval' => -1,
          'send_updates' => -1,
          'send_comments' => -1,
          'send_interval_visible' => -1,
          'send_updates_visible' => -1,
          'send_comments_visible' => -1,
          'autosub_on_post' => -1,
          'autosub_on_update' => -1,
          'autosub_on_comment' => -1,
          'send_self' => -1,
        ))
        ->condition('uid', $uid)
        ->execute();
      drupal_set_message(t('The site defaults were restored.'));
    }
  }
  elseif ($form_state['values']['op'] == $form_state['values']['save_settings']) {
    if (subscriptions_arg(0) != 'user') {
      $uid = -DRUPAL_AUTHENTICATED_RID;
      if (variable_get('subscriptions_hide_overview_page', 0) != $form_state['values']['hide_overview_page']) {
        variable_set('subscriptions_hide_overview_page', $form_state['values']['hide_overview_page']);
        menu_rebuild();
      }
    }
    $send_interval_visible = 1 - $form_state['values']['send_interval_visible'];
    $send_updates_visible = 1 - $form_state['values']['send_updates_visible'];
    $send_comments_visible = 1 - $form_state['values']['send_comments_visible'];
    db_update('subscriptions_user')
      ->fields(array(
        'digest' => $form_state['values']['digest'],
        'send_interval' => ($uid > 0 && $send_interval_visible == - 2 ? - 1 : $form_state['values']['send_interval']),
        'send_updates' => ($uid > 0 && $send_updates_visible == - 2 ? - 1 : $form_state['values']['send_updates']),
        'send_comments' => ($uid > 0 && $send_comments_visible == - 2 ? - 1 : $form_state['values']['send_comments']),
        'send_interval_visible' => $send_interval_visible,
        'send_updates_visible' => $send_updates_visible,
        'send_comments_visible' => $send_comments_visible,
        'autosub_on_post' => $form_state['values']['autosub_post'],
        'autosub_on_update' => $form_state['values']['autosub_update'],
        'autosub_on_comment' => $form_state['values']['autosub_comment'],
        'send_self' => $form_state['values']['sendself'],
      ))
      ->condition('uid', $uid)
      ->execute();
    drupal_set_message(t('The changes have been saved.'));
  }
}

/**
 * Provides the form definition for admin/config/system/subscriptions/userdefaults/bulk.
 *
 * Called by _subscriptions_menu() in subscriptions.module.
 *
 * @return array
 *
 * @ingroup form
 *
 * @see _subscriptions_menu()
 */
function subscriptions_page_user_bulk() {
  $variables = _subscriptions_page_user_bulk_variables();
  $output = $variables['info'] . '<br /><br />';
  $output .= t('Proceed as follows:', $variables) . '<ol>';
  $output .= '<li>' . t('Navigate to any of the subscription type subtabs.', $variables) . '</li>';
  $output .= '<li>' . t('Select the subscriptions to change.', $variables) . '</li>';
  $output .= '<li>' . t('Click [@Save] to perform the action for the selected users and return here.', $variables) . '</li>';
  $output .= '<li>' . t('Repeat if desired.', $variables) . '</li>';
  $output .= '<li>' . t('Click [@Done] below to clear the selected list of users and return to the user list page.', $variables) . '</li></ol><br />';
  $form['info'] = array(
    '#markup' => $output,
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Done'),
  );
  return $form;
}

/**
 * Helper function to provide strings.
 *
 * @return array
 */
function _subscriptions_page_user_bulk_variables() {
  $bulk_op = $_SESSION['subscriptions']['bulk_op'];
  $uids = unserialize($_SESSION['subscriptions']['uids']);
  $count = count($uids);
  $variables = array(
    '!action' => '<strong>' . ($bulk_op == 'sub' ? t('subscribing') : t('unsubscribing')) . '</strong>',
    '!change' => '<strong>' . ($bulk_op == 'sub' ? t('add') : t('remove')) . '</strong>',
    '@Save'   => t('Save'),
    '@Done'   => t('Done'),
  );
  $variables['info'] = format_plural($count, '1 user selected for bulk !action.', '@count users selected for bulk !action.', $variables);
  return $variables;
}

/**
 * Bulk operation form submit handler.
 *
 * @param $form
 * @param $form_state
 *
 * @ingroup form
 */
function subscriptions_page_user_bulk_submit($form, &$form_state) {
  $back_url = $_SESSION['subscriptions']['back_url'];
  unset($_SESSION['subscriptions']['bulk_op']);
  unset($_SESSION['subscriptions']['uids']);
  unset($_SESSION['subscriptions']['back_url']);
  drupal_goto($back_url);
}

/**
 * Provide the form definition for admin/settings/subscriptions/intervals.
 *
 * Called by _subscriptions_menu() in subscriptions.module.
 *
 * @param array $form
 * @param array $form_state
 *
 * @return array
 *
 * @ingroup form
 * @see _subscriptions_menu()
 */
function subscriptions_intervals(array $form, array &$form_state) {
  $default = '';
  foreach (_subscriptions_send_intervals() as $interval => $text) {
    $default .= "$interval|$text\n";
  }
  $form['info'] = array(
    '#markup' => t('Define the selection of %Send_interval options available through the user interface. Adding additional ones is easy, but removing one that is already in use is not recommended.', array('%Send_interval' => t('Send interval'))),
  );
  $form['intervals'] = array(
    '#type' => 'textarea',
    '#cols' => 40,
    '#default_value' => $default,
    '#description' => t('Every line has the format of seconds|human readable text'),
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
  );
  return $form;
}

/**
 * Sending intervals settings form submit handler.
 *
 * @param array $form
 * @param array $form_state
 *
 * @ingroup form
 */
function subscriptions_intervals_submit(array $form, array &$form_state) {
  $intervals = array();
  foreach (explode("\n", $form_state['values']['intervals']) as $line) {
    if ($line) {
      $v = explode('|', $line);
      $intervals[$v[0]] = $v[1];
    }
  }
  variable_set('subscriptions_send_intervals', $intervals);
  drupal_set_message(t('The changes have been saved.'));
}

/**
 * Provide the form definition for adding subscriptions via
 * subscriptions/add/... link.
 *
 * Callback of _subscriptions_menu() in subscriptions.module.
 *
 * @param array $form
 * @param array $form_state
 * @param string $stype
 *   Subscription type.
 * @param mixed $sid
 *   Subscription parameter (depends on type).
 * @param int|null $author_uid
 *   User ID for author-specific subscriptions or NULL/-1 for all authors.
 *
 * @return array
 *
 * @ingroup forms
 * @see _subscriptions_menu()
 */
function subscriptions_add_form(array $form, array &$form_state, $stype, $sid, $author_uid = NULL) {
  global $user;
  $form['sid'] = array('#type' => 'value', '#value' => $sid);
  $form['uid'] = array('#type' => 'value', '#value' => $user->uid);
  $form['stype'] = array('#type' => 'value', '#value' => $stype);
  $form['author_uid'] = array('#type' => 'value', '#value' => $author_uid);
  $form['send_interval'] = array(
    '#title' => t('Send interval'),
    '#type' => 'select',
    '#options' => _subscriptions_send_intervals(),
    '#default_value' => _subscriptions_get_setting('send_interval', $user),
    '#access' => _subscriptions_get_setting('send_interval_visible', $user),
  );
  $form['updates'] = array(
    '#type' => 'checkbox',
    '#title' => 'On updates',
    '#default_value' => _subscriptions_get_setting('send_updates', $user),
    '#access' => _subscriptions_get_setting('send_updates_visible', $user),
  );
  $form['comments'] = array(
    '#type' => 'checkbox',
    '#title' => 'On comments',
    '#default_value' => _subscriptions_get_setting('send_comments', $user),
    '#access' => _subscriptions_get_setting('send_comments_visible', $user),
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Subscribe'),
  );
  return $form;
}

/**
 * Add Subscription form submit handler.
 *
 * @param array $form
 * @param array $form_state
 *
 * @ingroup form
 */
function subscriptions_add_form_submit(array $form, array &$form_state) {
  if ($a = module_invoke_all('subscriptions', 'stype', $form_state['values']['stype'], $form_state['values']['sid'], (isset($form_state['values']['author_uid']) ? $form_state['values']['author_uid'] : -1))) {
    // Allow other modules to alter the data.
    drupal_alter('subscriptions_stype', $a);

    list($module, $field, $value, $author_uid) = $a;
    $uid = $form_state['values']['uid'];
    subscriptions_write_subscription($module, $field, $value, $author_uid, $uid, $form_state['values']['send_interval'], $form_state['values']['updates'], $form_state['values']['comments']);
    drupal_set_message(t('Your subscription was activated.'));
    $form_state['redirect'] = '<front>';
  }
  else {
    drupal_set_message(t('Your subscription could not be activated.'));
  }
}

/**
 * Provide the form definition for deleting subscriptions via
 * subscriptions/del/... link.
 *
 * Callback of _subscriptions_menu() in subscriptions.module.
 *
 * @param array $form
 * @param array $form_state
 *   FAPI form state.
 * @param string $stype
 *   Subscription type.
 * @param mixed $sid
 *   Subscription parameter (depends on type).
 * @param int|null $author_uid
 *   User ID for author-specific subscriptions or -1/NULL for all authors.
 *
 * @return array|null
 *
 * @ingroup forms
 * @see _subscriptions_menu()
 */
function subscriptions_del_form(array $form, array &$form_state, $stype, $sid, $author_uid = NULL) {
  global $user;

  if ($a = module_invoke_all('subscriptions', 'stype', $stype, $sid, (isset($author_uid) ? $author_uid : -1))) {
    // Allow other modules to alter the data.
    drupal_alter('subscriptions_stype', $a);

    list($module, $field, $value, $author_uid) = $a;
    return subscriptions_delete_form($form, $form_state, $module, $field, $value, $author_uid, $user->uid);
  }
  drupal_set_message(t('Your subscription could not be deactivated.'));
  return NULL;
}

/**
 * Returns a list of send intervals.
 *
 * @return array
 */
function _subscriptions_send_intervals() {
  return variable_get('subscriptions_send_intervals',
    array(
      1 => t('As soon as possible'),
      900 => t('Every 15 minutes'),
      3600 => t('Hourly'),
      10800 => t('Every three hours'),
      86400 => t('Daily'),
    )
  );
}

/**
 * Helper function for the submodules to build the table(s) on their
 * user/UID/subscriptions/... pages.
 *
 * @param array $form
 * @param array $defaults
 * @param int $author_uid
 * @param string $key
 * @param string $title
 * @param array $subscription
 *
 * @ingroup form
 */
function subscriptions_form_helper(array &$form, array &$defaults, $author_uid, $key, $title, array $subscription) {
  static $intervals;
  if (!isset($intervals)) {
    $intervals = _subscriptions_send_intervals();
  }
  if (isset($subscription['author_uid']) && ($author_uid == $subscription['author_uid'])) {
    $defaults['checkboxes'][$key][$author_uid] = 1;
  }
  $defaults['send_interval'][$key][$author_uid] = $subscription['send_interval'];
  if ($subscription['send_comments']) {
    $defaults['send_comments'][$key][$author_uid] = 1;
  }
  if ($subscription['send_updates']) {
    $defaults['send_updates'][$key][$author_uid] = 1;
  }
  if (isset($subscription['author_uid']) && $subscription['author_uid'] > 0) {
    $author_value = format_username(user_load($subscription['author_uid']));
  }
  elseif ($author_uid == 0) {
    $author_value = format_username(NULL);
  }
  else {
    $author_value = '';
  }

  $form['labels'][$key][$author_uid] = array(
    '#markup' => $title,
  );
  $form['author'][$key][$author_uid] = array(
    '#markup' => check_plain($author_value),
  );
  $form['send_interval'][$key][$author_uid] = array(
    '#type' => 'select',
    '#options' => $intervals,
    '#default_value' => $defaults['send_interval'][$key][$author_uid],
  );
  foreach (array('checkboxes', 'send_comments', 'send_updates') as $col_name) {
    $form[$col_name][$key][$author_uid] = array(
      '#type' => 'checkbox',
      '#default_value' => !empty($defaults[$col_name][$key][$author_uid]),
    );
  }
  if (isset($subscription['extra_info'])) {
    $form['extra_info'][$key][$author_uid] = array(
      '#markup' => $subscription['extra_info'],
    );
  }
}

/**
 * Helper function for the submodules to hide invisible or empty columns from
 * their page form table(s).
 *
 * @param array $form_table
 * @param int $uid
 *
 * @ingroup form
 */
function subscriptions_form_column_filter(array &$form_table, $uid) {
  $bulk_unsub = (isset($_SESSION['subscriptions']['bulk_op']) && $_SESSION['subscriptions']['bulk_op'] == 'unsub');
  foreach (array('send_interval', 'send_comments', 'send_updates', 'author') as $key) {
    if (isset($form_table[$key])) {
      $form_table[$key]['#access'] = !$bulk_unsub && ($uid <= 0 || $key == 'author' || _subscriptions_get_setting($key . '_visible', $uid) > 0);
    }
  }
}

