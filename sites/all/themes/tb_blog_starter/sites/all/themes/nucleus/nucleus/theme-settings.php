<?php
/**
 * @file
 * Theme setting callbacks for the nucleus theme.
 */

// Split funtions and stuff into seperate files for eaiser house keeping.
include_once(drupal_get_path('theme', 'nucleus') . '/inc/override_functions.inc');
include_once(drupal_get_path('theme', 'nucleus') . '/inc/custom_functions.inc');
include_once(drupal_get_path('theme', 'nucleus') . '/inc/theme_settings_parts.inc');
include_once(drupal_get_path('theme', 'nucleus') . '/inc/grid_functions.inc');
include_once(drupal_get_path('module', 'block') . '/block.admin.inc');

// Impliments hook_form_system_theme_settings_alter().
function nucleus_form_system_theme_settings_alter(&$form, $form_state) {
  if (theme_get_setting('nucleus_use_default_settings')) {
    nucleus_reset_settings();
  }
  $form['nucleus'] = array(
    '#type' => 'vertical_tabs',
    '#weight' => - 10,
    '#default_tab' => theme_get_setting('nucleus__active_tab'),
  );

  $form['nucleus']['nucleus_version'] = array(
    '#type' => 'hidden',
    '#default' => '1.1',
  );
  nucleus_settings_layout_tab($form);
  if (module_exists('superfish') || module_exists('quicktabs')) {
    nucleus_settings_third_parties_tab($form);
  }
  nucleus_settings_typography_tab($form);
  nucleus_settings_global_tab($form);
  nucleus_feedback_form($form);

  $form['#submit'][] = 'nucleus_form_system_theme_settings_submit';
  $form['#validate'][] = 'nucleus_form_system_theme_settings_validate';
  if (!isset($form['#attached']['css'])) {
    $form['#attached']['css'] = array();
  }
  if (!isset($form['#attached']['js'])) {
    $form['#attached']['js'] = array();
  }

  if (module_exists('jquery_update')) {
    $form['#attached']['js'][] = array(
      'data' => drupal_get_path('module', 'jquery_update') . '/replace/ui/ui/jquery.ui.core.js',
      'type' => 'file',
    );
    $form['#attached']['js'][] = array(
      'data' => drupal_get_path('module', 'jquery_update') . '/replace/ui/ui/jquery.ui.widget.js',
      'type' => 'file',
    );
    $form['#attached']['js'][] = array(
      'data' => drupal_get_path('module', 'jquery_update') . '/replace/ui/ui/jquery.ui.mouse.js',
      'type' => 'file',
    );
    $form['#attached']['js'][] = array(
      'data' => drupal_get_path('module', 'jquery_update') . '/replace/ui/ui/jquery.ui.sortable.js',
      'type' => 'file',
    );
    $form['#attached']['js'][] = array(
      'data' => drupal_get_path('theme', 'nucleus') . '/js/fixed-drag-drop.js',
      'type' => 'file',
    );
  }
  $form['#attached']['js'][] = array(
    'data' => drupal_get_path('theme', 'nucleus') . '/js/nucleus.js',
    'type' => 'file',
  );
  $form['#attached']['css'][] = array(
    'data' => drupal_get_path('theme', 'nucleus') . '/css/theme-settings.css',
    'type' => 'file',
    'group' => CSS_THEME,
  );

  $form['#attached']['css'][] = array(
    'data' => drupal_get_path('theme', 'nucleus') . '/css/ie7.css',
    'type' => 'file',
    'group' => CSS_THEME,
    'browsers' => array(
      'IE' => "IE 7",
      '!IE' => FALSE,
    ),
    'every_page' => TRUE,
    'basename' => 'nucleus-ie7.css',
  );
}

function nucleus_feedback_form(&$form) {
  $form['nucleus']['about_nucleus'] = array(
    '#type' => 'fieldset',
    '#title' => t('About Nucleus'),
    '#weight' => 40,
  );

  $form['nucleus']['about_nucleus']['about_nucleus_wrapper'] = array(
    '#type' => 'container',
    '#attributes' => array('class' => array('about-nucleus-wrapper')),
  );

  $form['nucleus']['about_nucleus']['about_nucleus_wrapper']['about_nucleus_content'] = array(
    '#markup' => '<iframe width="100%" height="650" scrolling="no" class="nucleus_frame" frameborder="0" src="http://themebrain.com/static/about/"></iframe>',
  );
}

