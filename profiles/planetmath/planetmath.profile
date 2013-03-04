<?php


/* Instructions for using this file... TBA
 * STATUS: The current setup makes it through the installation
 * routine, but it doesn't seem that any functions in this file are actually
 * run.
 */

// There is a possibility to set up a sub-profile, so that could be used to create 
// a configuration for Phanta Rhei as well as for PlanetMath.  If we can get to the
// level of site logos and such, then we can e.g. make a configuration for
// PlanetPhysics.

// description of parameters for arrays in `hook_install_tasks' (implemented below)

  /* `display' determines whether to show this task in the
     list of installation tasks on the side of the
     installation screens. If display_name is not given or
     display is FALSE, the task does not appear in the
     list of installation tasks on the side of the
     installation screens. display is useful if you want
     to conditionally display a task; for example, you
     might want to display a configuration form for a
     module that the user chose to enable in a previous
     step, but skip that form if the module was not
     enabled.*/

  /* `type' can be one of "normal," "batch," or "form."

     "Normal" tasks can return HTML that will be displayed
     as a page in the installer or NULL to indicate that
     the task is completed.  This is the default.
     Remember to provide some way to go on to the next
     step, such as a "continue" button.

     "Batch" tasks return a batch array to be processed by
     the Batch API, which is useful for example if you
     want to import something that could take awhile. The
     task will be considered complete when the batch
     finishes processing.

     "Form" tasks return a Form API structured array which
     will be displayed as a form on a page in the
     installer. The installer will take care of moving the
     user to the next task when the form is submitted.
     You can see more specifically what happens for each
     type in install_run_task(). */

  /* run should be one of INSTALL_TASK_RUN_IF_REACHED,
     INSTALL_TASK_RUN_IF_NOT_COMPLETED, or
     INSTALL_TASK_SKIP.

     INSTALL_TASK_RUN_IF_REACHED means the task will run
     at each stage of the installation that reaches
     it. This is mainly used by core to include important
     resources on each page of the installer.

     INSTALL_TASK_RUN_IF_NOT_COMPLETED means the task will
     run once during the installation process. This is the
     default, and it is useful for things like displaying
     instructions and configuration forms, or for
     inserting content into the database.

     INSTALL_TASK_SKIP means the task will not be
     run. This is usually set conditionally, since you may
     want to skip tasks depending on the options the user
     chose in previous steps. Typically a task will be
     skipped when display is set to FALSE, but it is also
     possible to display a task in the list without
     executing it.*/

  /* function is the name of the function that will be run
     when the task is executed.  If not set, this is the
     same as the machine_name of the task. You may want to
     set it to something else if you want to use the same
     function for multiple tasks, or if you want to
     conditionally choose a function depending on the
     options the user chose in previous steps.*/

/**
 * Implements hook_install_tasks
 */
