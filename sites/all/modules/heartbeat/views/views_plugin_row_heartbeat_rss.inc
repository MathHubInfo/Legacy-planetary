<?php
/**
 * @file
 * Contains the heartbeat activity view row style plugin.
 */

/**
 * Plugin which performs a heartbeat_activity_view on the resulting object.
 *
 * Most of the code on this object is in the theme function.
 */
class views_plugin_row_heartbeat_rss extends views_plugin_row {
  // Basic properties that let the row style follow relationships.
  public $base_table = 'heartbeat_activity';
  public $base_field = 'uaid';

  // Stores the $activities loaded with pre_render.
  public $activities = array();
  public $stream = NULL;

  function init(&$view, &$display, $options = NULL) {
    parent::init($view, $display, $options);
    // Handle existing views which has used build_mode instead of view_mode.
    if (isset($this->options['build_mode'])) {
      $this->options['view_mode'] = $this->options['build_mode'];
    }
  }

  function option_definition() {
    $options = parent::option_definition();

    $options['item_length'] = array('default' => 'default');

    return $options;
  }

  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);

    $form['item_length'] = array(
      '#type' => 'select',
      '#title' => t('Display type'),
      '#options' => $this->options_form_summary_options(),
      '#default_value' => $this->options['item_length'],
    );
  }

  /**
   * Return the main options, which are shown in the summary title.
   */
  function options_form_summary_options() {
    return array(
      //'full' => t('Full text'),
      'default' => t('Use default RSS settings'),
    );
  }

  function summary_title() {
    $options = $this->options_form_summary_options();
    return check_plain($options[$this->options['item_length']]);
  }

  function pre_render($values) {

    $uaids = array();
    foreach ($values as $row) {
      $uaids[] = $row->{$this->field_alias};
    }

    // We create a stream, however the query does not need to run since
    // views took care of that part. By creating a stream we can provide
    // the general flow to display everything.
    if ($heartbeatStream = heartbeat_stream('viewsactivity', $this->display->display_plugin == 'page', $GLOBALS['user'])) {

      if (isset($this->view->query->limit)) {
        $heartbeatStream->config->num_load_max = $this->view->query->limit;
      }

      $this->activities = heartbeat_stream_views_build($heartbeatStream, $uaids);
      $this->stream = $heartbeatStream;

    }

  }

  function render($row) {

    // For the most part, this code is taken from node_feed() in node.module
    global $base_url;

    $uaid = $row->{$this->field_alias};
    if (!is_numeric($uaid)) {
      return;
    }

    $item_length = $this->options['item_length'];

    // Load the specified activity:
    if (!isset($this->activities[$uaid])) {
      return;
    }
    $activity = $this->activities[$uaid];

    $item_text = '';

    $activity->rss_namespaces = array('xmlns:dc' => 'http://purl.org/dc/elements/1.1/');
    $activity->rss_elements = array(
      array('key' => 'pubDate', 'value' => gmdate('r', $activity->timestamp)),
      array('key' => 'dc:creator', 'value' => $activity->actor->name),
      array('key' => 'guid', 'value' => $activity->uaid . ' at ' . $base_url, 'attributes' => array('isPermaLink' => 'false'))
    );

    // The node gets built and modules add to or modify $node->rss_elements
    // and $node->rss_namespaces.

    // Remove previously built content, if exists.
    $activity->content = array();

    $view_mode = 'default';

    // Build fields content.
    field_attach_prepare_view('heartbeat_activity', array($activity->uaid => $activity), $view_mode);
    entity_prepare_view('heartbeat_activity', array($activity->uaid => $activity));
    $activity->content += field_attach_view('heartbeat_activity', $activity, $view_mode, $activity->language);

    // Populate $message->content with a render() array.
    $hook = 'heartbeat_activity_view';
    foreach (module_implements($hook) as $module) {
      $function = $module . '_' . $hook;
      if (function_exists($function)) {
        $result = $function($activity, $activity->view_mode, $activity->language);
      }
    }

    $this->view->style_plugin->namespaces = array_merge($this->view->style_plugin->namespaces, $activity->rss_namespaces);

    // Unset the attachements and buttons.
    unset($activity->content['attachments']);
    unset($activity->content['buttons']);

    if (!empty($activity->message)) {
      $item_text .= drupal_render($activity->content);
    }

    $item = new stdClass;
    $item->description = $item_text;
    $item->title = '';
    $item->link = url("heartbeat/message/$activity->uaid", array('absolute' => TRUE));
    $item->elements = $activity->rss_elements;
    $item->uaid = $activity->uaid;

    return theme($this->theme_functions(),
      array(
        'view' => $this->view,
        'options' => $this->options,
        'row' => $item
      ));
  }

}
