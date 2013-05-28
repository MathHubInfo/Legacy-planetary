<?php
/**
 * @file
 * Custom funtions.
 */

/**
 * Get class name for selected font setting.
 *
 * @param string $prefix
 *   briefing name of font setting.
 * @param string $font_type
 *   type of setting default/google web font/custom/...
 * @param string $font_value
 *   selected font family.
 *
 * @return string
 *   a string is used to class name.
 */
function nucleus_get_class_font($prefix, $font_type, $font_value) {
  $font_value = trim($font_value);
  $font_value = drupal_strtolower($font_value);
  $font_value = drupal_html_class($font_value);
  return $prefix . (!empty($font_type) ? '-' . $font_type : "") . "-" . $font_value;
}

/**
 * Format font family to be able to show as inline CSS.
 *
 * @param string $font_value
 *   font-family.
 *
 * @return string
 *   string is formated for css define.
 */
function nucleus_format_font_family($font_value) {
  $parts = explode(',', $font_value);
  $results = array();
  foreach ($parts as $part) {
    $part = trim($part);
    $part = preg_replace('/[^\w\d_ -]/si', '', $part);
    if (strpos($part, ' ') !== FALSE) {
      $part = "'" . $part . "'";
    }
    $results[] = $part;
  }
  return implode(', ', $results);
}

/**
 * Get font-settings options.
 *
 * @param array $fonts_list
 *   A predefine fonts list is gotten from .info.
 * @param string $prefix
 *   briefing of font setting, such as font-base is fb-.
 * @param bool $is_base_font
 *   flag if it's base-font.
 *
 * @return array
 *   list of font-settings options.
 */
function nucleus_get_font_settings_options($fonts_list, $prefix, $use_base_font) {
  $results = array();
  if ($use_base_font) {
    $results[''] = t('Use base font');
  }
  foreach ($fonts_list as $key => $font) {
    $results[$prefix . $key] = $font;
  }
  return $results;
}

/**
 * Get all active block in a theme
 *
 * @param string $theme
 *   theme key
 *
 * @return array
 *   list of actived blocks
 */
function nucleus_all_blocks_by_theme($theme) {
  static $_nucleus_all_blocks_by_theme = 0;
  if ($_nucleus_all_blocks_by_theme) {
    return $_nucleus_all_blocks_by_theme;
  }
  $blocks = db_select('block', 'b')->fields('b')->condition('theme', $theme)->orderBy('weight', 'ASC')->execute()->fetchAll();
  $_nucleus_all_blocks_by_theme = array();
  foreach($blocks as $block) {
    $b = array();
    foreach($block as $key => $value) {
      $b[$key] = $value;
    }
    $_nucleus_all_blocks_by_theme[] = $b;
  }
  return $_nucleus_all_blocks_by_theme;
}

/**
 * Get list of regions and their blocks.
 *
 * @return array
 *   An array containing all regions and their blocks inside.
 */
function nucleus_get_regions_blocks_list() {
  static $_nucleus_regions_blocks_list = 0;
  if ($_nucleus_regions_blocks_list) {
    return $_nucleus_regions_blocks_list;
  }
  global $theme_key;
  // Retrieve all active blocks in active theme.
  $blocks = block_admin_display_prepare_blocks($theme_key);
  // Retrieve the theme data to list all available regions.
  $theme_data = list_themes();
  $regions = $theme_data[$theme_key]->info['regions'];
  if (!isset($regions[BLOCK_REGION_NONE])) {
    $regions[BLOCK_REGION_NONE] = t('Disabled');
  }
  $_nucleus_regions_blocks_list = array();
  foreach ($regions as $region => $region_title) {
    $_nucleus_regions_blocks_list[$region] = array('region_title' => $region_title, 'blocks' => array());
  }
  foreach ($blocks as $i => $block) {
    $_nucleus_regions_blocks_list[$block['region']]['blocks'][] = $block;
  }
  return $_nucleus_regions_blocks_list;
}

/**
 * Get list to show the relationship of the regions and blocks so that help
 * js code run faster.
 *
 * @return array
 *   List show the relationship of the regions and blocks.
 */
