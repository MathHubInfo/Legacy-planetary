<?php
/**
 * @file
 */

function nucleus_page_preview(&$page_params, &$form) {
  global $theme_key, $theme;
  drupal_theme_initialize();
  $regions_blocks_list = $page_params['regions_blocks_list'];
  nucleus_create_page_hiddens($regions_blocks_list, $page_params['page_prefix'], $form);

  $page = array('#show_messages' => FALSE);
  $sidebar_regions_width = nucleus_get_sidebar_regions_width($page, $page_params['page_key'], TRUE);
  $panel_regions_width = nucleus_panel_regions_width($page_params['page_key'], TRUE);
  foreach ($regions_blocks_list as $region_key => $region_content) {
    $region_params = array(
      'region_key' => $region_key,
      'region_content' => $region_content,
      'page_key' => $page_params['page_key'],
      'page_prefix' => $page_params['page_prefix'],
      'block_styles' => $page_params['block_styles'],
      'grid_options' => $page_params['grid_options'],
    );
    $page[$region_key] = array(
      "#markup" => nucleus_region_preview($region_params, $form),
    );
  }
  $sidebar_regions_width = nucleus_get_sidebar_regions_width($page, $page_params['page_key'], FALSE);
  $panel_regions_width = nucleus_panel_regions_width($page_params['page_key'], FALSE);
  $hidden_regions = array();
  foreach ($regions_blocks_list as $region_key => $region_content) {
    if((isset($sidebar_regions_width[$region_key]) && $sidebar_regions_width[$region_key] == 0)
       || (isset($panel_regions_width[$region_key]) && $panel_regions_width[$region_key] == 0)
       || $region_key == BLOCK_REGION_NONE) {
         $hidden_regions[] = $page[$region_key]['#markup'];
         $page[$region_key]['#markup'] = '';
       }
  }
  $vars = array();
  $vars['page_key'] = $page_params['page_key'];
  $vars['page'] = $page;
  $result = nucleus_page_render_simulation($vars, $page_params);

  $extend_markup = nucleus_region_preview(
    array('grid' => $page_params['grid'], 'markup' => implode("\n", $hidden_regions)),
    $form,
    drupal_get_path('theme', 'nucleus') . "/tpl/admin/nucleus-disabled-region-preview.tpl.php"
  );
  
  $popup_markup = nucleus_popup_form($page_params);
  return $popup_markup . $result . $extend_markup;
}

function nucleus_popup_form($page_params) {
  $all_regions = nucleus_get_all_regions();
  $popup_form = array(
    '#type' => 'container',
    '#attributes' => array('class' => array('block-styles-wrapper', 'form-popup-container'))
  );

  if (module_exists('jquery_update')) {
    $popup_form['popup_region_selector'] = array(
      '#type' => 'select',
      '#name' => 'popup_region_selector',
      '#title' => t('Select Region:'),
      '#value' => '',
      '#options' => $all_regions,
    );
  }

  $popup_form['popup_region_width_selector'] = array(
    '#type' => 'select',
    '#title' => t("Width:"),
    '#name' => 'popup_region_width_selector',
    '#value' => "",
    '#options' => $page_params['grid_options'],
  );

  $popup_form['popup_block_style_selector'] = array(
    '#type' => 'select',
    '#name' => 'popup_block_style_selector',
    '#title' => t('Select Block Style:'),
    '#value' => '',
    '#options' => $page_params['block_styles'],
  );

  $block_style = "";
  $popup_form['nucleus_extend_class_form'] = array(
    '#markup' => nucleus_create_extend_classes_form(),
  );

  $form_popup_container = array('form_popup_container' => $popup_form);
  $form_params = array(
    'nucleus_form_popup' => drupal_render($form_popup_container),
  );
  
  return theme_render_template(
    drupal_get_path('theme', 'nucleus') . "/tpl/admin/nucleus-form-popup-wrapper.tpl.php",
    $form_params
  );
}

