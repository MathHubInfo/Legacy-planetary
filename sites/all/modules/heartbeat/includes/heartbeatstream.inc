<?php

/**
 * @file
 *   HeartbeatStream object is the object that takes stream
 *   configuration to create a stream of activity objects.
 *   It is the controlling organ at the pre-query, query and
 *   post-query phases.
 */


/**
 * Abstract class HeartbeatStream
 *   This base class has final template methods which are
 *   used by the derived concretes. The HeartbeatStream is a
 *   state object that is given to the HeartbeatStreamBuilder to
 *   set the access to the current request.
 */
abstract class HeartbeatStream {

  // Query object for this stream.
  protected $query = NULL;

  // Configuration object for this stream.
  public $config = NULL;

  // Well-formed activity messages.
  public $messages = array();

  // String prefix on top of the stream.
  public $prefix = '';

  // String suffix under a stream.
  public $suffix = '';

  // Templates available to show.
  public $templates = array();

  // Contextual arguments.
  public $contextual_arguments = array();

  // Denied templates.
  protected $templates_denied = array();

  // Language at display time.
  protected $language = LANGUAGE_NONE;

  // exclude Og.
  protected $exclude_og = FALSE;

  // The stream owner or activity watcher.
  protected $_uid = 0;

  // Array of runtime notices, warnings and errors.
  protected $_errors = array();

  // Indicates if there are runtime errors.
  protected $_has_errors = FALSE;

  // Indicates whether the page has modal requirement.
  protected $needsModal = TRUE;

  // Time where activity starts.
  protected $_offset_time = 0;

  // Maximum time where activity must end.
  protected $oldest_date = 604800;

  // Maximum number of activity messages to show.
  protected $messages_max = 0;

  // Latest user activity id fetched.
  protected $latest_activity_id = 0;

  // Indicates if the stream is displayed on a page or not.
  protected $_page = FALSE;

  // Indicates if this is an ajax request.
  protected $ajax = 0;

  // Can page means if we can show more messages
  protected $canPage = FALSE;

  // User view type of the stream instance.
  protected $_whoisuser_type = self::VIEWER;

  // The user who is viewing the activity stream.
  protected $viewer = null;

  // The user who's activity stream is viewed.
  protected $viewed = null;

  // View mode to display message.
  protected $view_mode = 'default';

  protected $_whoisuser_types = array(
    self::VIEWER => 'Viewing user',
    self::VIEWED => 'Viewed user'
  );

  // User viewer types.
  const VIEWER = 0;
  const VIEWED = 1;

  /**
   * Constructor
   *
   * @param $stram HeartbeatStreamConfig object with the neccesairy parameters
   * @param $page Boolean to indicate if this is a page view
   */
  final public function __construct(HeartbeatStreamConfig $streamConfig, $page = FALSE, $account = NULL) {

    $this->_page = $page;
    $this->setConfig($streamConfig);
    $this->setAjax();

    if (empty($this->_offset_time)) {
      $this->setOffsetTime();
    }

    $this->setViewer($GLOBALS['user']);
    $this->setViewed($account);

    $this->setAvailableTemplates();

    $this->construct();

    $this->setContextualArguments();

  }

  /**
   * Fake constructor to hook this method instead of the constructor.
   */
  public function construct() {

  }

  /**
   * setContextualArguments().
   */
  protected function setContextualArguments() {

    // Add a contextual argument if we are viewing a user.
    if (!empty($_GET['contextualArguments']) && isset($_GET['contextualArguments']['uid_target'])) {
      $this->contextual_arguments['uid_target'] = $_GET['contextualArguments']['uid_target'];
    }
    elseif ($this->viewed->uid != $this->viewer->uid) {
      $this->contextual_arguments['uid_target'] = $this->viewed->uid;
    }

    drupal_add_js(array('heartbeatContextArguments' => $this->contextual_arguments), "setting");
  }

  /**
   * setError
   * Alias for addError.
   *
   * @param $text String of found error
   * @return void
   */
  protected function setError($text) {
    $this->_addError($text);
  }

