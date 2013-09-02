<?php

/**
 * @file
 * Subscriptions_mail module integration with Mail Editor module.
 */

/**
 * Implements hook_mail_edit_text().
 *
 * Provide default templates for mail_edit.
 *
 * @param $mailkey
 * @param $language
 *
 * @return array
 *
 * @ingroup hooks
 */
function _subscriptions_mail_mail_edit_text($mailkey, $language) {
  $langcode = $language->language;
  _subscriptions_mail_module_load_include('templates.inc');
  switch ($mailkey) {
    case '.DEFAULT':
      $return = array(
        'subject'                    => subscriptions_mail_template('SUBJ', $langcode),
        'body'                       => subscriptions_mail_template('BODY', $langcode),
        'subscriptions_comment_body' => subscriptions_mail_template('CITEM', $langcode),
      );
      break;
    case 'digest':
      $return = array(
        'subject' => subscriptions_mail_template('DSUBJ', $langcode),
        'body'    => subscriptions_mail_template('DBODY', $langcode),
      );
      break;
    default:
      $return = _mail_edit_load('subscriptions_mail_.DEFAULT', $langcode, TRUE);
      unset($return['default'], $return['language'], $return['type']);
      // TODO: Implement a hook to allow other modules to provide their default templates.
  }
  $return['always'] = TRUE;
  return $return;
}

/**
 * Implements hook_mail_edit_token_types().
 *
 * Returns the available token types.
 *
 * @param $mailkey
 * @param array $options
 * @return array
 *
 * @ingroup hooks
 */
function _subscriptions_mail_mail_edit_token_types($mailkey, $options = array()) {
  global $language;
  $massage_tokens = &drupal_static('subscriptions_mail_massage_tokens');
  $massage_tokens = FALSE;

  if (module_exists('token')) {
    //dpm(token_get_info(), "TRIGGER HACK");
    // Clear token.module's caches.
    cache_clear_all('tree-rendered:', 'cache_token', TRUE);
    cache_clear_all('tree:subs:', 'cache_token', TRUE);
    cache_clear_all("info:{$language->language}", 'cache_token');
    $token_get_info = &drupal_static('token_get_info');
    $token_get_info = NULL;
    $token_info = &drupal_static('token_info');
    $token_info = NULL;
    // We want to poison token.module's caches now!
    $massage_tokens = TRUE;
    // Trigger a refresh of token.module's caches.
    token_get_info();
    $massage_tokens = FALSE;
    //dpm(token_get_info(), "HACK DONE");
    // Clear the permanent cache, keeping token.module's static caches.
    cache_clear_all("info:{$language->language}", 'cache_token');
  }

  $token_types = module_invoke_all('subscriptions', 'token_types', substr($mailkey, 19));
  $token_types = array_merge($token_types, ($mailkey == 'subscriptions_mail_digest' ? array('subs') : array('user', 'subs')));
  return $token_types;
}

/**
 * Implements hook_mail_edit_form_extra().
 *
 * Customize Mail Editor's edit template page.
 *
 * @param array $form
 * @param array $form_state
 * @param $mailkey
 * @param array $template
 */
