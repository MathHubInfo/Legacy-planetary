<?php

/**
 * @file
 *   HeartbeatActivity object
 *   Defines one heartbeat activity object.
 */

/**
 * Class defines an activity message object
 */
class HeartbeatActivity extends stdClass {

  // DB fields
  public $uaid = 0;
  public $message_id = '';
  public $uid = 0;
  public $uid_access = TRUE;
  public $uid_target = 0;
  public $nid = 0;
  public $cid = 0;
  public $nid_access = TRUE;
  public $nid_target = 0;
  public $nid_target_access = TRUE;
  public $in_group = 0;
  public $timestamp = 0;
  public $language = 'en';
  public $message = '';
  public $message_concat = '';
  public $access = HEARTBEAT_PUBLIC_TO_ALL;
  public $variables = array();
  public $attachments = array();
  public $additions = NULL;
  public $index = NULL;
  public $buttons = array();
  public $classes = '';
  // User object of the uid, being the actor of activity
  public $actor = NULL;

  // Template composite
  public $template = '';

  // Global properties on message base
  public $show_time = 0;
  public $count = 0; // count for same instance
  public $target_count = 0; // count for same instance that is merged by target
  public $show_message_times = 1;
  public $show_message_times_grouped = 1;
  public $delete_access = FALSE;
  public $actor_access = FALSE;

  // Template variables
  public $name = 'heartbeatactivity';
  public $type = 'heartbeatactivity';
  public $streamname = '';
  public $view_mode = 'full';
  public $content = array();
  //public $_vars = NULL;

  /**
   * constructor
   * @param $data Array or Object with fields that can match this object
   *   Data for the message, some are converted.
   *   It's possible to give a sql-result set as data which will
   *   adapt to a heartbeatActivity object.
   * @param $template HeartbeatMessageTemplate
   *   holds the template data.
   */
  function __construct($data, HeartbeatMessageTemplate $template) {

    //$this->_vars = new stdClass();

    $this->template = $template;

    $this->additions = new stdClass();
    $this->message_id = $this->template->message_id;

    if (is_object($data)) {
      $data = (array) $data;
    }

    if (isset($data['uaid'])) {
      $this->uaid = $data['uaid'];
    }
    if (isset($data['count'])) {
      $this->count = $data['count'];
    }
    $this->timestamp = isset($data['timestamp']) ? $data['timestamp'] : $_SERVER['REQUEST_TIME'];

    $this->set_actor($data);

    if (isset($data['uid_target'])) {
      $this->uid_target = $data['uid_target'];
    }

    if (isset($data['nid'])) {
      $this->nid = $data['nid'];
    }

    if (isset($data['nid_target'])) {
      $this->nid_target = $data['nid_target'];
    }

    if (isset($data['cid'])) {
      $this->cid = $data['cid'];
    }

    if (isset($data['in_group'])) {
      $this->in_group = $data['in_group'];
    }

    if (isset($data['variables'])) {
      $this->set_variables($data['variables']);
    }

    if (isset($data['extra']['duplicate'])) {
      $this->variables['duplicate'] = $data['extra']['duplicate'];
    }

    // Check access on the buttons and put their state onto the object
    $this->set_delete_access();

    // Add buttons. Other modules can still add or remove buttons
    // using the available entity hooks.
    $this->add_buttons();

    // Set the access for this message.
    $this->setAccess($data);

    // Build the runtime activity message.
    $this->rebuild_message();

    foreach ($data as $key => $value) {
      if (strpos($key, 'field_') === 0) {
        $this->$key = $value;
      }
    }

  }

  /**
   * Set the actor on the activity.
   */
  public function set_actor($data) {

    if (isset($data['actor'])) {

      $this->actor = $data['actor'];

    }
    elseif (!empty($data['name']) && !empty($data['created'])) {

      $this->actor = new stdClass();
      $this->actor->uid = $data['uid'];
      $this->actor->name = $data['name'];
      $this->actor->mail = $data['mail'];
      $this->actor->theme = $data['theme'];
      $this->actor->signature = $data['signature'];
      $this->actor->signature_format = $data['signature_format'];
      $this->actor->created = $data['created'];
      $this->actor->access = $data['users_access'];
      $this->actor->login = $data['login'];
      $this->actor->status = $data['status'];
      $this->actor->timezone = $data['timezone'];
      $this->actor->language = $data['language'];
      $this->actor->picture = $data['picture'];
      $this->actor->init = $data['init'];
      $this->actor->data = unserialize($data['data']);

    }
    else {

      $this->actor = user_load(isset($data['uid']) ? $data['uid'] : $GLOBALS['user']->uid);

    }

    $this->uid = $this->actor->uid;

  }

