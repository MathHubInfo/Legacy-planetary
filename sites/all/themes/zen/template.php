<?php
/**
 * @file
 * Contains theme override functions and preprocess functions for the Zen theme.
 *
 * IMPORTANT WARNING: DO NOT MODIFY THIS FILE.
 *
 * The base Zen theme is designed to be easily extended by its sub-themes. You
 * shouldn't modify this or any of the CSS or PHP files in the root zen/ folder.
 * See the online documentation for more information:
 *   http://drupal.org/node/193318
 */

// Auto-rebuild the theme registry during theme development.
if (theme_get_setting('zen_rebuild_registry') && !defined('MAINTENANCE_MODE')) {
  // Rebuild .info data.
  system_rebuild_theme_data();
  // Rebuild theme registry.
  drupal_theme_rebuild();
}


/**
 * Implements HOOK_theme().
 */
function zen_theme(&$existing, $type, $theme, $path) {
  include_once './' . drupal_get_path('theme', 'zen') . '/zen-internals/template.theme-registry.inc';
  return _zen_theme($existing, $type, $theme, $path);
}

/**
 * Return a themed breadcrumb trail.
 *
 * @param $variables
 *   - title: An optional string to be used as a navigational heading to give
 *     context for breadcrumb links to screen-reader users.
 *   - title_attributes_array: Array of HTML attributes for the title. It is
 *     flattened into a string within the theme function.
 *   - breadcrumb: An array containing the breadcrumb links.
 * @return
 *   A string containing the breadcrumb output.
 */
function zen_breadcrumb($variables) {
  $breadcrumb = $variables['breadcrumb'];
  // Determine if we are to display the breadcrumb.
  $show_breadcrumb = theme_get_setting('zen_breadcrumb');
  if ($show_breadcrumb == 'yes' || $show_breadcrumb == 'admin' && arg(0) == 'admin') {

    // Optionally get rid of the homepage link.
    $show_breadcrumb_home = theme_get_setting('zen_breadcrumb_home');
    if (!$show_breadcrumb_home) {
      array_shift($breadcrumb);
    }

    // Return the breadcrumb with separators.
    if (!empty($breadcrumb)) {
      $breadcrumb_separator = theme_get_setting('zen_breadcrumb_separator');
      $trailing_separator = $title = '';
      if (theme_get_setting('zen_breadcrumb_title')) {
        $item = menu_get_item();
        if (!empty($item['tab_parent'])) {
          // If we are on a non-default tab, use the tab's title.
          $title = check_plain($item['title']);
        }
        else {
          $title = drupal_get_title();
        }
        if ($title) {
          $trailing_separator = $breadcrumb_separator;
        }
      }
      elseif (theme_get_setting('zen_breadcrumb_trailing')) {
        $trailing_separator = $breadcrumb_separator;
      }

      // Provide a navigational heading to give context for breadcrumb links to
      // screen-reader users.
      if (empty($variables['title'])) {
        $variables['title'] = t('You are here');
      }
      // Unless overridden by a preprocess function, make the heading invisible.
      if (!isset($variables['title_attributes_array']['class'])) {
        $variables['title_attributes_array']['class'][] = 'element-invisible';
      }
      $heading = '<h2' . drupal_attributes($variables['title_attributes_array']) . '>' . $variables['title'] . '</h2>';

      return '<div class="breadcrumb">' . $heading . implode($breadcrumb_separator, $breadcrumb) . $trailing_separator . $title . '</div>';
    }
  }
  // Otherwise, return an empty string.
  return '';
}

/**
 * Duplicate of theme_menu_local_tasks() but adds clearfix to tabs.
 */
function zen_menu_local_tasks(&$variables) {
  $output = '';

  if ($primary = drupal_render($variables['primary'])) {
    $output .= '<h2 class="element-invisible">' . t('Primary tabs') . '</h2>';
    $output .= '<ul class="tabs primary clearfix">' . $primary . '</ul>';
  }
  if ($secondary = drupal_render($variables['secondary'])) {
    $output .= '<h2 class="element-invisible">' . t('Secondary tabs') . '</h2>';
    $output .= '<ul class="tabs secondary clearfix">' . $secondary . '</ul>';
  }

  return $output;
}