  /**
   * addError
   *
   * @param $text String of found error
   * @return void
   */
  public function addError($error) {
    $this->_errors[] = $error;
    $this->_has_errors = TRUE;
  }

  /**
   *
   * @param $text
   * @return unknown_type
   */
  public function getErrors() {
    return $this->_errors;
  }

  /**
   * hasErrors
   *
   * @return boolean has errors
   */
  public function hasErrors() {
    return variable_get('heartbeat_debug', 0) && $this->_has_errors;
  }

  /**
   * hasAccess
   *
   * @param $text
   * @return boolean to indicate the access to the stream
   */
  public function hasAccess() {
    return TRUE;
  }

  /**
   * canPostActivityStatuses().
   * TODO Remove this here. The stream plugins should be stored
   * in the stream object. This kind of access will become much
   * easier to implement.
   */
  public function canPostActivityStatuses() {
  	return TRUE;
  }

  /**
   * getCurrentLanguages().
   *
   * Get the current global language.
   */
  public function getCurrentLanguages() {

    global $language;
    $this->language = $language->language;
    $languages = array('und' => 'und');
    // TODO check if we are going to use no languages at all at log time
    $languages[str_replace('-', '_', $language->language)] = $language->language;

    return $languages;

  }

  /**
   * skipActiveUser().
   *
   * Return whether you want to skip the active user (being
   * the logged-in user and NOT the displayed user) from display.
   * Typical private will not skip this one ofcourse where most
   * other will skip active user since you don't want to watch
   * your own activity.
   */
  public function skipActiveUser() {
    return $this->config->skip_active_user;
  }

  /**
   * getViewer().
   *
   * Function to retrieve the viewer of the stream.
   */
  public function getViewer() {
    return $this->viewer;
  }

  /**
   * setViewer().
   */
  public function setViewer($account) {
    $this->viewer = $account;
  }

  /**
   * getViewed().
   *
   * Function to retrieve the user acting in the stream.
   */
  public function getViewed() {
    return $this->viewed;
  }

  /**
   * setViewed().
   */
  public function setViewed($account) {

    // If an account is given, then the stream is build for that user.
    if (isset($account)) {
      $this->_whoisuser_type = self::VIEWED;
      $this->viewed = $account;
    }
    // If not, we need to derive the account if possible.
    else {
      // If the logged-in user is watching the stream on a profile page,
      // the viewed user needs to be changed.
      // This could be through ajax or normal.
      $args = arg();
      if (!empty($_GET['viewed_uid']) && is_numeric($_GET['viewed_uid']) && $account = user_load($_GET['viewed_uid'])) {
        $this->_whoisuser_type = self::VIEWED;
        $this->viewed = $account;
      }
      elseif ($args[0] == 'user' && is_numeric($args[1])) {
      	// TODO Change this to access denied if not available.
        if (!empty($args[2])) {
        //if (!empty($args[2]) && $args[2] == $this->config->settings['stream_profile_path']) {
          $this->_whoisuser_type = self::VIEWED;
          $this->viewed = user_load($args[1]);
        }
        else {
          $this->_whoisuser_type = self::VIEWER;
          $this->viewed = $this->viewer;
        }
      }
      else {
        $this->_whoisuser_type = self::VIEWER;
        $this->viewed = $this->viewer;
      }
    }

    drupal_add_js(array('viewed_uid' => $this->viewed->uid), "setting");
    $this->_uid = $this->viewed->uid;

  }

  /**
   * getViewedId().
   */
  public function getViewedId() {
    return $this->_uid;
  }

  /**
   * setViewMode().
   */
  public function setViewMode($view_mode) {
    $this->view_mode = $view_mode;
  }

  /**
   * isPage().
   *
   * Getter function for heartbeat page/blocks.
   */
  public function isPage() {
    return $this->_page;
  }

  /**
   * setIsPage().
   *
   * @param Boolean $isPage
   */
  public function setIsPage($isPage) {
    $this->_page = $isPage;
  }

  /**
   * getLatestActivityId()
   */
  public function getLatestActivityId() {
    return $this->latest_activity_id;
  }

  /**
   * setLatestActivityId().
   */
  public function setLatestActivityId($id) {
    $this->latest_activity_id = $id;
  }

