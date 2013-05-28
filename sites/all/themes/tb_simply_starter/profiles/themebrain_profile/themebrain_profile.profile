<?php
/**
 * Implements hook_install_tasks_alter().
 */
function themebrain_profile_install_tasks_alter(&$tasks, &$install_state) {
  $new_tasks = array(
    'install_select_profile' => $tasks['install_select_profile'],
    'install_select_locale' => $tasks['install_select_locale'],
    'install_load_profile' => $tasks['install_load_profile'],
    'install_verify_requirements' => $tasks['install_verify_requirements'],
    'install_settings_form' => $tasks['install_settings_form'],
    'install_system_module' => $tasks['install_system_module'],
    'install_bootstrap_full' => $tasks['install_bootstrap_full'],
    'install_selected_profile' => array(
      'display_name' => st('Install profile'),
      'function' => 'tb_install_selected_profile'
    ),
    'install_import_locales' => $tasks['install_import_locales'],
    'install_configure_form' => array(
      'display_name' => st('Configure site'),
      'function' => 'tb_install_configure_form',
      'type' => 'form',
    ),
    'install_import_locales_remaining' => $tasks['install_import_locales_remaining'],
    'install_finished' => array(
      'display_name' => st('Install finished'),
      'function' => 'tb_install_finished',
    ),
  );
  $tasks = $new_tasks;
}

/**
 * Forms API validate for the site configuration form.
 */
function tb_install_configure_form_validate($form, &$form_state) {
  if ($error = user_validate_name($form_state['values']['account']['name'])) {
    form_error($form['admin_account']['account']['name'], $error);
  }
  if ($error = user_validate_mail($form_state['values']['account']['mail'])) {
    form_error($form['admin_account']['account']['mail'], $error);
  }
  if ($error = user_validate_mail($form_state['values']['site_mail'])) {
    form_error($form['site_information']['site_mail'], $error);
  }
}

/**
 * Forms API submit for the site configuration form.
 */
function tb_install_configure_form_submit($form, &$form_state) {
  global $user;

  variable_set('site_name', $form_state['values']['site_name']);
  variable_set('site_mail', $form_state['values']['site_mail']);
  variable_set('date_default_timezone', $form_state['values']['date_default_timezone']);
  variable_set('site_default_country', $form_state['values']['site_default_country']);

  // Enable update.module if this option was selected.
  if ($form_state['values']['update_status_module'][1]) {
    module_enable(array('update'), FALSE);

    // Add the site maintenance account's email address to the list of
    // addresses to be notified when updates are available, if selected.
    if ($form_state['values']['update_status_module'][2]) {
      variable_set('update_notify_emails', array($form_state['values']['account']['mail']));
    }
  }

  // We precreated user 1 with placeholder values. Let's save the real values.
  $account = user_load(1);
  $merge_data = array('init' => $form_state['values']['account']['mail'], 'roles' => !empty($account->roles) ? $account->roles : array(), 'status' => 1);
  user_save($account, array_merge($form_state['values']['account'], $merge_data));
  // Load global $user and perform final login tasks.
  $user = user_load(1);
  user_login_finalize();

  if (isset($form_state['values']['clean_url'])) {
    variable_set('clean_url', $form_state['values']['clean_url']);
  }

  // Record when this install ran.
  variable_set('install_time', $_SERVER['REQUEST_TIME']);
}

function tb_install_configure_form($form, &$form_state, &$install_state) {
  if (variable_get('site_name', FALSE) || variable_get('site_mail', FALSE)) {
    // Site already configured: This should never happen, means re-running the
    // installer, possibly by an attacker after the 'install_task' variable got
    // accidentally blown somewhere. Stop it now.
    throw new Exception(install_already_done_error());
  }

  drupal_set_title(st('Configure site'));

  // Warn about settings.php permissions risk
  $settings_dir = conf_path();
  $settings_file = $settings_dir . '/settings.php';
  // Check that $_POST is empty so we only show this message when the form is
  // first displayed, not on the next page after it is submitted. (We do not
  // want to repeat it multiple times because it is a general warning that is
  // not related to the rest of the installation process; it would also be
  // especially out of place on the last page of the installer, where it would
  // distract from the message that the Drupal installation has completed
  // successfully.)
  if (empty($_POST) && (!drupal_verify_install_file(DRUPAL_ROOT . '/' . $settings_file, FILE_EXIST|FILE_READABLE|FILE_NOT_WRITABLE) || !drupal_verify_install_file(DRUPAL_ROOT . '/' . $settings_dir, FILE_NOT_WRITABLE, 'dir'))) {
    drupal_set_message(st('All necessary changes to %dir and %file have been made, so you should remove write permissions to them now in order to avoid security risks. If you are unsure how to do so, consult the <a href="@handbook_url">online handbook</a>.', array('%dir' => $settings_dir, '%file' => $settings_file, '@handbook_url' => 'http://drupal.org/server-permissions')), 'warning');
  }

  drupal_add_js(drupal_get_path('module', 'system') . '/system.js');
  // Add JavaScript time zone detection.
  drupal_add_js('misc/timezone.js');
  // We add these strings as settings because JavaScript translation does not
  // work on install time.
  drupal_add_js(array('copyFieldValue' => array('edit-site-mail' => array('edit-account-mail'))), 'setting');
  drupal_add_js('jQuery(function () { Drupal.cleanURLsInstallCheck(); });', 'inline');
  // Add JS to show / hide the 'Email administrator about site updates' elements
  drupal_add_js('jQuery(function () { Drupal.hideEmailAdministratorCheckbox() });', 'inline');
  // Build menu to allow clean URL check.
  //menu_rebuild();

  // Cache a fully-built schema. This is necessary for any invocation of
  // index.php because: (1) setting cache table entries requires schema
  // information, (2) that occurs during bootstrap before any module are
  // loaded, so (3) if there is no cached schema, drupal_get_schema() will
  // try to generate one but with no loaded modules will return nothing.
  //
  // This logically could be done during the 'install_finished' task, but the
  // clean URL check requires it now.
  drupal_get_schema(NULL, TRUE);

  // Return the form.
  $current_form = _install_configure_form($form, $form_state, $install_state);
  return $current_form;
}

