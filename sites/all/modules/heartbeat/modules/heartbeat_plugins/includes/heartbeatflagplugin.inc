<?php
/**
 * @file
 * Heartbeat Flag Base Plugin and some required utility functions.
 */

 /**
 * CTools ajax callback to show the users who flagged the content.
 */
function heartbeat_plugins_modal_flagging_users($js, $heartbeatActivity) {

  $uaid = $heartbeatActivity->uaid;
  $result = db_query("SELECT u.name, files.uri, f.uid FROM {file_managed} files INNER JOIN {users} u ON u.picture = files.fid INNER JOIN {flag_content} f ON f.uid = u.uid WHERE content_id = :uaid AND content_type = 'heartbeat_activity' ", array(':uaid' => $uaid));

  $output = '';
  $list = array();
  $use_ds = module_exists('ds');
  foreach ($result as $account) {
  	if ($use_ds) {
  	  $list[] = drupal_render(user_view($account, 'heartbeat_user'));
  	}
  	else {
  	  $list[] = theme('heartbeat_flagging', array('heartbeatactivity' => $heartbeatActivity, 'uri' => $account->uri, 'name' => $account->name, 'uid' => $account->uid));
  	}
  }
  $output = theme('item_list', array('items' => $list));

  // Fall back if $js is not set.
  if (!$js) {

    return $output;

  }
  else {

    ctools_include('ajax');
    $commands = array();
    $commands[] = ajax_command_html('#modal-content', $output);
    print ajax_render($commands);
    exit;

  }

}

/**
 * HeartbeatFlagPlugin abstract class.
 */
class HeartbeatFlagPlugin extends HeartbeatBasePlugin {

  /**
   * hasFlagDefinitions().
   * Defines if the plugin hasFlagDefinitions.
   */
  public function hasFlagDefinitions() {
    return TRUE;
  }

  /**
   * flagDefinitions().
   * Defines the flag definition.
   */
  public function flagDefinitions() {
    return array();
  }

  /**
   * hasDefaultFlags().
   * Defines if the plugin has default flags.
   */
  public function hasDefaultFlags() {
    return TRUE;
  }

  /**
   * flagDefaults().
   * Defines the default flags.
   */
  public function flagDefaults() {
    return array();
  }

  /**
   * removeFlagContent().
   */
  public function removeFlagContent($activityId) {
    db_delete('flag_content')
      ->condition('content_type', 'heartbeat_activity')
      ->condition('content_id', $activityId)
      ->execute();
  }

  /**
   * activityRemoved()
   */
  public function activityRemoved($uaids, $all) {

    foreach (array('flag_content', 'flag_counts') as $table) {
      $query = db_delete($table);
      $query->condition('content_type', 'heartbeat_activity');

      if (!empty($uaids) && $all == FALSE) {
        $query->condition('content_id', $uaids, 'IN');
      }

      $query->execute();
    }
  }

}