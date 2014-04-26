<?php
/*
 * @file
 * Node activity access object
 */

/**
 * Class NodeActivity
 * Stream with all activity related to nodes.
 */
class NodeActivity extends HeartbeatStream {

  // Contains the Node ID for which should be filtered.
  protected $nid = 0;

  /**
   * getNid().
   *
   * Function to retrieve the node id
   */
  public function getNid() {
    return $this->nid;
  }

  /**
   * setNid().
   */
  public function setNid($nid) {
    $this->nid = $nid;
    // Add the node ID to the contextual arguments.
    $this->contextual_arguments['nid'] = $this->nid;
  }

  /**
   * Implements construct().
   */
  public function construct() {

  	// First check the contextual arguments that could have been sent along
  	// with ajax posts to get the context of the current node.
  	if (!empty($_GET['contextualArguments']) && isset($_GET['contextualArguments']['nid'])) {
  		$this->setNid($_GET['contextualArguments']['nid']);
  	}
    elseif (arg(0) == "node" && is_numeric(arg(1))) {
      $this->setNid(arg(1));
    }

  }

  /**
   * modifyActivityMessage().
   * This will make sure the nid is saved when a message is logged.
   * E.g. ActivityStatus plugin with a shout in node context.
   */
  public function modifyActivityMessage(HeartbeatActivity $heartbeatActivity) {
  	// Add the content node context.
    $heartbeatActivity->nid = $this->nid;
  }

  /**
   * Implements queryAlter().
   */
  protected function queryAlter() {
    $this->query
      ->condition('ha.access', 0, '>')
      ->condition(db_or()
        ->condition('ha.nid', $this->nid)
        ->condition('ha.nid_target', $this->nid)
      );
  }

  /**
   * Function to add a part of a sql to a query built by views UI
   *
   * @param object $view
   *   The  view handler by reference to add our part to the query.
   */
  public function viewsQueryAlter(&$view) {
    $views->query
      ->condition('ha.access', 0, '>')
      ->condition(db_or()
        ->condition('ha.nid', $this->nid)
        ->condition('ha.nid_target', $this->nid)
      );
  }
}