function nucleus_get_js_regions_blocks_list() {
  static $_nucleus_js_regions_blocks_list = 0;
  if ($_nucleus_js_regions_blocks_list) {
    return $_nucleus_js_regions_blocks_list;
  }

  $regions_blocks_list = nucleus_get_regions_blocks_list();

  $_nucleus_js_regions_blocks_list = array('regions' => array(), 'blocks' => array());
  foreach ($regions_blocks_list as $region_key => $region) {
    $region_key = str_replace('_', '-', $region_key);
    $_nucleus_js_regions_blocks_list['regions'][$region_key] = array();
    $blocks = isset($region['blocks']) ? $region['blocks'] : array();
    foreach ($blocks as $block) {
      $block_key = nucleus_get_block_key($block);
      $_nucleus_js_regions_blocks_list['regions'][$region_key][$block_key] = 1;
      if (!isset($_nucleus_js_regions_blocks_list['blocks'][$block_key])) {
        $_nucleus_js_regions_blocks_list['blocks'][$block_key] = $region_key;
      }
    }
  }
  return $_nucleus_js_regions_blocks_list;
}

function nucleus_get_region($block_key) {
  $regions_blocks_list = nucleus_get_js_regions_blocks_list();
  return $regions_blocks_list['blocks'][$block_key];
}
/**
 * Get array setting from info by name.
 *
 * @param string $param
 *   Name of setting in infor file.
 * @param array $pre_array
 *   The sub array will be added to before the first.
 * @param array $suf_array
 *   The sub array will be added to after the last.
 *
 * @return array
 *   Presetting.
 */
function nucleus_get_predefined_param($param, $pre_array = array(), $suf_array = array()) {
  global $theme_key;
  $theme_data = list_themes();
  $result = isset($theme_data[$theme_key]->info[$param]) ? $theme_data[$theme_key]->info[$param] : array();
  return $pre_array + $result + $suf_array;
}

/**
 * Get all info related to extend class is defined in .info.
 */
function nucleus_extend_classes_info() {
  static $_nucleus_extend_classes_info = 0;
  if ($_nucleus_extend_classes_info) {
    // if this info had been generated, don't need regenerate.
    return $_nucleus_extend_classes_info;
  }

  // Get settings related to block styles.
  $block_styles = nucleus_get_predefined_param('block_styles', array('default' => 'Default'));
  $block_extend_classes = nucleus_get_predefined_param('block_extend_classes');
  $block_extended_class_groups = nucleus_get_predefined_param('block_extended_class_groups');

  $visited = array();
  $block_styles_list = array();
  foreach ($block_styles as $style_key => $style_title) {
    $block_styles_list[] = $style_key;
  }

  // initial result
  $_nucleus_extend_classes_info = array();
  $_nucleus_extend_classes_info['support_groups'] = array();
  $_nucleus_extend_classes_info['groups'] = array();
  $_nucleus_extend_classes_info['groups_name_list'] = array();
  $_nucleus_extend_classes_info['classes_list'] = $block_extend_classes;
  $_nucleus_extend_classes_info['style_support_counter'] = array();

  // update result
  foreach ($block_styles_list as $block_style_key) {
    $_nucleus_extend_classes_info['support_groups'][$block_style_key] = array();
  }

  // update result
  foreach ($block_extended_class_groups as $group_key => $group) {
    $_nucleus_extend_classes_info['groups_name_list'][] = $group_key;
    $group_title = isset($group['group_title']) ? $group['group_title'] : "";
    $supported_styles = isset($group['supported_styles']) ? $group['supported_styles'] : FALSE;
    $classes = isset($group['classes']) ? $group['classes'] : "";
    if (is_array($classes)) {
      $classes = implode(', ', $classes);
    }
    $supported_styles_arr = $supported_styles ? explode(',', $supported_styles) : $block_styles_list;
    $classes_arr = explode(',', $classes);

    foreach ($supported_styles_arr as $supported_style) {
      $supported_style = trim($supported_style);
      if (isset($block_styles[$supported_style]) && $supported_style != 'raw') {
        $_nucleus_extend_classes_info['support_groups'][$supported_style][$group_key] = $group_key;
      }
    }

    $_nucleus_extend_classes_info['groups'][$group_key] = array();
    $_nucleus_extend_classes_info['groups'][$group_key]['group_title'] = $group_title;
    $_nucleus_extend_classes_info['groups'][$group_key]['extend_classes'] = array();
    foreach ($classes_arr as $class) {
      $class = trim($class);
      if (isset($block_extend_classes[$class])) {
        $_nucleus_extend_classes_info['groups'][$group_key]['extend_classes'][$class] = $block_extend_classes[$class];
        if (!isset($visited[$class])) {
          $visited[$class] = TRUE;
        }
      }
    }
  }

  $has_class_in_default_group = FALSE;
  foreach ($block_extend_classes as $class_key => $class_title) {
    if (!isset($visited[$class_key])) {
      $has_class_in_default_group = TRUE;
      break;
    }
  }

  if ($has_class_in_default_group) {
    $default_group_name = 'default_group';
    $default_group_title = 'Default group';
    while (isset($_nucleus_extend_classes_info['groups'][$default_group_name])) {
      $default_group_name .= '_';
    }

    foreach ($_nucleus_extend_classes_info['support_groups'] as $group_key => &$support_group) {
      if ($group_key != 'raw') {
        $support_group[$default_group_name] = $default_group_name;
      }
    }

    $_nucleus_extend_classes_info['groups'][$default_group_name] = array(
      'group_title' => t($default_group_title),
      'extend_classes' => array(),
    );

    foreach ($block_extend_classes as $class_key => $class_title) {
      if (!isset($visited[$class_key])) {
        $_nucleus_extend_classes_info['groups'][$default_group_name]['extend_classes'][$class_key] = $class_title;
      }
    }

    $_nucleus_extend_classes_info['groups_name_list'][] = $default_group_name;
  }

  $style_support_counter = array();
  foreach ($_nucleus_extend_classes_info['support_groups'] as $style_key => $groups_list) {
    $style_support_counter[$style_key] = count($groups_list);
  }
  $_nucleus_extend_classes_info['style_support_counter'] = $style_support_counter;

  $groups_name_list = &$_nucleus_extend_classes_info['groups_name_list'];
  $groups = &$_nucleus_extend_classes_info['groups'];
  $n = count($groups_name_list);
  for ($i = 0; $i < $n; $i ++) {
    for ($j = $i + 1; $j < $n; $j ++) {
      if (count($groups[$groups_name_list[$i]]['extend_classes']) < count($groups[$groups_name_list[$j]]['extend_classes'])) {
        $tmp = $groups_name_list[$i];
        $groups_name_list[$i] = $groups_name_list[$j];
        $groups_name_list[$j] = $tmp;
      }
    }
  }
  return $_nucleus_extend_classes_info;
}

