<?php

/**
 * @file
 *   HeartbeatStream Configuration object
 *   Parameter object that is given to a HeartbeatStreamConfig object
 *   to form a full stream of handled activity objects.
 */

/**
 * Class HeartbeatStreamConfig
 *
 * Changeable object with configurations for an activity stream
 */
class HeartbeatStreamConfig extends HeartbeatCtoolsObject {

  // Class name actualy used.
  public $name = '';

  // Class to ease the read/write.
  public $class = '';

  // Real class to load for cloned streams.
  public $real_class = '';

  // The path to the class.
  public $path = '';

  // Human readable name.
  public $title = '';

  // The module the query builder is located.
  public $module = '';

  // Extra variables.
  public $variables = array();

  // Indicates whether this stream has a block display or not.
  public $has_block = TRUE;

  // Maximum number of items in the block display.
  public $block_items_max = 25;

  // Number to indicate how a block-pager should be shown.
  public $block_show_pager = 0;

  // View mode for the block.
  public $block_view_mode = 'default';

  // Maximum number of items in the page display.
  public $page_items_max = 50;

  // Boolean to indicate of a page-pager should be shown.
  public $page_show_pager = 0;

  // Boolean to indicate if the pager is ajax-driven.
  public $page_pager_ajax = 0;

  // View mode for the page.
  public $page_view_mode = 'default';

  // Setting for the number of grouped items maximum.
  public $show_message_times = 1;

  // Setting for the number of grouped items maximum in a grouped message.
  public $show_message_times_grouped = 0;

  // Denied message templates.
  public $messages_denied = array();

  // Limit the number of messages by maximum messages to load.
  public $num_load_max = 100;

  // Limit the timespan to group messages.
  public $grouping_seconds = 7200;

  // Boolean for to skip the viewing user, defaults to false.
  public $skip_active_user = FALSE;

  // Timestamp used to poll for newer messages.
  public $poll_messages = 0;

  // How to notify there are newer messages.
  public $poll_messages_type = 0;

  // Stream path is the path to the stream page (optional).
  public $stream_path = '';

  // Stream user path is the path to a stream on the profile page (optional).
  public $stream_profile_path = '';

  // Settings variable
  public $settings = array();

  /**
   * Constructor to load the type variable
   */
  public function __construct() {
    $this->grouping_seconds = variable_get('heartbeat_activity_grouping_seconds', 7200);
  }

}