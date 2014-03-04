<?php

/**
 * @file
 * Defines activity comments.
 */


/**
 * Class HeartbeatFlagAttachmentPlugin.
 */
class HeartbeatActivityCommentsPlugin extends HeartbeatBasePlugin implements iHeartbeatPlugin  {

  public $HEARTBEAT_NODE_COMMENTS_PER_PAGE = 5;
  public $HEARTBEAT_REACTIONS_PER_PAGE = 5;

  private $commentCount = 0;
  private $parentNode = NULL;
  private $parentNodeTarget = NULL;
  private $objectType = 'heartbeat_activity';
  private $orderStyle = NULL;
  private $orderPosition = NULL;
  private $commentDisplay = FALSE;
  private $canComment = FALSE;
  private $accessComment = FALSE;
  private $showAllComments = FALSE;

  public $isNodeComment = FALSE;
  public $hasMoreComments = FALSE;
  public $reactions = array();

  /**
   * __construct().
   */
  public function __construct($label, $settings) {

    parent::__construct($label, $settings);

    $this->HEARTBEAT_NODE_COMMENTS_PER_PAGE = $settings['heartbeat_comments_node_count'];
    $this->HEARTBEAT_REACTIONS_PER_PAGE = $settings['heartbeat_comments_comment_count'];

    drupal_add_js(drupal_get_path('module', 'heartbeat') . '/js/autoresize.jquery.js');
    drupal_add_js(drupal_get_path('module', 'heartbeat_comments') . '/heartbeat_comments.js');
    drupal_add_js(array('heartbeat_comment_post_url' => url('heartbeat/comment/post', array('absolute' => TRUE))), "setting");
    drupal_add_js(array('heartbeat_comment_load_url' => url('heartbeat/comments/load/js', array('absolute' => TRUE))), "setting");

  }

  /**
   * getAttachments().
   *
   * @param $template
   *   The Heartbeat Template
   * @param $component_type
   *   The type of attachment [buttons, content]
   */
  public function getAttachments($template, $component_type) {
    return array(array(
      'name' => $this->settings['plugin_name'],
      'title' => t('Heartbeat Comments'),
      'enabled' => isset($template->attachments[$component_type]['enabled'][$this->settings['plugin_name']]) ? $template->attachments[$component_type]['enabled'][$this->settings['plugin_name']] : 0,
      'weight' => 2,
    ));
  }

  /**
   * loadAttachments().
   */
  public function loadAttachments(HeartbeatActivity & $heartbeatActivity, $name = NULL) {

    // Create required additions made to the activity object.
    $this->createActivityAdditions($heartbeatActivity);

    if (!$this->accessComment) {
      return;
    }

    // Load from cache if configured and available.
    if ($this->settings['heartbeat_comments_cache'] && $objects_cache = cache_get('heartbeat:comments:'. $heartbeatActivity->uaid. ':'. $heartbeatActivity->message_nid_cache)) {

      // Make sure the textarea.js script is attached.
      drupal_add_js('misc/textarea.js');
      $comments->heartbeat_comments = array('_cached' => $objects_cache->data);

    }
    // Create and cache the list.
    else {

      // For the single message, make sure all comments are loaded.
      $this->showAllComments = isset($this->stream) && $this->stream instanceOf SingleActivity;

      // HeartbeatActivity.additions.$commentCount is cached in the message itself.
      // Node comment reactions follow core. Here an extra query is needed to
      // the node comment statistics table.
      if (isset($this->parentNode) && $this->isNodeComment) {
        $result = db_query('SELECT comment_count FROM {node_comment_statistics} WHERE nid = :nid', array(':nid' => $this->parentNode->nid));
      }
      else {
        $result = db_query('SELECT COUNT(hcid) AS comment_count FROM {heartbeat_comments} WHERE uaid = :uaid', array(':uaid' => $heartbeatActivity->uaid));
      }
      foreach ($result as $row) {
        $this->commentCount = $row->comment_count;
      }

      // Fetch the comments if needed.
      if ($this->commentCount > 0) {
        $this->reactions = heartbeat_get_reactions($heartbeatActivity->uaid, $this->isNodeComment, $this->parentNode, $this->showAllComments);
        $heartbeatActivity->classes .= 'has-comments';
      }
      else {
        $heartbeatActivity->classes .= 'no-comments';
      }

    }

    // Attach the fully loaded plugin to the message.
    $heartbeatActivity->add_plugin($this->settings['plugin_name'], $this);

  }