  /**
   * setAccess().
   */
  public function setAccess($raw_data) {

    // By default, we always use the logged "access".
    $this->access = HEARTBEAT_PUBLIC_TO_ALL;

    // In most cases (hopefully), the property at the  time the activity
    // occurred will be set and gets priority. This value is calculated
    // from template access, user profile privacy or custom access.
    if (isset($raw_data['access'])) {
      $this->access = (int) $raw_data['access'];
    }

    // If the actor of the message has set this type of message, inherit.
    if (isset($raw_data['access_status']) && $raw_data['access_status'] <= $this->access) {
      $this->access = (int) $raw_data['access_status'];
    }

    // If for some reason what so ever, the template restriction had been changed
    // into some lower permission than calculated, lower down the access.
    if ((int) $this->template->perms < $this->access) {
      $this->access = (int) $this->template->perms;
    }

  }

  /**
   * isPrivate().
   */
  public function isPrivate() {
    return $this->access === HEARTBEAT_PRIVATE;
  }

  /**
   * hasAccess().
   *
   * @param Object $account
   *   The User object to check access for.
   * @param HeartbeatStream $heartbeatStream
   *   Optional heartbeat stream object where the account object is the viewer.
   *
   */
  public function hasAccess($account, $heartbeatStream = NULL) {

    // Case user1 is not related to userA and userB. UserA and UserB are related.
    // user1 views site activity.
    if (isset($heartbeatStream)) {
      $account = $heartbeatStream->getViewer();
    }
    else {
      $heartbeatStream = heartbeat_stream('singleactivity');
    }

    $access_activity_profiles = user_access('access heartbeat activity profiles', $account);
    $access_profiles = user_access('access user profiles', $account);

    // Remove messages set private by site administrator
    // and remove messages set private by user profile setting.
    if ($this->isPrivate() && $account->uid != $this->actor->uid) {
      $heartbeatStream->addError('Activity message #'. $this->uaid . ' is filtered from display because it is a private message.');
      return FALSE;
    }

    // Replace user links with their name if no access.
    if ($access_activity_profiles) {

      if (!$access_profiles) {

        // TODO Think of a superb way to divide message templates into parts, bound to properties.
        // For now, let's try to keep the problem to a minimum.
        // Do some tricks to try and solve the problem of profile access from generated links.
        if (isset($this->variables['!username'])) {
          $this->message = str_replace($this->variables['!username'], $this->actor->name, $this->message);
        }
        elseif (isset($this->variables['!user'])) {
          $this->message = str_replace($this->variables['!user'], $this->actor->name, $this->message);
        }
        else {
          $link = l($this->actor->name, 'user/' . $this->actor->uid);
          $this->message = preg_replace("|$link|", $this->actor->name, $this->message);
        }

      }

    }

    return TRUE;

  }

  /*
   * Rebuild the message with given candidate variables
   */
  public function rebuild_message($concat = FALSE) {

    $template_message = ($concat ? $this->template->message_concat : $this->template->message);

    //$this->message = strtr($template_message, $this->variables);
    $this->message = t($template_message, $this->variables);

    return $this->message;

  }