function nucleus_page_render_simulation(&$vars, &$page_params) {
  $page_key = $page_params['page_key'];
  $grid_int = $page_params['grid_int'];

  nucleus_clean_unregion_data($vars);

  template_preprocess($vars, 'page');
  $themes_array = nucleus_get_theme_keys();
  $preprocess_functions = array(
    'template_preprocess_page',
    'contextual_preprocess',
    'overlay_preprocess_page',
    'shortcut_preprocess_page'
  );
  foreach ($themes_array as $theme_name) {
    $preprocess_functions[] = $theme_name . "_preprocess_page";
  }
  foreach ($preprocess_functions as $function_name) {
    if (function_exists($function_name)) {
      if ($function_name == 'contextual_preprocess') {
        $function_name($vars, 'page');
      }
      else {
        $function_name($vars);
      }
    }
  }
  template_process($vars, 'page');
  $process_functions = array(
    'template_process_page',
  );
  foreach ($themes_array as $theme_name) {
    $preprocess_functions[] = $theme_name . "_process_page";
  }
  foreach ($process_functions as $function_name) {
    if (function_exists($function_name)) {
      $function_name($vars);
    }
  }

  foreach ($themes_array as $theme_name) {
    $preprocess_functions[] = $theme_name . "_preprocess_page";
  }

  $pages_array = array('page.tpl.php');
  if ($page_key != 'default') {
    $pages_array[] = 'page--' . str_replace("_", "-", $page_key) . ".tpl.php";
  }
  $template_file = FALSE;
  foreach ($pages_array as $page_name) {
    foreach ($themes_array as $theme_name) {
      if (file_exists(drupal_get_path('theme', $theme_name) . "/tpl/" . $page_name)) {
        $template_file = drupal_get_path('theme', $theme_name) . "/tpl/" . $page_name;
      }
    }
  }

  nucleus_auto_generate_fluid_grids($grid_int, 100);
  drupal_add_css("sites/default/files/nucleus/grid-fluid-" . $grid_int . "-100.css", array(
    'group' => CSS_THEME,
  ));
  if (isset($_SERVER['HTTP_USER_AGENT']) && strpos($_SERVER['HTTP_USER_AGENT'], 'Opera') !== FALSE) {
    drupal_add_css("sites/default/files/nucleus/grid-fluid-" . $grid_int . "-opera.css", array(
      'group' => CSS_THEME,
    ));
  }
  nucleus_panel_preview($vars, $page_key);
  nucleus_clean_unregion_data($vars);

  return theme_render_template($template_file, $vars);
}

function nucleus_region_preview($vars, &$form, $template_file = NULL) {
  if ($template_file) {
    return theme_render_template($template_file, $vars);
  }
  $popup_template_file = drupal_get_path('theme', 'nucleus') . "/tpl/admin/nucleus-region-settings-form.tpl.php";

  $region_key = $vars['region_key'];
  $page_key = $vars['page_key'];
  $page_prefix = $vars['page_prefix'];
  $region_content = $vars['region_content'];
  $block_styles = $vars['block_styles'];
  $grid_options = $vars['grid_options'];

  $style_name = $page_prefix . 'region_' . $region_key . "_style";
  $region_style_selector = $style_name . "_selector";
  $region_style = nucleus_block_style_setting($style_name);
  $region_style = empty($region_style) ? 'default' : $region_style;

  $blocks_markup = array();
  foreach ($region_content['blocks'] as $block) {
    $block_params = array(
      'block' => $block,
      'page_key' => $page_key,
      'page_prefix' => $page_prefix,
      'region_style' => $region_style,
      'block_styles' => $block_styles,
      'region_key' => $region_key,
    );
    $blocks_markup[] = nucleus_block_preview($block_params, $form);
  }

  $region_settings_form = array();
  $region_title = isset($region_content['region_title']) ? $region_content['region_title'] : "";

  $vars = array(
    'page_key' => $page_key,
    'page_prefix' => $page_prefix,
    'region_key' => $region_key,
    'region_title' => $region_title,
    'disabled_region' => $region_key == BLOCK_REGION_NONE,
    'blocks_markup' => implode("\n", $blocks_markup),
  );
  $template_file = drupal_get_path('theme', 'nucleus') . "/tpl/admin/nucleus-region-preview.tpl.php";
  return theme_render_template($template_file, $vars);
}

function nucleus_block_preview($vars, &$form, $template_file = NULL) {
  if (!$template_file) {
    $template_file = drupal_get_path('theme', 'nucleus') . "/tpl/admin/nucleus-block-preview.tpl.php";
  }
  $block = $vars['block'];
  $region_key = $vars['region_key'];
  $page_key = $vars['page_key'];
  $page_prefix = $vars['page_prefix'];
  $block_styles = $vars['block_styles'];
  $region_style = $vars['region_style'];
  $all_regions = nucleus_get_all_regions();

  $block_form = array(
    '#type' => 'container',
    '#attributes' => array('class' => array('block-styles-wrapper'))
  );

  $block_key = nucleus_get_block_key($block);
  $type = 'block';
  $style_name = $page_prefix . $type . '_' . $block_key . "_style";
  $block_style_selector = $style_name . "_selector";
  $block_region_selector = $style_name . "_region_selector";
  $block_style = nucleus_block_style_setting($style_name);
  $block_style = empty($block_style) ? 'default' : $block_style;
  $block_region = theme_get_setting($block_region_selector);
  $block_region = empty($block_region) ? $region_key : $block_region;

  $block_params = array(
    'page_key' => $page_key,
    'page_prefix' => $page_prefix,
    'block' => $block,
    'block_key' => $block_key,
  );
  return theme_render_template($template_file, $block_params);
}

