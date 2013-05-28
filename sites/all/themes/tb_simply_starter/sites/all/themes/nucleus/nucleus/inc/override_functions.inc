<?php
/**
 * @file
 * Override of the hook theme
 */

/**
 * Override or insert variables into the html template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
function nucleus_preprocess_html(&$vars) {
  global $theme, $base_url;

  $grid_info = nucleus_get_grid_setting();
  $grid = $grid_info['grid'];
  $grid_int = $grid_info['grid_int'];
  $grid_type = $grid_info['grid_type'];
  $layout_width = $grid_info['layout_width'];
  $layout_width_int = $grid_info['layout_width_int'];

  if ($grid_type == 'fluid') {
    nucleus_auto_generate_fluid_grids($grid_int, $layout_width_int);
    drupal_add_css(file_get_contents("public://nucleus/grid-fluid-" . $grid_int . "-" . $layout_width_int . ".css"), array(
      'group' => CSS_THEME,
      'type' => 'inline',
    ));
    if (isset($_SERVER['HTTP_USER_AGENT']) && strpos($_SERVER['HTTP_USER_AGENT'], 'Opera') !== FALSE) {
      drupal_add_css(file_get_contents("public://nucleus/grid-fluid-" . $grid_int . "-opera.css"), array(
        'group' => CSS_THEME,
        'type' => 'inline',
      ));
    }
  }
  else {
    nucleus_auto_generate_fixed_grids($grid_int, $layout_width);
    drupal_add_css(file_get_contents("public://nucleus/grid-fixed-" . $grid_int . "-" . $layout_width . ".css"), array(
      'group' => CSS_THEME,
      'type' => 'inline',
    ));
  }

  $vars['classes_array'][] = drupal_html_class($theme);
  $vars['classes_array'][] = $grid_type . "-grid";

  $fonts_arr = nucleus_default_fonts_arr();
  $used_gwf_list = array();
  $used_custom_font_list = array();
  $typo_keys_map = nucleus_typo_key_map();

  foreach ($fonts_arr as $font_setting_key => $value) {
    $key = $value['key'];
    $font_type = theme_get_setting($key . "_type");
    $font_value = theme_get_setting($key . (!empty($font_type) ? ('_' . $font_type) : ""));
    if ($font_type == '') {
      if (!empty($font_value)) {
        $vars['classes_array'][] = $font_value;
      }
    }
    else {
      if ($font_type == 'gwf') {
        if (!empty($font_value)) {
          $used_gwf_list[$font_value] = $font_value;
        }
      }
      else {
        if (!empty($font_value)) {
          $font_folder = drupal_strtolower($font_value);
          $font_folder = preg_replace('/[^\w\d_ -]/si', '-', $font_folder);
          $used_custom_font_list[$font_folder] = $font_folder;
        }
      }

      if (!empty($font_value)) {
        $font_value = nucleus_format_font_family($font_value);
        $style_name = nucleus_get_class_font($font_setting_key, $font_type, $font_value);
        $vars['classes_array'][] = $style_name;

        switch ($font_setting_key) {
          case 'bf':
            drupal_add_css("body.$style_name, .$style_name .form-text { font-family: " . $font_value . "; }", array(
              'type' => 'inline'
            ));
            break;
          default:
            drupal_add_css("body.$style_name " . $typo_keys_map[$font_setting_key] . " { font-family: " . $font_value . "; }", array(
              'type' => 'inline'
            ));
            break;
        }
      }
    }
  }
  $vars['classes_array'][] = theme_get_setting('font_size');

  if (count($used_gwf_list)) {
    $font_arr = array();
    foreach ($used_gwf_list as $key) {
      $parts = explode(",", $key);
      foreach ($parts as $part) {
        $font_arr[] = trim($part);
      }
    }
    $font_str = implode("|", $font_arr);
    $font_str = str_replace(" ", "+", $font_str);
    $url = 'http://fonts.googleapis.com/css?family=' . $font_str . "&v2";
    drupal_add_css($url);
  }

  if (count($used_custom_font_list)) {
    foreach ($used_custom_font_list as $font_folder) {
      $url = drupal_get_path('theme', $theme) . "/font/" . $font_folder . "/stylesheet.css";
      drupal_add_css($url, array(
        'group' => CSS_SYSTEM,
        'basename' => $font_folder,
      ));
    }
  }

  global $_nucleus_body_extend_class;
  if ($_nucleus_body_extend_class && is_array($_nucleus_body_extend_class)) {
    foreach ($_nucleus_body_extend_class as $class_name) {
      $vars['classes_array'][] = $class_name;
    }
  }
}

/**
 * Override or insert variables into the page template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
function nucleus_preprocess_page(&$vars) {
  $grid_info = nucleus_get_grid_setting();
  $grid = $grid_info['grid'];
  $grid_int = $grid_info['grid_int'];
  $grid_type = $grid_info['grid_type'];
  $layout_width = $grid_info['layout_width'];
  $sidebar_regions = nucleus_get_sidebar_regions();

  if (isset($vars['page_key'])) {
    $page_key = $vars['page_key'];
  }
  else {
    $page_key = theme_get_setting('page_layout');
  }
  $page_prefix = ($page_key == 'default' || empty($page_key)) ? '' : ($page_key . '_');
  $sidebar_regions_width = nucleus_get_sidebar_regions_width($vars['page'], $page_key);
  $vars['grid'] = $grid;
  foreach ($sidebar_regions_width as $region_key => $region_width) {
    if ($region_width) {
      $vars[$region_key . "_width"] = "grid grid-" . $region_width;
      if (isset($sidebar_regions_width[$region_key . "_hidden"])) {
        $vars[$region_key . "_width"] .= " hidden-region";
      }
    }
    else {
      $vars[$region_key . "_width"] = 0;
    }
  }

  if (isset($vars['node'])) {
    for ($i = count($vars['theme_hook_suggestions']); $i > 0; $i --) {
      $theme_hook_sugesstion = $vars['theme_hook_suggestions'][$i - 1];
      if ($theme_hook_sugesstion != 'page__node') {
        $vars['theme_hook_suggestions'][$i] = $vars['theme_hook_suggestions'][$i - 1];
      }
      else {
        $vars['theme_hook_suggestions'][$i] = 'page__node__' . str_replace('-', '_', $vars['node']->type);
        break;
      }
    }
  }

  $layout = theme_get_setting('page_layout');
  if ($layout != 'default') {
    $layout = str_replace("-", "_", $layout);
    $tmp_theme_hook_suggestions = array('page__' . $layout);
    foreach ($vars['theme_hook_suggestions'] as $suggestion) {
      $tmp_theme_hook_suggestions[] = $suggestion;
      $tmp_theme_hook_suggestions[] = $suggestion . "__" . $layout;
    }
    $vars['theme_hook_suggestions'] = $tmp_theme_hook_suggestions;
  }

  $vars['back_to_top_display'] = theme_get_setting('back_to_top_display');

  // Render all panel regions
  $panel_regions = nucleus_panel_regions();
  if (count($panel_regions)) {
    $template_file = nucleus_get_panel_template();
    if ($template_file) {
      $panel_regions_width = nucleus_panel_regions_width();
      foreach ($panel_regions as $panel_name => $panels_list) {
        $panel_markup = theme("render_panel", array(
          'page' => $vars['page'],
          'panels_list' => $panels_list,
          'panel_regions_width' => $panel_regions_width,
          'template_file' => $template_file,
        ));
        $panel_markup = trim($panel_markup);
        $vars[$panel_name] = empty($panel_markup) ? FALSE : $panel_markup;
        $panel_cols_number = 0;
        foreach($panels_list as $col_name => $col_title) {
          if($panel_regions_width[$col_name]) {
            $panel_cols_number ++;
          }
        }
        $vars[$panel_name . "_cols"] = "panel-cols-" . $panel_cols_number; 
      }
    }
  }

  global $theme_key;
  $current_skin = theme_get_setting('skin');
  if (isset($_COOKIE['nucleus_skin'])) {
    $current_skin = $_COOKIE['nucleus_skin'];
  }

  $vars['page']['show_skins_menu'] = $show_skins_menu = theme_get_setting('show_skins_menu');
  if($show_skins_menu) {
    $skins = nucleus_get_predefined_param('skins', array("default" => t("Default Style")));
    $current_skin = theme_get_setting('skin');
    if (isset($_COOKIE['nucleus_skin'])) {
      $current_skin = $_COOKIE['nucleus_skin'];
    }
	$str = array();
    $str[] = '<div id="change_skin_menu_wrapper" class="change-skin-menu-wrapper wrapper">';
    $str[] = '<div class="container">';
    $str[] = '<ul class="change-skin-menu">';
    
	foreach ($skins as $skin => $skin_title) {
	  $li_class = ($skin == $current_skin ? ($skin . ' active') : $skin);
	  $str[] = '<li class="' . $li_class . '"><a href="#change-skin/' . $skin . '" class="change-skin-button color-' . $skin . '">' . $skin_title . '</a></li>';
	}
	$str[] = '</ul></div></div>';
	$vars['page']['show_skins_menu'] = implode("", $str);
  }
  $default_logo = theme_get_setting("default_logo");
  $toggle_logo = theme_get_setting("toggle_logo");
  if (!empty($current_skin) && $current_skin != 'default'  && $default_logo && $toggle_logo) {
    $vars['logo'] = file_create_url(drupal_get_path('theme', $theme_key)) . "/skins/" . $current_skin . "/logo.png";
  }
  drupal_add_js('
	(function ($) {
	  if (Drupal.Nucleus == undefined) {
		Drupal.Nucleus = {};
	  }
	  Drupal.behaviors.skinMenuAction = {
		attach: function (context) {
		  jQuery(".change-skin-button").click(function() {
			parts = this.href.split("/");
			style = parts[parts.length - 1];
			jQuery.cookie("nucleus_skin", style, {path: "/"});
			window.location.reload();
			return false;
		  });
		}
	  }
	})(jQuery);
  ', 'inline');
  $vars['page']['nucleus_skin_classes'] = !empty($current_skin) ? ($current_skin . "-skin") : "";
}

/**
 * Override or insert variables into the panel template.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 */
