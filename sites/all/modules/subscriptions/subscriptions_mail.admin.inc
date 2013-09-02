<?php

/**
 * @file
 * Subscriptions module mail gateway (admin functions).
 */

/**
 * Implementation of hook_form_alter().
 *
 * Adds to the General Settings part at admin/settings/subscriptions.
 *
 * @param array $form
 * @param array $form_state
 */
function _subscriptions_mail_form_subscriptions_settings_form_alter(array &$form, array &$form_state) {
  if (variable_get('subscriptions_mail_trash_silently', 0)) {
    drupal_set_message(t('All notification mails are discarded because the %varname variable is set &mdash; see the @filename file for more information.', array('%varname' => 'subscriptions_mail_trash_silently', '@filename' => 'README.txt')), 'error');
  }
  _subscriptions_mail_check_baseurl(TRUE);

  $variables = array('@Subscriptions' => 'Subscriptions');
  $form['mail_settings'] = array(
      '#type'        => 'fieldset',
      '#title'       => t('Mail settings'),
      '#collapsible' => TRUE,
      '#weight'      => -3,
  );
  $form['mail_settings']['subscriptions_site_mail'] = array(
    '#type'          => 'textfield',
    '#title'         => t('E-mail address'),
    '#default_value' => _subscriptions_mail_site_mail(TRUE),
    '#description'   => t('A valid e-mail address to be used as the %From and %Reply_To address by the auto-mailer for @Subscriptions notifications.  To lessen the likelihood of e-mail being marked as spam, this e-mail address should use the same domain as the website.', $variables + array('%From' => 'From', '%Reply_To' => 'Reply-To')) . '<br />' . t('Clear this field to use the default site e-mail address.'),
  );
  $form['mail_settings']['subscriptions_site_mail_name'] = array(
    '#type'          => 'textfield',
    '#title'         => t('E-mail name'),
    '#default_value' => variable_get('subscriptions_site_mail_name', ''),
    '#description'   => t('An optional name to go with the e-mail address above, no "double-quotes".') . '<br />' . t('Clear this field to use the e-mail address only &mdash; some e-mail clients will display only the portion of the address to the left of the @ sign.'),
  );
  $form['mail_settings']['subscriptions_number_of_mails'] = array(
    '#type'          => 'textfield',
    '#title'         => t('Maximum number of notifications to send per cron run'),
    '#default_value' => variable_get('subscriptions_number_of_mails', 0),
    '#description'   => t('If you need to limit the number of outgoing e-mails for some reason, then set that number here. The default is 0, which means unlimited.'),
  );
  $cron_percentage = subscriptions_mail_get_cron_percentage();
  $form['mail_settings']['subscriptions_cron_percent'] = array(
    '#type'          => 'textfield',
    '#title'         => t('Maximum percent of cron job time to use'),
    '#default_value' => $cron_percentage,
    '#description'   => t('Limit the percentage of cron job time that @Subscriptions may use. If you have modules with cron jobs that run after @Subscriptions, then be sure to leave enough time for them! The default is @value.<br />You can temporarily set this to 0 to suspend processing of the notifications queue.', $variables + array('@value' => 50)),
  );
  if (empty($_POST) && $cron_percentage <= 0) {
    $message = t('@Subscriptions cannot send any notifications because its <a href="@link">cron job time</a> is 0!', $variables + array('@link' => '#edit-subscriptions-cron-percent'));
    drupal_set_message(filter_xss(t('Warning: !message', array('!message' => $message))), 'error');
    $form['mail_settings']['subscriptions_cron_percent']['#attributes'] = array('class' => array('error'));
  }
  $result = db_query("SELECT COUNT(sqid) AS count, suspended FROM {subscriptions_queue} GROUP BY suspended", array(), array('fetch' => PDO::FETCH_ASSOC));
  $active_count = $suspended_count = 0;
  foreach ($result as $record) {
    if (!$record['suspended']) {
      $active_count = $record['count'];
    }
    else {
      $suspended_count += $record['count'];
    }
  }
  $form['mail_settings']['queue_length'] = array(
    '#title'         => t('Queue'),
    '#markup'        => t('There are %active_count active and %suspended_count suspended items in the queue.', array('%active_count' => $active_count, '%suspended_count' => $suspended_count)) . ' &nbsp; ',
    '#description'   => t('Note: The number of generated e-mails is typically much lower than the number of queue items.'),
  );
  $form['mail_settings']['purge_queue'] = array(
    '#type'          => 'submit',
    '#name'          => 'op',
    '#value'         => t('Purge the queue'),
  );
  $form['mail_settings']['subscriptions_watchgood'] = array(
    '#type'          => 'checkbox',
    '#title'         => t('Display watchdog entries for successful mailings'),
    '#default_value' => variable_get('subscriptions_watchgood', 1),
    '#description'   => t('Logs successful mailings to the watchdog log.  Default is ON, but with many subscribers this will generate a huge number of log entries.'),
  );
  $form['mail_settings']['subscriptions_watchstats'] = array(
    '#type'          => 'checkbox',
    '#title'         => t('Display summary watchdog entries per cron job'),
    '#default_value' => variable_get('subscriptions_watchstats', 1),
    '#description'   => t('Logs the mailing counts, time spent, and size of the remaining queue to the watchdog log.  This is valuable information for estimating the load on the cron job and on your mail server.  Default is ON.'),
  );
  if (module_exists('mail_edit')) {
    $form['mail_settings']['subscriptions_showmailkeys'] = array(
      '#type'          => 'checkbox',
      '#title'         => t('Append the mailkey to every notification'),
      '#default_value' => variable_get('subscriptions_showmailkeys', 0),
      '#description'   => t('Appends the key of the <a href="@url">@Mail_Editor template</a> that was used to create each e-mail, to assist with configuration and testing. Default is OFF.', array('@Mail_Editor' => 'Mail Editor', '@url' => url('admin/config/system/mail-edit'))),
    );
  }
  array_unshift($form['#submit'], '_subscriptions_mail_submit_subscriptions_settings_form');
}

