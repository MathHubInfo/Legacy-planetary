<?php

/**
 * @file
 * Display Suite example layout configuration.
 */

function ds_lecture_layout() {
  return array(
    'label' => t('Lecture layout'),
    'regions' => array(
      'profile_left' => t('Profile Left'),
      'profile_right' => t('Profile Right'),
      'content' => t('Content'),
    ),
    // Uncomment if you want to include a CSS file for this layout (example_layout.css)
    'css' => TRUE,
  );
}
