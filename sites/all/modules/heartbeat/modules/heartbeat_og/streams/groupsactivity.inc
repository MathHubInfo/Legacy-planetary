<?php

/**
 * @file
 *   Defines a stream for Groups Activity.
 */

/**
 * Concrete class GroupsActivity
 *   Defines a stream displaying all activity in groups.
 */
class GroupsActivity extends HeartbeatStream {

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
   * Implementation of queryAlter().
   */
  protected function queryAlter() {
    $this->query->condition('ha.in_group', 0, '>');
  }

  /**
   * modifyActivityMessage().
   */
  public function modifyActivityMessage(HeartbeatActivity $heartbeatActivity) {
    $heartbeatActivity->in_group = 1;
  }

}
