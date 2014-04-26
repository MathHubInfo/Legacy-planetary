<?php

/**
 * @file
 * Subscriptions Content module (admin functions).
 */


/**
 * Implements hook_form_alter().
 *
 * Adds the Taxonomy Settings part to SUBSCRIPTIONS_CONFIG_PATH.
 *
 * @param array $form
 * @param array $form_state
 *
 * @ingroup hooks
 * @ingroup form
 */
function _subscriptions_taxonomy_form_subscriptions_settings_form_alter(array &$form, array &$form_state) {
  $tr = 't';

  $form['taxonomy'] = array(
    '#type' => 'fieldset',
    '#title' => t('Taxonomy settings'),
    '#collapsible' => TRUE,
    '#weight' => -8,
  );

  $vocabularies = taxonomy_get_vocabularies();
  $select[0] = '<' . t('none') . '>';
  foreach ($vocabularies as $vocabulary) {
    $select[$vocabulary->vid] = check_plain($vocabulary->name);
  }

  $form['taxonomy']['subscriptions_restricted_taxa'] = array(
    '#type'          => 'select',
    '#title'         => t('Restricted vocabularies'),
    '#default_value' => variable_get('subscriptions_restricted_taxa', array()),
    '#options'       => $select,
    '#description'   => t('Select vocabularies for which only the subscribed terms should be listed on the %Subscriptions | %Categories page.<br />This helps to reduce the size of the listing, especially for free-tagging vocabularies with large numbers of terms.', array('%Subscriptions' => t('Subscriptions'), '%Categories' => $tr('Categories'))),
    '#multiple'      => TRUE,
  );
  $form['taxonomy']['subscriptions_omitted_taxa'] = array(
    '#type'          => 'select',
    '#title'         => t('Omitted vocabularies'),
    '#default_value' => variable_get('subscriptions_omitted_taxa', array()),
    '#options'       => $select,
    '#description'   => t('Select vocabularies which should be <strong>omitted</strong> from subscriptions listings; this means the terms of those vocabularies will be unlisted, i.e. they will be removed from subscription listings.<br />The content may still be available for subscribing via different kinds of subscriptions, but subscribing by category will be unavailable for the terms in the selected vocabularies.'),
    '#multiple'      => TRUE,
  );

  // @ TODO write the code that supports this setting
  /*
  $form['taxonomy']['subscriptions_allow_vid'] = array(
    '#type' => 'checkbox',
    '#title' => t('Allow vocabularies subscription'),
    '#default_value' => variable_get('subscriptions_allow_vid', 1),
    '#description' => t('Allow users to subscribe to an entire vocabluary of terms.'),
  );
  */

}

/**
 * Build the Categories subscription form at user/UID/subscriptions/taxa.
 *
 * @param array $form
 * @param int $uid
 * @param array $vocabularies
 *   ID of a user if >0 or of a role if <0.
 *
 * @return array
 *
 * @ingroup form
 */
function _subscriptions_taxonomy_taxa_form(array $form, $uid, array $vocabularies) {
  $query = db_select('taxonomy_term_data', 't', array('fetch' => PDO::FETCH_ASSOC));
  $query->join('subscriptions', 's', (db_driver() != 'pgsql' ? 't.tid = s.value' : 'CAST(t.tid AS VARCHAR) = s.value'));
  $result = $query
    ->fields('s', array('value', 'send_interval', 'author_uid', 'send_comments', 'send_updates'))
    ->fields('t', array('tid', 'vid', 'name'))
    ->condition('s.module', 'node')
    ->condition('s.field', 'tid')
    ->condition('s.recipient_uid', $uid)
    ->addTag('taxonomy_access')
    ->orderBy('s.author_uid')
    ->execute();
  foreach ($result as $s) {
    $subscriptions[$s['vid']][$s['value']][$s['author_uid']] = $s;
    $subscriptions_terms_by_vid[$s['vid']][$s['value']] = $s;
  }
  foreach ($vocabularies as $vocab) {
    // display vocabulary name and group terms together
    $form[$vocab->vid] = array(
      '#type' => 'fieldset',
      '#title' => check_plain($vocab->name),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
    );
    $form[$vocab->vid][0] = array(
      '#tree' => TRUE,
      '#theme' => 'subscriptions_form_table',
    );
    $subscriptions_vid = (isset($subscriptions[$vocab->vid]) ? $subscriptions[$vocab->vid] : NULL);
    /** @var $vids_to_restrict array */
    $vids_to_restrict = variable_get('subscriptions_restricted_taxa', array());
    $tree = NULL;
    if (!in_array($vocab->vid, $vids_to_restrict)) {
      // @ TODO create mechanism to allow users to
      //        subscribe to all terms under this vocabulary
      $tree = taxonomy_get_tree($vocab->vid);
    }
    else {
      if (isset($subscriptions_terms_by_vid[$vocab->vid])) {
        $tree = $subscriptions_terms_by_vid[$vocab->vid];
        $form[$vocab->vid][1] = array(
          '#type' => 'item',
          '#description' => '<div>' . t('This is a restricted category group; deactivated subscriptions will be removed from the list. To subscribe to an unlisted category, go to a post in that category and subscribe from there.') . '</div>',
        );
      }
    }
    $forum_containers = NULL;
    if (module_exists('forum') && $vocab->vid == variable_get('forum_nav_vocabulary', '')) {
      $forum_containers = variable_get('forum_containers', array());
    }
    $defaults = array();
    if (isset($tree)) {
      foreach ($tree as $term) {
        if (is_array($term)) {
          $term = (object) $term;
        }
        $depth = (empty($term->depth) ? 0 : $term->depth);
        $term_name = function_exists('i18n_string') ? i18n_string('taxonomy:term:' . $term->tid . ':name', $term->name, array('langcode' => $GLOBALS['language']->language)) : $term->name;
        $title = '<span class="indenter">' . str_repeat('--&nbsp;', $depth) . '</span>' .
          l($term_name, 'taxonomy/term/' . $term->tid, array('attributes' => array('class' => 'depth-' . $depth)));
        if (!isset($subscriptions_vid[$term->tid][-1])) {
          // author-less item is missing -- add it here:
          $subscriptions_vid[$term->tid][-1] = array(
            'send_interval' => _subscriptions_get_setting('send_interval', $uid),
            'send_comments' => _subscriptions_get_setting('send_comments', $uid),
            'send_updates' => _subscriptions_get_setting('send_updates', $uid),
            'author_uid' => FALSE,
          );
        }
        // add the active subscriptions
        foreach ($subscriptions_vid[$term->tid] as $author_uid => $subscription) {
          // TODO: support multi-parent hierarchies (currently, the child is not repeated)
          subscriptions_form_helper($form[$vocab->vid][0], $defaults, $author_uid, $term->tid, $title, $subscription);
          if (isset($forum_containers) && in_array($term->tid, $forum_containers)) {
            $tids = array_keys($form[$vocab->vid][0]['checkboxes']);
            $tid = end($tids);
            $form[$vocab->vid][0]['checkboxes'][$tid][-1]['#disabled'] = TRUE;
          }
        }
      }
    }
    else {
      $form[$vocab->vid]['info']['#value'] = '<p>' . t('This is a restricted category group; only subscribed categories show up in this list.<br />To subscribe to a category in this group, go to a post in that category and subscribe from there.') . '</p>';
    }
    $form[$vocab->vid][0]['defaults'] = array(
      '#type' => 'value',
      '#value' => $defaults,
    );
    subscriptions_form_column_filter($form[$vocab->vid][0], $uid);
  }
  return $form;
}

