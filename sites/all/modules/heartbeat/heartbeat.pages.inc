<?php

/**
 * @file
 *   Separate codefile for page displays
 */

/**
 * Page callback function to load an activity stream page
 *
 * @param String $stream_name
 *   Stream class name.
 * @param Integer $offset_time
 *   The Offset timestamp to fetch activity.
 * @param stdClass $account
 *   Optional user account object. If none given, global user will be used
 *   as "viewer" of the stream.
 */
function heartbeat_messages_page($stream_name, $offset_time = 0, $account = NULL) {

  // $_GET['stream_class'] is not used, it's available in uri.
  $stream_name = $stream_name;
  $page = empty($_GET['block']);

  // Get the active stream.
  $heartbeatStream = heartbeat_stream($stream_name, $page);

  // Determine view mode.
  $view_mode = $page ? $heartbeatStream->config->page_view_mode : $heartbeatStream->config->block_view_mode;

  if (!$heartbeatStream) {
  	drupal_access_denied();
  	return;
  }
  else {

    // When view a streams specific for a user (E.g. stream blocks on profile page),
    // alter the viewed person.
    if (!$page && is_numeric($account) && $account > 0 && variable_get('heartbeat_show_user_profile_messages_' . $stream_name, 0)) {
      $heartbeatStream->setViewed(user_load($account));
    }
    // For blocks calling this page in general.
    elseif (isset($_GET['uid']) && is_numeric($_GET['uid']) && $_GET['uid'] > 0) {
      $heartbeatStream->setViewed(user_load($_GET['uid']));
    }

    // If OG related messages are excluded.
    if (!empty($heartbeatStream->config->settings['exclude_og'])) {
      $heartbeatStream->excludeOg(TRUE);
    }

    // Set the offset time of the pager.
    if ($offset_time > 0) {
      $heartbeatStream->setOffsetTime($offset_time);
    }
    elseif (!empty($_GET['offset_time'])) {
      $heartbeatStream->setOffsetTime($_GET['offset_time']);
    }

    // Build the stream output.
    heartbeat_stream_build($heartbeatStream);

    // Catch and display errors.
    if ($heartbeatStream->hasErrors()) {
      if (function_exists('dsm')) {
        dsm($heartbeatStream->getErrors(), $heartbeatStream->name);
      }
      else {
        drupal_set_message(implode('<br />', $heartbeatStream->getErrors()));
      }
    }

    $build = heartbeat_stream_view($heartbeatStream, $view_mode);

  }

  // Pass the content on to the theme layer.
  $content = array();
  $content['#theme'] = 'heartbeat_list';
  $content['#stream'] = $heartbeatStream;
  $content['#content'] = $build;

  return $content;

}

/**
 * JavaScript callback to load older messages.
 */
function heartbeat_activity_older() {

  // Stream name and offset time are required for fetching older messages.
  // @TODO Check if this is the best way to handle these requests.
  if (empty($_GET['stream_class']) || empty($_GET['offset_time']) || !$_GET['ajax']){
    return drupal_access_denied();
  }

  // Messages have to loaded by ajax if the url contains an offset
  // variable AND a post variable ajax is defined.
  $page = empty($_GET['block']);
  $stream_name = $_GET['stream_name'];
  $stream_class = $_GET['stream_class'];
  $uid = $_GET['uid'];
  $offset_time = $_GET['offset_time'];

  $account = user_load($uid);

  if ($heartbeatStream = heartbeat_stream($stream_class, $page, $account)) {

    // Changes at runtime.
    $heartbeatStream->setOffsetTime($offset_time);
    $heartbeatStream->setIsPage($page);

    heartbeat_stream_build($heartbeatStream);
    if ($heartbeatStream->hasErrors()) {
      if (function_exists('dsm')) {
        dsm($heartbeatStream->getErrors(), $heartbeatStream->name);
      }
      else {
        drupal_set_message(implode('<br />', $heartbeatStream->getErrors()));
      }
    }

    $build = heartbeat_stream_view($heartbeatStream);
  }
  else {
    $build = t('You don\'t have access to this stream.');
  }

  return drupal_json_output(array('status' => TRUE, 'data' => drupal_render($build)));

}

