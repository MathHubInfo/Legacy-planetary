<?php
/**
 * @file
 * Grid generate funtions.
 */

function nucleus_auto_generate_fluid_grids($grid, $width = 100, $rebuild = FALSE) {
  $grid_uri = "public://nucleus/grid-fluid-" . $grid . "-" . $width . ".css";
  $folder_uri = "public://nucleus";
  nucleus_auto_generate_fluid_grids_opera($grid);
  if (!$rebuild && file_exists($grid_uri)) {
    return;
  }
  global $base_root;
  if (!is_dir($folder_uri)) {
    mkdir($folder_uri, 0777);
  }

  $lines = array();
  $lines[] = 'div.container {';
  $lines[] = '  width: ' . $width . '%;';
  $lines[] = '}';
  $lines[] = "";
  $lines[] = ".grid {";
  $lines[] = "  float: left;";
  $lines[] = "}";
  $lines[] = "";
  $lines[] = "/* for none groupded columns */";

  for ($i = 1; $i <= $grid; $i ++) {
    $s = array();
    $lines[] = ".grid-" . $i . " {";
    $lines[] = "  width: " . (intval($i * 10000000 / $grid) / 100000) . "%;";
    $lines[] = "}";
    $lines[] = "";
  }

  for ($i = $grid; $i >= 1; $i --) {
    $lines[] = "/* for grouped $i columns */";
    for ($j = 1; $j <= $i; $j ++) {
      $lines[] = ".group-" . $i . " .grid-" . $j . " {";
      $lines[] = "  width: " . (intval($j * 10000000 / $i) / 100000) . "%;";
      $lines[] = "}";
    }
  }
  file_put_contents($grid_uri, implode("\n", $lines));
}

function nucleus_auto_generate_fixed_grids($grid, $width, $rebuild = FALSE) {
  $grid_uri = "public://nucleus/grid-fixed-" . $grid . "-" . $width . ".css";
  $folder_uri = "public://nucleus";
  if (!$rebuild && file_exists($grid_uri)) {
    return;
  }
  global $base_root;
  if (!is_dir($folder_uri)) {
    mkdir($folder_uri, 0777);
  }
  $lines = array();
  $lines[] = 'div.container {';
  $lines[] = '  width: ' . $width . ';';
  $lines[] = '}';
  $lines[] = "";

  for ($i = 1; $i <= $grid; $i ++) {
    $lines[] = ".grid-" . $i . " {";
    $lines[] = "  width: " . ($width / $grid * $i) . "px;";
    $lines[] = "}";
    $lines[] = "";
  }
  file_put_contents($grid_uri, implode("\n", $lines));
}

function nucleus_auto_generate_fluid_grids_opera($grid) {
  $grid_uri = "public://nucleus/grid-fluid-" . $grid . "-opera.css";
  $folder_uri = "public://nucleus";
  if (file_exists($grid_uri)) {
    return;
  }
  global $base_root;
  if (!is_dir($folder_uri)) {
    mkdir($folder_uri, 0777);
  }
  $lines = array();
  for ($i = 1; $i <= $grid; $i ++) {
    $padding_value = (($i * 100 / $grid) - floor($i * 100 / $grid));
    $padding_value = floor($padding_value * 10000) / 10000;
    $lines[] = ".grid-" . $i . " {";
    $lines[] = "  padding-right: -" . $padding_value . "%;";
    $lines[] = "}";
  }
  for ($i = $grid; $i >= 1; $i --) {
    $lines[] = "\n/* for grouped $i columns */";
    for ($j = 1; $j <= $i; $j ++) {
      $padding_value = (($j * 100 / $i) - floor($j * 100 / $i));
      $padding_value = floor($padding_value * 10000) / 10000;
      $lines[] = ".group-" . $i . " .grid-" . $j . " {";
      $lines[] = "  padding-right: -" . $padding_value . "%;";
      $lines[] = "}";
    }
  }
  file_put_contents($grid_uri, implode("\n", $lines));
}

/**
 * Generate grid options list.
 *
 * @param $grid
 *   is a number shows the grid (example 12, 16, 24).
 *
 * @return
 *   array will be the options in a select box.
 */
function nucleus_grid_options($grid) {
  $options = array(0 => t('Hidden'));
  for ($i = 1; $i <= $grid; $i ++) {
    $options[$i] = ($i == 1) ? t($i . ' columns') : t($i . ' columns');
  }
  return $options;
}