function nucleus_preprocess_render_panel(&$variables) {
  $page = $variables['page'];
  $panels_list = $variables['panels_list'];
  $panel_regions_width = $variables['panel_regions_width'];
  $variables = array();
  $variables['page'] = array();
  $variables['panel_width'] = $panel_regions_width;
  $variables['panel_classes'] = array();
  $variables['panels_list'] = $panels_list;
  $not_empty_panel = FALSE;
  $panel_keys = array_keys($panels_list);
  $first_key = $last_key = FALSE;
  for ($i = 0; $i < count($panel_keys); $i ++) {
    if ($panel_regions_width[$panel_keys[$i]]) {
      $first_key = $first_key ? $first_key : $panel_keys[$i];
      $last_key = $panel_keys[$i];
    }
  }

  foreach ($panels_list as $panel => $panel_label) {
    $variables['page'][$panel] = $page[$panel];
    $panel_width = $panel_regions_width[$panel];
    if (render($page[$panel])) {
      $not_empty_panel = TRUE;
    }
    $variables['panel_grid'][$panel] = "grid grid-" . $panel_width;
    if (isset($panel_regions_width[$panel . "_hidden"])) {
      $variables['panel_grid'][$panel] .= " hidden-region";
    }

    $classes = array();
    $classes[] = "panel-column";
    $classes[] = str_replace("_", "-", $panel);
    if ($panel == $first_key) {
      $classes[] = 'panel-column-first';
    }
    if ($panel == $last_key) {
      $classes[] = 'panel-column-last';
    }

    $variables['panel_classes'][$panel] = implode(" ", $classes);
  }
  $variables['not_empty_panel'] = $not_empty_panel;
}

