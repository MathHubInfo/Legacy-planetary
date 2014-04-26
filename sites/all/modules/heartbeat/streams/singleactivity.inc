<?php

/**
 * @file
 *   Defines a stream for one activity message.
 */

/**
 * Concrete class SingleActivity
 *   Defines a stream for one activity message.
 */
class SingleActivity extends HeartbeatStream {

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
   * Override the createQuery method.
   * @return HeartbeatParser object
   */
  protected function createQuery() {

    $this->query = db_select('heartbeat_activity', 'ha');
    $this->query->fields('ha');

    // Override the permission based on the user profile status.
    $this->query->leftJoin('heartbeat_user_templates', 'hut', ' ha.uid = hut.uid AND ha.message_id = hut.message_id ');
    $this->query->addField('hut', 'status', 'access_status');

    $this->query->condition('ha.uaid', $this->latest_activity_id);
    $this->query->where(" ha.language IN (:languages) ", array(':languages' => $this->getCurrentLanguages()));

    $this->config->variables['build_mode'] = 'full';

  }

}