/**
 * Override or insert variables into theme_menu_local_task().
 */
function zen_preprocess_menu_local_task(&$variables) {
  $link =& $variables['element']['#link'];

  // If the link does not contain HTML already, check_plain() it now.
  // After we set 'html'=TRUE the link will not be sanitized by l().
  if (empty($link['localized_options']['html'])) {
    $link['title'] = check_plain($link['title']);
  }
  $link['localized_options']['html'] = TRUE;
  $link['title'] = '<span class="tab">' . $link['title'] . '</span>';
}

/**
 * Adds conditional CSS from the .info file.
 *
 * Copy of conditional_styles_preprocess_html().
 */
function zen_add_conditional_styles() {
  // Make a list of base themes and the current theme.
  $themes = $GLOBALS['base_theme_info'];
  $themes[] = $GLOBALS['theme_info'];
  foreach (array_keys($themes) as $key) {
    $theme_path = dirname($themes[$key]->filename) . '/';
    if (isset($themes[$key]->info['stylesheets-conditional'])) {
      foreach (array_keys($themes[$key]->info['stylesheets-conditional']) as $condition) {
        foreach (array_keys($themes[$key]->info['stylesheets-conditional'][$condition]) as $media) {
          foreach ($themes[$key]->info['stylesheets-conditional'][$condition][$media] as $stylesheet) {
            // Add each conditional stylesheet.
            drupal_add_css(
              $theme_path . $stylesheet,
              array(
                'group' => CSS_THEME,
                'browsers' => array(
                  'IE' => $condition,
                  '!IE' => FALSE,
                ),
                'every_page' => TRUE,
              )
            );
          }
        }
      }
    }
  }
}

/**
 * Override or insert variables into the html template.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("html" in this case.)
 */
function zen_preprocess_html(&$variables, $hook) {
  // If the user is silly and enables Zen as the theme, add some styles.
  if ($GLOBALS['theme'] == 'zen') {
    include_once './' . drupal_get_path('theme', 'zen') . '/zen-internals/template.zen.inc';
    _zen_preprocess_html($variables, $hook);
  }
  elseif (!module_exists('conditional_styles')) {
    zen_add_conditional_styles();
  }

  // Classes for body element. Allows advanced theming based on context
  // (home page, node of certain type, etc.)
  if (!$variables['is_front']) {
    // Add unique class for each page.
    $path = drupal_get_path_alias($_GET['q']);
    // Add unique class for each website section.
    list($section, ) = explode('/', $path, 2);
    if (arg(0) == 'node') {
      if (arg(1) == 'add') {
        $section = 'node-add';
      }
      elseif (is_numeric(arg(1)) && (arg(2) == 'edit' || arg(2) == 'delete')) {
        $section = 'node-' . arg(2);
      }
    }
    $variables['classes_array'][] = drupal_html_class('section-' . $section);
  }
  if (theme_get_setting('zen_wireframes')) {
    $variables['classes_array'][] = 'with-wireframes'; // Optionally add the wireframes style.
  }
  // Store the menu item since it has some useful information.
  $variables['menu_item'] = menu_get_item();
  switch ($variables['menu_item']['page_callback']) {
    case 'views_page':
      // Is this a Views page?
      $variables['classes_array'][] = 'page-views';
      break;
    case 'page_manager_page_execute':
    case 'page_manager_node_view':
    case 'page_manager_contact_site':
      // Is this a Panels page?
      $variables['classes_array'][] = 'page-panels';
      break;
  }
  $variables['jump_link_target'] = theme_get_setting('zen_jump_link_target');
}

/**
 * Override or insert variables into the page template.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("page" in this case.)
 */
function zen_preprocess_page(&$variables, $hook) {
  // Find the title of the menu used by the secondary links.
  $secondary_links = variable_get('menu_secondary_links_source', 'user-menu');
  if ($secondary_links) {
    $menus = function_exists('menu_get_menus') ? menu_get_menus() : menu_list_system_menus();
    $variables['secondary_menu_heading'] = $menus[$secondary_links];
  }
  else {
    $variables['secondary_menu_heading'] = '';
  }
}

/**
 * Override or insert variables into the maintenance page template.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("maintenance_page" in this case.)
 */