/**
 * Page callback for one activity message.
 */
function heartbeat_message_activity($heartbeatActivity) {

  // Set the page title.
  $title = '';
  if ($heartbeatActivity->actor->uid) {
    $title = t('Activity of @username', array('@username' => entity_label('user', $heartbeatActivity->actor)));
  }
  drupal_set_title($title);

  $heartbeatStream = heartbeat_stream('singleactivity', 1);

  $content = array();

  // Configuration at runtime.
  if ($heartbeatStream) {
    $heartbeatStream->setLatestActivityId($heartbeatActivity->uaid);
    heartbeat_stream_build($heartbeatStream);

    $content['#theme'] = 'heartbeat_list';
    $content['#stream'] = $heartbeatStream;
    $content['#content'] = heartbeat_stream_view($heartbeatStream);
  }
  else {
    $content['error'] = array('#markup' => t('You are not allowed to see this message.'));
  }

  return $content;

}

/**
 * Callback to poll for newer messages.
 * Each stream is displayed within a context.
 */
function heartbeat_activity_poll() {

  // if no stream is defined or the user does not have access
  if (empty($_GET['stream_class']) || !user_access('view heartbeat messages')) {
    return drupal_json_output(array('status' => FALSE, 'data' => '', 'error' => t('No access')));
  }

  $page = empty($_GET['block']) || $_GET['block'] == 'false';
  $heartbeatStream = heartbeat_stream($_GET['stream_class'], TRUE);
  $view_mode = $page ? $heartbeatStream->config->page_view_mode : $heartbeatStream->config->block_view_mode;

  // Configuration at runtime.
  $heartbeatStream->setLatestActivityId($_GET['latestUaid']);
  $heartbeatStream->setAjax((isset($_GET['ajax']) && $_GET['ajax']));

  if (isset($_GET['language'])) {
    // change the language with the post value.
    $heartbeatStream->setLanguage($_GET['language']);
  }

  heartbeat_stream_build($heartbeatStream);
  $build = heartbeat_stream_view($heartbeatStream, $view_mode);

  $json = array(
    'status' => TRUE,
    'data' => drupal_render($build),
    'count' => $heartbeatStream->numberOfMessages(),
    'stream' => $_GET['stream_name'],
    'time_updates' => array()
  );

  // Get the times to update to the current time.
  if (!empty($_REQUEST['uaids'])) {
    $uaids = explode(',', $_REQUEST['uaids']);
    $result = db_query("SELECT uaid, timestamp FROM {heartbeat_activity} WHERE uaid IN(:placeholders) ", array(':placeholders' => $uaids));
    foreach ($result as $row) {
      $json['time_updates'][$row->uaid] = _theme_time_ago($row->timestamp);
    }
  }

  drupal_json_output($json);
  return;

}

/**
 * CTools modal wrapper function to delete activity.
 */
function heartbeat_activity_modal_delete($js, $heartbeatActivity) {

  if (empty($heartbeatActivity)) {
    return drupal_not_found();
  }

  $uaid = $heartbeatActivity->uaid;

  if ($js) {
    ctools_include('modal');
    ctools_include('ajax');
  }

  $form_state = array(
    'title' => t('Are you sure you want to delete this message?'),
    'ajax' => TRUE,
    'uaid' => $uaid,
  );

  // Fall back if $js is not set.
  if (!$js) {

    return drupal_get_form('heartbeat_delete_log_confirm', $uaid);

  }
  else {

    // Send this all off to our form. This is like drupal_get_form only wizardy.
    $output = ctools_modal_form_wrapper('heartbeat_delete_log_confirm', $form_state);

    if (!empty($form_state['executed'])) {
      // We'll just overwrite the form output if it was successful.
      $output = array();
      $output[] = ctools_modal_command_dismiss();
      $output[] = ajax_command_invoke('.heartbeat-activity-' . $uaid, 'heartbeatRemoveElement', array($uaid, t('Activity deleted.')));
    }

    print ajax_render($output);
    exit;
  }

}