  /**
   * createActivityAdditions().
   */
  public function createActivityAdditions($heartbeatActivity) {

    // Ease the settings retrieval.
    $settings = $heartbeatActivity->template->attachments['buttons']['settings'][$this->settings['plugin_name']];

    $this->orderStyle = $this->settings['heartbeat_comments_order'];
    $this->orderPosition = $this->settings['heartbeat_comments_position'];
    $this->commentDisplay = isset($this->settings['heartbeat_comments_show']) ? $this->settings['heartbeat_comments_show'] : TRUE;

    // Case if the comments are possible with nodes.
    if ($heartbeatActivity->nid > 0 && isset($heartbeatActivity->variables['node_type']) && module_exists('comment')) {

      $heartbeatActivity->message_nid_cache = $heartbeatActivity->nid;
      // Only nid & type is needed here (also for heartbeat_get_reactions)
      // so node_load is really over the top here.
      $this->parentNode = new stdClass;
      $this->parentNode->nid = $heartbeatActivity->nid;
      $this->parentNode->uid = $heartbeatActivity->variables['node_uid'];
      $this->parentNode->type = $heartbeatActivity->variables['node_type'];
      $this->parentNode->status = $heartbeatActivity->variables['node_status'];
      $this->isNodeComment = $settings['activitycomments_node'] && variable_get('comment_' . $this->parentNode->type, 2) > 0;

      $this->objectType = $this->parentNode->type;

    }

    // Case to check if the target node is set and is commentable and confiugred that way.
    if ($heartbeatActivity->nid_target > 0 && isset($heartbeatActivity->variables['node_target_type'])) {

      $this->parentNodeTarget = new stdClass;
      $this->parentNodeTarget->nid = $heartbeatActivity->nid_target;
      $this->parentNodeTarget->uid = $heartbeatActivity->variables['node_target_uid'];
      $this->parentNodeTarget->type = $heartbeatActivity->variables['node_target_type'];
      $this->parentNodeTarget->status = $heartbeatActivity->variables['node_target_status'];

    }

    if (!$this->isNodeComment) {
      // Reset the nid to 0 since we don't use it for node-type disabled comments.
      $heartbeatActivity->message_nid_cache = 0;
    }

    // Check access on the form submission.
    // Note that normal heartbeat comments will be used in case of node restrictions.
    if ($heartbeatActivity->message_nid_cache && $this->isNodeComment) {
      $this->canComment = user_access('post comments');
      $this->accessComment = user_access('access comments');
    }
    else {
      $this->canComment = user_access('add heartbeat comment');
      $this->accessComment = $this->canComment;
    }

  }

  /**
   * isStreamAdaptor().
   */
  public function isStreamAdaptor() {
    return TRUE;
  }

  /**
   * adaptsStream().
   */
  public function adaptsStream() {
    return TRUE;
  }

  /**
   * streamLoaded().
   */
  public function streamLoaded(HeartbeatStream $heartbeatStream) {

    $heartbeatStream->needsModal(TRUE);

    // Push the comments form/list settings to javascript.
    // We do this here as something could have been altered.
    drupal_add_js(array('heartbeat_comments_order' => $this->settings['heartbeat_comments_order']), "setting");
    drupal_add_js(array('heartbeat_comments_position' => $this->settings['heartbeat_comments_position']), "setting");

  }

  /**
   * hasContent().
   */
  public function hasContent() {
    return TRUE;
  }

  /**
   * hasAttachmentsContent().
   */
  public function hasAttachmentsContent() {
    return TRUE;
  }

