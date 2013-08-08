<?php

/**
 * @file
 * Contains page callbacks for og_menu
 */

/**
 * Menu callback which shows an overview page of all the custom menus in a
 * user's group and along with their description.
 */
function og_menu_overview_page($group_type, $gid) {
  // Set the title of the page.
  $entity_wrapper = entity_metadata_wrapper($group_type, $gid);
  $entity_label = $entity_wrapper->label() ? $entity_wrapper->label() : $group_type . ' ' . $gid;
  drupal_set_title(t('List menus for %title', array('%title' => $entity_label)), PASS_THROUGH);
  // Set the breadcrumb.
  og_set_breadcrumb($group_type, $gid, array(l(t('Group'), "$group_type/$gid/group")));

  // @todo Replace by D7 database independent functions.
  $result = db_query("
    SELECT om.gid, om.menu_name as name, m.title as title, m.description as description FROM {og_menu} om
    LEFT JOIN {menu_custom} m
    ON om.menu_name = m.menu_name
    WHERE om.gid = :gid
    ORDER BY title", array(':gid' => $gid));
  $header = array(t('Title'), array('data' => t('Operations'), 'colspan' => '3'));
  $rows = array();
  foreach ($result as $menu) {
    $row = array(theme('menu_admin_overview', array('title' => $menu->title, 'name' => $menu->name, 'description' => $menu->description)));
    $row[] = array('data' => l(t('list links'), 'group/' . $group_type . '/' . $gid . '/admin/menus/' . $menu->name));
    $row[] = array('data' => l(t('edit menu'), 'group/' . $group_type . '/' . $gid . '/admin/menus/' . $menu->name . '/edit'));
    $row[] = array('data' => l(t('add link'), 'group/' . $group_type . '/' . $gid . '/admin/menus/' . $menu->name . '/add'));
    $rows[] = $row;
  }

  if ($result->rowCount() == 0) {
    return t('There are currently no menus.');
  }
  else {
    return theme('table', array('header' => $header, 'rows' => $rows));
  }
}

/**
 * Menu callback; Build the form that handles the adding/editing of a custom menu.
 */
function og_menu_edit_menu_form($form, &$form_state, $type, $group_type, $gid, $menu = array()) {
  module_load_include('inc', 'menu', 'menu.admin');
  $entity_wrapper = entity_metadata_wrapper($group_type, $gid);
  $label = $entity_wrapper->label();
  // Set the breadcrumb.
  og_set_breadcrumb($group_type, $gid, array(l(t('Group'), "$group_type/$gid/group")));

  // Set the title of the page.
  switch ($type) {
    case 'add': drupal_set_title(t('Add menu for @title', array('@title' => $label)), PASS_THROUGH);
      break;

    case 'edit': drupal_set_title(t('Edit menu for @title', array('@title' => $label)), PASS_THROUGH);
      break;
  }

  // Build the form.
  $form = array();
  $form = menu_edit_menu($form, $form_state, $type, $menu);
  $form['og_menu_group_type'] = array(
    '#type' => 'value',
    '#value' => $group_type,
  );
  $form['og_menu_gid'] = array(
    '#type' => 'value',
    '#value' => $gid,
  );
  if ($type == 'edit') {
    $form['og_menu_name'] = array(
      '#type' => 'value',
      '#value' => $menu['menu_name'],
    );
  }
  // Add submit handlers.
  $form['#submit'][] = 'menu_edit_menu_submit';
  $form['#submit'][] = 'og_menu_edit_menu_form_submit';
  $form['#submit'][] = 'og_menu_edit_menu_form_submit_redirect';
  $form['actions']['delete']['#submit'][0] = 'og_menu_delete_menu_form_submit';
  return $form;
}

/**
 * Submit handler for og_menu_edit_menu_form
 */
function og_menu_delete_menu_form_submit($form, &$form_state) {
  $group_type = $form['og_menu_group_type']['#value'];
  $gid = $form['og_menu_gid']['#value'];
  $menu_name = $form['og_menu_name']['#value'];
  $form_state['redirect'] = 'group/' . $group_type . '/' . $gid . '/admin/menus/' . $menu_name . '/delete';
}

/**
 * Submit handler which handles redirection for og_menu_edit_menu_form form.
 */
function og_menu_edit_menu_form_submit_redirect($form, &$form_state) {
  $group_type = $form['og_menu_group_type']['#value'];
  $gid = $form['og_menu_gid']['#value'];
  $menu_name = $form['#insert'] ? $menu_name = 'menu-' . $form['menu_name']['#value'] : $form['og_menu_name']['#value'];
  $form_state['redirect'] = 'group/' . $group_type . '/' . $gid . '/admin/menus/' . $menu_name;
}

/**
 * Form callback which shows an entire menu tree at once.
 */
function og_menu_overview_form($form, &$form_state, $group_type, $gid, $menu) {
  module_load_include('inc', 'menu', 'menu.admin');
  drupal_set_title(t('List items for menu !mtitle', array('!mtitle' => $menu['title'])), PASS_THROUGH);
  // Set the breadcrumb.
  og_set_breadcrumb($group_type, $gid, array(l(t('Group'), "$group_type/$gid/group")));
  $b = drupal_get_breadcrumb();
  $b[] = l(t('Menus'), 'group/' . $group_type . '/' . $gid . '/admin/menus');
  drupal_set_breadcrumb($b);
  $form = menu_overview_form($form, $form_state, $menu);

  $form['#theme'] = 'menu_overview_form';
  $form['#empty_text'] = t('There are no menu links yet.') . ' ' . l(t('Add link'), 'group/' . $group_type . '/' . $gid . '/admin/menus/' . $menu['menu_name'] . '/add');

  foreach (element_children($form) as $mlid) {
    if (strstr($mlid, 'mlid:')) {
      $item = $form[$mlid]['#item'];
      $operations = array();
      $operations['edit'] = array(
        '#type' => 'link',
        '#title' => t('edit'),
        '#href' => 'group/' . $group_type . '/' . $gid . '/admin/menus/' . $menu['menu_name'] . '/item/' . $item['mlid'] . '/edit',
      );

      if ($item['module'] == 'menu' || $item['updated'] == 1) {
        $operations['delete'] = array(
          '#type' => 'link',
          '#title' => t('delete'),
          '#href' => 'group/' . $group_type . '/' . $gid . '/admin/menus/' . $menu['menu_name'] . '/item/' . $item['mlid'] . '/delete',
        );
      }
      $form[$mlid]['operations'] = $operations;
    }
  }
  return $form;
}

/**
 * Submit function; does the same as the normal menu_overview_form_submit.
 */
function og_menu_overview_form_submit($form, &$form_state) {
  menu_overview_form_submit($form, $form_state);
}

/**
 * Form callback for node/%node/admin/menus/%menu/delete.
 */
function og_menu_delete_menu_confirm($form, &$form_state, $menu, $group_type, $gid) {
  module_load_include('inc', 'menu', 'menu.admin');
  $form = menu_delete_menu_confirm($form, $form_state, $menu);
  $form['og_menu_group_type'] = array(
    '#type' => 'value',
    '#value' => $group_type,
  );
  $form['og_menu_gid'] = array(
    '#type' => 'value',
    '#value' => $gid,
  );
  $form['actions']['cancel']['#href'] = 'group/' . $group_type . '/' . $gid . '/admin/menus/' . $menu['menu_name'];
  $form['#submit'][] = 'menu_delete_menu_confirm_submit';
  $form['#submit'][] = 'og_menu_delete_menu_confirm_submit';
  $form['#submit'][] = 'og_menu_delete_menu_confirm_submit_redirect';
  return $form;
}

/**
 * Form callback; Build the menu link editing form.
 */
function og_menu_edit_item_form($form, &$form_state, $type, $group_type, $gid, $menu, $item = array()) {
  module_load_include('inc', 'menu', 'menu.admin');
  $form = menu_edit_item($form, $form_state, $type, $item, $menu);
  // Set the breadcrumb now to override menu_edit_item() breadcrumb.
  og_set_breadcrumb($group_type, $gid, array(l(t('Group'), "$group_type/$gid/group")));
  $b = drupal_get_breadcrumb();
  $b[] = l(t('Menus'), 'group/' . $group_type . '/' . $gid . '/admin/menus');
  $b[] = l($menu['title'], 'group/' . $group_type . '/' . $gid . '/admin/menus/' . $menu['menu_name']);
  drupal_set_breadcrumb($b);
  $list = array();
  $menus = og_menu_get_group_menus(array($group_type => array(0 => $gid)));
  foreach ($menus as $option) {
    $list[$option['menu_name']] = $option['title'];
  }

  // Set the title of the page.
  drupal_set_title(t('Add item into menu !mtitle', array('!mtitle' => $menu['title'])), PASS_THROUGH);


  // Build the form.
  $form['parent']['#options'] = menu_parent_options($list, array('mlid' => 0));
  $form['og_menu_group_type'] = array(
    '#type' => 'value',
    '#value' => $group_type,
  );
  $form['og_menu_gid'] = array(
    '#type' => 'value',
    '#value' => $gid,
  );
  $form['og_menu_name'] = array(
    '#type' => 'value',
    '#value' => $menu['menu_name'],
  );
  $form['#submit'][] = 'menu_edit_item_submit';
  $form['#submit'][] = 'og_menu_redirect';
  $form['#validate'][] = 'menu_edit_item_validate';
  if (!empty($item)) {
    $form['actions']['delete'] = array(
      '#type' => 'link',
      '#title' => 'Delete',
      '#href' => 'group/' . $group_type . '/' . $gid . '/admin/menus/'
        . $menu['menu_name'] . '/item/' . $item['mlid'] . '/delete',
      '#weight' => 10,
    );
  }
  return $form;
}

/**
 * Form callback for node/%node/og_menu/%menu/item/%menu_link/delete page
 */
function og_menu_delete_item_form($form, &$form_state, $item, $group_type, $gid, $menu) {
  module_load_include('inc', 'menu', 'menu.admin');
  $form = menu_item_delete_form($form, $form_state, $item);
  $form_state['values']['link_path'] = $form['#item']['link_path'];
  $form['og_menu_group_type'] = array(
    '#type' => 'value',
    '#value' => $group_type,
  );
  $form['og_menu_gid'] = array(
    '#type' => 'value',
    '#value' => $gid,
  );
  $form['og_menu_name'] = array(
    '#type' => 'value',
    '#value' => $menu['menu_name'],
  );
  $form['#submit'][] = 'menu_item_delete_form_submit';
  $form['#submit'][] = 'og_menu_redirect';
  $form['actions']['cancel']['#href'] = 'group/' . $group_type . '/' . $gid . '/admin/menus/' . $menu['menu_name'];
  return $form;
}

/**
 * Form callback for OG Menu configuration.
 */
function og_menu_config_form($form, &$form_state) {
  $bundles = og_get_all_group_bundle();

  $form['og_menu_block_links'] = array(
    '#type' => 'checkbox',
    '#title' => t('Convert OG Menu block titles into links'),
    '#default_value' => variable_get('og_menu_block_links', FALSE),
    '#description' =>
      t('If enabled, OG Menu block titles will link to the groupnode.'),
  );
  $form['og_menu_create_by_default'] = array(
    '#type' => 'checkbox',
    '#title' => t('Automatically create a OG Menu for new Organic Group'),
    '#default_value' => variable_get('og_menu_create_by_default', FALSE),
    '#description' => t('If enabled, an OG Menu will be created by default when
      a new Organic Group node is created.'),
  );

  $form['og_menu_max_menus_per_group'] = array(
    '#type' => 'textfield',
    '#title' => t('Maximum number of menus per group'),
    '#default_value' => variable_get('og_menu_max_menus_per_group', 1),
    '#size' => 20,
    '#maxlength' => 5,
    '#required' => TRUE,
    '#description' => t("Enter 0 for no limit. Users with the 'administer menu'
      permission will be able to bypass this."),
  );

  $form['og_menu_assignment'] = array(
    '#type' => 'radios',
    '#options' => array('select' => t('Select list'),
      'autocomplete' => t('Textbox with autocomplete')),
    '#title' => t('Use autocomplete field on menu admin page'),
    '#default_value' => variable_get('og_menu_assignment', 'autocomplete'),
    '#required' => 'TRUE',
    '#description' =>
      t('Autocomplete is recommended when you have a lot of organic groups.'),
  );

  // OG Menu default links.
  $form['og_menu_default_link_bundles'] = array(
    '#title' => t('OG Menu default links'),
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#description' => $bundles ? t('Specify default links to be added to get
      each new OG Menu for each node bundle.  Enter each <b>URL</b> followed by
      a <strong>title</strong> delimited by a pipe. Examples:
      <ul>
        <li>www.example.com|Example Link</li>
        <li>faculty/[node:nid]|Link to Faculty Page for Group <em>(If tokens are enabled)</em>
        </li>
      </ul>') : t('There are no group type bundles yet.'),
  );

  // Add a field for each bundle.
  if ($bundles) {
    foreach ($bundles['node'] as $bundle => $bundle_label) {
      $form['og_menu_default_link_bundles']['og_menu_default_links_' . strtolower($bundle)] = array(
        '#type' => 'textarea',
        '#title' => t("%bundle Bundle", array('%bundle' => $bundle_label)),
        '#default_value' => variable_get('og_menu_default_links_' . strtolower($bundle), FALSE),
        '#description' => t("These links will be added to any new OG Menus added
          to <b>%bundle</b> groups.", array('%bundle' => $bundle_label)),
      );
    }
  }

  if (module_exists('token')) {
    $form['token_help'] = array(
      '#title' => t('Replacement patterns'),
      '#type' => 'fieldset',
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#description' => t('Prefer raw-text replacements for text to avoid problems with HTML entities!'),
    );

    $form['token_help']['help'] = array(
      '#theme' => 'token_tree',
      '#token_types' => array('node'),
    );
  }

  // Visibility setting to hide OG Menus on selected pages.
  $form['og_menu_visibility'] = array(
    '#type' => 'fieldset',
    '#title' => t('Admin page visibility'),
    '#description' => t("On sites with multiple OG Menus it might be prefereable
      to hide them in places where you don't need them."),
  );

  $form['og_menu_visibility']['og_menu_show_blocks'] = array(
      '#type' => 'checkbox',
      '#title' => t("Show blocks for individual OG Menus"),
      '#default_value' => variable_get('og_menu_show_blocks', FALSE),
      '#description' => t("If disabled, blocks for OG Menus will be hidden from the block administration page."),
  );
  $form['og_menu_visibility']['og_menu_show_nodetype'] = array(
      '#type' => 'checkbox',
      '#title' => t("Include OG Menus in node type menu settings"),
      '#default_value' => variable_get('og_menu_show_nodetype', FALSE),
      '#description' => t("If disabled, OG Menus will be hidden from the node type config page."),
  );
  if (module_exists('menu_position')) {
    $form['og_menu_visibility']['og_menu_show_menuposition'] = array(
        '#type' => 'checkbox',
        '#title' => t("Show as available parent in menu position rules."),
        '#default_value' => variable_get('og_menu_show_menuposition', FALSE),
        '#description' => t("If disabled, OG Menus will be hidden from the menu position parent selection dropdown."),
    );
  }
  if (module_exists('homebox')) {
    $form['og_menu_visibility']['og_menu_show_homebox'] = array(
        '#type' => 'checkbox',
        '#title' => t("Show blocks in Homebox admin page"),
        '#default_value' => variable_get('og_menu_show_homebox', FALSE),
        '#description' => t("If disabled, blocks for OG Menus will be hidden from the homebox administration page."),
    );
  }
  return system_settings_form($form);
}

/**
 * Validation for OG Menu config form.
 */
function og_menu_config_form_validate($form, &$form_state) {
  $max_num = $form_state['values']['og_menu_max_menus_per_group'];
  if (!is_numeric($max_num)) {
    form_set_error('og_menu_max_menus_per_group', t('You must enter an integer for the maximum number of menus per group.'));
  }
  elseif ($max_num < 0) {
    form_set_error('og_menu_max_menus_per_group', t('Maximum number of menus per group must be positive.'));
  }

  foreach ($form_state['values'] as $form_index => $form_val) {
    if (preg_match('/^og_menu_default_links_(\w+)$/', $form_index)) {
      $links = explode("\n", $form_val );
      foreach ($links as $link) {
        $link_parts = explode('|', $link);
        if (substr($link_parts[0], 0, 1) == '/') {
          form_set_error('$form_index',
            t("%link is not a valid link. Make sure link does not start with a '/'.", array('%link' => $link)));
        }
      }
    }
  }
}

/**
 * Callback for admin/structure/og_menu
 * Just duplicates the standard menu list, but only displays those created through og_menu
 */
function og_admin_menu_overview_form($form, $form_state) {
  $session = isset($_SESSION['og_menu_filter']) ? $_SESSION['og_menu_filter'] : array();

  // Get filter value from $_SESSION variable.
  foreach ($session as $filter) {
    list($type, $value) = $filter;
  }

  $form['filters'] = array(
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#collapsed' => (isset($type)) ? FALSE : TRUE,
    '#title' => 'Filter',
    '#description' => 'Filter on the title of the OG menu.',
  );

  $form['filters']['og_menu_filter'] = array(
    '#type' => 'textfield',
    '#title' => t('Filter this out'),
    '#required' => FALSE,
    '#size' => 20,
    '#default_value' => isset($type) ? $value : '',
  );

  $form['filters']['og_menu_actions'] = array(
    '#type' => 'actions',
    '#attributes' => array('class' => array('container-inline')),
  );
  $form['filters']['og_menu_actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Filter'),
  );
  if (count($session)) {
    $form['filters']['og_menu_actions']['reset'] = array('#type' => 'submit', '#value' => t('Reset'));
  }

  $header = array(t('Title'), array(
    'data' => t('Operations'),
    'colspan' => '3',
  ));
  $header = array(
    array('data' => 'Title', 'field' => 'title', 'sort' => 'asc'),
    array('data' => 'Operations', 'colspan' => '3'),
  );

  // Build Query (extend for paging and sorting).
  $query = db_select('menu_custom', 'mc')->extend('PagerDefault')->limit(20);
  $query->join('og_menu', 'om', 'mc.menu_name = om.menu_name');    //Pager Extender
  $query->fields('mc')
    ->fields('om')
    ->orderBy('title')
    ->extend('TableSort')
    ->orderByHeader($header);

  // Add conditional filter if enter by user.
  if (isset($type)) {
    $query->condition('title', '%' . $value . '%', 'LIKE');
  }

  $result = $query->execute();

  // Build table.
  $rows = array();
  foreach ($result as $menu) {
    $row = array(theme('menu_admin_overview', array('title' => $menu->title, 'name' => $menu->menu_name, 'description' => $menu->description)));
    $row[] = array('data' => l(t('list links'), 'admin/structure/menu/manage/' . $menu->menu_name));
    $row[] = array('data' => l(t('edit menu'), 'admin/structure/menu/manage/' . $menu->menu_name . '/edit'));
    $row[] = array('data' => l(t('add link'), 'admin/structure/menu/manage/' . $menu->menu_name . '/add'));
    $rows[] = $row;
  }

  $output = theme('table', array('header' => $header, 'rows' => $rows)) . theme('pager');

  $form['og_menu_menu_list'] = array(
    '#type' => 'markup',
    '#title' => t('Results'),
    '#markup' => $output,
  );

  return $form;
}

/**
 * Process result from OG Menu administration filter form.
 */
function og_admin_menu_overview_form_submit($form, &$form_state) {
  switch ($form_state['values']['op']) {
    case t('Filter'):
      if (isset($form_state['values']['og_menu_filter']) && $form_state['values']['og_menu_filter'] != '') {
        $_SESSION['og_menu_filter'][] = array('og_menu_filter', $form_state['values']['og_menu_filter']);

      }
      break;
    case t('Reset'):
      $_SESSION['og_menu_filter'] = array();
      break;
  }
}
