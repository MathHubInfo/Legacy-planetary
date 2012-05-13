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
  $tasks = array('my_1st_task' => array(
                                        'display_name' => st('Your first task is to patch the core.'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_patch_core',
                                        ),
                 'my_2nd_task' => array(
                                        'display_name' => st('Your second task is to create 17 forums.'),
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
                 /* 'my_11th_task' => array( */
                 /*                        'display_name' => st('Add and configure an "image" field'), */
                 /*                        'display' => TRUE, */
                 /*                        'type' => 'normal', */
                 /*                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED, */
                 /*                        'function' => 'planetmath_profile_setup_image_field', */
                 /*                        ), */
                 'my_10th_task' => array(
                                        'display_name' => st('Set up tagging facilities'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_set_up_tags',
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

                 'my_12th_task' => array(
                                        'display_name' => st('Configure permissions'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_setup_permissions',
                                        ),
                 /* 'my_13th_task' => array( */
                 /*                        'display_name' => st('Configure Menus'), */
                 /*                        'display' => TRUE, */
                 /*                        'type' => 'normal', */
                 /*                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED, */
                 /*                        'function' => 'planetmath_profile_setup_menus', */
                 /*                        ), */
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
                 /* 'my_3rd_task' => array( */
                 /*                        'display_name' => st('Run the migrations to import legacy data.'), */
                 /*                        'display' => TRUE, */
                 /*                        'type' => 'normal', */
                 /*                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED, */
                 /*                        'function' => 'planetmath_profile_migration_runner', */
                 /*                        ), */
                 );
  return $tasks;
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
  dd("creating Forum 0");

  $edit = array(
		'name' => t('Planetary Bugs'),
		'description' => 'A place to report and discuss issues with the new software.',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 0,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 1");
  $edit = array(
		'name' => t('High School/Secondary'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight'=> 1
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 2");
  $edit = array(
		'name' => t('University/Tertiary'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 3");
  $edit = array(
		'name' => t('Industry/Practice'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 3,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 4");
  $edit = array(
		'name' => t('Graduate/Advanced'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 4,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 5");
  $edit = array(
		'name' => t('Research Topics'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 5,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 6");
  $edit = array(
		'name' => t('The Math Pub'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 6,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 7");
  $edit = array(
		'name' => t('Math Competitions'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 7,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 8");
  $edit = array(
		'name' => t('Math History'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 8,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 9");
  $edit = array(
		'name' => t('Math Humor'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 9,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 10");
  $edit = array(
		'name' => t('LaTeX help'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 10,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 11");
  $edit = array(
		'name' => t('PlanetMath help'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 11,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 12");
  $edit = array(
		'name' => t('PlanetMath Comments'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 12,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 13");
  $edit = array(
		'name' => t('PlanetMath.ORG'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 13,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 14");
  $edit = array(
		'name' => t('PlanetMath System Updates and News'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 14,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 15");
  $edit = array(
		'name' => t('Strategic Communications Development'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 15,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("creating Forum 16");
  $edit = array(
		'name' => t('Testing messages (ignore)'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 1,
		'weight' => 16,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  dd("Returning NULL");
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

function planetmath_profile_drutexml_configuration() {
  dd("Profile- In planetmath_profile_drutexml_configuration");
  set_time_limit(0);
  module_enable('drutexml');

  // create a LaTeX-filter-enabled content type; name it "TeX Editor"
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

  // select CodeMirror as the TeX Editor modality, and set it up for editing "stex" content
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
           ->fields(array('format'=>'tex_editor', 'editor'=>'codemirror2', 'settings' => serialize($vals)))
           ->execute();

  // select TeX Editor as the "Filter to be used" for the latex field (and adjust the other settings of that field).

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
  $types = array(
    array(
      'type' => 'page',
      'name' => st('Basic page'),
      'base' => 'node_content',
      'description' => st("Use <em>basic pages</em> for your static content, like the 'About us' page."),
      'custom' => 1,
      'modified' => 1,
      'locked' => 0,
    ),
    array(
      'type' => 'article',
      'name' => st('Article'),
      'base' => 'node_content',
      'description' => st('Use <em>articles</em> for encyclopedia content.'),
      'custom' => 1,
      'modified' => 1,
      'locked' => 0,
    ),
    array(
      'type' => 'news',
      'name' => st('News'),
      'base' => 'node_content',
      'description' => st('Use <em>news</em> for updates on site, organization, or community activity.'),
      'custom' => 1,
      'modified' => 1,
      'locked' => 0,
    ),
  );

  foreach ($types as $type) {
    $type = node_type_set_defaults($type);
    node_type_save($type);
    // Note: this is NOT what I want for articles, where in fact I actually want to remove the body field!
    node_add_body_field($type);
  }

  // DON'T NEED TO ADD ANY ADDITIONAL FIELDS HERE, IF IT IS DONE IN A FEATURE...

  //  planetmath_profile_docreate_field('field_canonicalname'   , 'article' ,'CanonicalName');
  // planetmath_profile_docreate_field('field_revisioncomment' , 'article' ,'Revision Comment');
  // planetmath_profile_docreate_field('field_msc'             , 'article' ,'MSC');
  // planetmath_profile_docreate_field('field_mathtype'        , 'article' ,'Type of Math Ojbect');
  // planetmath_profile_docreate_field('field_defines'         , 'article' ,'Defines');
  // planetmath_profile_docreate_field('field_keywords'        , 'article' ,'Keywords');
  // planetmath_profile_docreate_field('field_parent'          , 'article' ,'Parent');
  // planetmath_profile_docreate_field('field_related'         , 'article' ,'Related');
  // planetmath_profile_docreate_field('field_timecreated'     , 'article' ,'Time Created');
  // planetmath_profile_docreate_field('field_synonym'         , 'article' ,'Synonym');
  return NULL;
}



function planetmath_profile_configure_groups () {
  dd("Profile- In planetmath_profile_configure_groups");
  set_time_limit(0);
  // Potentially not needed - groups are being imported in the migration step,
  // and configuration MAY be automatic and/or provided by a feature (QUITE UNLIKELY).
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
                        'region' => 'header',
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
                        'module' => 'user',
                        'delta' => 'login',
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
                        'delta' => 'navigation',
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
                        'region' => 'content',
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
		  // this is giving an error claiming that
		  // `field_data_field_correction_article' doesn't exist
		  // commenting out for now
/*                   array( */
/*                         'module' => 'planetmath_blocks', */
/*                         'delta' => 'correction', */
/*                         'theme' => $theme_default, */
/*                         'status' => 1, */
/*                         'weight' => -30, */
/*                         'region' => 'sidebar_second', */
/*                         'pages' => '<?php if(arg(0) == "node"){ */
/*  return planetmath_blocks_countCorrectionsPerArticle(arg(1)); */
/* } */
/* return false; */
/* ?>', */
/*                         'cache' => 1, */
/*                         ), */
                  array(
                        'module' => 'planetmath_blocks',
                        'delta' => 'pversion',
                        'theme' => $theme_default,
                        'status' => 1,
                        'weight' => -34,
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
  variable_set('userpoints_nc_category_request', '0');
  variable_set('userpoints_nc_comment_category', '0');
  variable_set('userpoints_nc_comment_category_correction', '0');
  variable_set('userpoints_nc_comment_category_forum', '0');
  variable_set('userpoints_nc_comment_category_group', '0');
  variable_set('userpoints_nc_comment_category_image', '0');
  variable_set('userpoints_nc_comment_category_news', '0');
  variable_set('userpoints_nc_comment_category_page', '0');
  variable_set('userpoints_nc_comment_category_request', '0');
  variable_set('userpoints_nc_comment_delete_deduct', 1);
  variable_set('userpoints_nc_comment_delete_deduct_correction', 1);
  variable_set('userpoints_nc_comment_delete_deduct_forum', 1);
  variable_set('userpoints_nc_comment_delete_deduct_group', 1);
  variable_set('userpoints_nc_comment_delete_deduct_image', 1);
  variable_set('userpoints_nc_comment_delete_deduct_news', 1);
  variable_set('userpoints_nc_comment_delete_deduct_page', 1);
  variable_set('userpoints_nc_comment_delete_deduct_request', 1);
  variable_set('userpoints_nc_comment_enabled', 1);
  variable_set('userpoints_nc_comment_enabled_correction', 1);
  variable_set('userpoints_nc_comment_enabled_forum', 1);
  variable_set('userpoints_nc_comment_enabled_group', 1);
  variable_set('userpoints_nc_comment_enabled_image', 1);
  variable_set('userpoints_nc_comment_enabled_news', 1);
  variable_set('userpoints_nc_comment_enabled_page', 1);
  variable_set('userpoints_nc_comment_enabled_request', 1);
  variable_set('userpoints_nc_comment_ownership_deduct', 1);
  variable_set('userpoints_nc_comment_ownership_deduct_correction', 1);
  variable_set('userpoints_nc_comment_ownership_deduct_forum', 1);
  variable_set('userpoints_nc_comment_ownership_deduct_group', 1);
  variable_set('userpoints_nc_comment_ownership_deduct_image', 1);
  variable_set('userpoints_nc_comment_ownership_deduct_news', 1);
  variable_set('userpoints_nc_comment_ownership_deduct_page', 1);
  variable_set('userpoints_nc_comment_ownership_deduct_request', 1);
  variable_set('userpoints_nc_comment_points', '1');
  variable_set('userpoints_nc_comment_points_correction', '1');
  variable_set('userpoints_nc_comment_points_forum', '1');
  variable_set('userpoints_nc_comment_points_group', '1');
  variable_set('userpoints_nc_comment_points_image', '1');
  variable_set('userpoints_nc_comment_points_news', '1');
  variable_set('userpoints_nc_comment_points_page', '1');
  variable_set('userpoints_nc_comment_points_request', '1');
  variable_set('userpoints_nc_comment_published_only', 1);
  variable_set('userpoints_nc_delete_deduct', 1);
  variable_set('userpoints_nc_delete_deduct_correction', 1);
  variable_set('userpoints_nc_delete_deduct_forum', 1);
  variable_set('userpoints_nc_delete_deduct_group', 1);
  variable_set('userpoints_nc_delete_deduct_image', 1);
  variable_set('userpoints_nc_delete_deduct_news', 1);
  variable_set('userpoints_nc_delete_deduct_page', 1);
  variable_set('userpoints_nc_delete_deduct_request', 1);
  variable_set('userpoints_nc_enabled', 1);
  variable_set('userpoints_nc_enabled_correction', 1);
  variable_set('userpoints_nc_enabled_forum', 1);
  variable_set('userpoints_nc_enabled_group', 1);
  variable_set('userpoints_nc_enabled_image', 1);
  variable_set('userpoints_nc_enabled_news', 1);
  variable_set('userpoints_nc_enabled_page', 1);
  variable_set('userpoints_nc_enabled_request', 1);
  variable_set('userpoints_nc_ownership_deduct', 1);
  variable_set('userpoints_nc_ownership_deduct_correction', 1);
  variable_set('userpoints_nc_ownership_deduct_forum', 1);
  variable_set('userpoints_nc_ownership_deduct_group', 1);
  variable_set('userpoints_nc_ownership_deduct_image', 1);
  variable_set('userpoints_nc_ownership_deduct_news', 1);
  variable_set('userpoints_nc_ownership_deduct_page', 1);
  variable_set('userpoints_nc_ownership_deduct_request', 1);
  variable_set('userpoints_nc_points', '100');
  variable_set('userpoints_nc_points_correction', '5');
  variable_set('userpoints_nc_points_forum', '5');
  variable_set('userpoints_nc_points_group', '1');
  variable_set('userpoints_nc_points_image', '10');
  variable_set('userpoints_nc_points_news', '100');
  variable_set('userpoints_nc_points_page', '1');
  variable_set('userpoints_nc_points_request', '1');
  variable_set('userpoints_nc_published_only', 1);
  variable_set('userpoints_nc_revision_category', '0');
  variable_set('userpoints_nc_revision_category_correction', '0');
  variable_set('userpoints_nc_revision_category_forum', '0');
  variable_set('userpoints_nc_revision_category_group', '0');
  variable_set('userpoints_nc_revision_category_image', '0');
  variable_set('userpoints_nc_revision_category_news', '0');
  variable_set('userpoints_nc_revision_category_page', '0');
  variable_set('userpoints_nc_revision_category_request', '0');
  variable_set('userpoints_nc_revision_enabled', 1);
  variable_set('userpoints_nc_revision_enabled_correction', 1);
  variable_set('userpoints_nc_revision_enabled_forum', 1);
  variable_set('userpoints_nc_revision_enabled_group', 1);
  variable_set('userpoints_nc_revision_enabled_image', 1);
  variable_set('userpoints_nc_revision_enabled_news', 1);
  variable_set('userpoints_nc_revision_enabled_page', 1);
  variable_set('userpoints_nc_revision_enabled_request', 1);
  variable_set('userpoints_nc_revision_own_nodes', 0);
  variable_set('userpoints_nc_revision_own_nodes_correction', 0);
  variable_set('userpoints_nc_revision_own_nodes_forum', 0);
  variable_set('userpoints_nc_revision_own_nodes_group', 0);
  variable_set('userpoints_nc_revision_own_nodes_image', 0);
  variable_set('userpoints_nc_revision_own_nodes_news', 0);
  variable_set('userpoints_nc_revision_own_nodes_page', 0);
  variable_set('userpoints_nc_revision_own_nodes_request', 0);
  variable_set('userpoints_nc_revision_points', '5');
  variable_set('userpoints_nc_revision_points_correction', '1');
  variable_set('userpoints_nc_revision_points_forum', '0');
  variable_set('userpoints_nc_revision_points_group', '1');
  variable_set('userpoints_nc_revision_points_image', '5');
  variable_set('userpoints_nc_revision_points_news', '5');
  variable_set('userpoints_nc_revision_points_page', '1');
  variable_set('userpoints_nc_revision_points_request', '1');
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
  variable_set('additional_settings__active_tab_request', 'edit-userpoints-nc-revision');
  variable_set('settings_additional__active_tab', 'edit-userpoints-nc-comment');
}

function planetmath_profile_set_misc_variables () {
  dd("Profile- In planetmath_profile_set_misc_variables");
  set_time_limit(0);
  // Default "Basic page" to not be promoted and have comments disabled.
  variable_set('node_options_page', array('status'));
  variable_set('comment_page', COMMENT_NODE_HIDDEN);

  // Don't display date and author information for "Basic page" nodes by default.
  variable_set('node_submitted_page', FALSE);

  // Enable user picture support and set the default to a square thumbnail option.
  variable_set('user_pictures', '1');
  variable_set('user_picture_dimensions', '1024x1024');
  variable_set('user_picture_file_size', '800');
  variable_set('user_picture_style', 'thumbnail');

  // Allow visitor account creation with administrative approval.
  variable_set('user_register', USER_REGISTER_VISITORS_ADMINISTRATIVE_APPROVAL);
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

  // planetmath_user_default_permissions();
  module_enable('planetmath_permissions');

  return NULL;
}

// Actually this function doesn't really seem useful or needed for anything
// since we set up menus with a feature.
function planetmath_profile_setup_menus () {
  dd("Profile- In planetmath_profile_setup_menus");
  set_time_limit(0);
  // Create a Home link in the main menu.
  /* $item = array( */
  /*               'link_title' => st('Home'), */
  /*               'link_path' => '<front>', */
  /*               'menu_name' => 'main-menu', */
  /*               ); */
  /* menu_link_save($item); */

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

