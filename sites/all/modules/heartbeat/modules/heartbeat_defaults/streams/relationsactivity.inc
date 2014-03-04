<?php

/**
 * @file
 * User relations activity object.
 */

/**
 * Class RelationsActivity
 * Concrete class to build a stream with activity messages for all
 * users that are connected to the viewed user.
 */
class RelationsActivity extends HeartbeatStream {

  /**
   * Fake constructor to hook this method instead of the constructor.
   */
  public function construct() {

    // Add the relations to the viewed user object.
    $this->viewer->relations = heartbeat_related_uids($this->viewer->uid);

    // This stream needs the viewed relations as well. Load them if different.
    if ($this->viewed->uid != $this->viewer->uid) {
      $this->viewed->relations = heartbeat_related_uids($this->viewed->uid);
    }
    else {
      $this->viewed->relations = $this->viewer->relations;
    }

  }

  /**
   * Implementation of queryAlter().
   */
  protected function queryAlter() {
    // This stream is limited to the messages owned by the "viewed" user
    // and his/her relations (friends, fans, ...).
    $this->query->condition('ha.access', HEARTBEAT_PUBLIC_TO_ADDRESSEE, '>=');
    $this->query->condition('ha.uid', $this->viewed->relations, 'IN');

  }

  /**
   * Function to add a part of a sql to a query built by views.
   * @param object $view
   *   The view handler object by reference to add our part to the query
   */
  public function viewsQueryAlter(&$view) {

    // This stream is limited to the messages owned by the "viewed" user
    // and his/her relations (friends, fans, ...).
    $query = $view->query;
    $query->add_where(0, "access", HEARTBEAT_PUBLIC_TO_ADDRESSEE, ">=");
    $query->add_where(0, "uid", $this->viewed->relations, 'IN');

  }
}