  /**
   * renderAttachmentsContent().
   */
  public function renderAttachmentsContent(HeartbeatActivity $heartbeatActivity) {

    if (!$this->accessComment) {
      return;
    }

    // Keep a variable to indicate if the comments for this activity need to be cached.
    $cache = $this->settings['heartbeat_comments_cache'];

    // Check if the user has access to the comment widget/list.
    if (!$this->canComment) {

      $attachment = '<div class="user-login-teaser">' . t('!login or !register to make a comment', array('!login' => l(t('Login'), 'user'), '!register' => l(t('register'), 'user/register'))) . '</div>';
      $heartbeatActivity->add_attachment($attachment);
      //return;
    }

    // check if we can return data from cache.
    if (isset($heartbeatActivity->additions->heartbeat_comments, $heartbeatActivity->additions->heartbeat_comments['_cached'])) {

      $list = $heartbeatActivity->additions->heartbeat_comments['_cached'];
      $extraCssClass = empty($list) ? "heartbeat-comments-nocomments" : "heartbeat-comments-comments";
      // Don't cache it if it's already been cached.
      $cache = FALSE;

    }
    else {

      $list = '';
      $extraCssClass = "heartbeat-comments-nocomments";

      if ($this->commentCount > 0) {

        $extraCssClass = "heartbeat-comments-comments";
        $comments_per_page = $this->HEARTBEAT_REACTIONS_PER_PAGE;
        if ($this->isNodeComment && variable_get('comment_' . $this->objectType, 2) > 0) {
          $comments_per_page = $this->HEARTBEAT_NODE_COMMENTS_PER_PAGE;
        }

        if (!$this->showAllComments && $this->commentCount > $comments_per_page) {
          $this->hasMoreComments = TRUE;
          $this->reactions = array_slice($this->reactions, 0, $comments_per_page);
        }

        if ($this->orderStyle == 'oldest_on_top') {
          $this->reactions = array_reverse($this->reactions);
        }
        $list .= theme('heartbeat_comments', array('comments' => $this->reactions, 'activity' => $heartbeatActivity));

      }

    }

    // Cache the output if not cached yet.
    if ($cache) {
      cache_set('heartbeat:comments:'. $heartbeatActivity->uaid. ':'. $heartbeatActivity->message_nid_cache, $list);
    }

    // Create the list and the form in correct order.
    $output = '';
    $output .= '<div class="heartbeat-comments heartbeat-comments-'. $this->objectType .' '. $extraCssClass  .'">';
    if ($this->orderPosition == 'up') {
      $output .= $list;
    }
    // Render the form if user is allowed to.
    if ($this->canComment) {
      $elements = drupal_get_form('heartbeat_comments_form', $heartbeatActivity);
      $output .= drupal_render($elements);
    }

    if ($this->orderPosition == 'down') {
      $output .= $list;
    }
    $output .= '</div>';

    // Create the attachment output.
    if ($this->commentDisplay == 'block') {
      $display = $this->commentCount || !empty($heartbeatActivity->additions->comment_open_override) ? 'block' : 'none';
    }
    else {
      $display = 'none';
    }

    $attachment = '<div id="heartbeat-comments-wrapper-' . $heartbeatActivity->uaid . '" class="heartbeat-comments-wrapper" style="display: ' . $display . ';">';
    $attachment .= $output;
    $attachment .= '</div>';

    $heartbeatActivity->add_attachment($attachment);

  }

  /**
   * hasButtons().
   */
  public function hasButtons() {
    return TRUE;
  }

  /**
   * hasAttachmentsButtons().
   */
  public function hasAttachmentsButtons() {
    return TRUE;
  }

  /**
   * renderButtons().
   */
  public function renderButtons(HeartbeatActivity $heartbeatActivity) {

    if (!$this->canComment) {
      return;
    }

    $label = heartbeat_comments_get_count_label($this->commentCount);

    $output = l($label, 'heartbeat/message/' . $heartbeatActivity->uaid,
        array('attributes' => array('title' => t('comment'), 'onclick' => 'javascript:Drupal.heartbeat.comments.toggleComments(this, ' . $heartbeatActivity->uaid . '); return false;')));
    $heartbeatActivity->add_button('<span class="heartbeat-attachment-button">' . $output . '</span>');

  }

