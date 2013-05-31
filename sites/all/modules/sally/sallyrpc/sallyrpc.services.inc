<?php
/**
 * @file
 * sallyrpc.services.inc
 */

/**
 * Implements hook_default_services_endpoint().
 */
function sallyrpc_default_services_endpoint() {
  $export = array();

  $endpoint = new stdClass();
  $endpoint->disabled = FALSE; /* Edit this to true to make a default endpoint disabled initially */
  $endpoint->api_version = 3;
  $endpoint->name = 'sallyrpc';
  $endpoint->server = 'xmlrpc_server';
  $endpoint->path = 'sallyrpc';
  $endpoint->authentication = array(
    'services' => 'services',
  );
  $endpoint->server_settings = array();
  $endpoint->resources = array(
    'system' => array(
      'actions' => array(
        'connect' => array(
          'enabled' => '1',
        ),
      ),
    ),
    'user' => array(
      'actions' => array(
        'login' => array(
          'enabled' => '1',
        ),
        'logout' => array(
          'enabled' => '1',
          'settings' => array(
            'services' => array(
              'resource_api_version' => '1.0',
            ),
          ),
        ),
      ),
    ),
  );
  $endpoint->debug = 0;
  $export['sallyrpc'] = $endpoint;

  return $export;
}
