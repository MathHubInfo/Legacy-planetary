<?php

/**
 * @file
 * Token callbacks for the subscriptions module.
 */

/**
 * Implements hook_token_info().
 *
 * @return array
 */
function subscriptions_token_info() {
  $variables = array('%TYPE' => 'TYPE', '!TYPE' => 'TYPE');
  $info = array(
    'types' => array(
      'subs' => array(
        'name' => t('Subscriptions information'),
        'description' => t('Tokens related to the %Subscriptions module.', array('%Subscriptions' => 'Subscriptions')),
        'needs-data' => 'subs',
      ),
      'subs_item' => array(
        'name' => t('Subscriptions item'),
        'description' => t('Tokens related to the %Subscriptions module for building a digest.', array('%Subscriptions' => 'Subscriptions')),
        'needs-data' => 'subs_item',
      ),
    ),
    'tokens' => array(
      'subs' => array(
        'type' => array(
          'name' => t('Type'),
          'description' => t('The type of the subscription.'),
        ),
        'manage-url' => array(
          'name' => t('Manage URL'),
          'description' => t("The URL of the user's @Subscriptions page (requires log-in).", array('@Subscriptions' => t('Subscriptions'))),
          'type' => 'url',
        ),
        'unsubscribe-url' => array(
          'name' => t('Unsubscribe URL'),
          'description' => t('The URL for immediate canceling of the subscription that caused this notification.'),
          'type' => 'url',
        ),
        'is-new' => array(
          'name' => t('Is new'),
          'description' => t('Whether the item is new.'),
        ),
        'is-updated' => array(
          'name' => t('Is updated'),
          'description' => t('Whether the item is updated (or new and subsequently updated).'),
        ),
        'is-old' => array(
          'name' => t('Is old'),
          'description' => t('Whether the item is not new nor updated.'),
        ),
        'is-published' => array(
          'name' => t('Is published'),
          'description' => t('Whether the item is published.'),
        ),
        'has-distinct-summary' => array(
          'name' => t('Has distinct summary'),
          'description' => t('Whether the item has a non-empty summary that is distinct from the body.'),
        ),
        'forum' => array(
          'name' => t('Forum'),
          'description' => t('The forum (taxonomy term), if the item is in a forum.'),
          'type' => 'term',
        ),
        'comments' => array(
          'name' => t('Comments'),
          'description' => t('The array of formatted comments that have not been sent yet (for inclusion in a node).'),
          'type' => 'array',
        ),
        'items' => array(
          'name' => t('Digest Items'),
          'description' => t('The array of formatted items to send to one recipient (for building a digest).'),
          'type' => 'list<subs_item>',
        ),
        'subs-module' => array(
          'name' => t('Subscription module'),
          'description' => t('The module of the item that triggered the notification.'),
        ),
        'subs-field' => array(
          'name' => t('Subscription field'),
          'description' => t('The field (property) of the item that triggered the notification.'),
        ),
        'subs-value' => array(
          'name' => t('Subscription value'),
          'description' => t('The value of the field of the item that triggered the notification.'),
        ),
        'files' => array(
          'name' => t('Files'),
          'description' => t('The array of attached files in the specified field.'),
          'type' => 'list<file>',
          'dynamic' => TRUE,
        ),
        'terms' => array(
           'name' => t('Terms'),
           'description' => t('The array of taxonomy terms in the specified field.'),
           'type' => 'list<term>',
           'dynamic' => TRUE,
         ),
       ),
      'subs_item' => array(
        'as-TYPE' => array(
          'name' => t('Cast to %TYPE', $variables),
          'description' => t("Makes the !TYPE  tokens available for use (e.g. '!example').", $variables + array('!example' => 'as-node:?')),
        ),
        'is-TYPE' => array(
          'name' => t('Is %TYPE', $variables),
          'description' => t("Whether the item is of type !TYPE (e.g. '!example').", $variables + array('!example' => 'is-node')),
        ),
        'formatted' => array(
          'name' => t('Formatted'),
          'description' => t("Formatted string representation of the item, processed by its own template in the !DIGEST context.", $variables + array('!DIGEST' => 'DIGEST')),
        ),
        'subs' => array(
          'name' => t('Item information'),
          'description' => t('The Subscriptions information of the digest item.'),
          'type' => 'subs',
        ),
      ),
    ),
  );
  return $info;
}

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
function subscriptions_tokens($type, array $tokens, array $data = array(), array $options = array()) {
  global $user;

  $url_options = array('absolute' => TRUE);
  if (isset($options['language'])) {
    $url_options['language'] = $options['language'];
    $language_code = $options['language']->language;
  }
  else {
    $language_code = NULL;
  }
  $sanitize = !empty($options['sanitize']);

  $replacements = array();
  if ($type == 'subs' && isset($data['subs'])) {
    foreach ($tokens as $name => $original) {
      switch ($name) {
        case 'type':
          $replacements[$original] = $data['subs']['type'];
          break;
        case 'manage-url':
          $replacements[$original] = url('user/' . $user->uid . '/subscriptions', $url_options);
          break;
        case 'unsubscribe-url':
          $replacements[$original] = url($data['subs']['unsubscribe_path'], $url_options);
          break;
        case 'subs-module':
          $replacements[$original] = $data['subs']['module'];
          break;
        case 'subs-field':
          $replacements[$original] = $data['subs']['field'];
          break;
        case 'subs-value':
          $replacements[$original] = $data['subs']['value'];
          break;
        case 'forum':
          if (isset($data['node']['forum_tid'])) {
            $replacements[$original] = render(taxonomy_term_view(taxonomy_term_load($data['node']['forum_tid']), 'full', $language_code));
          }
          break;
      }
    }

    // Chained token relationships.
    if ($url_tokens = token_find_with_prefix($tokens, 'manage-url')) {
      $replacements += token_generate('url', $url_tokens, array('path' => 'user/' . $user->uid . '/subscriptions'), $options);
    }
    if ($url_tokens = token_find_with_prefix($tokens, 'unsubscribe-url')) {
      $replacements += token_generate('url', $url_tokens, array('path' => $data['subs']['unsubscribe_path']), $options);
    }
    if (isset($data['node']->forum_tid) && ($forum_tokens = token_find_with_prefix($tokens, 'forum'))) {
      $replacements += token_generate('term', $forum_tokens, array('term' => taxonomy_term_load($data['node']->forum_tid)), $options);
    }
    if (isset($data['subs']['items']) && ($items_tokens = token_find_with_prefix($tokens, 'items'))) {
      $replacements += token_generate('list<subs_item>', $items_tokens, array('list<subs_item>' => $data['subs']['items']), $options);
    }
  }

  // subs_item tokens.
  if ($type == 'subs_item' && isset($data['subs_item'])) {
    foreach ($tokens as $name => $original) {
      if ($name == ':' || $name == 'formatted') {
        // Plain [subs:item:?] token: return the formatted item.
        $replacements[$original] = $data['subs_item']['subs']['formatted_item'];
      }
      elseif (($subs_tokens = token_find_with_prefix($tokens, 'subs')) && !empty($data['subs_item']['subs']) && is_array($data['subs_item']['subs'])) {
        // Return the Subscriptions information of the item.
        $replacements += token_generate('subs', $subs_tokens, $data['subs_item'], $options);
      }
      elseif (preg_match('/is-([a-z_]*)/', $name, $match) && !in_array($xtype = $match[1], array('new', 'updated', 'old', 'published'))) {
        // Type query, like 'is-node': verify directly.
        $replacements[$original] = !empty($data['subs_item'][$xtype]) && is_object($data['subs_item'][$xtype]);
      }
      elseif (preg_match('/as-([a-z_]*)/', $name, $match)) {
        $xtype = $match[1];
        if (($xtype_tokens = token_find_with_prefix($tokens, "as-$xtype")) && !empty($data['subs_item'][$xtype]) && is_object($data['subs_item'][$xtype])) {
          // Cast, like 'as-node': pass on as the detected type.
          $replacements += token_generate($xtype, $xtype_tokens, $data['subs_item'], $options);
        }
      }
      else {
      }
    }
  }

  // List<TYPE> tokens.
  // We've tried to contribute this code to Token module, see
  // http://drupal.org/node/1195874#comment-5070144
  if (preg_match('/list<([a-z_]*)>/', $type, $match) && !empty($data[$type]) && is_array($data[$type])) {
    $array_type = $type;
    $element_type = $match[1];
    $array = $data[$array_type];

    $sort = isset($options['array sort']) ? $options['array sort'] : TRUE;
    $keys = element_children($array, $sort);

    foreach ($tokens as $name => $original) {
      if ($name == ':') {
        // Plain [list<>] token.
        switch ($element_type) {
          case 'term':
            foreach ($array as $term) {
              $term_names[] = $sanitize ? check_plain($term->name) : $term->name;
            }
            $replacements[$original] = implode(', ', $term_names);
            break;
        }
        continue;
      }

      switch ($name) {
        case 'first':
          $value = $array[$keys[0]];
          $value = is_array($value) ? render($value) : (string) $value;
          $replacements[$original] = $sanitize ? check_plain($value) : $value;
          break;
        case 'last':
          $value = $array[$keys[count($keys) - 1]];
          $value = is_array($value) ? render($value) : (string) $value;
          $replacements[$original] = $sanitize ? check_plain($value) : $value;
          break;
        case 'count':
          $replacements[$original] = count($keys);
          break;
        case 'keys':
          $replacements[$original] = token_render_array($keys, $options);
          break;
        case 'reversed':
          $reversed = array_reverse($array, TRUE);
          $replacements[$original] = token_render_array($reversed, $options);
          break;
        case 'join':
          $replacements[$original] = token_render_array($array, array('join' => '') + $options);
          break;
      }
    }

    // [list<>:key:*] dynamic tokens.
    if (($value_tokens = token_find_with_prefix($tokens, 'key')) ||
        ($value_tokens = token_find_with_prefix($tokens, 'value'))) {
      $tokss = array();
      foreach ($value_tokens as $key => $original) {
        $k = strtok($key, ':');
        $tokss[$k][($k == $key ? ':' : substr($key, strlen($k) + 1))] = $original;
      }
      foreach ($tokss as $key => $toks) {
        if ($key[0] !== '#' && isset($array[$key])) {
          $replacements += token_generate($element_type, $toks, array($element_type => $array[$key]), $options);
        }
      }
    }

    // [list<>:index:*] dynamic tokens.
    if ($index_tokens = token_find_with_prefix($tokens, 'index')) {
      $tokss = array();
      foreach ($index_tokens as $index => $original) {
        $i = strtok($index, ':');
        $tokss[$i][substr($index, strlen($i) + 1)] = $original;
      }
      $array_keys = array_keys($array);
      foreach ($tokss as $index => $toks) {
        if ($index[0] !== '#' && isset($array[$array_keys[$index]])) {
          $replacements += token_generate($element_type, $toks, array($element_type => $array[$array_keys[$index]]), $options);
        }
      }
    }

    // [list<>:first:*] chained tokens.
    if ($first_tokens = token_find_with_prefix($tokens, 'first')) {
      $replacements += token_generate($element_type, $first_tokens, array($element_type => $array[$keys[0]]), $options);
    }

    // [list<>:last:*] chained tokens.
    if ($last_tokens = token_find_with_prefix($tokens, 'last')) {
      $replacements += token_generate($element_type, $last_tokens, array($element_type => $array[count($keys) - 1]), $options);
    }

    // [list<>:join:?] dynamic tokens.
    if ($join_tokens = token_find_with_prefix($tokens, 'join')) {
      $formatted = array();
      foreach ($array as $item) {
        $formatted[] = (is_string($item) ? $item : current(token_generate($element_type, array(':'), array($element_type => $item), array('sanitize' => FALSE) + $options)));
      }
      foreach ($join_tokens as $join => $original) {
        $replacements[$original] = token_render_array($formatted, array('join' => $join) + $options);
      }
    }

    // [list<>:keys:*] chained tokens.
    if ($key_tokens = token_find_with_prefix($tokens, 'keys')) {
      $replacements += token_generate('array', $key_tokens, array('array' => $keys), $options);
    }

    // [list<>:reversed:*] chained tokens.
    if ($reversed_tokens = token_find_with_prefix($tokens, 'reversed')) {
      $reversed = array_reverse($array, TRUE);
      $replacements += token_generate($array_type, $reversed_tokens, array($array_type => $reversed), $options);
    }
  }

  return $replacements;
}