/**
 * Override or insert variables into the node template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
function nucleus_preprocess_node(&$vars) {
  global $theme, $user;
  $vars['title_attributes_array']['class'][] = 'node-title';
  $vars['content_attributes_array']['class'][] = 'node-content';
  if (module_exists('translation')) {
    if ($vars['node']->language) {
      global $language;
      $vars['classes_array'][] = 'node-lang-' . $vars['node']->language;
    }
  }
  $vars['classes_array'][] = 'node-' . $vars['zebra'];
  $vars['classes_array'][] = drupal_html_class('node-' . $vars['view_mode']);
  $vars['datetime'] = format_date($vars['created'], 'custom', 'c');
  $vars['unpublished'] = '';
  if (!$vars['status']) {
    $vars['unpublished'] = '<div class="unpublished">' . t('Unpublished') . '</div>';
  }
}

/**
 * Override or insert variables into the comment template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
function nucleus_preprocess_comment(&$vars) {
  $vars['title_attributes_array']['class'][] = 'comment-title';
  $vars['content_attributes_array']['class'][] = 'comment-content';
  $uri = entity_uri('comment', $vars['comment']);
  $uri['options'] += array(
    'attributes' => array(
      'rel' => 'bookmark',
    ),
  );
  $vars['title'] = l($vars['comment']->subject, $uri['path'], $uri['options']);
  $vars['permalink'] = l(t('Permalink'), $uri['path'], $uri['options']);
  $vars['created'] = '<span class="date-time permalink">' . l($vars['created'], $uri['path'], $uri['options']) . '</span>';
  $vars['datetime'] = format_date($vars['comment']->created, 'custom', 'c');
  $vars['unpublished'] = '';
  if ($vars['status'] == 'comment-unpublished') {
    $vars['unpublished'] = '<div class="unpublished">' . t('Unpublished') . '</div>';
  }
}

/**
 * Override or insert variables into the block template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
function nucleus_preprocess_block(&$vars) {
  $vars['title_attributes_array']['class'][] = 'block-title';
  $vars['content_attributes_array']['class'][] = 'block-content';
  $vars['content_attributes_array']['class'][] = 'clearfix';
  if ($vars['block']->region == 'menu_bar') {
    $vars['title_attributes_array']['class'][] = 'element-invisible';
  }

  $block = $vars['block'];
  $block_key = nucleus_get_block_key($block);
  $region_key = $block->region;

  $page_key = theme_get_setting('page_layout');
  $page_prefix = ($page_key == 'default' || empty($page_key)) ? "" : ($page_key . "_");

  $custom_style = nucleus_block_style_setting($page_prefix . 'block_' . $block_key . '_style');
  if (empty($custom_style) || $custom_style == 'default') {
    $custom_style = nucleus_block_style_setting($page_prefix . 'region_' . $region_key . '_style');
  }

  if (!empty($custom_style) && $custom_style != 'default') {
    $tmp_theme_hook_suggestions = array('block__' . $custom_style);
    foreach ($vars['theme_hook_suggestions'] as $suggestion) {
      $tmp_theme_hook_suggestions[] = $suggestion;
      $tmp_theme_hook_suggestions[] = $suggestion . "__" . $custom_style;
    }
    $vars['theme_hook_suggestions'] = $tmp_theme_hook_suggestions;
  }

  $classes = $vars['classes_array'];

  $custom_class = nucleus_block_style_setting($page_prefix . 'block_' . $block_key . '_extend_class');
  if (empty($custom_class)) {
    $custom_class = nucleus_block_style_setting($page_prefix . 'region_' . $region_key . '_extend_class');
  }

  if (!empty($custom_class)) {
    $class_array = explode(' ', $custom_class);
    $parts_count = count($class_array);
    for ($i = 0; $i < $parts_count; $i += 2) {
      $class = ($parts_count > $i + 1) ? trim($class_array[$i + 1]) : "";
      $classes[] = $class;
    }
  }

  if ($block->module == 'views') {
    global $theme;
    drupal_add_css(drupal_get_path('theme', $theme) . "/css/views.css");
  }
  if ($vars['elements']['#block']->module == 'system' && $vars['elements']['#block']->delta == 'main') {
    foreach ($classes as $key => $value) {
      if ($value == 'block') {
        unset($classes[$key]);
      }
    }
  }
  $vars['classes_array'] = $classes;
}

/**
 * Override or insert variables into the aggregator-item template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
function nucleus_preprocess_aggregator_item(&$vars) {
  $item = $vars['item'];
  $vars['datetime'] = format_date($item->timestamp, 'custom', 'c');
}

/**
 * Override or insert variables into the fieldset template.
 *
 * @param $vars
 *   An array of variables to pass to the theme template.
 */