  /**
   * excludeOg().
   */
  public function excludeOg($status) {
    $this->exclude_og = $status;
  }

  /**
   * getAjax().
   */
  public function getAjax() {
    return $this->ajax;
  }

  /**
   * isAjax().
   *
   * Alias for getAjax.
   */
  public function isAjax() {
    return $this->ajax;
  }

  /**
   * setAjax().
   */
  public function setAjax($ajax = NULL) {

    if (isset($ajax)) {
      $this->ajax = $ajax;
    }
    elseif ($this->_page) {
      $this->ajax = $this->config->page_pager_ajax;
    }
    else {
      $this->ajax = ($this->config->block_show_pager == 2 || $this->config->block_show_pager == 3);
    }

  }

  /**
   * needsModal().
   * Returns a boolean to indicate whether modal window is needed on the page.
   */
  public function needsModal($needsModal = NULL) {
    if (isset($needsModal)) {
      $this->needsModal = $needsModal;
    }
    return $this->needsModal;
  }

  /**
   * Set the maximum number of items to fetch.
   */
  public function setItemsMax() {

    $this->oldest_date = variable_get('heartbeat_activity_log_cron_delete', 2678400);

    if ($this->_page) {
      $this->messages_max = $this->config->page_items_max;
    }
    else {
      $this->messages_max = $this->config->block_items_max;
    }
  }

  /**
   * numberOfMessages().
   */
  public function numberOfMessages() {
  	return count($this->messages);
  }

  /**
   * getConfig().
   *
   * Get HeartbeatStreamConfig object with all configurations
   *
   * @return HeartbeatStreamConfig object
   */
  public function getConfig() {
    return $this->config;
  }

  /**
   * setConfig().
   *
   * @param HeartbeatStreamConfig object
   */
  public function setConfig(HeartbeatStreamConfig $config) {
    $this->config = $config;
    $this->setItemsMax();
  }

  /**
   * Get the messages.
   */
  public function getMessages() {
    return $this->messages;
  }

  /**
   * setLanguage().
   */
  public function setLanguage($language) {
    $this->language = $language;
  }

  /**
   * setOffsetTime
   *
   * @param $offset integer to set the offset time
   * @return void
   */
  final public function setOffsetTime($offset = 0) {
    if ($offset == 0) {
      $offset = $_SERVER['REQUEST_TIME'];
    }
    $this->_offset_time = $offset;
  }

  /**
   * getOffsetTime
   *
   * @param $offset integer to set the offset time
   * @return void
   */
  final public function getOffsetTime() {
    return $this->_offset_time;
  }

  /**
   * getTemplate().
   */
  final public function getTemplate($template_id, $access = NULL) {

    if (isset($access) && isset($this->templates[$access][$template_id])) {
      return $this->templates[$access][$template_id];
    }
    else {
      foreach ($this->templates as $perm => $templates) {
        if (isset($templates[$template_id])) {
          return $templates[$template_id];
        }
      }
      return NULL;
    }

  }

  /**
   * result
   * Prepares a query, makes it available to alter it and finally executes it.
   * @return Array of messages as a result of the query.
   */
  public function result() {

    if ($this->hasAccess()) {

      $this->createQuery();
      $this->queryAlter();

      $messages = $this->executeQuery();

      $allowed_tags = heartbeat_allowed_html_tags();

      // Check on xss attack before other modules can change messages.
      // Delegate the time.
      foreach ($messages as $key => $message) {
        $messages[$key]->message = filter_xss($messages[$key]->message, $allowed_tags);
        $messages[$key]->message_concat = filter_xss($messages[$key]->message_concat, $allowed_tags);
        $messages[$key]->show_message_times_grouped = $this->config->show_message_times_grouped;
      }

      return $messages;

    }
    else {
      return NULL;
    }

  }