function zen_preprocess_maintenance_page(&$variables, $hook) {
  // If Zen is the maintenance theme, add some styles.
  if ($GLOBALS['theme'] == 'zen') {
    include_once './' . drupal_get_path('theme', 'zen') . '/zen-internals/template.zen.inc';
    _zen_preprocess_html($variables, $hook);
  }
  elseif (!module_exists('conditional_styles')) {
    zen_add_conditional_styles();
  }
}

/**
 * Override or insert variables into the node templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("node" in this case.)
 */
function zen_preprocess_node(&$variables, $hook) {
  // Add $unpublished variable.
  $variables['unpublished'] = (!$variables['status']) ? TRUE : FALSE;

  // Add a class for the view mode.
  if (!$variables['teaser']) {
    $variables['classes_array'][] = 'view-mode-' . $variables['view_mode'];
  }

  // Add a class to show node is authored by current user.
  if ($variables['uid'] && $variables['uid'] == $GLOBALS['user']->uid) {
    $variables['classes_array'][] = 'node-by-viewer';
  }

  $variables['title_attributes_array']['class'][] = 'node-title';
}

/**
 * Override or insert variables into the comment templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("comment" in this case.)
 */
function zen_preprocess_comment(&$variables, $hook) {
  // If comment subjects are disabled, don't display them.
  if (variable_get('comment_subject_field_' . $variables['node']->type, 1) == 0) {
    $variables['title'] = '';
  }

  // Anonymous class is broken in core. See #1110650
  if ($variables['comment']->uid == 0) {
    $variables['classes_array'][] = 'comment-by-anonymous';
  }
  // Zebra striping.
  if ($variables['id'] == 1) {
    $variables['classes_array'][] = 'first';
  }
  if ($variables['id'] == $variables['node']->comment_count) {
    $variables['classes_array'][] = 'last';
  }
  $variables['classes_array'][] = $variables['zebra'];

  $variables['title_attributes_array']['class'][] = 'comment-title';
}

/**
 * Preprocess variables for region.tpl.php
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("region" in this case.)
 */
function zen_preprocess_region(&$variables, $hook) {
  // Sidebar regions get some extra classes and a common template suggestion.
  if (strpos($variables['region'], 'sidebar_') === 0) {
    $variables['classes_array'][] = 'column';
    $variables['classes_array'][] = 'sidebar';
    $variables['theme_hook_suggestions'][] = 'region__sidebar';
    // Allow a region-specific template to override Zen's region--sidebar.
    $variables['theme_hook_suggestions'][] = 'region__' . $variables['region'];
  }
}

/**
 * Override or insert variables into the block templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("block" in this case.)
 */
function zen_preprocess_block(&$variables, $hook) {
  // Classes describing the position of the block within the region.
  if ($variables['block_id'] == 1) {
    $variables['classes_array'][] = 'first';
  }
  // The last_in_region property is set in zen_page_alter().
  if (isset($variables['block']->last_in_region)) {
    $variables['classes_array'][] = 'last';
  }
  $variables['classes_array'][] = $variables['block_zebra'];

  $variables['title_attributes_array']['class'][] = 'block-title';
}

/**
 * Override or insert variables into the block templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("block" in this case.)
 */
function zen_process_block(&$variables, $hook) {
  // Drupal 7 should use a $title variable instead of $block->subject.
  $variables['title'] = $variables['block']->subject;
}

/**
 * Implements hook_page_alter().
 *
 * Look for the last block in the region. This is impossible to determine from
 * within a preprocess_block function.
 *
 * @param $page
 *   Nested array of renderable elements that make up the page.
 */
function zen_page_alter(&$page) {
  // Look in each visible region for blocks.
  foreach (system_region_list($GLOBALS['theme'], REGIONS_VISIBLE) as $region => $name) {
    if (!empty($page[$region])) {
      // Find the last block in the region.
      $blocks = array_reverse(element_children($page[$region]));
      while ($blocks && !isset($page[$region][$blocks[0]]['#block'])) {
        array_shift($blocks);
      }
      if ($blocks) {
        $page[$region][$blocks[0]]['#block']->last_in_region = TRUE;
      }
    }
  }
}