function nucleus_preprocess_fieldset(&$vars) {
  $element = $vars['element'];
  if (isset($element['#attributes'])) {
    $vars['attributes'] = $element['#attributes'];
  }

  if (isset($element['#id'])) {
    $vars['attributes']['id'] = $element['#id'];
  }
  $vars['attributes']['class'][] = 'fieldset';
  $vars['attributes']['class'][] = 'form-wrapper';
  if (isset($element['#title'])) {
    $vars['attributes']['class'][] = 'titled';
  }
  $description = isset($element['#description']) ? "<div class='description'>{$element['#description']}</div>" : '';
  $children = isset($element['#children']) ? $element['#children'] : '';
  $value = isset($element['#value']) ? $element['#value'] : '';
  $vars['content'] = $description . $children . $value;
  $vars['title'] = isset($element['#title']) ? $element['#title'] : '';
  $vars['hook'] = 'fieldset';
}

/**
 * Implements hook_html_head_alter().
 */
function nucleus_html_head_alter(&$head_elements) {
  $head_elements['system_meta_content_type']['#attributes'] = array(
    'http-equiv' => 'Content-Type',
    'content' => 'text/html; charset=utf-8',
  );
}

/**
 * Implements hook_css_alter().
 */
function nucleus_css_alter(&$css) {
  $path = drupal_get_path('theme', 'nucleus') . "/css/base.css";
  $css = drupal_add_css($path, array(
    'group' => CSS_SYSTEM,
    'every_page' => TRUE,
    'weight' => 0,
  ));

  foreach ($css as $key => &$value) {
    if ($key == $path) {
      $value['weight'] = 0;
    }
    else {
      $value['weight'] += 0.001;
    }
  }
  nucleus_add_conditional_styles($css);

  global $theme_key;
  $skin = theme_get_setting('skin');
  if (isset($_COOKIE['nucleus_skin'])) {
	$skin = $_COOKIE['nucleus_skin'] == 'default' ? '' : $_COOKIE['nucleus_skin'];
  }  
  if (!empty($skin) && file_exists(drupal_get_path('theme', $theme_key) . "/skins/" . $skin . "/style.css")) {
    $css = drupal_add_css(drupal_get_path('theme', $theme_key) . "/skins/" . $skin . "/style.css", array(
      'group' => CSS_THEME,
    ));
  }
}