function nucleus_settings_layout_tab(&$form) {
  global $theme_key;

  $grid_info = nucleus_get_grid_setting();
  $grid = $grid_info['grid'];
  $grid_int = $grid_info['grid_int'];
  $pages_list = array('default' => t('Page preview & direct setting'));
  $skins = nucleus_get_predefined_param('skins', array('' => t("Default skin")));
  $regions_blocks_list = nucleus_get_regions_blocks_list();
  $classes_info = nucleus_extend_classes_info();
  $style_support_counter = $classes_info['style_support_counter'];
  $block_styles = nucleus_get_predefined_param('block_styles', array('default' => '-- Select style --'));

  nucleus_layout_tab_attach($form);

  $form['nucleus']['layout'] = array(
    '#type' => 'fieldset',
    '#title' => t('Layout'),
    '#weight' => 0,
  );

  $width_select_names = array();

  $form['nucleus']['layout']['grid'] = array(
    '#type' => 'select',
    '#title' => t('Grid'),
    '#default_value' => $grid_info['grid_int'],
    '#options' => nucleus_grid_number_options(),
  );

  $form['nucleus']['layout']['layout_width_selector'] = array(
    '#type' => 'select',
    '#title' => t('Page width'),
    '#options' => nucleus_layout_width_options(900, 1080, theme_get_setting('grid_number')) + array('custom' => t("Custom")),
    '#default_value' => $grid_info['layout_width_selector'],
  );

  $form['nucleus']['layout']['layout_width_custom_wrapper'] = array(
    '#type' => 'container',
    '#states' => array(
      'visible' => array(
        'select[name="layout_width_selector"]' => array(
          'value' => 'custom',
        ),
      ),
    ),
  );

  $form['nucleus']['layout']['layout_width_custom_wrapper']['layout_width_custom'] = array(
    '#type' => 'textfield',
    '#size' => 8,
    '#maxlength' => 10,
    '#title' => t('Custom width'),
    '#default_value' => $grid_info['layout_width_custom'],
    '#description' => t("Width of page, should be string like '960px' or '90%'. If base on px, it must be multiple of grid (it'll be auto descreased to be the biggest number is multiple of grid when using)."),
  );

  if (count($skins) > 1) {
    $form['nucleus']['layout']["skin"] = array(
      '#type' => 'select',
      '#title' => t('Skin'),
      '#default_value' => theme_get_setting("skin"),
      '#options' => $skins,
    );
  }

  $page_params = array(
    'grid' => $grid_info['grid'],
    'grid_int' => $grid_info['grid_int'],
    'grid_options' => nucleus_grid_options($grid_int),
    'block_styles' => $block_styles,
    'panel_regions' => nucleus_panel_regions(),
    'regions_blocks_list' => $regions_blocks_list,
  );

  $form['nucleus']['layout']['settings_popup_container'] = array(
    '#type' => 'container',
  );

  foreach ($pages_list as $page_name => $page_title) {
    $page_key = nucleus_get_key_from_name($page_name);
    $page_prefix = nucleus_get_prefix_from_key($page_key);
    $page_params['page_name'] = $page_name;
    $page_params['page_key'] = $page_key;
    $page_params['page_prefix'] = $page_prefix;

    $page_form = array(
      '#type' => 'container',
    );
    $page_form['page_title'] = array(
      '#prefix' => '<div id="' . str_replace("_", "-", $page_prefix) . 'page-preview-title" class="page-preview-title"><b>',
      '#suffix' => '</b></div>',
      '#markup' => t($page_title),
    );

    $draggable_class = " nucleus-page-draggable";
    if (!module_exists('jquery_update')) {
      $page_form['preview_note'] = array(
        '#markup' => '<div class="description">' . t('Require module <a href="http://drupal.org/project/jquery_update">jQuery Update</a> to drag & drop blocks around the regions') . '</div>',
      );
      $draggable_class = "";
    }
    $page_form['preview'] = array(
      '#prefix' => '<div class="nucleus-page-preview-container' . $draggable_class . '" id=' . $page_prefix . 'page_preview_container>',
      '#suffix' => '</div>',
      '#markup' => nucleus_page_preview($page_params, $form),
    );
    $form['nucleus']['layout'][$page_prefix . "preview_container"] = $page_form;

    foreach ($regions_blocks_list as $region => $region_detail) {
      if (nucleus_is_panel_region($region) || nucleus_is_sidebar_region($region)) {
        $width_select_names[] = $page_prefix . $region . "_width_selector";
      }
    }
  }

  $form['#attached']['js'][] = array(
    'data' => "Drupal.Nucleus.widthSelectNames = " . json_encode($width_select_names) . ";",
    'type' => 'inline',
  );
  $form['#attached']['js'][] = array(
    'data' => "Drupal.Nucleus.currentGridInt = parseInt($grid_int);",
    'type' => 'inline',
  );
}

