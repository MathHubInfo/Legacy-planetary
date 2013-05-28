<?php

/**
 * @file
 * Token processing for Widgets module
 */

function widgets_token_info() {
  $type = array(
    'name' => t('Widgets'), 
    'description' => t('Tokens for widget sets.'), 
    //'needs-data' => 'socialmedia',
  );
  $tokens = array(
    'widgets' => array(),
  );

  $widget_sets = widgets_sets();
  foreach ($widget_sets AS $name => $data) {
    $edesc = t('Display %name widget set',
      array(
        '%name' => $name,
      ));
    $tokens['widgets']['ws-' . $name] = array(
      'name' => $name,
      'description' => $edesc,
    );
  }
  
  return array(
    'types' => array('widgets' => $type), 
    'tokens' => array(
      'widgets' => $tokens['widgets'],
    ),
  );
}

function widgets_tokens($type, $tokens, array $data = array(), array $options = array()) {
  $replacements = array();
  if ($type == 'widgets') {
    foreach ($tokens as $name => $original) { 
      if (strpos($name, 'ws-') === 0) {
        $name = substr($name, 3);
        $set = widgets_set_load($name);
        $replacements[$original] = theme('widgets_set_view', array('set' => $set));
      }
    }
  }

  return $replacements;
}


