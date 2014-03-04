<?php

/**
 * @file
 * Views heartbeat activity access object.
 *
 * This is a pseudo-stream used to fallback in the normal heartbeat flow
 * when views is the query builder.
 *
 */

/**
 * Class ViewsActivity
 *
 * Concrete class to prepare messages from a views query.
 *
 */
class ViewsActivity extends HeartbeatStream {

	private $streamName = NULL;
	public $rowPlugin = FALSE; // Default for fields (TRUE for row plugin).

  /**
   * Fake constructor to hook this method instead of the constructor.
   */
  public function construct() {
  	parent::construct();
  }

  /**
   * Implements queryAlter().
   */
  protected function queryAlter() {
  }

  /**
   * Function to add a part of a sql to a query built by views.
   * @param object $view
   *   The view handler object by reference to add our part to the query
   */
  public function viewsQueryAlter(&$view) {
  }
}