/**
 * Generate extend class popup.
 *
 * @param $key
 *   Specific key for each block style element setting.
 * @param $typess
 *   Type block style element setting.
 * @param $show_extend_class_popup
 *   Status of this block, which takes a Boolean value.
 *
 * @return
 *   Return markup for each popup.
 */
function nucleus_create_popup_extend_classes($page_key, $type, $key, $applying_style) {
  $classes_info = nucleus_extend_classes_info();
  if (!is_array($classes_info) || !isset($classes_info['groups'])) {
    return "";
  }
  $page_prefix = ($page_key == 'default' || empty($page_key)) ? "" : ($page_key . "_");

  $style_name = $page_prefix . $type . "_" . $key . '_style';
  $hidden_name = $page_prefix . $type . "_" . $key . "_extend_class";
  $name = str_replace('_', '-', $hidden_name);

  $group_class = array();
  $selected_classes = array();

  $style_value = nucleus_block_style_setting($style_name);
  $extend_classes_value = nucleus_block_style_setting($hidden_name);

  $parts = explode(' ', $extend_classes_value);
  $parts_count = count($parts);
  for ($i = 0; $i < $parts_count; $i += 2) {
    $group = trim($parts[$i]);
    $class = ($parts_count > $i + 1) ? trim($parts[$i + 1]) : "";
    $group_class[$group] = $class;
    if (isset($classes_info['classes_list'][$class])) {
      $selected_classes[] = $classes_info['classes_list'][$class];
    }
  }

  $groups_vars = array('name' => $name, 'hidden_name' => $hidden_name, 'groups' => array());
  foreach ($classes_info['groups_name_list'] as $group_key) {
    $group = $classes_info['groups'][$group_key];
    $extend_classes = $group['extend_classes'];
    $classes_vars = array(
      'name' => $name,
      'hidden_name' => $hidden_name,
      'classes' => $extend_classes,
      'group' => $group_key,
      'default_value' => isset($group_class[$group_key]) ? $group_class[$group_key] : "",
    );
    $template_file = drupal_get_path('theme', 'nucleus') . "/tpl/admin/nucleus-extend-class-form-classes.tpl.php";
    $groups_vars['groups'][$group_key] = array();
    $groups_vars['groups'][$group_key]['group_title'] = $group['group_title'];
    $groups_vars['groups'][$group_key]['classes_content'] = theme_render_template($template_file, $classes_vars);
    $groups_vars['groups'][$group_key]['show'] = isset($classes_info['support_groups'][$applying_style][$group_key]);
  }

  $template_file = drupal_get_path('theme', 'nucleus') . "/tpl/admin/nucleus-extend-class-form-groups.tpl.php";

  $default_value = implode(', ', $selected_classes);
  if ($default_value == "") {
    $default_value = "&nbsp;";
  }
  $variables = array(
    'name' => $name,
    'default_value' => $default_value,
    'nucleus_extend_class_form_groups' => theme_render_template($template_file, $groups_vars),
    'show_extend_class_popup' => count($classes_info['support_groups'][$applying_style]),
  );
  $template_file = drupal_get_path('theme', 'nucleus') . "/tpl/admin/nucleus-extend-class.tpl.php";
  return theme_render_template($template_file, $variables);
}