/**
 * Override of theme_field().
 */
function nucleus_field(&$vars) {
  $output = '';

  // Render the label, if it's not hidden.
  if (!$vars['label_hidden']) {
    $output .= '<h3 class="field-label"' . $vars['title_attributes'] . '>' . $vars['label'] . ':&nbsp;</h3>';
  }

  // Render the items.
  $output .= '<div class="field-items"' . $vars['content_attributes'] . '>';
  foreach ($vars['items'] as $delta => $item) {
    $classes = 'field-item ' . ($delta % 2 ? 'even' : 'odd');
    $output .= '<div class="' . $classes . '"' . $vars['item_attributes'][$delta] . '>' . drupal_render($item) . '</div>';
  }
  $output .= '</div>';

  // Render the top-level DIV.
  $output = '<div class="section ' . $vars['classes'] . '"' . $vars['attributes'] . '>' . $output . '</div>';

  return $output;
}

/**
 * Override of theme_breadcrumb().
 */
function nucleus_breadcrumb($vars) {
  if (theme_get_setting('breadcrumb_display')) {
    $breadcrumb = $vars['breadcrumb'];
    $home_class = 'crumb-home';
    if (!empty($breadcrumb)) {
      $heading = '<h2 class="element-invisible">' . t('You are here') . '</h2>';
      $separator = " &#187; ";
      $output = '';
      foreach ($breadcrumb as $key => $val) {
        if ($key == 0) {
          $output .= '<li class="crumb ' . $home_class . '">' . $val . '</li>';
        }
        else {
          $output .= '<li class="crumb"><span>' . $separator . '</span>' . $val . '</li>';
        }
      }
      return $heading . '<ol id="crumbs">' . $output . '</ol>';
    }
  }
  return '';
}

/**
 * Override of theme_button().
 */