  /**
   * setAvailableTemplates()
   */
  protected function setAvailableTemplates() {

    // Load the available templates for this stream.
    ctools_include('export');
    $templates = ctools_export_crud_load_all('heartbeat_messages');

    // Deny messages that have been denied through stream configuration.
    foreach ($this->config->messages_denied as $denied_message) if (!empty($denied_message)) {
      $this->templates_denied[$denied_message] = $denied_message;
    }

    // Prepare the allowed templates for this stream.
    foreach ($templates as $key => $template) {

      // Restrict templates to roles.
      if ($template->hasRoleRestrictions()) {
        foreach ($template->roles as $rid) {
          if (!isset($this->viewer->roles[$rid])) {
            $this->templates_denied[$key] = $key;
            break;
          }
        }
        if (isset($this->templates_denied[$key])) {
          continue;
        }
      }

      $this->templates[$template->perms][$template->message_id] = $template;
      //$this->templates[$template->message_id] = $template;

    }

  }

  /**
   * createQuery().
   *
   * This query is the most important preparation to get the messages
   * in a stream.
   * Note that the access logged at the time of activity "ha.access" as
   * well as the access at display time "hut.status". The perms property
   * in the template is not used by design. This is something to discuss.
   * @todo Discuss
   *
   * @param $text
   * @return HeartbeatParser object
   */
  protected function createQuery() {

    $this->query = db_select('heartbeat_activity', 'ha')->extend('PagerActivity');
    $this->query->fields('ha', array('uaid', 'message_id', 'uid', 'access'));
//    $this->query->addField('ha', 'variables', 'variables');
//    $this->query->addField('ha', 'access', 'access');

    // Override the permission based on the user profile status.
    $this->query->leftJoin('heartbeat_user_templates', 'hut', ' ha.uid = hut.uid AND ha.message_id = hut.message_id ');
    $this->query->addField('hut', 'status', 'access_status');
    // The user_access field holds the least access known. (NULL = HEARTBEAT_PUBLIC_TO_ALL).
    $access_expression = "LEAST ( IFNULL ( ha.access, " . HEARTBEAT_PUBLIC_TO_ALL . "), IFNULL ( hut.status, " . HEARTBEAT_PUBLIC_TO_ALL . "))";
    $this->query->addExpression($access_expression, 'user_access');

    // Exclude unpublished comments.
    if (module_exists('comment')) {
      $this->query->leftJoin('comment', 'c', 'ha.cid = c.cid');
      $this->query->where("c.status = 1 OR ha.cid = 0");
    }

    // Include only the required language(s).
    $db_or = db_or();
    foreach ($this->getCurrentLanguages() as $lang_code) {
      $db_or->condition('ha.language', $lang_code, "=");
    }
    if ($db_or->count()) {
      $this->query->conditions($db_or);
    }

    // Condition on time of creation.
    if ($this->latest_activity_id > 0) {
      // Calls with an offset uaid will fetch newer messages
      $this->query->setLastActivityId($this->latest_activity_id);
    }
    else {
      // Otherwise we'll set oldest and newest date.
      $this->query->setOffsetTime($this->_offset_time, $this->oldest_date);
    }

    // Condition to exclude organic groups specific messages.
    if ($this->exclude_og) {
      $this->query->condition('ha.in_group', 1, '<>');
    }

    // Prepare "OR" clause for logical activity access conditions.
    $or = db_or();

    // Include messages where the actor addressed the viewer.
    $or->condition(db_and()
      ->where($access_expression . " = " . HEARTBEAT_PUBLIC_TO_ADDRESSEE)
      ->condition(db_or()
        ->condition(db_and()
          ->condition('ha.uid_target', $this->viewer->uid)
          ->condition('ha.uid_target', 0, '!=')
        )
        ->condition(db_and()
          ->condition('ha.uid', $this->viewer->uid)
          ->condition('ha.uid', 0, '!=')
        )
      )
    );

    // Include messages where the actor is somehow connected to the viewer.
    $this->viewer->relations = heartbeat_related_uids($this->viewer->uid);
    $or->condition(db_and()
      ->where($access_expression . " >= " .HEARTBEAT_PUBLIC_TO_CONNECTED)
      ->condition(db_or()
        ->condition('ha.uid', $this->viewer->relations, 'IN')
        ->condition('ha.uid_target', $this->viewer->relations, 'IN')
      )
    );

    // Include messages that are public to everyone.
    //$or->condition('ha.access', HEARTBEAT_PUBLIC_TO_ALL, '=');
    $or->where($access_expression . " = " . HEARTBEAT_PUBLIC_TO_ALL);

    // Include message where the viewer is the actor and sees all own activity.
    if (!$this->skipActiveUser()) {
      // Include private messages.
      $or->condition(db_and()
        ->condition("ha.uid", $this->viewer->uid)
        ->condition("ha.access", HEARTBEAT_PRIVATE, '>=')
      );
    }
    // Or completely skip that user.
    else {
      $this->query->condition('ha.uid', $this->viewer->uid, '!=');
    }

    if (count($or->conditions())) {
      $this->query->condition($or);
    }

    // Exclude denied message templates.
    if (!empty($this->templates_denied)) {
      $this->query->where("ha.message_id NOT IN (:messages)", array(':messages' => array_unique($this->templates_denied)));
    }

    // Order by.
    $this->query->orderBy('ha.timestamp', 'DESC')->limit($this->config->num_load_max);
    $this->query->orderBy('ha.uaid', 'DESC');

  }