  /**
   * pluginUIForm().
   */
  public function pluginUIForm(&$form, &$form_state) {

    $settings = $form_state['item']->settings;
    $form['settings']['heartbeat_comments_cache'] = array(
      '#title' => t('Enable heartbeat comments cache'),
      '#description' => t('When enabled, heartbeat will cache the cache with the form foreach activity. This means times and so will not be updated untill new comment is made.'),
      '#type' => 'checkbox',
      '#default_value' => isset($settings['heartbeat_comments_cache']) ? $settings['heartbeat_comments_cache'] : '',
      '#weight' => -5,
    );
    $form['settings']['heartbeat_comments_position'] = array(
      '#title' => t('Choose the position of the comment box'),
      '#type' => 'select',
      '#options' => array('down' => t('Comment list is beneath the comment box'), 'up' => t('Comment list is on top of the comment box')),
      '#default_value' => isset($settings['heartbeat_comments_position']) ? $settings['heartbeat_comments_position'] : 'up',
      '#weight' => -5,
    );
    $form['settings']['heartbeat_comments_order'] = array(
      '#title' => t('Select the sort order of the comments'),
      '#type' => 'select',
      '#options' => array('recent_on_top' => t('Most recent comments on top'), 'oldest_on_top' => t('Oldest comments on top')),
      '#default_value' => isset($settings['heartbeat_comments_order']) ? $settings['heartbeat_comments_order'] : 'oldest_on_top',
      '#weight' => -5,
    );
    $form['settings']['heartbeat_comments_comment_count'] = array(
      '#title' => t('Maximum of displayed heartbeat comments'),
      '#type' => 'textfield',
      '#default_value' => isset($settings['heartbeat_comments_comment_count']) ? $settings['heartbeat_comments_comment_count'] : '',
      '#weight' => -5,
    );
    $form['settings']['heartbeat_comments_node_count'] = array(
      '#title' => t('Maximum of displayed heartbeat node comments'),
      '#type' => 'textfield',
      '#default_value' => isset($settings['heartbeat_comments_node_count']) ? $settings['heartbeat_comments_node_count'] : '',
      '#weight' => -5,
    );
    $form['settings']['heartbeat_comments_show'] = array(
      '#title' => t('Choose whether to show comments or hide them by default'),
      '#type' => 'select',
      '#options' => array('block' => t('Show comments by default'), 'none' => t('Hide comments by default')),
      '#default_value' => isset($settings['heartbeat_comments_show']) ? $settings['heartbeat_comments_show'] : 'block',
      '#weight' => -5,
    );
    $form['settings']['heartbeat_comments_load_more'] = array(
      '#title' => t('Choose the behaviour of the more comments button'),
      '#type' => 'select',
      '#options' => array('ajax' => t('Load with ajax'), 'page' => t('Load on detail page')),
      '#default_value' => isset($settings['heartbeat_comments_load_more']) ? $settings['heartbeat_comments_load_more'] : '',
      '#description' => t('Note that the ajax loading will be very heavy on for high traffic sites. Use this feature wisely!')
    );

  }

  /**
   * pluginAttachmentForm().
   *
   * @param $form
   * @param $form_values
   * @param $component_type [buttons, content]
   */
  public function pluginAttachmentForm(&$form, $form_values, $component_type) {

    if ($component_type == 'buttons') {
      $form['activitycomments_node'] = array(
        '#type' => 'checkbox',
        '#default_value' => isset($form_values['settings'][$this->settings['plugin_name']]['activitycomments_node']) ? $form_values['settings'][$this->settings['plugin_name']]['activitycomments_node'] : array(),
        '#title' => t('Enable node comments for this activity template if a node is available'),
        '#weight' => 11,
      );
    }

  }

}