function planetmath_install_tasks($install_state) {
  $tasks = array(
		 'my_0th_task' => array(
                                        'display_name' => st('Create Full Html format.'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_create_full_html_format',
                                        ),
		 'my_0ath_task' => array(
                                        'display_name' => st('Create Filtered Html format.'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_create_filtered_html_format',
                                        ),
		 /* 'my_1st_task' => array( */
                 /*                        'display_name' => st('Patch the core.'), */
                 /*                        'display' => TRUE, */
                 /*                        'type' => 'normal', */
                 /*                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED, */
                 /*                        'function' => 'planetmath_profile_patch_core', */
                 /*                        ), */
                 'my_2nd_task' => array(
                                        'display_name' => st('Create 17 forums.'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_forum_creator',
                                        ),
                 'my_5th_task' => array(
                                        'display_name' => st('Configure Node Types'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_configure_node_types',
                                        ),
                 'my_4th_task' => array(
                                        'display_name' => st('Configure DruTeXML settings properly'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_drutexml_configuration',
                                        ),
                 'my_mth_task' => array(
                                        'display_name' => st('Add extra fields to user entities'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_setup_user_entities',
                                        ),
                 'my_5Ath_task' => array(
                                        'display_name' => st('Configure Email Rerouting'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_configure_email_rerouting',
                                        ),
                 'my_6th_task' => array(
                                        'display_name' => st('Configure Organic Groups'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_configure_groups',
                                        ),

                 'my_8th_task' => array(
                                        'display_name' => st('Configure RDF mappings'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_rdf_mappings',
                                        ),
                 'my_9Ath_task' => array(
                                        'display_name' => st('Set up the basic Userpoints config'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_set_userpoints_variables',
                                        ),
                 'my_9th_task' => array(
                                        'display_name' => st('Set miscellaneous variables'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_set_misc_variables',
                                        ),
                 'my_cap_task' => array(
                                        'display_name' => st('Configure site CAPTCHA'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_configure_captcha',
                                        ),
                 'my_14th_task' => array(
                                        'display_name' => st('Choose and install the theme'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_setup_theme',
                                        ),
                 'my_7th_task' => array(
                                        'display_name' => st('Configure Blocks'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_configure_blocks',
                                        ),
                 'my_12th_task' => array(
                                        'display_name' => st('Configure permissions'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_setup_permissions',
                                        ),
                 'my_13th_task' => array(
                                        'display_name' => st('Configure Menus'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_setup_menus',
                                        ),
                 );
  return $tasks;
}

// This is useful for "internal" needs, we may or may not need to expose it to the user
// We could use PHP format everywhere instead but that might confuse people.  This seems
// a little cleaner.
function planetmath_profile_create_full_html_format() {
  $full_html_format = array(
    'format' => 'full_html', 
    'name' => 'Full HTML', 
    'weight' => 1, 
    'filters' => array(
      // URL filter.
      'filter_url' => array(
        'weight' => 0, 
        'status' => 1,
      ),
      // Line break filter. 
      'filter_autop' => array(
        'weight' => 1, 
        'status' => 1,
      ),
      // HTML corrector filter. 
      'filter_htmlcorrector' => array(
        'weight' => 10, 
        'status' => 1,
      ),
    ),
  );
  $full_html_format = (object) $full_html_format;
  filter_format_save($full_html_format);
}

function planetmath_profile_create_filtered_html_format() {
    $filtered_html_format = array(
    'format' => 'filtered_html',
    'name' => 'Filtered HTML',
    'weight' => 0,
    'filters' => array(
      
      // URL filter.
      'filter_url' => array(
        'weight' => 0,
        'status' => 1,
      ),
      
      // HTML filter.
      'filter_html' => array(
        'weight' => 1,
        'status' => 1,
      ),
      
      // Line break filter.
      'filter_autop' => array(
        'weight' => 2,
        'status' => 1,
      ),
      
      // HTML corrector filter.
      'filter_htmlcorrector' => array(
        'weight' => 10,
        'status' => 1,
      ),
    ),
  );
  $filtered_html_format = (object) $filtered_html_format;
  filter_format_save($filtered_html_format);
}

function planetmath_profile_patch_core() {
  module_enable('devel');
  dd('In planetmath_profile_patch_core');
  // In general this should be set interactively via some config option (how?)
  $install_directory = '/home/planetary/drupal_planetary/';
  chdir($install_directory);

  //skip for now, since I just applied those by hand...
  //it would be nice to have some logic that would only run the patch if needed.

  //shell_exec('patch -p5 < node.module.patch');
  //shell_exec('patch -p5 < node.api.php.patch');
  return NULL;
}

// This seems to be pretty much what's needed...
function planetmath_profile_forum_creator() {
  dd("Profile- In planetmath_profile_forum_creator");
  set_time_limit(0);

  // Note that there will already be a "general discussion" forum created out of
  // the box.  It would be best to delete it so that the mappings are consistent.
  // This should do it:
  //---- taxonomy_term_delete(1);
  // Try this a different way:

  dd("Revising definition of Forum 1");

  $firstForum = taxonomy_term_load(1);
  $firstForum->name = 'PlanetMath System Updates and News';
  $firstForum->description = 'Site news and updates not major enough for the main page.';
  taxonomy_term_save($firstForum);



  /* $forum_topic_fields = array(); */
  /* $forum_topic_fields['values']['name'] = 'PlanetMath System Updates and News'; */
  /* $forum_topic_fields['values']['description'] = 'Site news and updates not major enough for the main page.'; */
  /* $forum_topic_fields['values']['parent'][0] = array(0); */
  /* $forum_topic_fields['values']['weight'] = 0; */
  /* $forum_topic_fields['values']['vid'] = 1; */

  /* $forum = forum_form_forum($forum_topic_fields); */
  /* forum_form_submit($forum,$forum_topic_fields); */

  // Introducing this because otherwise we get messages complaining
  // that we don't provide it, even though the reason seems 
  // particularly silly, since the argument isn't used in the
  // function that requires it, see discussion at http://drupal.org/node/1748044
  $form_state_req = array();

  dd("creating Forum 2");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'PlanetMath Comments';
  $forum_topic_fields['values']['description'] = 'Talk about the web site itself here; comments, suggestions, complaints.';
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);

  dd("creating Forum 3");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'Math Competitions';
  $forum_topic_fields['values']['description'] = 'For discussing problems from mathematics competitions.';
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);

  dd("creating Forum 4");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'High School/Secondary';
  $forum_topic_fields['values']['description'] = 'For discussing questions from any discipline at high school/secondary school level.';
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);

  dd("creating Forum 5");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'Math Humor';
  $forum_topic_fields['values']['description'] = 'The zingiest of zingers...';
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);

  dd("creating Forum 6");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'University/Tertiary';
  $forum_topic_fields['values']['description'] = 'Questions from any subject, at the university/tertiary/4-year college level.';
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);


  dd("creating Forum 7");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'Testing messages (ignore)';
  $forum_topic_fields['values']['description'] = 'This forum is for testing of message functionality.';
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);


  dd("creating Forum 8");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'LaTeX help';
  $forum_topic_fields['values']['description'] = 'This is the place for asking TeX/LaTeX questions in regards to writing PlanetMath entries.';
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);


  dd("creating Forum 9");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'PlanetMath help';
  $forum_topic_fields['values']['description'] = 'This is the place to get assistance with tasks on PlanetMath.';
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);


  dd("creating Forum 10");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'The Math Pub';
  $forum_topic_fields['values']['description'] = "A catch-all discussion area; for math news and current events, discussion of philosophy of mathematics, math and society, and in general the kind of casual banter you'd find in an appropriately nerdy watering hole.";
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);


  dd("creating Forum 11");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'Graduate/Advanced';
  $forum_topic_fields['values']['description'] = 'Questions aimed at the post- or advanced undergrad level.';
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);


  dd("creating Forum 12");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'Research Topics';
  $forum_topic_fields['values']['description'] = 'Questions at the active research level.';
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);


  dd("creating Forum 13");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'Industry/Practice';
  $forum_topic_fields['values']['description'] = 'Questions arising from real-world applications.';
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);

  dd("creating Forum 14");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'Math History';
  $forum_topic_fields['values']['description'] = 'Discussion of the history of mathematics.';
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);


  dd("creating Forum 15");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'Strategic Communications Development';
  $forum_topic_fields['values']['description'] = 'Discuss strategic communications development for PlanetMath.';
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);

  dd("creating Forum 16");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'PlanetMath.ORG';
  $forum_topic_fields['values']['description'] = 'Official chatter for the PlanetMath nonprofit organization, including discussion with and regarding the board and official business.';
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);

  dd("creating Forum 17");

  $forum_topic_fields = array();
  $forum_topic_fields['values']['name'] = 'Planetary Bugs';
  $forum_topic_fields['values']['description'] = 'A place to report and discuss issues with the new software.';
  $forum_topic_fields['values']['parent'][0] = array(0);
  $forum_topic_fields['values']['weight'] = 0;
  $forum_topic_fields['values']['vid'] = 1;
  $forum_topic_fields['form_id']['#value'] = 'forum';

  $forum = forum_form_forum($forum_topic_fields,$form_state_req);
  forum_form_submit($forum,$forum_topic_fields);


  return NULL;
}

function planetmath_profile_configure_email_rerouting () {
  // need to figure out what goes here! 
  module_enable('reroute_email');
  variable_set(REROUTE_EMAIL_ENABLE, 1);
  variable_set(REROUTE_EMAIL_ADDRESS, "tothedarktowercame@gmail.com");

  return NULL;
}

// NOTE: THIS FUNCTION ASSUMES:
//
// - that the legacy database tables have been imported/massaged
//   using the tables-into-drupal.sql script (for now at least,
//   this should be done by mysql root user; it could be added here
//   at some point if we want that!).
//
// - that tables-into-drupal-pt2.sql and
//   tables-into-drupal-pt3.sql are accessible in the drupal base
//   directory; maybe it should find them somewhere else?
//
// - It also assumes that the images that need to be imported
//   are accessible in ../pm-fileboxes (path relative to
//   the base path of the drupal install directory).
//
// IN ORDER TO MAKE IT LESS OBNOXIOUS, MAYBE THIS SHOULD BE PRESENTED AS AN
// OPTION TO THE USER (i.e. ONLY RUN THIS STEP IF THE USER SAYS THEY WANT TO).
function planetmath_profile_migration_runner () {
  dd("Profile- In planetmath_profile_migration_runner");
  set_time_limit(0);

  module_enable('migrate');
  module_enable('planetmath_migration');
  module_enable('planetmath_migration_extras');
  module_enable('group_migrate');
  module_enable('image_migrate');

  $install_directory = '/home/planetary/drupal_planetary/';
  chdir($install_directory);

  // this step should avoid any need for hardcoding the database name within the profile.

  global $databases;

  $database_name = $databases['default']['default']->database;
  $database_user = $databases['default']['default']->username;
  $database_pass = $databases['default']['default']->password;

  // Not going to mess with this for now.  We COULD do this, but then we would
  // need to give permission to read the planetary database to the drupal user
  // Not a major thing, but it does bifurcate the instructions.  Things could
  // be rewritten so that EVERYTHING about migration could be handled from this
  // profile (given a .sql dump) -- but for now, let's just make it so that
  // SOMETHING can be handled.

  // assume these steps have been run outside of drupal, see assumptions above.
  // shell_exec("sed -i 's/demodb/".$database_name."/g' tables-into-drupal.sql");
  // shell_exec("mysql -u ".$database_user." --password=".$database_pass." ".$database_name." < tables-into-drupal.sql");
  // shell_exec("cp sites/default/default.settings.php sites/default/settings.php");

  dd(" running tables-into-drupal-pt2.sql command");
  dd(shell_exec('mysql -u '.$database_user.' --password='.$database_pass.' '.$database_name. ' < tables-into-drupal-pt2.sql'));

  
  // it would also be cool if this could be executed from within a screen... or if
  // I knew how to make it run via the visual UI, but that seems like another story altogether
  dd(" running drush migrate-import PMUser");
  dd(shell_exec('drush migrate-import PMUser'));

  dd(" running drush migrate-import PMForumOP");
  dd(shell_exec('drush migrate-import PMForumOP'));

  dd(" running drush migrate-import PMForumFirstComment");
  shell_exec('drush migrate-import PMForumFirstComment');

  dd(" running drush migrate-import PMForumComment");
  shell_exec('drush migrate-import PMForumComment');

  dd(" running drush migrate-import PMObject");
  shell_exec('drush migrate-import PMObject');

  dd(" running drush migrate-import PMObjectComment");
  shell_exec('drush migrate-import PMObjectComment');

  dd(" running tables-into-drupal-pt3.sql commands");
  shell_exec('mysql -u '.$database_user.' --password='.$database_pass.' '.$database_name.
             ' < tables-into-drupal-pt3.sql');

  // Gets user data ported
  dd(" running planetmath_migration_extras_migrateUserFields");
  planetmath_migration_extras_migrateUserFields();

  // Gets correction data ported
  dd(" running planetmath_migration_extras_corrections");
  planetmath_migration_extras_corrections();

  // Gets old permissions ported over into organic groups
  // SKIP FOR NOW B/C WE NEED TO SET UP EMAIL REROUTING FIRST!
  // group_migrate_run_group_migration();

  // processes images.
  dd(" running image_migrate_im_buildShell");
  image_migrate_im_buildShell();
  dd(" running image_migrate_createAllNodes");
  image_migrate_createAllNodes();
  return NULL;
}

function planetmath_profile_group_creator () {
  dd("Profile- In planetmath_profile_group_creator");
  set_time_limit(0);
  // probably unneeded since groups are being moved in the migration function
  return NULL;
}


// Sets up a latex field
//
// Note: The user will still have to go to
//   admin/config/content/formats/tex_editor
// to specify their LaTeXML daemon URL if they don't want to use the default.
// (That could be changed and added to this configuration script.)

// TODO  LaTeX field needs to be turned on for articles, problems, solutions...
// and maybe some other content types.

function planetmath_profile_drutexml_configuration() {
  dd("Profile- In planetmath_profile_drutexml_configuration");
  set_time_limit(0);
  //module_enable('drutexml');

  // create a LaTeX-filter-enabled Content Type (AKA Text format) --
  // name it "TeX Editor"
  $tex_format = array(
                        'format' => 'tex_editor',
                        'name' => 'TeX Editor',
                        'weight' => 0,
                        'filters' => array('latex_filter' => array(
                                                                   'weight' => 0,
                                                                   'status' => 1,
                                                                   ),),
                      );
  $tex_format = (object) $tex_format;
  filter_format_save($tex_format);

  // Indicate that the TeX Editor text format should enable the "latex" filter format
  // with the default settings

  db_merge('filter')
    ->key(array('format'=> 'tex_editor', 'name'=> 'latex'))
    ->fields(array(
      'format' => 'tex_editor',
      'module' => 'drutexml',
      'name' => 'latex',
      'weight' => 0,
      'status' => 1,
      'settings' => serialize(array (
			       'latexml_url' => 'http://latexml.mathweb.org/convert',
   			       'latexml_preamble' => '%none for now',
				     )
			      )))
    ->execute();

  // select CodeMirror as the TeX Editor modality,
  // and set it up for editing "stex" content
  $vals = array(
      'default' => 1,
      'user_choose' => 0,
      'show_toggle' => 1,
      'theme' => 'advanced',
      'language' => 'en',
      'buttons' =>
      array(
          'default' =>
          array(
              'stex' => 1,
          ),
      ),
      'toolbar_loc' => 'top',
      'toolbar_align' => 'left',
      'path_loc' => 'bottom',
      'resizing' => 1,
      'verify_html' => 1,
      'preformatted' => 0,
      'convert_fonts_to_spans' => 1,
      'remove_linebreaks' => 1,
      'apply_source_formatting' => 0,
      'paste_auto_cleanup_on_paste' => 0,
      'block_formats' => 'p,address,pre,h2,h3,h4,h5,h6,div',
      'css_setting' => 'theme',
      'css_path' => '',
      'css_classes' => '',
  );

  $query = db_merge('wysiwyg')
           ->key(array('format'=> 'tex_editor'))
           ->fields(array('format'=>'tex_editor',
			  'editor'=>'codemirror2',
			  'settings' => serialize($vals)))
           ->execute();

  // Finally, select TeX Editor as the "Filter to be used" for on a LATEX FIELD
  // (and adjust the other settings of that field).

  $fl = db_query("SELECT * FROM  `field_config_instance` WHERE  `field_name` LIKE  'field_latex' LIMIT 0 , 30")
        ->fetchObject();

  $fl->data = serialize(array (
                               'default_value' => NULL,
                               'description' => 'A multi-part field for LaTeX documents (source and preamble).',
                               'display' =>
                               array (
                                      'default' =>
                                      array (
                                             'label' => 'hidden',
                                             'type' => 'latex_formatter',
                                             'weight' => '0',
                                             'settings' => array (
                                                                  ),
                                             'module' => 'latex_field',
                                             ),

                                      'teaser' =>
                                      array (
                                             'label' => 'hidden',
                                             'settings' => array (
                                                                  ),
                                             'type' => 'hidden',
                                             'weight' => '0',
                                             ),

                                      'full' =>
                                      array (
                                             'label' => 'hidden',
                                             'type' => 'latex_formatter',
                                             'weight' => '11',
                                             'settings' => array (
                                                                  ),
                                             'module' => 'latex_field',
                                             ),
                                      ),
                               'label' => 'LaTeX',
                               'required' => 0,
                               'settings' =>
                               array (
                                      'user_register_form' => false,
                                      ),
                               'widget' => array (
                                                  'weight' => 0,
                                                  'type' => 'latex_widget',
                                                  'module' => 'latex_field',
                                                  'active' => 1,
                                                  // This is the main thing that we're trying to set here!!
                                                  'settings' => array (
                                                                       'filter' => 'tex_editor',
                                                                       ),
                                                  ),
                               ));

  db_merge('field_config_instance')->key(array('id' => $fl->id))->fields((array)$fl)->execute();


  return NULL;
}

// The node types we have are:

          /* Article, Basic page, Forum topic, News,
             Correction, Group, Image, Poll, Problem, Request, Solution */

// However, everything in the SECOND line above can be created by the corresponding module.

// This function also has to adjust the fields for Articles to include...:

/* *Tags                          field_tags              Term reference  Autocomplete term widget (tagging)
   *Image                         field_image             Image           Image
   CanonicalName                  field_canonicalname     Text            Text field
   Revision Comment               field_revisioncomment   Text            Text field
   MSC                            field_msc               Text            Text field
   Type of Math Ojbect            field_mathtype          Text            Text field
   Defines                        field_defines           Text            Text field
   Keywords                       field_keywords          Text            Text field
   Parent                         field_parent            Text            Text field
   Related                        field_related           Text            Text field
   Time Created                   field_timecreated       Text            Text field
   Synonym                        field_synonym           Text            Text field
   URL path settings              path                    Path module form elements
   LaTeX                          field_latex             LaTeX field     LaTeX widget    */


function planetmath_profile_configure_node_types () {
  dd("Profile- In planetmath_profile_configure_node_types");
  set_time_limit(0);
  // Insert default pre-defined node types into the database. For a complete
  // list of available node type attributes, refer to the node type API
  // documentation at: http://api.drupal.org/api/HEAD/function/hook_node_info.

  // We treat articles slightly differently (they don't get a body field).
  $articleDefaults = node_type_set_defaults(array(
						  'type' => 'article',
						  'name' => st('Article'),
						  'base' => 'node_content',
						  'description' => st('Use <em>articles</em> for encyclopedia content.'),
						  'custom' => 1,
						  'modified' => 1,
						  'locked' => 0,
						  ));
  node_type_save($articleDefaults);


  $pageDefaults = node_type_set_defaults(array(
					       'type' => 'page',
					       'name' => st('Basic page'),
					       'base' => 'node_content',
					       'description' => st("Use <em>basic pages</em> for your static content, like the 'About us' page."),
					       'custom' => 1,
					       'modified' => 1,
					       'locked' => 0,
					       ));
  node_type_save($pageDefaults);
  node_add_body_field($pageDefaults);

  $newsDefaults = node_type_set_defaults(array(
					       'type' => 'news',
					       'name' => st('News'),
					       'base' => 'node_content',
					       'description' => st('Use <em>news</em> for updates on site, organization, or community activity.'),
					       'custom' => 1,
					       'modified' => 1,
					       'locked' => 0,
					       ));
  node_type_save($newsDefaults);
  node_add_body_field($newsDefaults);

 /* NOTE: This part would ideally be done in the module itself
    to make the module self-contained. */

  $imageDefaults = node_type_set_defaults(array(
						'type' => 'image',
						'name' => st('Image'),
						'base' => 'node_content',
						'description' => st('Use <em>images</em> in the gallery.'),
						'custom' => 1,
						'modified' => 1,
						'locked' => 0,
					       ));

  node_type_save($imageDefaults);

  $newfield=array(
                  'field_name' => 'gallery_image',
                  'type' => 'image'
                  );
  field_create_field($newfield);
  $newfield_instance=array(
                           'field_name' => 'gallery_image',
                           'entity_type' => 'node',
                           'bundle' => 'image',
                           'label' => t('Image'),
                           'description' => t('The image'),
			   'display' => array(
					      'default' => array(
								 'label' => 'above',
								 'module' => 'shadowbox',
								 'settings' => array(
										     'compact' => 0,
										     'gallery' => '',
										     'image_link' => '',
										     'image_style' => '',
										     'title' => '',
										     ),
								 'type' => 'shadowbox',
								 'weight' => '0',
								 ),
					      'teaser' => array(
								'label' => 'above',
								'settings' => array(),
								'type' => 'hidden',
								'weight' => 0,
								),
					      ),
                           'widget' => array(
                                             'type' => 'image_image'
                                             )
                           );
  field_create_instance($newfield_instance);

  // Note also: In the future we should find a way to maintain a list of multiple
  // places where images are used.  Probably this will be done with Virtuoso.
  // In which case, we may not need this field in the future.

  // OK, even though we don't have the Virtuoso part set up, I think
  // it is time to get rid of this field.

  /* $newfield=array( */
  /*                 'field_name' => 'obj_cname', */
  /*                 'type' => 'text' */
  /*                 ); */
  /* field_create_field($newfield); */
  /* $newfield_instance=array( */
  /*                          'field_name' => 'obj_cname', */
  /*                          'entity_type' => 'node', */
  /*                          'bundle' => 'image', */
  /*                          'label' => t('Object Canonical Name'), */
  /*                          'description' => t('First article where this image is used'), */
  /*                          'widget' => array( */
  /*                                            'type' => 'text_textfield' */
  /*                                            ) */
  /*                          ); */
  /* field_create_instance($newfield_instance); */

  return NULL;
}


// sets up a world writable group as Group #1
// it is created by and owned by user 1
// (Other modules will maintain the membership of this group.)
function planetmath_profile_configure_groups () {
  dd("Profile- In planetmath_profile_configure_groups");
  set_time_limit(0);

  // It is important to set this or authenticated users won't be able
  // to "create article content" (i.e. add articles to groups).
  // (Similarly with commenting on a group.)
  // Note that if we wanted to make it so that only group members could
  // post comments, that would be a different story.  There's a module for
  // that, though I don't know if it is currently working.
  og_role_grant_permissions(2, array("post comments",
				     "create article content",
                                     "update own article content",
                                     "update any article content",
                                     "delete own article content"));

  /*??*/
  /* $og_field = og_fields_info(OG_AUDIENCE_FIELD); */
  /* $og_field['field']['settings']['target_type'] = 'node'; */
  /* $og_field['instance']['settings']['behaviors']['prepopulate'] = array( */
  /*   'status' => TRUE, */
  /*   'action' => 'none', */
  /*   'fallback' => 'none', */
  /*   'skip_perm' => FALSE, */
  /* ); */
  /* og_create_field(OG_AUDIENCE_FIELD, 'node', 'article', $og_field); */

  /* $og_field = og_fields_info(OG_AUDIENCE_FIELD); */
  /* $og_field['field']['settings']['target_type'] = 'node'; */
  /* $og_field['instance']['settings']['behaviors']['prepopulate'] = array( */
  /*   'status' => TRUE, */
  /*   'action' => 'none', */
  /*   'fallback' => 'none', */
  /*   'skip_perm' => FALSE, */
  /* ); */
  /* og_create_field(OG_AUDIENCE_FIELD, 'user', 'user', $og_field); */
  /*??*/

  planetmath_og_group_add_programmatic("World Writable", 1, "World writable articles - everyone has permission to edit.");

  return NULL;
}

// note that the actual selection of blocks would presumably be
// different in a different installation of Planetary.
function planetmath_profile_configure_blocks () {
  dd("Profile- In planetmath_profile_configure_blocks");
  set_time_limit(0);
  // this is just copied from the standard installation for now...
  // in a moment, it should have the new PlanetMath blocks set up
  module_enable('planetmath_blocks');

  // Since this is set up to run AFTER the theme has been selected,
  // these variables should be set properly.
  $theme_default = variable_get('theme_default');
  $admin_theme = variable_get('admin_theme');

  $blocks = array(
		  // note that visibility => 0 is "all pages except those listed"
		  // note that visibility => 1 is "Only the listed pages"
		  // note that visibility => 2 is what you use for custom PHP logic
                  array(
                        'module' => 'user',
                        'delta' => 'login',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => -27,
                        'region' => 'header',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'system',
                        'delta' => 'main',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => 0,
                        'region' => 'content',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'search',
                        'delta' => 'form',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => -26,
                        'region' => 'sidebar_first',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'node',
                        'delta' => 'recent',
                        'theme' => $admin_theme,
                        'status' => 1,
                        'weight' => 10,
                        'region' => 'dashboard_main',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'system',
                        'delta' => 'navigation',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => 1,
                        'region' => 'sidebar_first',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'system',
                        'delta' => 'main-menu',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => 0,
                        'region' => 'sidebar_first',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'system',
                        'delta' => 'powered-by',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => 10,
                        'region' => 'footer',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'system',
                        'delta' => 'help',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => 0,
                        'region' => 'help',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
		  // turn some stuff off
                  array(
                        'module' => 'system',
                        'delta' => 'navigation',
                        'theme' => $admin_theme,
                        'status' => 0,
                        'weight' => 0,
                        'region' => 'sidebar_first',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
		  array(
                        'module' => 'user',
                        'delta' => 'online',
                        'theme' => $admin_theme,
                        'status' => 0,
                        'weight' => 0,
                        'region' => 'help',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
		  array(
                        'module' => 'system',
                        'delta' => 'management',
                        'theme' => $admin_theme,
                        'status' => 0,
                        'weight' => -5,
                        'region' => -1,
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'user',
                        'delta' => 'new',
                        'theme' => $theme_default,
                        'status' => 0,
                        'weight' => 0,
                        'region' => 'dashboard_sidebar',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'user',
                        'delta' => 'new',
                        'theme' => $theme_default,
                        'status' => 0,
                        'weight' => 0,
                        'region' => 'dashboard_sidebar',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'node',
                        'delta' => 'recent',
                        'theme' => $theme_default,
                        'status' => 0,
                        'weight' => 10,
                        'region' => 'dashboard_main',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'devel_node_access',
                        'delta' => 'dna_node',
                        'theme' => $theme_default,
                        'status' => 0,
                        'weight' => 0,
                        'region' => 'help',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'forum',
                        'delta' => 'active',
                        'theme' => $theme_default,
                        'status' => 0,
                        'weight' => 0,
                        'region' => 'help',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'forum',
                        'delta' => 'active',
                        'theme' => $admin_theme,
                        'status' => 0,
                        'weight' => 0,
                        'region' => 'help',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'forum',
                        'delta' => 'new',
                        'theme' => $theme_default,
                        'status' => 0,
                        'weight' => 0,
                        'region' => 'help',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'forum',
                        'delta' => 'new',
                        'theme' => $admin_theme,
                        'status' => 0,
                        'weight' => 0,
                        'region' => 'help',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
		  array(
                        'module' => 'comment',
                        'delta' => 'recent',
                        'theme' => $admin_theme,
                        'status' => 0,
                        'weight' => 0,
                        'region' => 'help',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
		  array(
                        'module' => 'comment',
                        'delta' => 'recent',
                        'theme' => $theme_default,
                        'status' => 0,
                        'weight' => 0,
                        'region' => 'help',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
		  array(
                        'module' => 'forum',
                        'delta' => 'new',
                        'theme' => $theme_default,
                        'status' => 0,
                        'weight' => 0,
                        'region' => 'help',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
		  // might be reasonable to show this on the "People" page, ... which
		  // I'm realizing didn't make it through the migration for some
		  // reason.
		  array(
                        'module' => 'user',
                        'delta' => 'online',
                        'theme' => $theme_default,
                        'status' => 0,
                        'weight' => 0,
                        'region' => 'help',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
		  array(
                        'module' => 'relation_entity_collector',
                        'delta' => 'block',
                        'theme' => $theme_default,
                        'status' => 0,
                        'weight' => 0,
                        'region' => 'help',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
		  array(
                        'module' => 'relation_entity_collector',
                        'delta' => 'block',
                        'theme' => $admin_theme,
                        'status' => 0,
                        'weight' => 0,
                        'region' => 'help',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
		  // it might be good to enable a second block below
		  // the main menu (for admin-level tasks) but let's skip
		  // that for now
                  array(
                        'module' => 'system',
                        'delta' => 'management',
                        'theme' => $theme_default,
                        'status' => 0,
                        'weight' => -5,
                        'region' => -1,
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'system',
                        'delta' => 'main',
                        'theme' => $admin_theme,
                        'status' => 1,
                        'weight' => 0,
                        'region' => 'content',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'system',
                        'delta' => 'help',
                        'theme' => $admin_theme,
                        'status' => 1,
                        'weight' => 0,
                        'region' => 'help',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'user',
                        'delta' => 'login',
                        'theme' => $admin_theme,
                        'status' => 1,
                        'weight' => 10,
                        'region' => 'header',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'user',
                        'delta' => 'new',
                        'theme' => $admin_theme,
                        'status' => 1,
                        'weight' => 0,
                        'region' => 'dashboard_sidebar',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'search',
                        'delta' => 'form',
                        'theme' => $admin_theme,
                        'status' => 0,
                        'weight' => -26,
                        'region' => 'header',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => -1,
                        ),
		  // Configure the custom blocks that are supposed to
		  // appear in the sidebar.  This could presumably be
		  // done from within the planetmath_blocks module itself
                  // but no harm prototyping here.
                  array('module' => 'planetmath_blocks',
                        'delta' => 'revision',
                        'theme' => variable_get('theme_default'),
                        'status' => 1,
                        'weight' => 0,
                        'region' => 'sidebar_second',
                        'visibility' => 1,
                        'pages' => '<front>',
                        'cache' => 1,
                        ),
                  array('module' => 'planetmath_blocks',
                        'delta' => 'everything-else',
                        'theme' => variable_get('theme_default'),
                        'status' => 1,
                        'weight' => 10,
                        'region' => 'sidebar_first',
                        'visibility' => 0,
                        'pages' => '',
                        'cache' => 1,
                        ),
                  array(
                        'module' => 'planetmath_blocks',
                        'delta' => 'news',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => -32,
                        'region' => 'sidebar_second',
                        'visibility' => 1,
                        'pages' => '<front>',
                        'cache' => 1,
                        ),
		  // Try to get a little welcome message showing up
                  array(
                        'module' => 'planetmath_blocks',
                        'delta' => 'welcome',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => -32,
                        'region' => 'header',
                        'custom' => 1,
                        'visibility' => 2,
                        'pages' => '<?php 
  global $user;
  if (drupal_is_front_page()) {
  return !((bool) $user->uid);
  } ; 
?>',
                        'cache' => 1,
                        ),
		  // this is giving an error claiming that
		  // `field_data_field_correction_article' doesn't exist
		  // commenting out for now
                  array(
                        'module' => 'planetmath_blocks',
                        'delta' => 'correction',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => -29,
                        'region' => 'sidebar_second',
                        'visibility' => 2,
                        'pages' => '<?php 
if(drupal_is_front_page()){
  return false;
}
if(arg(0) == "node"){
 return planetmath_blocks_countCorrectionsPerArticle(arg(1));
}
return false;
?>',
                        'cache' => 1,
                        ),
		  array('module'=> 'planetmath_blocks',
			'delta' => 'provenance',
			'theme' => $theme_default,
			'delta' => 'provenance',
			'status' => 1,
			'weight' => -36,
			'region' => 'sidebar_second',
			'visibility' => 2,
			'pages' => '<?php 
if(drupal_is_front_page()){
  return false;
}
if(arg(0) == "node"){
 $node=node_load(arg(1));
 if(   $node->type == "article" 
    || $node->type == "group"
    || $node->type == "problem"
    || $node->type == "solution"
    || $node->type == "question"
    || $node->type == "collection")
  return true;
else
 return false;
}
return false;
?>',
			'cache'=>1,
			),
		  // This causes version information to show up on forum posts,
		  // I'm not sure we want that, but we can think more about it
                  array(
                        'module' => 'planetmath_blocks',
                        'delta' => 'pversion',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => -28,
                        'region' => 'sidebar_second',
                        'visibility' => 2,
                        'pages' => '<?php 
if(drupal_is_front_page()){
  return false;
}
if(arg(0) == "node"){
 return planetmath_blocks_countVersionsPerArticle(arg(1));
}
return false;
?>',
                        'cache' => 1,
                        ),
                  array(
                        'module' => 'planetmath_blocks',
                        'delta' => 'problem',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => -30,
                        'region' => 'sidebar_second',
                        'visibility' => 2,
                        'pages' => '<?php 
if(drupal_is_front_page()){
  return false;
}
if(arg(0) == "node"){
 return planetmath_blocks_countProblems(arg(1));
}
return false;
?>',
                        'cache' => 1,
                        ),
                  array(
                        'module' => 'planetmath_blocks',
                        'delta' => 'reverseproblem',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => -30,
                        'region' => 'sidebar_second',
                        'visibility' => 2,
                        'pages' => '<?php 
if(drupal_is_front_page()){
  return false;
}
if(arg(0) == "node"){
 return planetmath_blocks_countReverseProblems(arg(1));
}
return false;
?>',
                        'cache' => 1,
                        ),
                  array(
                        'module' => 'planetmath_blocks',
                        'delta' => 'childarticles',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => -31,
                        'region' => 'sidebar_second',
                        'visibility' => 2,
                        'pages' => '<?php 
if(drupal_is_front_page()){
  return false;
}
if(arg(0) == "node"){
 return planetmath_blocks_countChildArticles(arg(1));
}
return false;
?>',
                        'cache' => 1,
                        ),
                  array(
                        'module' => 'planetmath_blocks',
                        'delta' => 'solution',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => -30,
                        'region' => 'sidebar_second',
                        'visibility' => 2,
                        'pages' => '<?php 
if(drupal_is_front_page()){
  return false;
}
if(arg(0) == "node"){
 return planetmath_blocks_countSolutions(arg(1));
}
return false;
?>',
                        'cache' => 1,
                        ),
                  array(
                        'module' => 'planetmath_blocks',
                        'delta' => 'review',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => -30,
                        'region' => 'sidebar_second',
                        'visibility' => 2,
                        'pages' => '<?php 
if(drupal_is_front_page()){
  return false;
}
if(arg(0) == "node"){
 return planetmath_blocks_countReviews(arg(1));
}
return false;
?>',
                        'cache' => 1,
                        ),
		  array(
                        'module' => 'planetmath_blocks',
                        'delta' => 'userlist',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => -33,
                        'region' => 'sidebar_second',
                        'visibility' => 1,
                        'pages' => '<front>',
                        'cache' => 1,
                        ),

                  );
  foreach ($blocks as $block) {
    //dd($block, "CONFIGURING... ");
    db_merge('block')
      ->key(array('module'=>$block['module'],
		  'theme'=>$block['theme'],
		  'delta' => $block['delta']))
      ->fields(array('module'=> $block['module'],
		     'theme' => $block['theme'],
		     'delta' => $block['delta'],
		     'status' => $block['status'],
		     'weight' => $block['weight'],
		     'region' => $block['region'],
		     'visibility' => $block['visibility'],
		     'pages' => $block['pages'],
		     'cache' => $block['cache']))
      ->execute();
  }

  return NULL;
}

function planetmath_profile_rdf_mappings () {
  dd("Profile- In planetmath_profile_rdf_mappings");
  set_time_limit(0);
  // Insert default pre-defined RDF mapping into the database.
  $rdf_mappings = array(
    array(
      'type' => 'node',
      'bundle' => 'page',
      'mapping' => array(
        'rdftype' => array('foaf:Document'),
      ),
    ),
    array(
      'type' => 'node',
      'bundle' => 'article',
      'mapping' => array(
        'field_image' => array(
          'predicates' => array('og:image', 'rdfs:seeAlso'),
          'type' => 'rel',
        ),
        'field_tags' => array(
          'predicates' => array('dc:subject'),
          'type' => 'rel',
        ),
      ),
    ),
  );
  foreach ($rdf_mappings as $rdf_mapping) {
    rdf_mapping_save($rdf_mapping);
  }
  return NULL;
}

// I do not actually understand all of these settings, but it's what I got
// when dumping the userpoints variables out of the database.

function planetmath_profile_set_userpoints_variables () {
  dd("Profile- In planetmath_profile_set_userpoints_variables");

  variable_set('userpoints_category_default_tid', '0');
  variable_set('userpoints_category_default_vid', '3');
  variable_set('userpoints_category_profile_display_tid', array('uncategorized'=>'uncategorized',
								'all'=>'all'));
  variable_set('userpoints_display_message', '1');
  variable_set('userpoints_expireafter_date', '');
  // this setting is a bit strange
  variable_set('userpoints_expireon_date', array('month'=>'1',
						 'day'=>'1',
						 'year'=>'1980'));
  variable_set('userpoints_expiry_description', '');
  variable_set('userpoints_nc_category', '0');
  variable_set('userpoints_nc_category_correction', '0');
  variable_set('userpoints_nc_category_forum', '0');
  variable_set('userpoints_nc_category_group', '0');
  variable_set('userpoints_nc_category_image', '0');
  variable_set('userpoints_nc_category_news', '0');
  variable_set('userpoints_nc_category_page', '0');
  variable_set('userpoints_nc_category_question', '0');
  variable_set('userpoints_nc_comment_category', '0');
  variable_set('userpoints_nc_comment_category_correction', '0');
  variable_set('userpoints_nc_comment_category_forum', '0');
  variable_set('userpoints_nc_comment_category_group', '0');
  variable_set('userpoints_nc_comment_category_image', '0');
  variable_set('userpoints_nc_comment_category_news', '0');
  variable_set('userpoints_nc_comment_category_page', '0');
  variable_set('userpoints_nc_comment_category_question', '0');
  variable_set('userpoints_nc_comment_delete_deduct', 1);
  variable_set('userpoints_nc_comment_delete_deduct_correction', 1);
  variable_set('userpoints_nc_comment_delete_deduct_forum', 1);
  variable_set('userpoints_nc_comment_delete_deduct_group', 1);
  variable_set('userpoints_nc_comment_delete_deduct_image', 1);
  variable_set('userpoints_nc_comment_delete_deduct_news', 1);
  variable_set('userpoints_nc_comment_delete_deduct_page', 1);
  variable_set('userpoints_nc_comment_delete_deduct_question', 1);
  variable_set('userpoints_nc_comment_enabled', 1);
  variable_set('userpoints_nc_comment_enabled_correction', 1);
  variable_set('userpoints_nc_comment_enabled_forum', 1);
  variable_set('userpoints_nc_comment_enabled_group', 1);
  variable_set('userpoints_nc_comment_enabled_image', 1);
  variable_set('userpoints_nc_comment_enabled_news', 1);
  variable_set('userpoints_nc_comment_enabled_page', 1);
  variable_set('userpoints_nc_comment_enabled_question', 1);
  variable_set('userpoints_nc_comment_ownership_deduct', 0);
  variable_set('userpoints_nc_comment_ownership_deduct_correction', 0);
  variable_set('userpoints_nc_comment_ownership_deduct_forum', 0);
  variable_set('userpoints_nc_comment_ownership_deduct_group', 0);
  variable_set('userpoints_nc_comment_ownership_deduct_image', 0);
  variable_set('userpoints_nc_comment_ownership_deduct_news', 0);
  variable_set('userpoints_nc_comment_ownership_deduct_page', 0);
  variable_set('userpoints_nc_comment_ownership_deduct_question', 0);
  variable_set('userpoints_nc_comment_points', '1');
  variable_set('userpoints_nc_comment_points_correction', '1');
  variable_set('userpoints_nc_comment_points_forum', '1');
  variable_set('userpoints_nc_comment_points_group', '1');
  variable_set('userpoints_nc_comment_points_image', '1');
  variable_set('userpoints_nc_comment_points_news', '1');
  variable_set('userpoints_nc_comment_points_page', '1');
  variable_set('userpoints_nc_comment_points_question', '1');
  variable_set('userpoints_nc_comment_published_only', 1);
  variable_set('userpoints_nc_delete_deduct', 0);
  variable_set('userpoints_nc_delete_deduct_correction', 0);
  variable_set('userpoints_nc_delete_deduct_forum', 0);
  variable_set('userpoints_nc_delete_deduct_group', 0);
  variable_set('userpoints_nc_delete_deduct_image', 0);
  variable_set('userpoints_nc_delete_deduct_news', 0);
  variable_set('userpoints_nc_delete_deduct_page', 0);
  variable_set('userpoints_nc_delete_deduct_question', 0);
  variable_set('userpoints_nc_enabled', 1);
  variable_set('userpoints_nc_enabled_correction', 1);
  variable_set('userpoints_nc_enabled_forum', 1);
  variable_set('userpoints_nc_enabled_group', 1);
  variable_set('userpoints_nc_enabled_image', 1);
  variable_set('userpoints_nc_enabled_news', 1);
  variable_set('userpoints_nc_enabled_page', 1);
  variable_set('userpoints_nc_enabled_question', 1);
  variable_set('userpoints_nc_ownership_deduct', 1);
  variable_set('userpoints_nc_ownership_deduct_correction', 1);
  variable_set('userpoints_nc_ownership_deduct_forum', 1);
  variable_set('userpoints_nc_ownership_deduct_group', 1);
  variable_set('userpoints_nc_ownership_deduct_image', 1);
  variable_set('userpoints_nc_ownership_deduct_news', 1);
  variable_set('userpoints_nc_ownership_deduct_page', 1);
  variable_set('userpoints_nc_ownership_deduct_question', 1);
  variable_set('userpoints_nc_points', '100');
  variable_set('userpoints_nc_points_image', '10');
  variable_set('userpoints_nc_points_problem', '10');
  variable_set('userpoints_nc_points_solution', '10');
  variable_set('userpoints_nc_points_review', '10');
  variable_set('userpoints_nc_points_collection', '5');
  variable_set('userpoints_nc_points_correction', '5');
  variable_set('userpoints_nc_points_forum', '1');
  variable_set('userpoints_nc_points_news', '1');
  variable_set('userpoints_nc_points_page', '1');
  variable_set('userpoints_nc_points_group', '1');
  variable_set('userpoints_nc_points_question', '2');
  variable_set('userpoints_nc_published_only', 1);
  variable_set('userpoints_nc_revision_category', '0');
  variable_set('userpoints_nc_revision_category_correction', '0');
  variable_set('userpoints_nc_revision_category_forum', '0');
  variable_set('userpoints_nc_revision_category_group', '0');
  variable_set('userpoints_nc_revision_category_image', '0');
  variable_set('userpoints_nc_revision_category_news', '0');
  variable_set('userpoints_nc_revision_category_page', '0');
  variable_set('userpoints_nc_revision_category_question', '0');
  variable_set('userpoints_nc_revision_enabled', 1);
  variable_set('userpoints_nc_revision_enabled_correction', 1);
  variable_set('userpoints_nc_revision_enabled_forum', 1);
  variable_set('userpoints_nc_revision_enabled_group', 1);
  variable_set('userpoints_nc_revision_enabled_image', 1);
  variable_set('userpoints_nc_revision_enabled_news', 1);
  variable_set('userpoints_nc_revision_enabled_page', 1);
  variable_set('userpoints_nc_revision_enabled_question', 1);
  variable_set('userpoints_nc_revision_own_nodes', 0);
  variable_set('userpoints_nc_revision_own_nodes_correction', 0);
  variable_set('userpoints_nc_revision_own_nodes_forum', 0);
  variable_set('userpoints_nc_revision_own_nodes_group', 0);
  variable_set('userpoints_nc_revision_own_nodes_image', 0);
  variable_set('userpoints_nc_revision_own_nodes_news', 0);
  variable_set('userpoints_nc_revision_own_nodes_page', 0);
  variable_set('userpoints_nc_revision_own_nodes_question', 0);
  variable_set('userpoints_nc_revision_points', '5');
  variable_set('userpoints_nc_revision_points_correction', '5');
  variable_set('userpoints_nc_revision_points_forum', '5');
  variable_set('userpoints_nc_revision_points_group', '5');
  variable_set('userpoints_nc_revision_points_image', '5');
  variable_set('userpoints_nc_revision_points_news', '5');
  variable_set('userpoints_nc_revision_points_page', '5');
  variable_set('userpoints_nc_revision_points_question', '5');
  variable_set('userpoints_points_moderation', '0');
  variable_set('userpoints_report_displayzero', '1');
  variable_set('userpoints_report_limit', '10');
  variable_set('userpoints_report_usercount', '30');
  variable_set('userpoints_transaction_timestamp', 1);
  variable_set('userpoints_trans_lcpoint', 'point');
  variable_set('userpoints_trans_lcpoints', 'score');
  variable_set('userpoints_trans_ucpoint', 'Point');
  variable_set('userpoints_trans_ucpoints', 'Score');
  variable_set('userpoints_trans_uncat', 'General');
  variable_set('userpoints_truncate', '30";');

  variable_set('additional_settings__active_tab_correction', 'edit-userpoints-nc-revision');
  variable_set('additional_settings__active_tab_forum', 'edit-userpoints-nc-revision');
  variable_set('additional_settings__active_tab_group', 'edit-userpoints-nc-revision');
  variable_set('additional_settings__active_tab_image', 'edit-userpoints-nc-revision');
  variable_set('additional_settings__active_tab_page', 'edit-userpoints-nc-revision');
  variable_set('additional_settings__active_tab_question', 'edit-userpoints-nc-revision');
  variable_set('settings_additional__active_tab', 'edit-userpoints-nc-comment');
}

function planetmath_profile_configure_captcha (){
  db_merge('captcha_points')
    ->key(array('form_id'=> 'user_register_form'))
    ->fields(array(
      'module' => 'riddler',
      'captcha_type' => 'Riddler'))
    ->execute();

  db_merge('riddler_questions')
    ->key(array('qid'=> '1'))
    ->fields(array(
      'question' => 'What is twice the base of the natural logarithm? (Hint: Rhymes with "chewy".)',
      'answer' => '2e'))
    ->execute();
}

function planetmath_profile_set_misc_variables () {
  dd("Profile- In planetmath_profile_set_misc_variables");
  set_time_limit(0);

  // This will prevent errors when indexing articles if the comment doesn't exist or
  // if the user has been imported wrong.  The fact that I even have to add this 
  // suggests that I had better check the user importing to make sure everyone comes
  // along for the ride...
  variable_set('apachesolr_exclude_nodeapi_types',array('article'=>array('comment'=>TRUE)));

  // set watchable content types
  variable_set('watcher_content_types', serialize(array(
							"article"=> "article",
							"page"=> 0,
							"collection"=> 0,
							"correction"=> "correction",
							"forum"=> 0,
							"group"=> 0,
							"image"=> 0,
							"news"=> 0,
							"poll"=> 0,
							"problem"=> "problem",
							"question"=> "question",
							"review"=> 0,
							"solution"=> 0,
							)));

  variable_set('watcher_default_settings',
	       serialize(array(
			       'watcher_automatic_enable_notifications' => 1,
			       'watcher_notifications_updates' => 1,
			       'watcher_notifications_new_comments' => 1,
			       'watcher_autowatch_commented_on' => 0,
			       'watcher_autowatch_posted' => 1,
			       'watcher_share_binder' => 0,
			       )));
  // Default "Basic page" to not be promoted and have comments disabled.
  variable_set('node_options_page', array('status'));
  variable_set('comment_page', COMMENT_NODE_HIDDEN);

  variable_set('dhtml_menu_settings', array (
                                             'nav' => "open",
                                             'animation' => array (
								   // slide in horizontally, not vertically	
                                                                   'effects' => array (
                                                                                       'height' => 0,
                                                                                       'opacity' => "opacity",
                                                                                       'width' => "width"
                                                                                       ),
                                                                   'speed' => "500"
                                                                   ),
                                             'effects' => array (
                                                                 'siblings' => "close-same-tree",
                                                                 'children' => "none",
                                                                 'remember' => ""
                                                                 ),
                                             'filter' => array (
                                                                'type' => "blacklist",
                                                                'list' => array(
                                                                         'devel' => 1,
                                                                         'main-menu' => 1,
                                                                         'management' => 1,
                                                                         'navigation' => 0,
                                                                         'shortcut-set-1' => 1,
                                                                         'user-menu' => 1
                                                                    ))
                                             ));


  // this seems to be a way to make it so that articles are always versioned.
  variable_set('node_options_article', array (
					      0 => 'status',
					      1 => 'revision',
					      ));

  // And similarly for other vaguely "article like" node types...

  variable_set('node_options_correction', array (
						 0 => 'status',
						 1 => 'revision',
						 ));
  variable_set('node_options_problem', array (
					      0 => 'status',
					      1 => 'revision',
					      ));
  variable_set('node_options_solution', array (
					       0 => 'status',
					       1 => 'revision',
					       ));
  variable_set('node_options_review', array (
					     0 => 'status',
					     1 => 'revision',
					     ));

  // Don't display date and author information for "Basic page" nodes by default.
  variable_set('node_submitted_page', FALSE);

  // Enable user picture support and set the default to a square thumbnail option.
  variable_set('user_pictures', '1');
  variable_set('user_picture_dimensions', '1024x1024');
  variable_set('user_picture_file_size', '800');
  variable_set('user_picture_style', 'thumbnail');

  // Allow visitor account creation with administrative approval.
  variable_set('user_register', USER_REGISTER_VISITORS_ADMINISTRATIVE_APPROVAL);


  // some settings for pathauto - note that in some sense this "should"
  // imply that all content types have a canonical name field.
  // In fact, what seems to happen, is that the replacement is made whenever
  // there actually is a canonical name field.  Which for the moment is just
  // with articles (IIRC).
  variable_set('pathauto_node_pattern', "[node:field_canonicalname]");
  variable_set('pathauto_user_pattern', "users/[user:name]");
  variable_set('pathauto_taxonomy_term_pattern', "[term:vocabulary]/[term:name]");
  variable_set('pathauto_forum_pattern', "[term:vocabulary]/[term:name]");

  return NULL;
}

// This isn't hooked into the routine above since I don't know that we're using tags
function planetmath_profile_set_up_tags () {
  dd("Profile- In planetmath_profile_set_up_tags");
  set_time_limit(0);
  // Create a default vocabulary named "Tags", enabled for the 'article' content type.
  $description = st('Use tags to group articles on similar topics into categories.');
  $help = st('Enter a comma-separated list of words to describe your content.');
  $vocabulary = (object) array(
                               'name' => st('Tags'),
                               'description' => $description,
                               'machine_name' => 'tags',
                               'help' => $help,
                               );
  taxonomy_vocabulary_save($vocabulary);
  $field = array(
                 'field_name' => 'field_' . $vocabulary->machine_name,
                 'type' => 'taxonomy_term_reference',
                 // Set cardinality to unlimited for tagging.
                 'cardinality' => FIELD_CARDINALITY_UNLIMITED,
                 'settings' => array(
                                     'allowed_values' => array(
                                                               array(
                                                                     'vocabulary' => $vocabulary->machine_name,
                                                                     'parent' => 0,
                                                                     ),
                                                               ),
                                     ),
                 );
  field_create_field($field);
  $instance = array(
                    'field_name' => 'field_' . $vocabulary->machine_name,
                    'entity_type' => 'node',
                    'label' => 'Tags',
                    'bundle' => 'article',
                    'description' => $vocabulary->help,
                    'widget' => array(
                                      'type' => 'taxonomy_autocomplete',
                                      'weight' => -4,
                                      ),
                    'display' => array(
                                       'default' => array(
                                                          'type' => 'taxonomy_term_reference_link',
                                                          'weight' => 10,
                                                          ),
                                       'teaser' => array(
                                                         'type' => 'taxonomy_term_reference_link',
                                                         'weight' => 10,
                                                         ),
                                       ),
                    );
  field_create_instance($instance);
  return NULL;
}

// we probably want to do something similar for quite a few other fields?

// NOTE: actually, this seems to be handled properly by features, so it is taken out of the routine above.
function planetmath_profile_setup_image_field () {
  dd("Profile- In planetmath_profile_setup_image_field");
  set_time_limit(0);
  // Create an image field named "Image", enabled for the 'article' content type.
  // Many of the following values will be defaulted, they're included here as an illustrative examples.
  // See http://api.drupal.org/api/function/field_create_field/7

  $field = array(
                 'field_name' => 'field_image',
                 'type' => 'image',
                 'cardinality' => 1,
                 'locked' => FALSE,
                 'indexes' => array('fid' => array('fid')),
                 'settings' => array(
                                     'uri_scheme' => 'public',
                                     'default_image' => FALSE,
                                     ),
                 'storage' => array(
                                    'type' => 'field_sql_storage',
                                    'settings' => array(),
                                    ),
                 );
  field_create_field($field);

  // Many of the following values will be defaulted, they're included here as an illustrative examples.
  // See http://api.drupal.org/api/function/field_create_instance/7
  $instance = array(
                    'field_name' => 'field_image',
                    'entity_type' => 'node',
                    'label' => 'Image',
                    'bundle' => 'article',
                    'description' => st('Upload an image to go with this article.'),
                    'required' => FALSE,
                    'settings' => array(
                                        'file_directory' => 'field/image',
                                        'file_extensions' => 'png gif jpg jpeg',
                                        'max_filesize' => '',
                                        'max_resolution' => '',
                                        'min_resolution' => '',
                                        'alt_field' => TRUE,
                                        'title_field' => '',
                                        ),
                    'widget' => array(
                                      'type' => 'image_image',
                                      'settings' => array(
                                                          'progress_indicator' => 'throbber',
                                                          'preview_image_style' => 'thumbnail',
                                                          ),
                                      'weight' => -1,
                                      ),
                    'display' => array(
                                       'default' => array(
                                                          'label' => 'hidden',
                                                          'type' => 'image',
                                                          'settings' => array(
                                                                              'image_style' => 'large',
                                                                              'image_link' => '',
                                                                              ),
                                                          'weight' => -1,
                                                          ),
                                       'teaser' => array(
                                                         'label' => 'hidden',
                                                         'type' => 'image',
                                                         'settings' => array(
                                                                             'image_style' => 'medium',
                                                                             'image_link' => 'content',
                                                                             ),
                                                         'weight' => -1,
                                                         ),
                                       ),
                    );
  field_create_instance($instance);
  return NULL;
}

function planetmath_profile_setup_user_entities () {
  dd("Profile- In planetmath_profile_setup_user_entities");
  set_time_limit(0);


    planetmath_profile_docreate_user_field('user_forename', 'Forename');
    planetmath_profile_docreate_user_field('user_surname', 'Surname');
    planetmath_profile_docreate_user_field('user_city', 'City');
    planetmath_profile_docreate_user_field('user_state', 'State');
    planetmath_profile_docreate_user_field('user_country', 'Country');
    planetmath_profile_docreate_user_field('user_homepage', 'Homepage');
    planetmath_profile_docreate_user_field_long('user_preamble', 'Preamble', 'If you want to use a custom LaTeX preamble, enter it here, otherwise the site default will be used.');
    planetmath_profile_docreate_user_field_long_html('user_bio', 'Bio', 'Tell us who you are!');
    planetmath_profile_docreate_user_buddy_list_field();

    // Let's not port the score for now, they are being re-calculated; if we really
    // need to get the old score properly, it can be fixed up after the install 
    // profile finishes

    return NULL;
}
// My plan here is to cleverly load the feature we created HERE
// (since loading it inside of the profile directory b0rked things)
// ... OK this works.
function planetmath_profile_setup_permissions () {
  dd("Profile- In planetmath_profile_setup_permissions");
  set_time_limit(0);

 // Create a default role for site administrators, with all available permissions assigned.
  $admin_role = new stdClass();
  $admin_role->name = 'administrator';
  $admin_role->weight = 2;
  user_role_save($admin_role);

  user_role_grant_permissions($admin_role->rid,
			      array_keys(module_invoke_all('permission')));
  // Set this as the administrator role.
  variable_set('user_admin_role', $admin_role->rid);

  // Assign user 1 the "administrator" role.
  db_insert('users_roles')
    ->fields(array('uid' => 1, 'rid' => $admin_role->rid))
    ->execute();

  // For whatever reason, it seems that we need to set this explicitly (maybe?)
  variable_set('nodeaccess-types', array('group'=>TRUE,
					 'poll'=>TRUE,
					 'problem'=>TRUE,
					 'forum'=>TRUE,
					 'article'=>TRUE,
					 'correction'=>TRUE,
					 'image'=>TRUE,
					 'news'=>TRUE,
					 'page'=>TRUE,
					 'review'=>TRUE,
					 'solution'=>TRUE));

  //$install_directory = '/home/planetary/drupal_planetary/';
  //chdir($install_directory);

  // planetmath_user_default_permissions();
  dd("ENABLING PERMISSIONS");
  //dd(shell_exec('drush -y en planetmath_permissions'));

  // Ah, OK this is the way to do it! ('cause this way works)
  user_role_grant_permissions(DRUPAL_ANONYMOUS_RID, array('access comments','access content','access news feeds','access user profiles','search content','use advanced search'));

  // Run  SELECT * FROM role_permission;  in mysql to see the
  // list of available permissions

  user_role_grant_permissions(DRUPAL_AUTHENTICATED_RID, array('access comments','access content','access news feeds','access user profiles','search content','use advanced search','cancel account','use text format tex_editor', 'use text format filtered_html', 'create article content', 'create correction content', 'create forum content', 'create group content', 'create image content', 'create problem content', 'create review content', 'create solution content', 'create question content', 'create collection content', 'edit own article content', 'edit own correction content', 'edit own forum content', 'edit own group content', 'edit own image content', 'edit own problem content', 'edit own review content', 'edit own solution content', 'edit own question content', 'edit own collection content', 'delete own article content', 'delete own correction content', 'delete own group content', 'delete own image content', 'delete own problem content', 'delete own review content', 'delete own solution content', 'delete own question content', 'delete own correction content', 'read privatemsg', 'write privatemsg', 'post comments', 'skip comment approval', 'edit own comments', 'view own userpoints', 'view userpoints', 'use watcher', 'change own user settings', 'access help page'));

  return NULL;
}

function planetmath_profile_setup_menus () {
  dd("Profile- In planetmath_profile_setup_menus");
  set_time_limit(0);

  module_load_include('inc', 'menu', 'menu.admin');

  menu_link_delete(NULL,'drutexml');
  // Update the menu router information.
  menu_rebuild();
  return NULL;
}

function planetmath_profile_setup_theme () {
  dd("Profile- In planetmath_profile_setup_theme");
  set_time_limit(0);

  $enable = array(
                  'theme_default' => 'planetmath',
                  'admin_theme' => 'seven',
                  );

  theme_enable($enable);

  // important not to get these screwed around backwards
  variable_set('theme_default', 'planetmath');
  variable_set('admin_theme', 'seven');

  // Disable the default Bartik theme
  theme_disable(array('bartik'));

  // adjust the theme settings to use our logo etc.
  variable_set('site_slogan', 'Math for the people, by the people.');
  variable_set('theme_settings', array (
					'toggle_logo' => 1,
					'toggle_name' => 1,
					'toggle_slogan' => 1,
					'toggle_node_user_picture' => 1,
					'toggle_comment_user_picture' => 1,
					'toggle_comment_user_verification' => 1,
					'toggle_favicon' => 1,
					'toggle_main_menu' => 1,
					'toggle_secondary_menu' => 1,
					'default_logo' => 0,
					'logo_path' => 'public://alpha.png',
					'logo_upload' => '',
					'default_favicon' => 0,
					'favicon_path' => 'public://planetary.ico',
					'favicon_upload' => '',
					'favicon_mimetype' => 'image/png',
					));

  return NULL;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Utility functions for the above
////////////////////////////////////////////////////////////////////////////////////////////////////

function planetmath_profile_docreate_field ($machine_name, $bundle, $description) {
  dd("Profile- In planetmath_profile_docreate_field");
  set_time_limit(0);

  $newfield=array(
                  'field_name' => $machine_name,
                  'type' => 'text'
                  );
  field_create_field($newfield);
  $newfield_instance=array(
                           'field_name' => $machine_name,
                           'entity_type' => 'node',
                           'bundle' => $bundle,
                           'label' => t($label),
                           'description' => t($description),
                           'widget' => array(
                                             'type' => 'text_textfield'
                                             )
                           );
  field_create_instance($newfield_instance);
}

function planetmath_profile_docreate_user_field ($myField_name, $label){

    if(!field_info_field($myField_name)) // check if the field already exists.
    {
        $field = array(
            'field_name'    => $myField_name,
            'type'          => 'text',
        );
        field_create_field($field);

        $field_instance = array(
            'field_name'    => $myField_name,
            'entity_type'   => 'user',
            'bundle'        => 'user',
            'label'         => t($label),
            'description'   => "",
            'widget'        => array(
                'type'      => 'text_textfield',
                'weight'    => 10,
            ),
            'formatter'     => array(
                'label'     => t($label),
                'format'    => 'text_default'
            ),
            'settings'      => array(
            )
        );
        field_create_instance($field_instance);
    }
}

function planetmath_profile_docreate_user_field_long ($myField_name, $label, $desc)
{
        $field = array(
            'field_name'    => $myField_name,
            'type'          => 'text_long',
        );
        field_create_field($field);

        $field_instance = array(
            'field_name'    => $myField_name,
            'entity_type'   => 'user',
            'bundle'        => 'user',
            'label'         => t($label),
            'description'   => t($desc),
            'widget'        => array(
                'type'      => 'text_textarea',
                'weight'    => 10,
            ),
            'formatter'     => array(
                'label'     => t($label),
                'format'    => 'text_default'
            ),
            'settings'      => array(
            )
        );
        field_create_instance($field_instance);
}

function planetmath_profile_docreate_user_field_long_html ($myField_name, $label, $desc)
{
        $field = array(
            'field_name'    => $myField_name,
            'type'          => 'text_long',
        );
        field_create_field($field);

        $field_instance = array(
            'field_name'    => $myField_name,
            'entity_type'   => 'user',
            'bundle'        => 'user',
            'label'         => t($label),
            'description'   => t($desc),
            'widget'        => array(
                'type'      => 'text_textarea',
                'weight'    => 10,
            ),
            'formatter'     => array(
                'label'     => t($label),
                'format'    => 'filtered_html'
            ),
            'settings'      => array(
            )
        );
        field_create_instance($field_instance);
}

function planetmath_profile_docreate_user_buddy_list_field ()
{
        $field = array(
            'field_name'    => "buddy_list",
            'type'          => 'node_reference',
        );
        field_create_field($field);

        $field_instance = array(
            'field_name'    => "buddy_list",
            'entity_type'   => 'user',
            'bundle'        => 'user',
            'label'         => t("Buddy List"),
            'cardinality'   => 1,
            'description'   => t("People in the buddy list have permission to edit all of your articles!  You can use this, for example, to make everything you submit to the site world writable."),
            'widget'        => array(
                'type'      => 'node_reference_autocomplete',
                'weight'    => 10,
            ),
            'settings'      => array(
				     ),
        );
        field_create_instance($field_instance);
}

