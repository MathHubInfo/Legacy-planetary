<?php

/**
 * Prepares a heartbeat stream.
 * @param $stream_name Name of the stream.
 */
function heartbeat_stream($stream_name, $page = 0, $account = NULL) {

  static $streams;

  try {

    if (!isset($streams[$stream_name])) {

      // Load a configuration object for the stream.
      $streamConfig = heartbeat_stream_config_load($stream_name);

      // Load the stream if access to it is granted.
      if (_heartbeat_stream_has_access($streamConfig)) {

        $heartbeatStream = HeartbeatStreamFactory::getStream($streamConfig, $page, $account);

        // Add settings that need to be set for each stream.
        drupal_add_js(array('heartbeatPollNewerMessages' => array($streamConfig->class => $streamConfig->poll_messages)), 'setting');
        drupal_add_js(array('heartbeatPollTypes' => array($streamConfig->class => $streamConfig->poll_messages_type)), 'setting');

        // Give other modules a chance to take action when the stream is loaded.
        module_invoke_all('heartbeat_stream_load', $heartbeatStream);

        if ($heartbeatStream instanceof HeartbeatStream && !$heartbeatStream->hasErrors()) {
          $streams[$stream_name] = $heartbeatStream;
        }
        else {
          $streams[$stream_name] = FALSE;
        }
      }
      else {
      	$streams[$stream_name] = FALSE;
      }

    }

  }
  catch (HeartbeatInvalidStreamException $h) {
    drupal_set_message($h->getMessage());
    drupal_not_found();
  }

  return $streams[$stream_name];
}

/**
 * Builds a heartbeat stream in the StreamObject.
 */
function heartbeat_stream_build(HeartbeatStream & $heartbeatStream) {
  // Load the messages.
  $messages = $heartbeatStream->execute();
}

/**
 * Builds a heartbeat stream from views results.
 */
function heartbeat_stream_views_build(HeartbeatStream & $heartbeatStream, $values) {
  // Load the messages from views response.
  return $heartbeatStream->executeViews($values);
}

/**
 * Views a heartbeat stream.
 */
function heartbeat_stream_view(HeartbeatStream & $heartbeatStream, $view_mode = NULL) {
  if (isset($view_mode)) {
    $heartbeatStream->setViewMode($view_mode);
  }
  $build = $heartbeatStream->render();
  return $build;
}

/**
 * Load all the stream configuration objects.
 *
 * @param Boolean $reset
 *   Indicates whether the stream data needs to be rebuilt.
 */
function heartbeat_stream_config_load_all($reset = FALSE) {

  $streams = &drupal_static('heartbeat_streams');

  if (!$reset && $object = cache_get('heartbeat_streams')) {
    $streams = $object->data;
  }
  else {
    // Fetch the streams with ctools export.
    ctools_include('export');
    $streams = ctools_export_crud_load_all('heartbeat_streams');
    cache_set('heartbeat_streams', $streams);
  }

  return $streams;

}

/**
 * Implementation of ctools load all function.
 */
function _heartbeat_stream_config_load_all($reset) {
  $streams = ctools_export_load_object('heartbeat_streams', 'all');
  foreach (array_keys($streams) as $key) {
    _heartbeat_stream_config_unpack($streams[$key]);
  }
  return $streams;
}

/**
 * Menu loader for the configuration object of a stream.
 */
function heartbeat_stream_config_load($class) {

  $streams = &drupal_static('heartbeat_streams');

  if (!isset($streams[$class])) {
    ctools_include('export');
    $streams[$class] = ctools_export_crud_load('heartbeat_streams', $class);
    if (isset($streams[$class])) {
      _heartbeat_stream_config_unpack($streams[$class]);
    }
  }

  return $streams[$class];

}

/**
 * Implements Ctools load function.
 */
function _heartbeat_stream_config_load($name) {

  $result = ctools_export_load_object('heartbeat_streams', 'names', array($name));
  if (isset($result[$name])) {
    return $result[$name];
  }

}

/**
 * Helper function to reset cached streams and attached menu entries.
 */
function heartbeat_stream_config_reset($streamConfig = NULL) {

  // Clear the heartbeat stream cache.
  cache_clear_all('heartbeat_streams', 'cache');
  drupal_static_reset('heartbeat_streams');

  // This is the only way we can let the menu system know that the
  // menu needs to be rebuild. Just calling menu_rebuild here is too
  // soon and would result in not clearing the menu later on.
  variable_set('menu_rebuild_needed', TRUE);

}

/**
 * Helper function to unpack the settings into the root of the object.
 */
function _heartbeat_stream_config_unpack(HeartbeatStreamConfig & $streamConfig) {
  if (!empty($streamConfig->settings)) {
    foreach ($streamConfig->settings as $key => $value) {
      $streamConfig->$key = $value;
    }
  }
}

/**
 * Helper function to check access on activity stream by name.
 *
 * @param String $stream
 *   The ClassName of the stream.
 */
function heartbeat_stream_has_access($stream) {
  $streamConfig = heartbeat_stream_config_load($stream);
  return _heartbeat_stream_has_access($streamConfig);
}

/**
 * Helper function to check access on activity stream.
 *
 * @param HeartbeatStreamConfig $streamConfig
 *   A Heartbeat stream configuration object.
 */
function _heartbeat_stream_has_access($streamConfig = NULL) {
  if (isset($streamConfig) && $streamConfig instanceof HeartbeatStreamConfig) {
    return user_access('view heartbeat messages') && user_access('view ' . $streamConfig->name . ' stream');
  }
  return FALSE;
}

/**
 * Factory to return a stream object.
 */
class HeartbeatStreamFactory {

  public static function getStream($streamConfig, $page = 0, $account = NULL) {

    $className = !empty($streamConfig->real_class) ? $streamConfig->real_class : $streamConfig->class;
    if (class_exists($className)) {
      return new $className($streamConfig, $page, $account);
    }
    else {
      throw new HeartbeatInvalidStreamException(t('Stream class @class does not exist in @path or it\'s not auto-included in yourmodule.info.', array('@class' => $streamConfig->class, '@path' => $streamConfig->path)), 1000, 'stream does not exist');
    }

  }

}

class HeartbeatInvalidStreamException extends Exception {

  public $arguments;

  function __construct($message, $code = 0, $arguments = array()) {
    parent::__construct($message, $code);
    $this->arguments = $arguments;
  }

}