/**
 * Menu callback: confirm deleting of logs.
 */
function heartbeat_delete_log_confirm($form, & $form_state, $uaid = NULL) {

  if (isset($uaid)) {
    $form_state['uaid'] = $uaid;
  }

  $path = isset($_GET['destination']) ? $_GET['destination'] : (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER']: '<front>');

  // Prepare the form.
  $form = array(
    'redirect_path' => array(
      '#type' => 'hidden',
      '#value' => $path,
    ),
  );
  $form_state['redirect'] = $path;

  // Bail out if this is accessed unfortenate.
  if (!isset($form_state['uaid'])) {
    drupal_access_denied();
  }

  $form['#uaid'] = $form_state['uaid'];
  if (!empty($form_state['uaid'])) {
    $form['#uaid'] = $form_state['uaid'];
  }

  $output = confirm_form($form,
    t('Are you sure you want to delete this message?'),
    $path,
    t('This action cannot be undone.'),
    t('Delete'),
    t('Cancel'));

  return $output;

}

/**
 * Handler for wipe confirmation
 */
function heartbeat_delete_log_confirm_submit($form, &$form_state) {

  // Make sure there is a redirect instead of delivering a page not found.
  if (!isset($form_state['redirect'])) {
    $form_state['redirect'] = '<front>';
  }

  // Set the flag so the form knows it's been executed.
  $form_state['executed'] = TRUE;
  //$form_state['complete'] = TRUE;

  if (!empty($form_state['uaid'])) {

    // Delete the activity message.
    heartbeat_activity_delete(array($form_state['uaid']));

  }

}

/**
 * ahah callback
 */
function heartbeat_activity_ahah($element) {

  $form_state = array('storage' => NULL, 'submitted' => FALSE);
  $form_build_id = $_POST['form_build_id'];
  $form = form_get_cache($form_build_id, $form_state);
  $args = $form['#parameters'];
  $form_id = array_shift($args);
  $form['#post'] = $_POST;
  $form['#redirect'] = FALSE;
  $form['#programmed'] = FALSE;
  $form_state['post'] = $_POST;
  drupal_process_form($form_id, $form, $form_state);
  $form = drupal_rebuild_form($form_id, $form_state, $args, $form_build_id);
  $javascript = drupal_add_js(NULL, NULL, 'header');
  $_SESSION['messages'] = array();

  if (isset($form['hb_fields'][$element])) {
    $ahah_form = $form['hb_fields'][$element];
  }
  elseif(isset($form['fs_settings'][$element])) {
    $ahah_form = $form['fs_settings'][$element];
  }

  if ($ahah_form) {

    //drupal_set_message(_heartbeat_activity_get_time($form_state['values'][$element]));
    $ahah_form['#description'] = '<div class="status">' . t('Currently set ') . _heartbeat_activity_get_time($form_state['values'][$element]) . '</div>';

    unset($ahah_form['#prefix'], $ahah_form['#suffix']); // Prevent duplicate wrappers.
    drupal_json_output(array(
      'status'   => TRUE,
      'data'     => theme('status_messages') . drupal_render($ahah_form),
      'settings' => call_user_func_array('array_merge_recursive', $javascript['setting']),
    ));
  }
  else {
    drupal_json_output(array(
      'status'   => FALSE,
      'data'     => t('Element not found: @element', array('@element' => $element)),
      'settings' => call_user_func_array('array_merge_recursive', $javascript['setting']),
    ));
  }
  exit;
}