/**
 * Submit handler for the Purge-the-queue button on the Subscriptions settings form.
 *
 * @param array $form
 * @param array $form_state
 */
function _subscriptions_mail_submit_subscriptions_settings_form(array $form, array &$form_state) {
  if ($form_state['values']['op'] == $form_state['values']['purge_queue']) {
    drupal_goto(SUBSCRIPTIONS_CONFIG_PATH . '/purge-queue', array('query' => drupal_get_destination()));
  }
}

/**
 * Implementation of hook_form_alter().
 *
 * Add the digest parts to the subscriptions_mail_digest mail_edit page.
 *
 * @ingroup hooks
 * @ingroup form
 * /
function _subscriptions_mail_form_mail_edit_trans_alter(&$form, &$form_state) {
  $mailkey = 'subscriptions_mail_digest';
  if ($form['id']['#value'] == $mailkey) {
    $tr = 't';
    $langcode = $form['language']['#value'];

    $form['mail']['subject']['#title'] = t('Digest subject');
    $form['mail']['body']['#title'] = t('Digest body');
    $form['mail']['body']['#rows'] = 8;

    $digest_item = subscriptions_mail_template_load(SUBSCRIPTIONS_DIGEST_MAILKEY . '+item', $langcode, 'body', 'DITEM');
    $digest_item_separator = subscriptions_mail_template_load(SUBSCRIPTIONS_DIGEST_MAILKEY . '+item', $langcode, 'subject', 'SEP');
    $digest_item_comment = subscriptions_mail_template_load(SUBSCRIPTIONS_DIGEST_MAILKEY . '+comment', $langcode, 'body', 'DITEMCMT');

    $form['mail']['digest_item'] = array(
      '#title'      => t('Digest item'),
      '#type'       => 'textarea',
      '#default_value'  => $digest_item,
      '#rows' => 15,
    );
    $form['mail']['digest_item_comment'] = array(
      '#title'      => t('Digest item comment'),
      '#type'       => 'textarea',
      '#default_value'  => $digest_item_comment,
      '#rows' => 4,
      '#description' => t('The comments inside a digest item body.'),
    );
    $form['mail']['digest_item_separator'] = array(
      '#title'      => t('Digest item separator'),
      '#type'       => 'textarea',
      '#default_value' => $digest_item_separator,
      '#rows' => 2,
      '#description' => t('The separator between digest items (if needed). '),
    );

    $form['op']['#submit'][] = 'subscriptions_mail_form_mail_edit_trans_save';
    if (isset($form['delete'])) {
      $form['delete']['#submit'][] = 'subscriptions_mail_form_mail_edit_trans_delete';
    }
  }
}

/**
 * Save handler for enhanced mail_edit page.
 * /
function subscriptions_mail_form_mail_edit_trans_save($form, &$form_state) {
  $id = $form_state['values']['id'];
  $form_state['values']['description'] = '';
  $form_state['values']['subject'] = $form_state['values']['digest_item_separator'];
  $form_state['values']['body'] = $form_state['values']['digest_item'];
  $form_state['values']['id'] = $id . '+item';
  mail_edit_trans_save($form, $form_state);
  $form_state['values']['subject'] = '';
  $form_state['values']['body'] = $form_state['values']['digest_item_comment'];
  $form_state['values']['id'] = $id . '+comment';
  mail_edit_trans_save($form, $form_state);
}

/**
 * Delete handler for enhanced mail_edit page.
 * /
function subscriptions_mail_form_mail_edit_trans_delete($form, &$form_state) {
  foreach (array('item', 'comment') as $key) {
    db_delete('mail_edit')
      ->condition('id', $form_state['values']['id'] . $key)
      ->condition('language', $form_state['values']['language'])
      ->execute();
  }
}

/**/