function _subscriptions_mail_mail_edit_form_extra(array &$form, array &$form_state, $mailkey, array $template) {
  if ($mailkey == 'digest') {
    $form['mail']['body']['#description'] = t('The mail body contains a repeat loop that pulls in multiple items that are ready for sending. Recommended tokens: <ul><li>@t1 and @t2<br />Note: Accessing parts of an item requires casting the item to the correct item type, e.g. @t4.</li> <li>@t3</li></ul>', array(
      '@t1' => '[subs:items]',
      '@t2' => '[subs:manage-url]',
      '@t3' => '[current-user:*]',
      '@t4' => '[subs:items:index:#0:as-node:title]',
    ));
  }
  else {
    if ($mailkey == '.DEFAULT') {
      $form['explain_default'] = array(
        '#markup' => t('This template serves a double purpose for all other !Subscriptions templates (except for the %digest template):<ul><li>it is used as default template where no customized template exists, and</li><li>it serves as starting point for adding new templates.</li></ul>', array('!Subscriptions' => 'Subscriptions', '%digest' => 'digest')),
        '#weight' => -7,
      );
      $description = t('The mail body contains one node of unknown type.');
    }
    else {
      $description = t('The mail body contains one node of the named type.');
    }
    $form['mail']['body']['#description'] = $description . ' ' . t('Recommended tokens: <ul><li>@t1, except for @t2,</li> <li>@t3, @t4, and @t5,</li> <li>!t6, if comments should be included.</li></ul>', array(
      '@t1' => '[subs:*]',
      '@t2' => '[subs:items]',
      '@t3' => '[node:*]',
      '@t4' => '[node:author:*]',
      '@t5' => '[current-user:*]',
      '!t6' => '<code>{{[subs:comments:count]#...[subs:comments:value:#0]...}}</code>',
    ));
    if (isset($template['subscriptions_comment_body'])) {
      $form['mail']['subscriptions_comment_body'] = array(
        '#title'         => module_exists('comment') ? t('Comment') : t('@Comment (unused because @Comment module is disabled on this site)', array('@Comment' => t('Comment'))),
        '#type'          => 'textarea',
        '#default_value' => $template['subscriptions_comment_body'],
        '#rows'          => 5,
        '#description'   => t('This template formats one comment for inclusion in the @Body template above. Recommended tokens:<ul><li>@t1, @t2, @t3, @t4, and @t5, if available,</li> <li>@t6 and @t7.</li></ul>', array(
          '@Body'        => t('Body'),
          '@t1'          => '[subs:is-new]',
          '@t2'          => '[subs:is-updated]',
          '@t3'          => '[subs:is-published]',
          '@t4'          => '[subs:type]',
          '@t5'          => '[subs:files:field_FILES]',
          '@t6'          => '[comment:*]',
          '@t7'          => '[comment:author:*]',
        )),
        '#weight'        => 5,
      );
    }
  }
}

/**
 * Implements hook_form_alter().
 *
 * Adds the preview functionality to mail_edit's edit page.
 *
 * @param $form
 * @param $form_state
 *
 * @ingroup hooks
 * @ingroup form
 */
function _subscriptions_mail_form_mail_edit_template_form_alter(&$form, &$form_state) {
  $mailkey = $form['id']['#value'];
  $type_ = 'subscriptions_mail_node-type-';
  if (strpos($mailkey, $type_) === 0) {
    $form['content_type'] = array(
      '#type'  => 'hidden',
      '#value' => substr($mailkey, strlen($type_)),
    );
  }

  if (isset($form_state['template_preview'])) {
    $form['template_preview'] = array(
      '#type'        => 'fieldset',
      '#title'       => t('Template preview'),
      '#collapsible' => TRUE,
      '#weight'      => -5,
    )
    + $form_state['template_preview'];
  }

  $form['preview'] = array(
    '#type'   => 'submit',
    '#value'  => t('Preview template'),
    '#submit' => array('subscriptions_mail_preview'),
    '#weight' => 7,
  );
}

/**
 * Submit handler for the 'Preview template' button.
 *
 * @param $form array
 * @param $form_state array
 */
function _subscriptions_mail_preview(array $form, array &$form_state) {
  $values = $form_state['values'];
  if (isset($values['preview_mode'])) {
    variable_set('subscriptions_preview_mode', $values['preview_mode']);
  }
  $form_state['template_preview'] = _subscriptions_mail_preview_form($values);
  $form_state['rebuild'] = TRUE;
}

/**
 * Returns the template preview subform.
 *
 * @param $values array
 *
 * @return array
 */