/**
 * Generate class name for the group sidebar in page.tpl.php.
 *
 * @param $regions_list
 *   list of the regions in this group, is a string seperated by comma.
 *
 * @return
 *   class name for the group.
 */
function nucleus_group_class($regions_list) {
  $grid = theme_get_setting('grid');
  $grid_type = drupal_substr($grid, 0, 5);

  $regions = explode(",", $regions_list);
  $sidebar_regions_width = nucleus_get_sidebar_regions_width();

  $ggrid = 0;
  $columns_count = 0;
  foreach ($regions as $region) {
    $region = trim($region);
    if (isset($sidebar_regions_width[$region])) {
      $ggrid += $sidebar_regions_width[$region];
      if ($sidebar_regions_width[$region]) {
        $columns_count ++;
      }
    }
  }
  return 'group-cols-' . $columns_count . ' group-' . $ggrid . " grid grid-" . $ggrid;
}

/**
 * Get all sidebar regions.
 */
function nucleus_get_sidebar_regions() {
  static $_nucleus_sidebar_regions = 0;
  if (!$_nucleus_sidebar_regions) {
    global $theme_key;
    $theme_data = list_themes();
    $regions = $theme_data[$theme_key]->info['regions'];
    $_nucleus_sidebar_regions = array();
    foreach ($regions as $key => $value) {
      if (strpos($key, "sidebar_") !== FALSE) {
        $_nucleus_sidebar_regions[$key] = $value;
      }
    }
  }
  return $_nucleus_sidebar_regions;
}

function nucleus_get_current_page_key($page_key = NULL) {
  static $_current_page_key = 'default';
  if (!$page_key) {
    $page_key = $_current_page_key;
  }
  else {
    $_current_page_key = $page_key;
  }
  return $page_key;
}

/**
 * Calculate width of all sidebar regions.
 *
 * @param $page
 *   $vars['page'] in theme_preprocess_page.
 *
 * @return
 *   width of all sidebar and content regions by grid.
 */
