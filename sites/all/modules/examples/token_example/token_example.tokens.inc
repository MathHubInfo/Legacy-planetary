<?php

/**
 * @file
 * Token callbacks for the token_example module.
 */

/**
 * Implements hook_token_info().
 */
function token_example_token_info() {
  // Add two different token types. The first is the generic text format. The
  // second is the user's default text format, which is itself a 'format' token
  // type so it can be used directly.
  $info['types']['format'] = array(
    'name' => t('Text formats'),
    'description' => t('Tokens related to text formats.'),
    'needs-data' => 'format',
  );
  $info['types']['default-format'] = array(
    'name' => t('Default text format'),
    'description' => t("Tokens related to the currently logged in user's default text format."),
    'type' => 'format',
  );

  // Tokens for the text format token type.
  $info['tokens']['format']['id'] = array(
    'name' => t('ID'),
    'description' => t("The unique ID of the text format."),
  );
  $info['tokens']['format']['name'] = array(
    'name' => t('Name'),
    'description' => t("The name of the text format."),
  );

  // Node tokens.
  $info['tokens']['node']['body-format'] = array(
    'name' => t('Body text format'),
    'description' => t("The name of the text format used on the node's body field."),
    'type' => 'format',
  );

  // Comment tokens.
  if (module_exists('comment')) {
    $info['tokens']['comment']['body-format'] = array(
      'name' => t('Body text format'),
      'description' => t("The name of the text format used on the comment's body field."),
      'type' => 'format',
    );
  }

  return $info;
}

/**
 * Implements hook_tokens().
 */
function token_example_tokens($type, $tokens, array $data = array(), array $options = array()) {
  $replacements = array();
  $sanitize = !empty($options['sanitize']);

  // Text format tokens.
  if ($type == 'format' && !empty($data['format'])) {
    $format = $data['format'];

    foreach ($tokens as $name => $original) {
      switch ($name) {
        case 'id':
          // Since {filter_format}.format is an integer and not user-entered
          // text, it does not need to ever be sanitized.
          $replacements[$original] = $format->format;
          break;
        case 'name':
          // Since the format name is user-entered text, santize when requested.
          $replacements[$original] = $sanitize ? filter_xss($format->name) : $format->name;
          break;
      }
    }
  }

  // Default format tokens.
  if ($type == 'default-format') {
    $default_id = filter_default_format();
    $default_format = filter_format_load($default_id);
    $replacements += token_generate('format', $tokens, array('format' => $default_format), $options);
  }

  // Node tokens.
  if ($type == 'node' && !empty($data['node'])) {
    $node = $data['node'];

    foreach ($tokens as $name => $original) {
      switch ($name) {
        case 'body-format':
          $format = filter_format_load($node->body[LANGUAGE_NONE][0]['format']);
          $replacements[$original] = $sanitize ? filter_xss($format->name) : $format->name;
          break;
      }
    }

    // Chained token relationships.
    if ($format_tokens = token_find_with_prefix($tokens, 'body-format')) {
      $body_format = filter_format_load($node->body[LANGUAGE_NONE][0]['format']);
      $replacements += token_generate('format', $format_tokens, array('format' => $body_format), $options);
    }
  }

  // Comment tokens.
  if ($type == 'comment' && !empty($data['comment'])) {
    $comment = $data['comment'];

    foreach ($tokens as $name => $original) {
      switch ($name) {
        case 'body-format':
          $format = filter_format_load($comment->comment_body[LANGUAGE_NONE][0]['format']);
          $replacements[$original] = $sanitize ? filter_xss($format->name) : $format->name;
          break;
      }
    }

    // Chained token relationships.
    if ($format_tokens = token_find_with_prefix($tokens, 'body-format')) {
      $body_format = filter_format_load($comment->comment_body[LANGUAGE_NONE][0]['format']);
      $replacements += token_generate('format', $format_tokens, array('format' => $body_format), $options);
    }
  }

  return $replacements;
}