function nucleus_settings_third_parties_tab(&$form) {
  global $theme_key;
  $superfish_styles = nucleus_get_predefined_param('superfish_styles', array('' => t("Use Superfish style setting")));
  $quicktabs_styles = nucleus_get_predefined_param('quicktabs_styles', array('' => t("Use quicktabs style setting")));

  if ((module_exists('superfish') && !empty($superfish_styles)) || (module_exists('quicktabs') && !empty($quicktabs_styles))) {
    $form['nucleus']['supported_modules'] = array(
      '#type' => 'fieldset',
      '#title' => t('Modules'),
      '#weight' => 10,
    );

    $form['nucleus']['supported_modules']['contributed_modules_description'] = array(
      '#markup' => '<div class="description">' . t('We can choose one of the pre-defined styles for any Superfish or Quicktabs block you have created. Read <a href="http://www.themebrain.com/guide" target="_blank">Nucleus Quick Guide</a> for more information.') . '</div>',
    );
  }

  if (module_exists('superfish') && !empty($superfish_styles)) {
    $superfish_blocks = superfish_block_info();
    if (!empty($superfish_blocks)) {
      $form['nucleus']['supported_modules']['superfish_container'] = array(
        '#type' => 'fieldset',
        '#title' => t('Superfish extend style'),
        '#collapsible' => TRUE,
        '#collapsed' => TRUE,
      );

      foreach ($superfish_blocks as $delta => $superfish_block) {
        $form['nucleus']['supported_modules']['superfish_container']['superfish_extend_style_' . $delta] = array(
          '#type' => 'select',
          '#title' => variable_get('superfish_name_' . $delta, 'Superfish ' . $delta),
          '#default_value' => theme_get_setting('superfish_extend_style_' . $delta),
          '#options' => $superfish_styles,
        );
      }
    }
  }

  if (module_exists('quicktabs') && !empty($quicktabs_styles)) {
    $quicktabs_blocks = quicktabs_block_info();
    if (!empty($quicktabs_blocks)) {
      $form['nucleus']['supported_modules']['quicktabs_container'] = array(
        '#type' => 'fieldset',
        '#title' => t('Quicktabs extend style'),
        '#collapsible' => TRUE,
        '#collapsed' => TRUE,
      );

      foreach ($quicktabs_blocks as $delta => $quicktabs_block) {
        $form['nucleus']['supported_modules']['quicktabs_container']['quicktabs_extend_style_' . $delta] = array(
          '#type' => 'select',
          '#title' => $quicktabs_block['info'],
          '#default_value' => theme_get_setting('quicktabs_extend_style_' . $delta),
          '#options' => $quicktabs_styles,
        );
      }
    }
  }
}