  /*
   * Rebuild the message with given candidate variables
   */
  public function create_grouped_message($candidates, $max_items_to_group = 5) {

    global $base_url;

    $message_template = $this->rebuild_message(TRUE);
    $message_extension = '';
    $message_template = str_replace("%times%", $this->target_count, $message_template);
    $message_template = str_replace("%count%", $this->target_count, $message_template);

    // Prepare the merged factors from the stored messages
    $merged_string = '';

    $remains = array();
    $target = $this->template->concat_args['group_target'];
    $beat = 'beat-item-' . $this->uaid;
    $unique = $candidates['variables'];
    $count = $candidates['count'];//count($candidates['variables']);

    // Limit the number of displayed (grouped) messages by message
    // or left as default global configuration
    if (!empty($this->template->concat_args['group_num_max'])) {
      $max_items_to_group = $this->template->concat_args['group_num_max'];
    }

    // Reduce the variables for substitution to the maximum
    // Add the remains by keeping the others plus the last one,
    // in case the total exceeds the max group setting.
    if ($count > $max_items_to_group) {
      $count = $max_items_to_group;
      $unique = array_slice($unique, 0, $count);
      $remains = array_slice($candidates['variables'], $count - 1);
    }

    // Replacement of placeholder with group targets
    // If there is a match for %variable%
    // Try to replace the variable with the group_target variables
    if (preg_match_all("|\%(.*)\%(.*)|U", $message_template, $matches)) {

      if (count($remains) > 0) {
        $hidden_remains = '<ul id="' . $beat . '_remaining_wrapper" style="display: none;">';
        foreach ($remains as $remain) {
          $key = isset($remain["@". $target]) ? $remain["@". $target] : (isset($remain["!". $target]) ? $remain["!". $target] : $remain["%". $target]);
          $hidden_remains .= '<li>' . $key . '</li>';
        }
        $hidden_remains .= '</ul>';
      }

      $placeholder = $matches[1][0];

      $i = 1;
      foreach ($unique as $stored_variables) {

        // limit them to the value given by the group variable setting
        if (isset($stored_variables["!". $target])) {
          if ($i == 1) {
            $merged_string .= $stored_variables["!". $target];
          }
          elseif ($i < $count && $count > 2) {
            $merged_string .= $this->template->concat_args['merge_separator'];
            $merged_string .= $stored_variables["!". $target];
          }
          elseif ($i == $count || $count == 2) {
            $merged_string .= ' ' . $this->template->concat_args['merge_end_separator'];
            if (count($remains) >= 1 && $hidden_remains != '') {
              $attributes = array(
                'attributes' => array(
                  'id' => $beat . '_remaining',
                  'class' => array('beat-remaining'),
                ),
                'absolute' => TRUE,
                'fragment' => $beat
                );
              $merged_string .= l(t('@num more', array('@num' => count($remains))), $base_url . request_uri(), $attributes);
              $message_extension .= $hidden_remains;
            }
            else {
              $merged_string .= $stored_variables["!". $target];
            }
          }
        }
        $i++;
      }
      $message_template = str_replace("%". $placeholder ."%", $merged_string, $message_template);
      if (isset($message_extension)) {
        $message_template .= $message_extension;
      }

    }
    $this->message = $message_template;
  }

  /**
   * Public function to save activity to database
   * @param array raw argument to enforce as is (pre-renderd)
   */
  public function save($raw_args = array()) {

    if (!empty($this->nid)) {
      // if a user selected a language, then we follow i19n
      $node = node_load($this->nid);
      if (!empty($node->language)) {
        return $this->_save($raw_args, $node->language);
      }
    }

    return $this->_save($raw_args);

  }

  /**
   * Sets the variables array
   * Data variables are stored in an array to use them to build real variables.
   * this means that when activity message objects get merged, the variables
   * will be filled with variables components from all instances.
   */
  public function set_variables($variables = NULL) {

    if (!empty($variables)) {

      if (is_string($variables)) {
        $this->variables = heartbeat_decode_message_variables($variables);
      }
      elseif (is_array($variables)) {
        $this->variables = $variables;
      }
    }
  }

  /**
   * Add buttons to the activity message.
   */
  protected function add_buttons() {

    // Internal button.
    if ($this->delete_access || $this->actor_access) {
      heartbeat_ctools_modal_prepare();

      drupal_add_library('system', 'drupal.ajax');
      $link = l(t('Delete'), 'heartbeat/nojs/activity/delete/' . $this->uaid, array('query' => array('destination' => $_GET['q']), 'html' => TRUE, 'attributes' => array('class' => array('use-ajax', 'ctools-modal-ctools-heartbeat-style'), 'title' => t('Delete'))));
      $button = '<span class="hover-delete">' . $link . '</span>';
      //$button = '<span class="hover-delete">' . ctools_modal_text_button(t('Delete'), 'heartbeat/nojs/activity/delete/' . $this->uaid, t('Delete'),  'ctools-modal-ctools-heartbeat-style') . '</span>';
      $this->add_button($button);
    }

  }

  /**
   * Add button to the activity message.
   */
  public function add_button($button) {
    $this->buttons[] = $button;
  }