function _subscriptions_mail_preview_form(array $values) {
  global $user;

  _subscriptions_module_load_include('subscriptions_mail', 'cron.inc');
  $language_list = language_list();
  $language = $language_list[$values['language']];
  $is_digest = $values['id'] == 'subscriptions_mail_digest';
  $preview_mode = variable_get('subscriptions_preview_mode', 'text');
  $digest_data = array('subs' => array('type' => 'digest'));

  $query = db_select('node', 'n')
    ->fields('n', array('nid', 'comment'));
  if (isset($values['content_type'])) {
    $query
      ->condition('type', $values['content_type']);
  }
  $query
    ->orderBy('n.nid', 'DESC')
    ->addTag('node_access');

  foreach ($query->execute() as $row) {
    // This code is adapted from _subscriptions_mail_cron().
    $queue_item = array(
      'sqid'          => 0,
      'uid'           => $user->uid,
      'name'          => check_plain(format_username($user)),
      'language'      => $user->language,
      'module'        => 'node',
      'field'         => 'nid',
      'value'         => $row->nid,
      'author_uid'    => -1,
      'send_interval' => 1,
      'digest'        => $is_digest,
      'load_args'     => $row->nid,
      'load_function' => 'subscriptions_content_load_node',
      'is_new'        => 1,
      'mail'          => $user->mail,
    );
    $load_function = $queue_item['load_function'];
    if ($load_function($queue_item)) {
      $node = $queue_item['object'];
      $access = module_invoke_all('subscriptions', 'access', $load_function, $queue_item['load_args'], $node);
      $allow = !empty($access) && array_search(FALSE, $access) === FALSE;
      if ($allow) {
        $node->_subscriptions_comments = array();
        if (module_exists('comment')) {
          // Load and add all comments for this node.
          $cids = comment_get_thread($node, COMMENT_MODE_FLAT, 5);
          if (!empty($cids)) {
            foreach (comment_load_multiple($cids) as $comment) {
              // Fake every other comment as new.
              $comment->_subscriptions_is_new = $comment->cid%2;
              $node->_subscriptions_comments[] = $comment;
            }
          }
        }

        $fields = module_invoke_all('subscriptions', 'fields', $queue_item['module']);
        $field = $queue_item['field'];
        $data_function = $fields[$field]['data_function'];
        $mailmod = (empty($fields[$field]['mail_module']) ? 'subscriptions_mail' : $fields[$field]['mail_module']);
        $mailkey = $fields[$field]['mailkey'];
        if ($mailkey_altered = module_invoke_all('subscriptions', 'mailkey_alter', $mailkey, $node)) {
          $mailkey = $mailkey_altered[0];
        }
        $data = array(
          'subs' => array(
            'type'             => $fields[$field]['subs_type'],
            'unsubscribe_path' => 's/del/...',
            'subs-module'      => 'MODULE',
            'subs-field'       => 'FIELD',
            'subs-value'       => 'VALUE',
          ),
          'user' => user_load(!empty($node->revision_uid) ? $node->revision_uid : $node->uid),
        );
        $data_function($data, $node, $queue_item);
        drupal_alter('subscriptions_data', $data, $node, $queue_item);
        $digest_data = subscriptions_mail_digest_add_item($digest_data, $mailmod, $mailkey, $data, $user);
      }
    }
    if (count($digest_data['subs']['items']) >= ($is_digest ? 3 : 1)) {
      break;
    }
  }

  if ($is_digest) {
    $data = $digest_data;
  }
  if (empty($data)) {
    $form['note'] = array(
      '#markup' => '<span class="error">' . t('No displayable content found!') . '</span>',
    );
    return $form;
  }

  $subject = mail_edit_format($values['subject'], $data, array('language' => $language));
  $body = $values['body'];
  if ($preview_mode == 'html-rendered-nl') {
    $body = str_replace("\n", "<br />\n", $body);
  }
  $body = mail_edit_format($body, $data, array('language' => $language));
  switch ($preview_mode) {
    case 'text':
      $body = drupal_html_to_text($body);
    case 'html-raw':
      $body = check_plain($body);
      $body = '<pre>' . $body . '</pre>';
      break;
    case 'html-rendered':
    case 'html-rendered-nl':
      $body = '<div>' . filter_xss_admin($body) . '</div>';
      break;
  }
  $form['preview_subject'] = array(
    '#markup' => '<h4><u>' . $subject . "</u></h4><br />",
  );
  $form['preview_body'] = array(
    '#markup' => $body,
  );
  $form['preview_mode'] = array(
    '#type'          => 'select',
    '#prefix'        => '<div style="float: left; margin-right: 2em;">',
    '#suffix'        => '</div>',
    '#title'         => t('Preview mode'),
    '#default_value' => $preview_mode,
    '#options'       => array(
      'text'             => t('Text (default)'),
      'html-raw'         => t('Raw HTML'),
      'html-rendered'    => t('Rendered HTML'),
      'html-rendered-nl' => t('Rendered HTML with line breaks'),
    ),
  );
  $form['preview_mode_info'] = array(
    '#type' => 'item',
    '#description' => t("The input to drupal_mail() is HTML. Drupal's default mail system converts it to text before sending it out as an email message. Sending HTML mail is possible by installing an alternative mail system and converting the template to HTML.", array('@drupal_mail', 'drupal_mail()')),
  );
  return $form;
}