function nucleus_button($vars) {
  $element = $vars['element'];
  $element['#attributes']['class'][] = 'form-' . $element['#button_type'];
  $button_id = (isset($element['#id']) ? $element['#id'] : "");
  return '<span class="button ' . $button_id . '">
    <input type="submit" ' . (empty($element['#name']) ? '' : 'name="' . $element['#name'] . '" ') . 'id="' . $button_id . '" value="' . check_plain($element['#value']) . '" ' . drupal_attributes($element['#attributes']) . " />
    </span>\n";
}

/**
 * Override of theme_superfish().
 */
function nucleus_superfish(&$vars) {
  global $theme_key;
  $style = theme_get_setting('superfish_extend_style_' . $vars['id']);
  if (!empty($style)) {
    $vars['sfsettings']['style'] = $style;
    $path = drupal_get_path('theme', $theme_key) . "/css/superfish/" . $style . ".css";
    drupal_add_css($path, array('group' => CSS_THEME, 'every_page' => TRUE, 'basename' => 'sf_' . $style . ".css"));
  }
  global $_nucleus_body_extend_class;
  if (!$_nucleus_body_extend_class) {
    $_nucleus_body_extend_class = array();
  }

  $delta = $vars['id'];
  if (variable_get('superfish_type_' . $delta, 'horizontal') == 'navbar') {
    if (!isset($_nucleus_body_extend_class['tb-sf-navbar'])) {
      $_nucleus_body_extend_class['tb-sf-navbar'] = 'tb-sf-navbar';
    }
  }
  return theme_superfish($vars);
}

/**
 * Override of theme_qt_quicktabs().
 */
function nucleus_qt_quicktabs(&$vars) {
  global $theme_key;
  $attributes = $vars['element']['#options']['attributes'];
  $id = drupal_substr($attributes['id'], 10);
  $style = theme_get_setting('quicktabs_extend_style_' . $id);
  if (!empty($style)) {
    $classes = $attributes['class'];
    $class_parts = explode(' ', $classes);
    $new_classes = array();
    foreach ($class_parts as $class) {
      if (strpos($class, 'quicktabs-style') === FALSE) {
        $new_classes[] = $class;
      }
    }
    $new_classes[] = 'quicktabs-style-' . $style;
    $vars['element']['#options']['attributes']['class'] = implode(' ', $new_classes);
    $vars['element']['tabs']['#options']['style'] = $style;
    $vars['element']['container']['#prefix'] = '<div id="quicktabs-container-' . $id . '" class="quicktabs_main quicktabs-style-' . $style . '">';

    $path = drupal_get_path('theme', $theme_key) . "/css/quicktabs/" . $style . ".css";
    drupal_add_css($path, array('group' => CSS_THEME, 'every_page' => TRUE, 'basename' => 'quicktabs_' . $style . ".css"));
  }
  return theme_qt_quicktabs($vars);
}

/**
 * Override of theme_qt_ui_tabs().
 */
function nucleus_qt_ui_tabs(&$vars) {
  global $theme_key;
  $attributes = $vars['element']['#options']['attributes'];
  $id = drupal_substr($attributes['id'], 10);
  $style = theme_get_setting('quicktabs_extend_style_' . $id);
  if (!empty($style)) {
    $vars['element']['#options']['attributes']['class'] .= ' quicktabs-ui-' . $style;
    $path = drupal_get_path('theme', $theme_key) . "/css/quicktabs/" . $style . ".css";
    drupal_add_css($path, array('group' => CSS_THEME, 'every_page' => TRUE, 'basename' => 'quicktabs_' . $style . ".css"));
  }
  return theme_qt_ui_tabs($vars);
}

/**
 * Override of theme_qt_accordion().
 */
function nucleus_qt_accordion($vars) {
  global $theme_key;
  $attributes = $vars['element']['#options']['attributes'];
  $id = drupal_substr($attributes['id'], 9);
  $style = theme_get_setting('quicktabs_extend_style_' . $id);
  if (!empty($style)) {
    $vars['element']['#options']['attributes']['class'][] = 'quick-accordion-' . $style;
    $path = drupal_get_path('theme', $theme_key) . "/css/quicktabs/" . $style . ".css";
    drupal_add_css($path, array('group' => CSS_THEME, 'every_page' => TRUE, 'basename' => 'quicktabs_' . $style . ".css"));
  }
  return theme_qt_accordion($vars);
}