  /**
   * add_attachment().
   */
  public function add_attachment($attachment) {
    $this->attachments[] = $attachment;
  }

  /**
   * add_plugin().
   */
  public function add_plugin($pluginId, iHeartbeatPlugin $plugin) {
    if (!isset($this->additions->plugins)) {
      $this->additions->plugins = array();
    }
    $this->additions->plugins[$pluginId] = $plugin;
  }

  /**
   * remove_plugin().
   */
  public function remove_plugin($pluginId) {
    unset($this->additions->plugins[$pluginId]);
  }

  /**
   * Save activity log
   *
   * @param array $raw_args
   *   All variables as key => value.
   * @param Object $lang
   *   Optional lang_code.
   */
  private function _save($raw_args = array(), $lang = '') {
    // Rebuild arguments with tokens
    $args = $this->rebuild_arguments($raw_args);
    return $this->log_message($args, $lang);
  }

  /**
   * Logs a heartbeat message
   * @param string language optional
   *
   */
  private function log_message($args, $lang = '') {

    if (empty($lang)) {
      $lang = $GLOBALS['language']->language;
    }

    // Checks if there should be logging what so ever.
    if (empty($this->message)) {
      watchdog('heartbeat', 'Error in logging user activity: it is not possible to log empty message', array(), WATCHDOG_ERROR);
      return FALSE;
    }

    // Rewrite access if the user has configured the access state of this message type.
    $heartbeat_user_templates = heartbeat_user_templates_load($this->uid);
    if (!empty($heartbeat_user_templates) && isset($heartbeat_user_templates[$this->message_id])) {
      $this->access = $heartbeat_user_templates[$this->message_id]->status;
    }

    // Prepare extra variables (hardcoded for node for now)
    // TODO think of a cleaner sollution.
    if ($this->nid > 0 && $node = node_load($this->nid)) {
      $this->variables['node_type'] = $node->type;
      $this->variables['node_status'] = $node->status;
      $this->variables['node_uid'] = $node->uid;
    }
    if ($this->nid_target > 0 && $node = node_load($this->nid_target)) {
      $this->variables['node_target_type'] = $node->type;
      $this->variables['node_target_status'] = $node->status;
      $this->variables['node_target_uid'] = $node->uid;
    }

    // Log relational message to user activity
    $last_id = db_insert('heartbeat_activity')
      ->fields(array('message_id', 'nid', 'uid', 'nid_target', 'uid_target', 'cid', 'access', 'timestamp', 'language', 'variables', 'in_group'))
      ->values(array(
        'message_id' => $this->message_id,
        'nid' => $this->nid,
        'uid' => $this->uid,
        'nid_target' => $this->nid_target,
        'uid_target' => $this->uid_target,
        'cid' => $this->cid,
        'access' => $this->access,
        'timestamp' => $this->timestamp,
        'language' => $lang,
        'in_group' => $this->in_group,
        'variables' => heartbeat_encode_message_variables($this->variables)))
      ->execute();

    // Add the uaid.
    $this->uaid = $last_id;

    // Allow modules to respond to the save of a heartbeat activity message.
    module_invoke_all('heartbeat_activity_save', $this);

    return $last_id ? $last_id : 0;

  }

  /**
   * protected function to set the delete access for the message.
   */
  protected function set_delete_access() {
    $this->delete_access = user_access('admin heartbeat delete all');
    $this->actor_access = $this->delete_access || ($this->uid == $GLOBALS['user']->uid && user_access('admin heartbeat delete own'));
  }

  /**
   * Rebuild the arguments for variables
   * to share within this object
   *
   * @param array $raw_input of arguments
   */
  private function rebuild_arguments($raw_input) {
    $args = array();

    // Rebuild arguments with language tokens
    foreach ($this->variables as $key => $value) {

      $value = filter_xss($value);

      // Leave $key[0] == "!"  asis
      if ($key[0] != "@" || $key[0] != "!") {
        continue; // bad argument
      }
      $oldkey = $key;

      // if argument is prefilled, override
      if (isset($raw_input[$oldkey])) {
        $args[$key] = $raw_input[$oldkey];
        continue;
      }
      // Argument gets the value as in variables
      $args[$key] = $value;
    }

    return $args;
  }


} // eof class heartbeat_activity