function nucleus_create_extend_classes_form() {
  $classes_info = nucleus_extend_classes_info();
  if (!is_array($classes_info) || !isset($classes_info['groups'])) {
    return "";
  }

  $groups_vars = array('groups' => array());
//  $groups_vars = array('name' => $name, 'hidden_name' => $hidden_name, 'groups' => array());
  foreach ($classes_info['groups_name_list'] as $group_key) {
    $group = $classes_info['groups'][$group_key];
    $extend_classes = $group['extend_classes'];
    $classes_vars = array(
      'classes' => $extend_classes,
      'group' => $group_key,
      'default_value' => "",
    );
    $template_file = drupal_get_path('theme', 'nucleus') . "/tpl/admin/nucleus-extend-class-form-classes.tpl.php";
    $groups_vars['groups'][$group_key] = array();
    $groups_vars['groups'][$group_key]['group_title'] = $group['group_title'];
    $groups_vars['groups'][$group_key]['classes_content'] = theme_render_template($template_file, $classes_vars);
  }

  $template_file = drupal_get_path('theme', 'nucleus') . "/tpl/admin/nucleus-extend-class-form-groups.tpl.php";

  $variables = array(
    'default_value' => "",
    'nucleus_extend_class_form_groups' => theme_render_template($template_file, $groups_vars),
  );
  $template_file = drupal_get_path('theme', 'nucleus') . "/tpl/admin/nucleus-extend-class.tpl.php";
  return theme_render_template($template_file, $variables);
}

function nucleus_panel_preview(&$vars, $page_key) {
  global $theme_key, $theme;
  // Render all panel regions
  $panel_regions = nucleus_panel_regions();
  if (count($panel_regions)) {
    $template_file = nucleus_get_panel_template();
    if ($template_file) {
      $panel_regions_width = nucleus_panel_regions_width($page_key);
      $template_file_panel = drupal_get_path('theme', 'nucleus') . "/tpl/panel.tpl.php";
      if (file_exists(drupal_get_path('theme', $theme_key) . "/tpl/panel.tpl.php")) {
        $template_file_panel = drupal_get_path('theme', $theme_key) . "/tpl/panel.tpl.php";
      }

      foreach ($panel_regions as $panel_name => $panels_list) {
        $vars_panel = array(
          'page' => $vars['page'],
          'panels_list' => $panels_list,
          'panel_regions_width' => $panel_regions_width,
          'template_file' => $template_file_panel,
        );
        template_preprocess($vars_panel, 'render_panel');
        $themes_array = $theme_key == 'nucleus' ? array($theme_key) : array('nucleus', $theme_key);
        for ($i = 0; $i < count($themes_array); $i ++) {
          $function_name = $themes_array[$i] . '_preprocess_render_panel';
          if (function_exists($function_name)) {
            $function_name($vars_panel);
          }
        }
        $panel_markup = theme_render_template($template_file_panel, $vars_panel);
        $panel_markup = trim($panel_markup);
        $vars[$panel_name] = empty($panel_markup) ? FALSE : $panel_markup;
      }
    }
  }
}

function nucleus_layout_tab_attach(&$form) {
  $regions_blocks_list = nucleus_get_regions_blocks_list();
  $js_regions_blocks_list = nucleus_get_js_regions_blocks_list($regions_blocks_list);
  $classes_info = nucleus_extend_classes_info();
  $style_support_counter = $classes_info['style_support_counter'];
  $block_styles = nucleus_get_predefined_param('block_styles', array('default' => '-- Select style --'));

  $form['#attached']['css'][] = array(
    'data' => drupal_get_path('theme', 'nucleus') . "/css/popup_extend_class.css",
    'type' => 'file',
  );
  $form['#attached']['js'][] = array(
    'data' => drupal_get_path('theme', 'nucleus') . "/js/popup_extend_class.js",
    'type' => 'file',
  );

  $form['#attached']['js'][] = array(
    'data' => 'Drupal.Nucleus.styleSupportCounter = ' . json_encode($style_support_counter) . ';',
    'type' => 'inline',
  );
  $form['#attached']['js'][] = array(
    'data' => 'Drupal.Nucleus.regionsBlocksList = ' . json_encode($js_regions_blocks_list) . ';',
    'type' => 'inline',
  );
  $form['#attached']['js'][] = array(
    'data' => 'Drupal.Nucleus.extendClassSupportGroups = ' . json_encode($classes_info['support_groups']) . ';',
    'type' => 'inline',
  );
  $form['#attached']['js'][] = array(
    'data' => 'Drupal.Nucleus.extendClassGroupsNameList = ' . json_encode($classes_info['groups_name_list']) . ';',
    'type' => 'inline',
  );
  $form['#attached']['js'][] = array(
    'data' => 'Drupal.Nucleus.extendClassesList = ' . json_encode($classes_info['classes_list']) . ';',
    'type' => 'inline',
  );

  $stylesheets = nucleus_get_predefined_param('stylesheets');
  $styles = array();
  foreach ($stylesheets as $stylesheet) {
    if (is_array($stylesheet)) {
      foreach ($stylesheet as $key => $value) {
        if (strpos($key, "page.css") !== FALSE) {
          $styles[] = nucleus_get_layout_style($value);
        }
      }
    }
  }
  drupal_add_css(implode("\n", $styles), array(
    'group' => CSS_THEME, 'type' => 'inline',
  ));
}