/**
 * Implements hook_token_info_alter().
 *
 * @param array $data
 */
function subscriptions_token_info_alter(array &$data) {
  $massage_tokens = &drupal_static('subscriptions_mail_massage_tokens');

  if (empty($massage_tokens)) {
    // Do nothing if we're not on a Mail Editor page.
    return;
  }

  //dpm($data, "BEF subscriptions_content_token_info_alter");
  // Remove some types and tokens that are not applicable for
  // Subscriptions notifications.
  unset($data['types']['current-page']);
  unset($data['types']['default-format']);
  unset($data['types']['random']);
  unset($data['tokens']['current-user']['ip-address']);
  unset($data['site']['current-user']);

  // Tune the labeling and explanations for our use.
  $data['types']['current-user']['name'] = t('Recipient user');
  $data['types']['current-user']['description'] = t('Tokens related to the user who receives the notification.');
  $data['types']['user']['name'] = t('Sender user');
  $data['types']['user']['description'] = t('Tokens related to the user who created the content.');

  // Note: Adding tokens to existing types doesn't work here.

  // Add list<TYPE> types.
  $list_types = array();
  foreach ($data['tokens'] as $group => $tokens) {
    foreach ($tokens as $token) {
      if (isset($token['type']) && preg_match('/list<([a-z_]*)>/', $token['type'], $match)) {
        $list_types[$match[1]] = $match[0];
      }
    }
  }
  foreach ($list_types as $type => $list) {
    $data['tokens'][$list] = $data['tokens']['array'];
    $data['tokens'][$list]['first']['type'] = $type;
    $data['tokens'][$list]['last']['type'] = $type;
    $data['tokens'][$list]['reversed']['type'] = $list;
    $data['tokens'][$list]['key'] = array(
      'type' => $type,
      'name' => t('Value by key'),
      'description' => t('The specific element of the array, indexed by the keys/IDs in %keys.', array('%keys' => 'keys')),
      'dynamic' => TRUE,
    );
    $data['tokens'][$list]['index'] = array(
      'type' => $type,
      'name' => t('Value by index'),
      'description' => t('The specific element of the array, indexed by zero-based numeric index.'),
      'dynamic' => TRUE,
    );
    $type_name = $data['types'][$type]['name'];
    $data['types'][$list] = array(
      'name' => t('Array of @type', array('@type' => $type_name)),
      'description' => t('Tokens related to arrays of @type', array('@type' => $type_name)),
      'needs-data' => $list,
    );
    unset($data['tokens'][$list]['value']);
  }

  //dpm($data, "AFT subscriptions_content_token_info_alter");
}