function nucleus_get_sidebar_regions_width($page = NULL, $page_key = NULL, $backend_render = FALSE) {
  static $_nucleus_sidebar_regions_width = array();
  $page_key = nucleus_get_current_page_key($page_key);

  if (!isset($_nucleus_sidebar_regions_width[$backend_render][$page_key])) {
    $page_prefix = ($page_key == 'default' || empty($page_key)) ? "" : ($page_key . "_");
    $grid = theme_get_setting('grid');
    $grid_int = drupal_substr($grid, -2);
    $sidebar_regions = nucleus_get_sidebar_regions();
    $_nucleus_sidebar_regions_width[$backend_render] = array();
    $_nucleus_sidebar_regions_width[$backend_render][$page_key] = array();
    $_nucleus_sidebar_regions_width[$backend_render][$page_key]['content'] = $grid_int;
    foreach ($sidebar_regions as $key => $value) {
      $content = render($page[$key]);
      $width = theme_get_setting($page_prefix . $key . "_width");
      $width = empty($width) ? 0 : $width;
      $_nucleus_sidebar_regions_width[$backend_render][$page_key][$key] = $backend_render ? $width : (!empty($content) ? $width : 0);
      $_nucleus_sidebar_regions_width[$backend_render][$page_key]['content'] -= $_nucleus_sidebar_regions_width[$backend_render][$page_key][$key];
    }
  }
  if ($backend_render) {
    $_nucleus_sidebar_regions_width[$backend_render][$page_key] = regenerate_panel_sidebar_regions_width($_nucleus_sidebar_regions_width[$backend_render][$page_key], FALSE);
  }
  return $_nucleus_sidebar_regions_width[$backend_render][$page_key];
}

/**
 * Get all regions.
 */
function nucleus_get_all_regions() {
  static $_nucleus_all_regions = 0;
  if (!$_nucleus_all_regions) {
    global $theme_key;
    $_nucleus_all_regions = array();
    $theme_data = list_themes();
    $regions = $theme_data[$theme_key]->info['regions'];
    $_nucleus_all_regions[BLOCK_REGION_NONE] = t('Disabled');
    $hidden_regions = array('dashboard_main', 'dashboard_sidebar', 'dashboard_inactive', 'page_top', 'page_bottom');
    foreach ($regions as $key => $title) {
      if (!in_array($key, $hidden_regions)) {
        $_nucleus_all_regions[$key] = $title;
      }
    }
  }
  return $_nucleus_all_regions;
}

/**
 * Get all panel regions.
 */
function nucleus_panel_regions() {
  static $_nucleus_panel_regions = 0;
  if (!$_nucleus_panel_regions) {
    global $theme_key;
    $theme_data = list_themes();
    $regions = $theme_data[$theme_key]->info['regions'];
    $_nucleus_panel_regions = array();
    foreach ($regions as $key => $value) {
      if (strpos($key, "panel_") !== FALSE) {
        $parts = explode("_", $key);
        $id = $parts[count($parts) - 1];
        unset($parts[count($parts) - 1]);
        $panel_name = implode("_", $parts);

        if (isset($_nucleus_panel_regions[$panel_name])) {
          $_nucleus_panel_regions[$panel_name][$key] = $value;
        }
        else {
          $_nucleus_panel_regions[$panel_name] = array($key => $value);
        }
      }
    }
  }
  return $_nucleus_panel_regions;
}

/**
 * Calculate width of all panel regions.
 */
function nucleus_panel_regions_width($page_key = NULL, $backend_render = FALSE) {
  static $_nucleus_panel_regions_width = array();
  static $_current_page_key = 'default';
  if (!$page_key) {
    $page_key = $_current_page_key;
  }
  else {
    $_current_page_key = $page_key;
  }
  if (!isset($_nucleus_panel_regions_width[$backend_render][$page_key])) {
    $page_prefix = ($page_key == 'default' || empty($page_key)) ? "" : ($page_key . "_");
    $grid = theme_get_setting('grid');
    $grid_int = drupal_substr($grid, -2);
    $_nucleus_panel_regions = nucleus_panel_regions();
    $_nucleus_panel_regions_width[$backend_render] = array();
    $_nucleus_panel_regions_width[$backend_render][$page_key] = array();
    foreach ($_nucleus_panel_regions as $key => $panels_list) {
      $sum = 0;
      foreach ($panels_list as $panel => $panel_title) {
        $width = theme_get_setting($page_prefix . $panel . "_width");
        $width = empty($width) ? 0 : $width;
        if ($sum + $width > $grid_int) {
          $width = $grid_int - $sum;
        }
        $sum += $width;
        $_nucleus_panel_regions_width[$backend_render][$page_key][$panel] = $width;
      }
    }
  }
  if ($backend_render) {
    $_nucleus_panel_regions_width[$backend_render][$page_key] = regenerate_panel_sidebar_regions_width($_nucleus_panel_regions_width[$backend_render][$page_key]);
  }
  return $_nucleus_panel_regions_width[$backend_render][$page_key];
}