  /**
   * executeQuery
   *
   * @return array results
   */
  protected function executeQuery() {

    // dqm($this->query);
    $result = $this->query->execute()->fetchAll();
    $messages = array();

    $uaids = array();
    foreach ($result as $key => $row) {
      if ($template = $this->getTemplate($row->message_id)) {
        $uaids[$key] = $row->uaid;
      }
    }

    $messages = heartbeat_activity_load_multiple($uaids);

    return $messages;

  }

  /**
   * Alter the query object.
   */
  protected function queryAlter() {}

  /**
   * viewsQueryAlter
   *
   * @param $view Object View
   * @return void
   */
  public function viewsQueryAlter(&$view) {}

  /**
   * Function to check access on messages
   * This behaviour is set by a heartbeat message configuration
   * to overrule the chosen display access type
   */
  protected function checkAccess(& $messages) {

    // This hook is invoked BEFORE calculating the maximum
    // number of messages to show,
    // giving other modules the opportunity to remove messages
    // based on their own parameters and custom reasons.
    $hook = 'heartbeat_messages_alter';
    foreach (module_implements($hook) as $module) {
      $function = $module .'_'. $hook;
      $result = $function($messages, $this);
    }

    foreach ($messages as $key => $message) {

      // Check node access if information is available.
      if (!empty($message->nid) && !empty($message->variables['node_type'])) {
        $dummy_node = new stdClass();
        $dummy_node->nid = $message->nid;
        $dummy_node->uid = $message->variables['node_uid'];
        $dummy_node->status = $message->variables['node_status'];
        $dummy_node->type = $message->variables['node_type'];
        if (!node_access('view', $dummy_node)) {
          unset($messages[$key]);
          continue;
        }
      }

      // Check node target access if information is available.
      if (!empty($message->nid_target) && !empty($message->variables['node_target_type'])) {
        $dummy_node = new stdClass();
        $dummy_node->nid = $message->nid_target;
        $dummy_node->uid = $message->variables['node_target_uid'];
        $dummy_node->status = $message->variables['node_target_status'];
        $dummy_node->type = $message->variables['node_target_type'];
        if (!node_access('view', $dummy_node)) {
          unset($messages[$key]);
        }
      }
    }

  }

  /**
   * Function to check if more/older messages can be loaded
   *
   * @return Boolean has more messages
   */
  public function hasMoreMessages() {

    if ($this->isPage()) {
      $display_pager = $this->config->page_show_pager;
    }
    else {
      $display_pager = $this->config->block_show_pager;
    }
    return $this->canPage && $display_pager;
  }

  /**
   * Create the well-formed activity messages from a result.
   * HeartbeatParser will do most of the work here.
   */
  public function parseMessages($result) {

    $heartbeatparser = new HeartbeatParser();
    $heartbeatparser->set_timespan_gap($this->config->grouping_seconds);
    $heartbeatparser->build_sets($result);
    $heartbeatparser->merge_sets();
    $messages = $heartbeatparser->get_messages();

    // $messages = $heartbeatparser->remove_broken_messages();
    $num_total_messages = count($messages);

    // From here we know the number of messages actualy loaded (and allowed)
    $messages = array_slice($messages, 0, $this->messages_max);

    $i = 0;
    foreach ($messages as $key => $message) {
      $message->index = $i;
      $i++;
    }

    // Set the possibility of a pager appearence
    if ($num_total_messages > $this->messages_max) {
      $this->canPage = TRUE;
    }

    return $messages;
  }

