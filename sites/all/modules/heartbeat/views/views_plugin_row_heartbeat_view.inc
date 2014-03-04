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
class views_plugin_row_heartbeat_view extends views_plugin_row {

  // Basic properties that let the row style follow relationships.
  public $base_table = 'heartbeat_activity';
  public $base_field = 'uaid';
  // Properties for internal storage.
  public $activities = array();
  public $stream = NULL;

  /**
   * Implements init(&$view, &$display, $options).
   */
  function init(&$view, &$display, $options = NULL) {
    parent::init($view, $display, $options);
    // Handle existing views which has used build_mode instead of view_mode.
    if (isset($this->options['build_mode'])) {
      $this->options['view_mode'] = $this->options['build_mode'];
    }
  }

  /**
   * Implements option_definition().
   */
  function option_definition() {
    $options = parent::option_definition();

    $options['view_mode'] = array('default' => 'full');
    $options['links'] = array('default' => TRUE);
    $options['comments'] = array('default' => FALSE);

    return $options;
  }

  /**
   * Implements options_form(&$form, &$form_state).
   *
   */
  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);

    $options = $this->options_form_summary_options();
    $form['view_mode'] = array(
      '#type' => 'select',
      '#options' => $options,
      '#title' => t('View mode'),
      '#default_value' => $this->options['view_mode'],
     );
    $form['links'] = array(
      '#type' => 'checkbox',
      '#title' => t('Display links'),
      '#default_value' => $this->options['links'],
    );
    $form['comments'] = array(
      '#type' => 'checkbox',
      '#title' => t('Display comments'),
      '#default_value' => $this->options['comments'],
    );
  }

  /**
   * Implements options_form_summary_options().
   *
   * Return the main options, which are shown in the summary title.
   */
  function options_form_summary_options() {
    $entity_info = entity_get_info('heartbeat_activity');
    $options = array();
    if (!empty($entity_info['view modes'])) {
      foreach ($entity_info['view modes'] as $mode => $settings) {
        $options[$mode] = $settings['label'];
      }
    }
    if (empty($options)) {
      $options = array(
        'full' => t('Full content')
      );
    }

    return $options;
  }

  function summary_title() {
    $options = $this->options_form_summary_options();
    return check_plain($options[$this->options['view_mode']]);
  }

  /**
   * Implements pre_render($values).
   *
   * Here the stream is build, but letting users create the stream custom.
   * If they do so, the default access checks which heartbeat normally does
   * in the query will not be executed.
   * If they configured the stream to behave like a heartbeat stream, then
   * Heartbeat will take over the base query.
   */
  function pre_render($values) {
    $uaids = array();
    foreach ($values as $row) {
      $uaids[] = $row->{$this->field_alias};
    }

    // We create a stream, however the query does not need to run since
    // views took care of that part. By creating a stream we can provide
    // the general flow to display everything.
    if ($heartbeatStream = heartbeat_stream('viewsactivity', $this->display->display_plugin == 'page', $GLOBALS['user'])) {

    	$heartbeatStream->rowPlugin = TRUE;

      // Use the views limit instead of heartbeats stream setting.
      if (isset($this->view->query->limit)) {
        $heartbeatStream->config->num_load_max = $this->view->query->limit;
      }

      // Load activities by using the heartbeat loader.
      $this->activities = heartbeat_stream_views_build($heartbeatStream, $uaids);

      // Store the stream for later usage.
      $this->stream = $heartbeatStream;

      if ($heartbeatStream->hasErrors()) {
        drupal_set_message(implode('<br />', $heartbeatStream->getErrors()));
      }

    }

  }

  /**
   * Implements render($row).
   *
   */
  function render($row) {
  	$uaid = isset($row->uaid) ? $row->uaid : (isset($row->heartbeat_activity_uaid) ? $row->heartbeat_activity_uaid : 0);
    if ($uaid) {
      $activity = heartbeat_activity_load($uaid);
      $build = heartbeat_activity_view($activity);
      return render($build);
    }
    return '';
  }

}