/**
 * Generate briefing list of font settings.
 */
function nucleus_default_fonts_arr() {
  return array(
    'bf' => array('key' => 'base_font', 'title' => 'Base font'),
    'snf' => array('key' => 'site_name_font', 'title' => 'Site name'),
    'ssf' => array('key' => 'site_slogan_font', 'title' => 'Site slogan'),
    'ptf' => array('key' => 'page_title_font', 'title' => 'Page title'),
    'ntf' => array('key' => 'node_title_font', 'title' => 'Node title'),
    'ctf' => array('key' => 'comment_title_font', 'title' => 'Comment title'),
    'btf' => array('key' => 'block_title_font', 'title' => 'Block title'),
  );
}

/**
 * Reset settings of current theme.
 */
function nucleus_reset_settings() {
  global $theme_key;
  variable_del('theme_' . $theme_key . '_settings');
  variable_del('theme_settings');
  $cache = &drupal_static('theme_get_setting', array());
  $cache[$theme_key] = NULL;
}

/**
 * Get template for panels.
 */
function nucleus_get_panel_template() {
  global $theme_key;
  $cache = cache_get(__FUNCTION__ . ':' . $theme_key);
  if ($cache && !empty($cache->data)) {
    return $cache->data;
  }

  $themes = list_themes();
  $theme_keys = nucleus_get_theme_keys();

  $template_file = FALSE;
  for ($i = count($theme_keys) - 1; $i >= 0; $i --) {
    $theme_name = $theme_keys[$i];
    if (file_exists(drupal_get_path('theme', $theme_name) . "/tpl/panel.tpl.php")) {
      $template_file = drupal_get_path('theme', $theme_name) . "/tpl/panel.tpl.php";
      break;
    }
  }
  cache_set(__FUNCTION__ . ':' . $theme_key, $template_file);
  return $template_file;
}

/**
 * Get array of themes to get settings.
 */
function nucleus_get_theme_keys() {
  static $_nucleus_theme_keys = NULL;
  if (!$_nucleus_theme_keys) {
    global $theme_key;
    $themes = list_themes();
    $theme_object = $themes[$theme_key];
    $theme_keys = array();
    if (isset($theme_object->base_themes)) {
      $theme_keys = array_keys($theme_object->base_themes);
      $theme_keys[] = $theme_key;
    }
    elseif (isset($theme_object->base_theme)) {
      $theme_keys = array($theme_object->base_theme, $theme_key);
    }
    else {
      $theme_keys = array($theme_key);
    }
    $_nucleus_theme_keys = $theme_keys;
  }
  return $_nucleus_theme_keys;
}

/**
 * Add css with rule of Conditional Stylesheets modules.
 *
 * source code reference from conditional_styles module
 * http://drupal.org/project/conditional_styles.
 */
function nucleus_add_conditional_styles(&$css) {
  $themes = list_themes();
  $theme_keys = nucleus_get_theme_keys();

  foreach ($theme_keys as $key) {
    $theme_path = drupal_get_path('theme', $key) . '/';
    if (isset($themes[$key]->info['stylesheets-conditional'])) {
      foreach (array_keys($themes[$key]->info['stylesheets-conditional']) as $condition) {
        foreach (array_keys($themes[$key]->info['stylesheets-conditional'][$condition]) as $media) {
          foreach ($themes[$key]->info['stylesheets-conditional'][$condition][$media] as $stylesheet) {
            $parts = explode("/", $stylesheet);
            $css_filename = $parts[count($parts) - 1];
            // Add each conditional stylesheet.
            $css = drupal_add_css(
              $theme_path . $stylesheet,
              array(
                'group' => CSS_THEME,
                'browsers' => array(
                  'IE' => $condition,
                  '!IE' => FALSE,
                ),
                'every_page' => TRUE,
                'basename' => $key . '-' . $css_filename,
              )
            );
          }
        }
      }
    }
  }
}