function nucleus_settings_typography_tab(&$form) {
  global $theme_key;
  $fonts_arr = nucleus_default_fonts_arr();
  $default_fonts_list = nucleus_get_predefined_param('default_fonts');

  // Typography
  $form['nucleus']['typography'] = array(
    '#type' => 'fieldset',
    '#title' => t('Typography'),
    '#weight' => 20,
  );

  $form['nucleus']['typography']['description'] = array(
    '#markup' => '<div class="description">' . t('Nucleus allows users to choose the font for all default text element on a Drupal site. You have the option to select from a predefined font family, Google web font list or any custom font you have at hand. Read <a href="http://www.themebrain.com/guide" target="_blank">Nucleus Quick Guide</a> for more information.') . '</div>',
  );

  $use_base_font = 0;
  foreach ($fonts_arr as $font_setting_key => $value) {
    $use_base_font ++;
    $key = $value['key'];
    $title = $value['title'];
    $form['nucleus']['typography'][$key . "_wrapper"] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('typo-element-wrapper')),
    );

    $form['nucleus']['typography'][$key . "_wrapper"]['typo_fonts'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('typo-fonts')),
    );

    $form['nucleus']['typography'][$key . "_wrapper"]['typo_fonts'][$key] = array(
      '#type' => 'select',
      '#title' => t($title),
      '#states' => array(
        'visible' => array(
          'select[name="' . $key . '_type"]' => array(
            'value' => ''
          )
        )
      ),
      '#default_value' => theme_get_setting($key),
      '#options' => nucleus_get_font_settings_options($default_fonts_list, $font_setting_key . "-", $use_base_font),
    );

    $form['nucleus']['typography'][$key . "_wrapper"]['typo_fonts'][$key . "_gwf"] = array(
      '#type' => 'textfield',
      '#title' => t($title),
      '#states' => array(
        'visible' => array(
          'select[name="' . $key . '_type"]' => array(
            'value' => 'gwf'
          )
        )
      ),
      '#default_value' => theme_get_setting($key . "_gwf"),
    );

    $form['nucleus']['typography'][$key . "_wrapper"]['typo_fonts'][$key . "_custom"] = array(
      '#type' => 'textfield',
      '#title' => t($title),
      '#states' => array(
        'visible' => array(
          'select[name="' . $key . '_type"]' => array(
            'value' => 'custom'
          )
        )
      ),
      '#default_value' => theme_get_setting($key . "_custom"),
    );

    $form['nucleus']['typography'][$key . "_wrapper"]['typo_type'] = array(
      '#type' => 'container',
      '#attributes' => array('class' => array('typo-type')),
    );

    $form['nucleus']['typography'][$key . "_wrapper"]['typo_type'][$key . "_type"] = array(
      '#type' => 'select',
      '#options' => array(
        '' => t('Default list'),
        'gwf' => t('Google webfont'),
        'custom' => t('Custom font')
      ),
      '#default_value' => theme_get_setting($key . "_type"),
    );
  }

  $form['nucleus']['typography']["font_size_wrapper"] = array(
    '#type' => 'container',
    '#attributes' => array('class' => array('typo-element-wrapper')),
  );

  $form['nucleus']['typography']["font_size_wrapper"]['font_size'] = array(
    '#type' => 'select',
    '#title' => t('Base Font Size'),
    '#default_value' => theme_get_setting('font_size'),
    '#description' => t('This sets a base font-size on the body element - all text will scale relative to this value.'),
    '#options' => array(
      'fs-smallest' => t('Smallest'),
      'fs-small'    => t('Small'),
      'fs-medium'   => t('Medium'),
      'fs-large'    => t('Large'),
      'fs-largest'  => t('Largest'),
    ),
  );
}

function nucleus_settings_global_tab(&$form) {
  // Toggles
  $form['theme_settings']['toggle_logo']['#default_value'] = theme_get_setting('toggle_logo');
  $form['theme_settings']['toggle_name']['#default_value'] = theme_get_setting('toggle_name');
  $form['theme_settings']['toggle_slogan']['#default_value'] = theme_get_setting('toggle_slogan');
  $form['theme_settings']['toggle_node_user_picture']['#default_value'] = theme_get_setting('toggle_node_user_picture');
  $form['theme_settings']['toggle_comment_user_picture']['#default_value'] = theme_get_setting('toggle_comment_user_picture');
  $form['theme_settings']['toggle_comment_user_verification']['#default_value'] = theme_get_setting('toggle_comment_user_verification');
  $form['theme_settings']['toggle_favicon']['#default_value'] = theme_get_setting('toggle_favicon');
  $form['theme_settings']['toggle_secondary_menu']['#default_value'] = theme_get_setting('toggle_secondary_menu');
  $form['theme_settings']['breadcrumb_display'] = array(
    '#type' => 'checkbox',
    '#title' => t('Display breadcrumb'),
    '#default_value' => theme_get_setting('breadcrumb_display'),
  );
  $form['theme_settings']['back_to_top_display'] = array(
    '#type' => 'checkbox',
    '#title' => t('To Top Button'),
    '#default_value' => theme_get_setting('back_to_top_display'),
  );
  $form['theme_settings']['show_skins_menu'] = array(
    '#type' => 'checkbox',
    '#title' => t('Show Skins Menu'),
    '#default_value' => theme_get_setting('show_skins_menu'),
  );

  $form['logo']['default_logo']['#default_value'] = theme_get_setting('default_logo');
  $form['logo']['settings']['logo_path']['#default_value'] = theme_get_setting('logo_path');
  $form['favicon']['default_favicon']['#default_value'] = theme_get_setting('default_favicon');
  $form['favicon']['settings']['favicon_path']['#default_value'] = theme_get_setting('favicon_path');

  $form['nucleus']['global_settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('Global'),
    '#weight' => 40,
  );
  $form['theme_settings']['#collapsible'] = TRUE;
  $form['theme_settings']['#collapsed'] = TRUE;
  $form['logo']['#collapsible'] = TRUE;
  $form['logo']['#collapsed'] = TRUE;
  $form['favicon']['#collapsible'] = TRUE;
  $form['favicon']['#collapsed'] = TRUE;
  $form['nucleus']['global_settings']['theme_settings'] = $form['theme_settings'];
  $form['nucleus']['global_settings']['logo'] = $form['logo'];
  $form['nucleus']['global_settings']['favicon'] = $form['favicon'];

  unset($form['theme_settings']);
  unset($form['logo']);
  unset($form['favicon']);

  $form['nucleus']['nucleus_use_default_settings'] = array(
    '#type' => 'hidden',
    '#default_value' => 0,
  );

  global $theme_key;
  $form['nucleus']['nucleus_current_theme'] = array(
    '#type' => 'hidden',
    '#default_value' => $theme_key,
  );

  $form['actions']['nucleus_use_default_settings_wrapper'] = array(
    '#markup' => '<input type="submit" value="' . t('Reset theme settings') . '" class="form-submit form-reset" onclick="return Drupal.Nucleus.onClickResetDefaultSettings();">',
  );
}

