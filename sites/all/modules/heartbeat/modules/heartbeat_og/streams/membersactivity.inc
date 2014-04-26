<?php

/**
 * @file
 *   Defines a stream for Member Activity.
 */

/**
 * Concrete class MembersActivity
 *   Defines a stream displaying all activity from members in a group.
 */
class MembersActivity extends HeartbeatStream {

  protected $nid = 0;
  protected $og_context = NULL;
  protected $group = NULL;

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
      if (isset($og_context->etid)) {
      	$this->setGroup($og_context->etid);
      }
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

    if (empty($this->og_context->gid)) {
    	$this->nid = 0;
      return;
    }
    $members = array();
    $result = db_query("SELECT u.uid FROM {users} u LEFT JOIN {og_membership} om ON u.uid = om.etid AND om.entity_type = 'user' " .
    		"WHERE om.gid = :gid AND u.status <> '0' AND om.state = '1' ", array(':gid' => $this->og_context->gid));
    foreach ($result as $row) {
      $members[$row->uid] = $row->uid;
    }

    //$this->query->condition('ha.in_group', 0, '<>');
    if (!empty($members)) {
      $this->query->condition('ha.uid', $members, 'IN');
    }

  }

}