/**
 * Get array of typo_keys_map to help source code in html_preprocess is shorter.
 */
function nucleus_typo_key_map() {
  return array(
    'snf' => '.site-name',
    'ssf' => '.site-slogan',
    'ptf' => '#page-title',
    'ntf' => '.node-title',
    'ctf' => '.comment-title',
    'btf' => '.block-title',
  );
}

/**
 * Check if a region is a panel
 *
 * @param $region_key
 *   region name
 *
 * @return
 *   boolean value
 */
function nucleus_is_panel_region($region_key) {
  return strpos($region_key, "panel_") !== FALSE;
}

/**
 * Check if a region is a panel
 *
 * @param $region_key
 *   region name
 *
 * @return
 *   boolean value
 */
function nucleus_is_sidebar_region($region_key) {
  return strpos($region_key, "sidebar_") !== FALSE;
}

function regenerate_panel_sidebar_regions_width($regions_width) {
  $grid_info = nucleus_get_grid_setting();
  $grid_int = $grid_info['grid_int'];
  foreach ($regions_width as $key => $value) {
    if ($value == 0) {
      $regions_width[$key] = $grid_int;
    }
  }
  return $regions_width;
}

function nucleus_get_key_from_name($name) {
  return str_replace("-", "_", $name);
}

function nucleus_get_prefix_from_key($key) {
  return $key == 'default' ? "" : $key . "_";
}

function nucleus_get_block_key($block) {
  $block_name = is_array($block) ? ($block['module'] . "_" . $block['delta']) : ($block->module . "_" . $block->delta);
  return nucleus_get_key_from_name($block_name);
}

function nucleus_parse_css_add(&$css, $key, $codestr) {
  $key = drupal_strtolower($key);
  $codestr = drupal_strtolower($codestr);
  if (!isset($css[$key])) {
    $css[$key] = array();
  }
  $codes = explode(";", $codestr);
  if (count($codes) > 0) {
    foreach ($codes as $code) {
      $code = trim($code);
      $style = explode(":", $code);
      if (count($style) > 1) {
        $codekey = trim($style[0]);
        $codevalue = trim($style[1]);
        if ($codekey == 'float') {
          $css[$key][$codekey] = $codevalue;
        }
      }
    }
  }
}

function nucleus_get_css($css) {
  $result = "";
  foreach ($css as $key => $values) {
    if (!empty($values)) {
      $result .= $key . " {\n";
      foreach ($values as $key => $value) {
        $result .= "  $key: $value;\n";
      }
      $result .= "}\n\n";
    }
  }
  return $result;
}

function nucleus_parse_css_str($str) {
  $css = array();
  $str = preg_replace("/\/\*(.*)?\*\//Usi", "", $str);
  $parts = explode("}", $str);
  if (count($parts) > 0) {
    foreach ($parts as $part) {
      $sub_parts = explode("{", $part);
      if (count($sub_parts) > 1) {
        list($keystr, $codestr) = $sub_parts;
        $keys = explode(",", trim($keystr));
        if (count($keys) > 0) {
          foreach ($keys as $key) {
            if (drupal_strlen($key) > 0) {
              $key = str_replace("\n", "", $key);
              $key = str_replace("\\", "", $key);
              nucleus_parse_css_add($css, $key, trim($codestr));
            }
          }
        }
      }
    }
  }
  return $css;
}

function nucleus_parse_css_file($filename) {
  if (file_exists($filename)) {
    return nucleus_parse_css_str(file_get_contents($filename));
  }
  else {
    return FALSE;
  }
}

function nucleus_get_layout_style($css_file) {
  $cache = cache_get(__FUNCTION__ . ':' . $css_file);
  if ($cache && !empty($cache->data)) {
    return $cache->data;
  }
  $css = nucleus_parse_css_file($css_file);
  $filtered_css = nucleus_get_css($css);
  cache_set(__FUNCTION__ . ':' . $css_file, $filtered_css);
  return $filtered_css;
}

function nucleus_block_style_setting($name, $page_prefix = "") {
  $value = theme_get_setting($name);
  if (empty($value) && empty($page_prefix)) {
    $value = theme_get_setting('default_' . $name);
  }
  return $value;
}
