<?php
/*
 * @file
 * Integrates with Organic Groups module.
 */

/**
 * Class HeartbeatOgPlugin.
 */
class HeartbeatOgPlugin extends HeartbeatBasePlugin implements iHeartbeatPlugin  {

  /**
   * loadAttachments().
   * Loads extra attachments onto a heartbeat activity message.
   */
  public function loadAttachments(HeartbeatActivity & $heartbeatActivity, $name = NULL) {

  }

  /**
   * hasContent().
   * True if a plugin provides attachments.
   */
  public function hasContent() {
    return FALSE;
  }

  /**
   * hasAttachmentsContent().
   * True if the message has attachments content.
   */
  public function hasAttachmentsContent() {
    return FALSE;
  }

  /**
   * renderAttachmentsContent().
   */
  public function renderAttachmentsContent(HeartbeatActivity $heartbeatActivity) {
    return '';
  }

  /**
   * hasButtons().
   * True if a plugin provides attachments.
   */
  public function hasButtons() {
    return FALSE;
  }

  /**
   * hasAttachmentsButtons().
   * True if a message has attachment buttons.
   */
  public function hasAttachmentsButtons() {
    return FALSE;
  }

  /**
   * renderButtons().
   */
  public function renderButtons(HeartbeatActivity $heartbeatActivity) {
    return '';
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

  }

}