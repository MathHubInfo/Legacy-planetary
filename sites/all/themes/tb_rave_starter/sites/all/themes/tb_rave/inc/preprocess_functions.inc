<?php

/**
 * Temporarily for color and will move to nucleus 1.1
 */
function tb_rave_preprocess_page(&$vars) {
  $skin = theme_get_setting("skin");
  $default_logo = theme_get_setting("default_logo");
  $toggle_logo = theme_get_setting("toggle_logo");
  if (!empty($skin) && $default_logo && $toggle_logo) {
    $vars['logo'] = file_create_url(drupal_get_path('theme', 'tb_rave')) . "/skins/" . $skin . "/logo.png";
  }
}