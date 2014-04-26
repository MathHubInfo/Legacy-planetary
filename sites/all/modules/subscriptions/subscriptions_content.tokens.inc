<?php

/**
 * @file
 * Token callbacks for the subscriptions_content module.
 */

/**
 * Implements hook_tokens().
 *
 * @param string $type
 * @param array $tokens
 * @param array $data
 * @param array $options
 *
 * @return array
 */
function subscriptions_content_tokens($type, array $tokens, array $data = array(), array $options = array()) {
  //dpm($tokens, "subscriptions_content_tokens($type) - tokens");
  //dpm($data, "subscriptions_content_tokens($type) - data");
  $sanitize = !empty($options['sanitize']);

  $replacements = array();

  if ($type == 'node' && !empty($data['node'])) {
    $node = $data['node'];

    foreach ($tokens as $name => $original) {
      switch ($name) {
        // Simple key values on the node.
        case 'node-html':
          $replacements[$original] = $node->nid;
          break;
      }
    }
  }

  if ($type == 'subs' && !empty($data['comment'])) {
    $comment = $data['comment'];
    foreach ($tokens as $name => $original) {
      switch ($name) {
        case 'is-new':
          $replacements[$original] = (int) !empty($comment->_subscriptions_is_new);
          break;
        case 'is-updated':
          $replacements[$original] = (int) empty($comment->_subscriptions_is_new);
          break;
        case 'is-old':
          $replacements[$original] = 0;
          break;
        case 'is-published':
          $replacements[$original] = (int) ($comment->status == COMMENT_PUBLISHED);
          break;
        case 'has-distinct-summary':
          $replacements[$original] = 0;
          break;
      }
    }

    // files:field_FILE
    if (user_access('view uploaded files')) {
      $replacements += _subscriptions_content_tokens_field_array($type, $tokens, $data, $options, 'comment', 'files', 'list<file>');
    }

    // terms:field_TERM
    $replacements += _subscriptions_content_tokens_field_array($type, $tokens, $data, $options, 'comment', 'terms', 'list<term>');
  }
  elseif ($type == 'subs' && !empty($data['node'])) {
    $node = $data['node'];
    foreach ($tokens as $name => $original) {
      switch ($name) {
        case 'is-new':
          $replacements[$original] = (int) !empty($node->_subscriptions_is_new);
          break;
        case 'is-updated':
          $replacements[$original] = (int) !empty($node->_subscriptions_is_updated);
          break;
        case 'is-old':
          $replacements[$original] = (int) (empty($node->_subscriptions_is_new) && empty($node->_subscriptions_is_updated));
          break;
        case 'is-published':
          $replacements[$original] = $node->status;
          break;
        case 'has-distinct-summary':
          $repls = token_generate('node', array('summary' => '[node:summary]', 'body' => '[node:body]'), $data, $options);
          $replacements[$original] = (int) (!empty($repls['[node:summary]']) && $repls['[node:summary]'] != $repls['[node:body]']);
          break;
      }
    }

    if (($comments_tokens = token_find_with_prefix($tokens, 'comments')) && !empty($node->_subscriptions_comments)) {
      if (empty($node->_subscriptions_comments_rendered)) {
        foreach ($node->_subscriptions_comments as $comment) {
          $node->_subscriptions_comments_rendered[] = mail_edit_format($data['template']['subscriptions_comment_body'], $data + array('comment' => $comment), $options);
        }
      }
      $replacements += token_generate('array', $comments_tokens, array(
        'array' => (isset($node->_subscriptions_comments_rendered) ? $node->_subscriptions_comments_rendered : array()),
      ), array('sanitize' => FALSE) + $options);
    }

    // files:field_FILE
    if (user_access('view uploaded files')) {
      $replacements += _subscriptions_content_tokens_field_array($type, $tokens, $data, $options, 'node', 'files', 'list<file>');
    }

    // terms:field_TERM
    $replacements += _subscriptions_content_tokens_field_array($type, $tokens, $data, $options, 'node', 'terms', 'list<term>');
  }

  return $replacements;
}

/**
 * Helper function to resolve a field which is a files array.
 *
 * @param $type
 * @param $tokens
 * @param array $data
 * @param array $options
 * @param $data_type
 * @param $token
 * @param $token_type
 *
 * @return array
 */
function _subscriptions_content_tokens_field_array($type, $tokens, array $data, array $options, $data_type, $token, $token_type) {
  $replacements = array();

  if ($field_tokens = token_find_with_prefix($tokens, $token)) {

    $url_options = array('absolute' => TRUE);
    if (isset($options['language'])) {
      $url_options['language'] = $options['language'];
      $language_code = $options['language']->language;
    }
    else {
      $language_code = NULL;
    }

    $tokenss = array();
    foreach ($field_tokens as $field_token => $original) {
      $field_name = strtok($field_token, ':');
      $tokenss[$field_name][substr($field_token, strlen($field_name) + 1)] = $original;
    }
    foreach ($tokenss as $field_name => $tokens) {
      if ($field_items = field_get_items($data_type, $data[$data_type], $field_name, $language_code)) {
        $objs = array();
        switch ($token) {
          case 'terms':
            // Terms are stored as tids only.
            $tids = array();
            foreach ($field_items as $term) {
              $tids[] = $term['tid'];
            }
            $objs = taxonomy_term_load_multiple($tids);
            break;
          default:
            foreach ($field_items as $key => $item) {
              $objs[$key] = (object) $item;
            }
        }
        if (!empty($objs)) {
          $replacements += token_generate($token_type, $tokens, array($token_type => $objs), $options);
        }
      }
    }
  }
  return $replacements;
}