  /**
   * Function that reorganizes a query result of messages
   *   into a stream of heartbeat activity objects.
   *
   * @return $messages
   *   array of messages
   */
  public function execute() {

    // Fetch the messages from database for current Stream
    $result = $this->result();

    if (!isset($result)) {

    }
    elseif (!empty($result)) {

      // Filter messages by permission.
      $this->checkAccess($result);

      // Group the activity messages as configured
      $messages = $this->parseMessages($result);

      // Give contributes modules the opportunity to load
      // additions for the heartbeat activity message object.
      $hook = 'heartbeat_load';
      foreach (module_implements($hook) as $module) {
        $function = $module .'_'. $hook;
        // $messages should be implemented by reference!!!
        $function($result, $this);
      }

      // Let other modules retheme or completely rebuild messages
      $hook = 'heartbeat_theme_alter';
      foreach (module_implements($hook) as $module) {
        $function = $module .'_'. $hook;
        $result = $function($messages, $this);
      }

      $this->messages = $messages;

    }

    return $this->messages;

  }

  /**
   * executeViews().
   *
   * Method to represent the messages if comes from views.
   */
  public function executeViews($values = NULL) {

    $activities = heartbeat_activity_load_multiple($values);

    if (empty($activities)) {
      return;
    }

    // Filter messages by permission, skipped for views for now.
    // $this->checkAccess($activities);

    // Give contributes modules the opportunity to load
    // additions for the heartbeat activity message object
    $hook = 'heartbeat_load';
    foreach (module_implements($hook) as $module) {
      $function = $module .'_'. $hook;
      // $messages should be implemented by reference!!!
      $function($activities, $this);
    }

    // Group the activity messages as configured
    $messages = $this->parseMessages($activities);

    // Let other modules retheme or completely rebuild messages
    $hook = 'heartbeat_theme_alter';
    foreach (module_implements($hook) as $module) {
      $function = $module .'_'. $hook;
      $function($messages, $this);
    }

    $this->messages = $messages;

    $messages = array();
    foreach ($this->messages as $message) {
      $messages[$message->uaid] = $message;
    }

    return $messages;

  }

  /**
   * Render().
   *
   * Function to create a renderable build array.
   */
  public function render() {

    $build = array();

    if ($this->hasAccess()) {

      $path = drupal_get_path('module', 'heartbeat');
      $build = array('#type' => 'markup', 'messages' => array());
      $weight = 0;

      // Get the messages.
      foreach (array_keys($this->messages) as $key) {
        $build['messages'][$key] = heartbeat_activity_view($this->messages[$key], $this->view_mode);
        $build['messages'][$key]['#weight'] = $weight;
        $weight++;
      }
      $build['messages']['#sorted'] = TRUE;

      $build['pager'] = array(
        '#stream' => $this,
        '#theme' => 'activity_pager',
        '#weight' => 5,
      );

      if ($this->needsModal()) {
        // Add CTools modal requirements.
        heartbeat_ctools_modal_prepare();
      }
      // Add the javascript and css files.
      drupal_add_js($path . '/js/heartbeat.js');
      if (variable_get('heartbeat_include_default_style', 1)) {
      	drupal_add_css($path . '/css/heartbeat.css');
      }
      // Dirty hack to fix polled streams when no js/css can be included on custom ajax command.
	    drupal_add_css($path . '/layouts/heartbeat_2col/heartbeat_2col.css');

    }

    return $build;
  }

  /**
   * modifyActivityMessage()
   */
  public function modifyActivityMessage(HeartbeatActivity $heartbeatActivity) {

    if (!empty($this->contextual_arguments['uid_target'])) {
      $heartbeatActivity->uid_target = $this->contextual_arguments['uid_target'];
    }

  }

}

/**
 * eof().
 */