function nucleus_form_system_theme_settings_submit($form, &$form_state) {
  $inputs = $form_state['input'];
  $blocks = block_admin_display_prepare_blocks($form['nucleus']['nucleus_current_theme']['#default_value']);
  $updated_list = array();
  foreach ($blocks as $block) {
    $block_key = nucleus_get_block_key($block);
    $new_region = isset($inputs['region_block_hidden_' . $block_key]) ? $inputs['region_block_hidden_' . $block_key] : FALSE;
    $new_weight = isset($inputs['block_weight_hidden_' . $block_key]) ? $inputs['block_weight_hidden_' . $block_key] : FALSE;
    if ($new_region !== FALSE && $new_weight !== FALSE 
      && ($block['region'] != $new_region || $block['weight'] != $new_weight)
      && ($new_region != BLOCK_REGION_NONE || $block['module'] != 'system' || $block['delta'] != 'main')) {
      $updated_list[] = array(
        'bid' => $block['bid'],
        'region' => $new_region,
        'weight' => $new_weight,
        'old_region' => $block['region'],
        'old_weight' => $block['weight'],
        'block' => $block,
      );
    }
  }
  foreach ($updated_list as $updated) {
    if ($updated['region'] != BLOCK_REGION_NONE) {
      $num_updated = db_update('block')->fields(array(
        'region' => $updated['region'],
        'weight' => $updated['weight'],
        'status' => 1,
      ))->condition('bid', $updated['bid'])->execute();
    }
    else {
      $num_updated = db_update('block')->fields(array(
        'region' => $updated['region'],
        'status' => 0,
      ))->condition('bid', $updated['bid'])->execute();
    }
  }

  $grid = intval($inputs['grid']);
  $grid = $grid <= 0 ? 24 : $grid;
  $layout_width_selector = $inputs['layout_width_selector'];
  $layout_width_custom = $inputs['layout_width_custom'];
  if ($layout_width_selector != 'custom') {
    nucleus_auto_generate_fixed_grids($grid, $layout_width_selector . "px");
  }
  else {
    $width = intval($layout_width_custom);
    if (!$width) {
      $width = 960;
      while ($width % $grid != 0) {
        $width ++;
      }
      nucleus_auto_generate_fixed_grids($grid, $width . "px", TRUE);
    }
    elseif ($width > 100) {
      while ($width % $grid != 0) {
        $width --;
      }
      nucleus_auto_generate_fixed_grids($grid, $width . "px", TRUE);
    }
    else {
      nucleus_auto_generate_fluid_grids($grid, $width, TRUE);
    }
  }
  if(isset($form_state['input']['skin']) && $form_state['input']['skin'] != $form_state['complete form']['nucleus']['layout']['skin']['#default_value']) {
    setcookie('nucleus_skin', $form_state['input']['skin'], time() + 100000, "/");
  }
}

function nucleus_form_system_theme_settings_validate($form, &$form_state) {
}