function nucleus_grid_number_options($max = 100) {
  static $_nucleus_grid_options = NULL;
  if ($_nucleus_grid_options) {
    return $_nucleus_grid_options;
  }
  $themes = list_themes();
  $theme_keys = nucleus_get_theme_keys();
  $supported_grids = nucleus_get_predefined_param('supported_grids');

  $options = array();
  if (isset($supported_grids['min']) && isset($supported_grids['max'])) {
    $delta = isset($supported_grids['delta']) && intval($supported_grids['delta']) > 0 ? $supported_grids['delta']  : 1;
    for ($i = $supported_grids['min']; $i <= $supported_grids['max']; $i += $delta) {
      $options[$i] = ($i == 1) ? t($i . ' column') : t($i . ' columns');
    }
  }
  else {
    if (isset($supported_grids['min'])) {
      unset($supported_grids['min']);
    }
    if (isset($supported_grids['max'])) {
      unset($supported_grids['max']);
    }
    if (isset($supported_grids['delta'])) {
      unset($supported_grids['delta']);
    }
    $options = !empty($supported_grids) ? $supported_grids : array(12 => "12 columns", 16 => "16 columns", 24 => "24 columns");
  }

  $_nucleus_grid_options = $options;
  return $_nucleus_grid_options;
}

function nucleus_max_grid() {
  static $_nucleus_max_grid = NULL;
  if ($_nucleus_max_grid) {
    return $_nucleus_max_grid;
  }
  $themes = list_themes();
  $theme_keys = nucleus_get_theme_keys();
  $supported_grids = nucleus_get_predefined_param('supported_grids');

  if (isset($supported_grids['min']) && isset($supported_grids['max'])) {
    $_nucleus_max_grid = $supported_grids['max'];
  }
  else {
    $_nucleus_max_grid = 24;
    foreach ($supported_grids as $key => $value) {
      if (intval($key) > $_nucleus_max_grid) {
        $_nucleus_max_grid = intval($key);
      }
    }
  }

  return $_nucleus_max_grid;
}

function nucleus_layout_width_options($min = 800, $max = 1080, $grid_number = 1) {
  $grid_number = empty($grid_number) ? 1 : $grid_number;
  $options = array();
  for ($i = $min; $i <= $max; $i ++) {
    if ($i % $grid_number == 0) {
      $options[$i] = $i . " " . t("pixels");
    }
  }
  $options['custom'] = t("Custom");
  return $options;
}

function nucleus_get_grid_setting() {
  static $_nucleus_get_grid_setting = FALSE;
  if (!$_nucleus_get_grid_setting) {
    $_nucleus_get_grid_setting = array();

    $grid = theme_get_setting('grid');
    if (intval($grid) <= 0) {
      $grid = drupal_substr($grid, -2);
      if (intval($grid) <= 0) {
        $grid = '24';
      }
    }
    $grid = intval($grid);

    $layout_width_selector = theme_get_setting('layout_width_selector');
    $layout_width_custom = theme_get_setting('layout_width_custom');
    $layout_width_custom = empty($layout_width_custom) ? theme_get_setting('layout_width') : $layout_width_custom;
    $width = intval($layout_width_custom);
    $layout_width = '960px';
    $layout_width_int = 960;
    $grid_type = 'fixed';
    if ($layout_width_selector == 'custom' || empty($layout_width_selector)) {
      $layout_width_selector = 'custom';
      if ($width <= 0) {
        $width = 960;
        while ($width % $grid != 0) {
          $width ++;
        }
        $layout_width = $width . "px";
        $layout_width_int = $width;
        $grid_type = 'fixed';
      }
      elseif ($width > 100) {
        while ($width % $grid != 0) {
          $width --;
        }
        $layout_width = $width . "px";
        $layout_width_int = $width;
        $grid_type = 'fixed';
      }
      else {
        $layout_width = $width . "%";
        $layout_width_int = $width;
        $grid_type = 'fluid';
      }
    }
    else {
      $width = intval($layout_width_selector);
      if ($width <= 0) {
        $width = 960;
      }
      while ($width % $grid != 0) {
        $width --;
      }
      $layout_width_selector = $width;
      $layout_width = $width . "px";
      $layout_width_int = $width;
      $grid_type = 'fixed';
    }

    $_nucleus_get_grid_setting['grid'] = 'grid-' . $grid;
    $_nucleus_get_grid_setting['grid_int'] = $grid;
    $_nucleus_get_grid_setting['grid_type'] = $grid_type;
    $_nucleus_get_grid_setting['layout_width'] = $layout_width;
    $_nucleus_get_grid_setting['layout_width_int'] = $layout_width_int;
    $_nucleus_get_grid_setting['layout_width_selector'] = $layout_width_selector;
    $_nucleus_get_grid_setting['layout_width_custom'] = $layout_width_custom;
  }
  return $_nucleus_get_grid_setting;
}