function nucleus_create_page_hiddens($regions_blocks_list, $page_prefix, &$form) {
  $region_block_hiddens = array();
  $block_weight_hiddens = array();
  $region_width_hiddens = array();
  $block_style_hiddens = array();
  foreach ($regions_blocks_list as $region_key => $region_content) {
    foreach ($region_content['blocks'] as $block) {
      $block_key = nucleus_get_block_key($block);
      $region_block_hiddens[$page_prefix . 'region_block_hidden_' . $block_key] = array(
        '#type' => 'hidden',
        '#default_value' => $block['region'],
      );
      $block_weight_hiddens[$page_prefix . 'block_weight_hidden_' . $block_key] = array(
        '#type' => 'hidden',
        '#default_value' => $block['weight'],
      );
      $block_style_hiddens[$page_prefix . "block_" . $block_key . "_style"] = array(
        '#type' => 'hidden',
        '#default_value' => nucleus_block_style_setting($page_prefix . "block_" . $block_key . "_style"),
      );
      $block_style_hiddens[$page_prefix . "block_" . $block_key . "_extend_class"] = array(
        '#type' => 'hidden',
        '#default_value' => nucleus_block_style_setting($page_prefix . "block_" . $block_key . "_extend_class"),
      );
    }
    if ($region_key != BLOCK_REGION_NONE) {
      $block_style_hiddens[$page_prefix . "region_" . $region_key . "_style"] = array(
        '#type' => 'hidden',
        '#default_value' => nucleus_block_style_setting($page_prefix . "region_" . $region_key . "_style"),
      );
      $block_style_hiddens[$page_prefix . "region_" . $region_key . "_extend_class"] = array(
        '#type' => 'hidden',
        '#default_value' => nucleus_block_style_setting($page_prefix . "region_" . $region_key . "_extend_class"),
      );
    }
    if (nucleus_is_panel_region($region_key) || nucleus_is_sidebar_region($region_key)) {
      $region_width_hiddens[$page_prefix . $region_key . "_width"] = array(
        '#type' => 'hidden',
        '#default_value' => theme_get_setting($page_prefix . $region_key . "_width"),
      );
    }
  }
  if (!isset($form['nucleus']['layout']['region_block_hiddens'])) {
    $form['nucleus']['layout']['region_block_hiddens'] = array('#type' => 'container');
    $form['nucleus']['layout']['region_block_hiddens']['content'] = array();
  }
  if (!isset($form['nucleus']['layout']['block_weight_hiddens'])) {
    $form['nucleus']['layout']['block_weight_hiddens'] = array('#type' => 'container');
    $form['nucleus']['layout']['block_weight_hiddens']['content'] = array();
  }
  if (!isset($form['nucleus']['layout']['region_block_style_hiddens'])) {
    $form['nucleus']['layout']['region_block_style_hiddens'] = array('#type' => 'container');
    $form['nucleus']['layout']['region_block_style_hiddens']['content'] = array();
  }
  if (!isset($form['nucleus']['layout']['region_width_hiddens'])) {
    $form['nucleus']['layout']['region_width_hiddens'] = array('#type' => 'container');
    $form['nucleus']['layout']['region_width_hiddens']['content'] = array();
  }
  $form['nucleus']['layout']['region_block_hiddens']['content'] += $region_block_hiddens;
  $form['nucleus']['layout']['block_weight_hiddens']['content'] += $block_weight_hiddens;
  $form['nucleus']['layout']['region_block_style_hiddens']['content'] += $block_style_hiddens;
  $form['nucleus']['layout']['region_width_hiddens']['content'] += $region_width_hiddens;
}

function nucleus_clean_unregion_data(&$vars) {
  $vars['test_nucleus'] = TRUE;
  $vars['logo'] = FALSE;
  $vars['site_name'] = FALSE;
  $vars['site_slogan'] = FALSE;
  $vars['messages'] = FALSE;
  $vars['title'] = FALSE;
  $vars['feed_icons'] = FALSE;
  $vars['breadcrumb'] = FALSE;
  $vars['secondary_menu'] = FALSE;
  $vars['tabs'] = FALSE;
  $vars['back_to_top_display'] = FALSE;
  $vars['page']['show_skins_menu'] = FALSE;
  $grid_info = nucleus_get_grid_setting();
  $vars['grid'] = $grid_info['grid'];
}

