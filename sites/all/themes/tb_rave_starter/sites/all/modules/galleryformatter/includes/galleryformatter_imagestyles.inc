<?php

/**
 * @file
 * Provides default Image styles presets that can be overridden by site administrators.
 */

/*
 * Implementation of hook_image_default_styles().
 */
function galleryformatter_image_default_styles() {
  $styles = array();

  $styles['galleryformatter_slide'] = array(
    'effects' => array(
      array(
        'name' => 'image_scale_and_crop',
        'data' => array('width' => 500, 'height' => 312),
        'weight' => '0',
      ),
    ),
  );
  $styles['galleryformatter_thumb'] = array(
    'effects' => array(
      array(
        'name' => 'image_scale_and_crop',
        'data' => array('width' => 121, 'height' => 75),
        'weight' => '0',
      ),
    ),
  );
  return $styles;
}