function tb_install_finished() {
  drupal_set_title(st('@drupal installation complete', array('@drupal' => drupal_install_profile_distribution_name())), PASS_THROUGH);
  $messages = drupal_set_message();
  $output = '<p>' . st('Congratulations, you installed @drupal!', array('@drupal' => drupal_install_profile_distribution_name())) . '</p>';
  $output .= '<p>' . (isset($messages['error']) ? st('Review the messages above before visiting <a href="@url">your new site</a>.', array('@url' => url(''))) : st('<a href="@url">Visit your new site</a>.', array('@url' => url('')))) . '</p>';
  return $output;  
}

function tb_install_selected_profile() {
  $info = Database::getConnectionInfo();
  $sqlserver = $info ['default'] ['host'] . (empty($info ['default'] ['port']) ? "" : (":" . $info ['default'] ['port']));
  $user = $info ['default'] ['username'];
  $password = $info ['default'] ['password'];
  $database = $info ['default'] ['database'];
  $driver = $info ['default'] ['driver'];
  $prefix = $info ['default'] ['prefix']['default'];
  
  if ($driver == 'mysql') {
    $connection = mysql_connect($sqlserver, $user, $password);
    @mysql_select_db($database, $connection);
    
    $file_name = dirname(__FILE__) . '/sample_data/sample_data.sql';
	if(!file_exists($file_name)) {
	  $file_name = dirname(__FILE__) . '/sample_data.sql';
	}
    if(!file_exists($file_name)) {
	  $file_name = DRUPAL_ROOT . '/_resource/sample_data.sql';
	}

	$tables = db_query('SHOW TABLES')->fetchCol(0);
    foreach ($tables as $table) {
      if(empty($prefix) || strpos($table, $prefix) === 0) {
        try {
      	  db_query("TRUNCATE TABLE $table");
        }
        catch (Exception $e) {
        }
      }
    }
    $success = tb_import_database($file_name, $prefix, $connection);
    variable_set('file_temporary_path', NULL);
    file_directory_temp();
    variable_set('site_name', FALSE);
    variable_set('site_mail', FALSE);
    cache_clear_all();
  }
}

function tb_import_database($file_name, $prefix, $connection) {
  try {
    mysql_query("SET NAMES 'utf8'", $connection);
    $queries = array ();
    $current_query = array ();
    $file = @fopen($file_name, "r");
    if ($file) {
      while (($buffer = fgets($file)) !== false) {
        $buffer = trim($buffer);
        if (strpos($buffer, "--") === 0) {
          continue;
        }
        if (empty($buffer) || strpos($buffer, "INSERT INTO") === 0 || strpos($buffer, "CREATE TABLE") === 0) {
          if(strpos($buffer, "INSERT INTO `") === 0) {
      	    $buffer = str_replace("INSERT INTO `",  "INSERT INTO `" . $prefix, $buffer);
          }

          if(strpos($buffer, "CREATE TABLE IF NOT EXISTS `") === 0) {
      	    $buffer = str_replace("CREATE TABLE IF NOT EXISTS `",  "CREATE TABLE IF NOT EXISTS `". $prefix, $buffer);
          }

          if (count($current_query) != 0) {
            $query = implode(" ", $current_query);
            $result = mysql_query($query, $connection);
          }
          $current_query = empty($buffer) ? array () : array (
            $buffer 
          );
        }
        else {
          $current_query [] = $buffer;
        }
      }
    }
  
    $query = implode(" ", $current_query);
    $result = mysql_query($query, $connection);
    return true;
  }
  catch (Exception $e) {
    return false;
  }
}

