<?php

/**
 * @file
 *   Defines a stream for Group Activity.
 */

/**
 * Concrete class GroupActivity
 *   Defines a stream for activity within a group.
 */
class GroupActivity extends HeartbeatStream {

  public $nid = 0;
  public $og_context = NULL;
  public $group = NULL;

  public function construct() {
    $this->detectGroup();
  }

  /**
   * detectGroup
   *
   * Detects the group for a given node ID.
   */
  private function detectGroup() {
  	// First check the contextual arguments that could have been sent along
  	// with ajax posts to get the context of the current node.
  	if (!empty($_GET['contextualArguments']) && isset($_GET['contextualArguments']['og_etid'])) {
  		$this->setGroup($_GET['contextualArguments']['og_etid']);
  	}
  	// Set the group via current group context.
    elseif ($og_context = og_context()) {
      $this->og_context = $og_context;
      $this->setGroup($og_context->etid);
    }

  }

  /**
   * modifyActivityMessage().
   */
  public function modifyActivityMessage(HeartbeatActivity $heartbeatActivity) {
  	// Add the content node context.
    $heartbeatActivity->nid = $this->nid;
    $heartbeatActivity->in_group = 1;
  }

  /**
   * setGroup
   *
   * Sets the group for a given node ID.
   * @param Integer $nid
   *   The group node ID.
   */
  private function setGroup($nid) {
    $this->nid = $nid;
    // Add the node ID to the contextual arguments.
    $this->contextual_arguments['og_etid'] = $this->nid;
    // Load the group.
    $this->group = node_load($this->nid);
  }

  /**
   * hasAccess
   *
   * @param $text
   * @return boolean to indicate the access to the stream
   */
  public function hasAccess() {
    return $this->nid > 0 ? TRUE : FALSE;
  }

  /**
   * Implementation of queryAlter().
   */
  protected function queryAlter() {

    $this->query->condition('ha.nid', 0, '<>');
    $this->query->condition('ha.in_group', 0, '<>');
    $this->query->condition(db_or()
      ->condition('ha.nid', $this->nid)
      ->condition('ha.nid_target', $this->nid)
    );

  }

}
