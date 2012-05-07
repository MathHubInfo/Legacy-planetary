<?php


/* Instructions for using this file... TBA
 * STATUS: The current setup makes it through the installation
 * routine, but it doesn't seem that any functions in this file are actually
 * run.
 */

// In general this should be set interactively via some config option!
$install_directory = '/home/planetary/drupal_planetary/';

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
                 'my_3rd_task' => array(
                                        'display_name' => st('Run the migrations to import legacy data.'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_migration_runner',
                                        ),
                 'my_4th_task' => array(
                                        'display_name' => st('Configure DruTeXML settings properly'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_drutexml_configuration',
                                        ),
                 'my_5th_task' => array(
                                        'display_name' => st('Configure Node Types'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_configure_node_types',
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
                 // this would be different in another installation...
                 'my_7th_task' => array(
                                        'display_name' => st('Configure Blocks'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_configure_blocks',
                                        ),
                 'my_8th_task' => array(
                                        'display_name' => st('Configure RDF mappings'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_rdf_mappings',
                                        ),
                 'my_9th_task' => array(
                                        'display_name' => st('Set miscellaneous variables'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_set_misc_variables',
                                        ),
                 'my_10th_task' => array(
                                        'display_name' => st('Set up tagging facilities'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_set_up_tags',
                                        ),
                 'my_11th_task' => array(
                                        'display_name' => st('Add and configure an "image" field'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_setup_image_field',
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
                 'my_14th_task' => array(
                                        'display_name' => st('Choose and install the theme'),
                                        'display' => TRUE,
                                        'type' => 'normal',
                                        'run' => INSTALL_TASK_RUN_IF_NOT_COMPLETED,
                                        'function' => 'planetmath_profile_setup_theme',
                                        ),
                 );
  return $tasks;
}

function planetmath_profile_patch_core() {
  chdir($install_directory);
  module_enable('devel');
  dd('In planetmath_profile_patch_core');
  // skip for now, since I just applied those by hand...
  //shell_exec('patch -p5 < node.module.patch');
  //shell_exec('patch -p5 < node.api.php.patch');
  return NULL;
}

// This seems to be pretty much what's needed...
function planetmath_profile_forum_creator() {
  dd("In planetmath_profile_forum_creator");
  $edit = array(
		'name' => t('Planetary Bugs'),
		'description' => 'A place to report and discuss issues with the new software.',
		'parent' => array(0),
		'vid' => 2,
		'weight' => -1,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('High School/Secondary'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('University/Tertiary'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('Industry/Practice'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('Graduate/Advanced'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('Research Topics'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('The Math Pub'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('Math Competitions'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('Math History'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('Math Humor'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('LaTeX help'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('PlanetMath help'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('PlanetMath Comments'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('PlanetMath.ORG'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('PlanetMath System Updates and News'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('Strategic Communications Development'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);

  $edit = array(
		'name' => t('Testing messages (ignore)'),
		'description' => 'CHANGE THIS',
		'parent' => array(0),
		'vid' => 2,
		);
  $term = (object) $edit;
  taxonomy_term_save($term);
  return NULL;
}

function planetmath_profile_configure_email_rerouting () {
  // need to figure out what goes here! 
  return NULL;
}

// THIS FUNCTION ASSUMES:
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
function planetmath_profile_migration_runner () {
  dd("In planetmath_profile_migration_runner");
  set_time_limit(0);
  module_enable('migrate');
  module_enable('planetmath_migration');

  module_enable('planetmath_migration_extras');

  module_enable('group_migrate');
  module_enable('image_migrate');

  chdir($install_directory);

  // this should work without hardcoding of database names within the profile.

  global $databases;

  $database_name = $databases['default']['default']->database;
  $database_user = $databases['default']['default']->username;
  $database_pass = $databases['default']['default']->password;

  // Not going to mess with this for now.  We COULD do this, but then we would
  // need to give permission to read the planetary database to the drupal user
  // Not a major thing, but it does bifurcate the instructions.
  // shell_exec("sed -i 's/demodb/".$database_name."/g' tables-into-drupal.sql");

  dd(" running tables-into-drupal-pt2.sql command");
  shell_exec('mysql -u '.$database_user.' --password='.$database_pass.' '.$database_name. ' < tables-into-drupal-pt2.sql');

  
  // it would also be cool if this could be executed from within a screen... or if
  // I knew how to make it run via the visual UI, but that seems like another story altogether
  dd(" running drush migrate-import PMUser");
  shell_exec('drush migrate-import PMUser');
  dd(" running drush migrate-import PMForumOP");
  shell_exec('drush migrate-import PMForumOP');
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
  dd("In planetmath_profile_group_creator");
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
  dd("In planetmath_profile_drutexml_configuration");
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
  dd("In planetmath_profile_configure_node_types");
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

  planetmath_profile_docreate_field('field_canonicalname'   , 'article' ,'CanonicalName');
  planetmath_profile_docreate_field('field_revisioncomment' , 'article' ,'Revision Comment');
  planetmath_profile_docreate_field('field_msc'             , 'article' ,'MSC');
  planetmath_profile_docreate_field('field_mathtype'        , 'article' ,'Type of Math Ojbect');
  planetmath_profile_docreate_field('field_defines'         , 'article' ,'Defines');
  planetmath_profile_docreate_field('field_keywords'        , 'article' ,'Keywords');
  planetmath_profile_docreate_field('field_parent'          , 'article' ,'Parent');
  planetmath_profile_docreate_field('field_related'         , 'article' ,'Related');
  planetmath_profile_docreate_field('field_timecreated'     , 'article' ,'Time Created');
  planetmath_profile_docreate_field('field_synonym'         , 'article' ,'Synonym');
  return NULL;
}



function planetmath_profile_configure_groups () {
  dd("In planetmath_profile_configure_groups");
  // Potentially not needed - groups are being imported in the migration step,
  // and configuration MAY be automatic and/or provided by a feature (QUITE UNLIKELY).
  return NULL;
}

function planetmath_profile_configure_blocks () {
  dd("In planetmath_profile_configure_blocks");
  // this is just copied from the standard installation for now...
  // in a moment, it should have the new PlanetMath blocks set up
  module_enable('planetmath_blocks');

  $blocks = array(
                  array(
                        'module' => 'system',
                        'delta' => 'main',
                        'theme' => $default_theme,
                        'status' => 1,
                        'weight' => 0,
                        'region' => 'content',
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'search',
                        'delta' => 'form',
                        'theme' => $default_theme,
                        'status' => 1,
                        'weight' => -1,
                        'region' => 'sidebar_first',
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
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'user',
                        'delta' => 'login',
                        'theme' => $default_theme,
                        'status' => 1,
                        'weight' => 0,
                        'region' => 'sidebar_first',
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'system',
                        'delta' => 'navigation',
                        'theme' => $default_theme,
                        'status' => 1,
                        'weight' => 0,
                        'region' => 'sidebar_first',
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'system',
                        'delta' => 'powered-by',
                        'theme' => $default_theme,
                        'status' => 1,
                        'weight' => 10,
                        'region' => 'footer',
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'system',
                        'delta' => 'help',
                        'theme' => $default_theme,
                        'status' => 1,
                        'weight' => 0,
                        'region' => 'help',
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
                        'pages' => '',
                        'cache' => -1,
                        ),
                  array(
                        'module' => 'search',
                        'delta' => 'form',
                        'theme' => $admin_theme,
                        'status' => 1,
                        'weight' => -10,
                        'region' => 'dashboard_sidebar',
                        'pages' => '',
                        'cache' => -1,
                        ),
                  );
  $query = db_insert('block')->fields(array(
                                            'module',
                                            'delta',
                                            'theme',
                                            'status',
                                            'weight',
                                            'region',
                                            'pages',
                                            'cache'));
  foreach ($blocks as $block) {
    $query->values($block);
  }
  $query->execute();
    return NULL;
}

function planetmath_profile_rdf_mappings () {
  dd("In planetmath_profile_rdf_mappings");
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

function planetmath_profile_set_misc_variables () {
  dd("In planetmath_profile_set_misc_variables");
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
  dd("In planetmath_profile_set_up_tags");
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

function planetmath_profile_setup_image_field () {
  dd("In planetmath_profile_setup_image_field");
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

// see function at end of this file...
function planetmath_profile_setup_permissions () {
  dd("In planetmath_profile_setup_permissions");

  // Enable default permissions for system roles.
  // this presumably shouldn't cause any errors...?

  $filtered_html_permission = filter_permission_name($filtered_html_format);
  user_role_grant_permissions(DRUPAL_ANONYMOUS_RID,
                              array('access content',
                                    'access comments',
                                    $filtered_html_permission));

  // should be able to post contents as well
  user_role_grant_permissions(DRUPAL_AUTHENTICATED_RID,
                              array('access content',
                                    'access comments',
                                    'post comments',
                                    'skip comment approval',
                                    $filtered_html_permission));

  // This seems to have been breaking when coming from the filter
  /* // Exported permission: use text format filtered_html */
  /* $permissions['use text format filtered_html'] = array( */
  /*   'name' => 'use text format filtered_html', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'anonymous user', */
  /*     2 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'filter', */
  /* ); */

  /* // Exported permission: use text format full_html */
  /* $permissions['use text format full_html'] = array( */
  /*   'name' => 'use text format full_html', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'filter', */
  /* ); */

  /* // Exported permission: use text format php_code */
  /* $permissions['use text format php_code'] = array( */
  /*   'name' => 'use text format php_code', */
  /*   'roles' => array(), */
  /* ); */

  /* // Exported permission: use text format php_evaluator */
  /* $permissions['use text format php_evaluator'] = array( */
  /*   'name' => 'use text format php_evaluator', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'filter', */
  /* ); */

  /* // Exported permission: use text format tex_editor */
  /* $permissions['use text format tex_editor'] = array( */
  /*   'name' => 'use text format tex_editor', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'filter', */
  /* ); */

  /* // Exported permission: create article content */
  /* $permissions['create article content'] = array( */
  /*   'name' => 'create article content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: create correction content */
  /* $permissions['create correction content'] = array( */
  /*   'name' => 'create correction content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: create group content */
  /* $permissions['create group content'] = array( */
  /*   'name' => 'create group content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: create image content */
  /* $permissions['create image content'] = array( */
  /*   'name' => 'create image content', */
  /*   'roles' => array( */
  /*     0 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: create news content */
  /* $permissions['create news content'] = array( */
  /*   'name' => 'create news content', */
  /*   'roles' => array( */
  /*     0 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: create page content */
  /* $permissions['create page content'] = array( */
  /*   'name' => 'create page content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: create poll content */
  /* $permissions['create poll content'] = array( */
  /*   'name' => 'create poll content', */
  /*   'roles' => array( */
  /*     0 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: create problem content */
  /* $permissions['create problem content'] = array( */
  /*   'name' => 'create problem content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: create forum content */
  /* $permissions['create forum content'] = array( */
  /*   'name' => 'create forum content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */



  /* // Exported permission: create relations */
  /* $permissions['create relations'] = array( */
  /*   'name' => 'create relations', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'relation', */
  /* ); */

  /* // Exported permission: create request content */
  /* $permissions['create request content'] = array( */
  /*   'name' => 'create request content', */
  /*   'roles' => array( */
  /*     0 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: create solution content */
  /* $permissions['create solution content'] = array( */
  /*   'name' => 'create solution content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: create url aliases */
  /* $permissions['create url aliases'] = array( */
  /*   'name' => 'create url aliases', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'path', */
  /* ); */

  /* // Exported permission: customize shortcut links */
  /* $permissions['customize shortcut links'] = array( */
  /*   'name' => 'customize shortcut links', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'shortcut', */
  /* ); */

  /* // Exported permission: delete any article content */
  /* $permissions['delete any article content'] = array( */
  /*   'name' => 'delete any article content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete any correction content */
  /* $permissions['delete any correction content'] = array( */
  /*   'name' => 'delete any correction content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete any forum content */
  /* $permissions['delete any forum content'] = array( */
  /*   'name' => 'delete any forum content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete any group content */
  /* $permissions['delete any group content'] = array( */
  /*   'name' => 'delete any group content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete any image content */
  /* $permissions['delete any image content'] = array( */
  /*   'name' => 'delete any image content', */
  /*   'roles' => array(), */
  /* ); */

  /* // Exported permission: delete any news content */
  /* $permissions['delete any news content'] = array( */
  /*   'name' => 'delete any news content', */
  /*   'roles' => array(), */
  /* ); */

  /* // Exported permission: delete any page content */
  /* $permissions['delete any page content'] = array( */
  /*   'name' => 'delete any page content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete any poll content */
  /* $permissions['delete any poll content'] = array( */
  /*   'name' => 'delete any poll content', */
  /*   'roles' => array(), */
  /* ); */

  /* // Exported permission: delete any problem content */
  /* $permissions['delete any problem content'] = array( */
  /*   'name' => 'delete any problem content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete any request content */
  /* $permissions['delete any request content'] = array( */
  /*   'name' => 'delete any request content', */
  /*   'roles' => array(), */
  /* ); */

  /* // Exported permission: delete any solution content */
  /* $permissions['delete any solution content'] = array( */
  /*   'name' => 'delete any solution content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete own article content */
  /* $permissions['delete own article content'] = array( */
  /*   'name' => 'delete own article content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete own correction content */
  /* $permissions['delete own correction content'] = array( */
  /*   'name' => 'delete own correction content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete own forum content */
  /* $permissions['delete own forum content'] = array( */
  /*   'name' => 'delete own forum content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete own group content */
  /* $permissions['delete own group content'] = array( */
  /*   'name' => 'delete own group content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete own image content */
  /* $permissions['delete own image content'] = array( */
  /*   'name' => 'delete own image content', */
  /*   'roles' => array( */
  /*     0 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete own news content */
  /* $permissions['delete own news content'] = array( */
  /*   'name' => 'delete own news content', */
  /*   'roles' => array( */
  /*     0 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete own page content */
  /* $permissions['delete own page content'] = array( */
  /*   'name' => 'delete own page content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete own poll content */
  /* $permissions['delete own poll content'] = array( */
  /*   'name' => 'delete own poll content', */
  /*   'roles' => array( */
  /*     0 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete own problem content */
  /* $permissions['delete own problem content'] = array( */
  /*   'name' => 'delete own problem content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete own request content */
  /* $permissions['delete own request content'] = array( */
  /*   'name' => 'delete own request content', */
  /*   'roles' => array( */
  /*     0 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete own solution content */
  /* $permissions['delete own solution content'] = array( */
  /*   'name' => 'delete own solution content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete relations */
  /* $permissions['delete relations'] = array( */
  /*   'name' => 'delete relations', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'relation', */
  /* ); */

  /* // Exported permission: delete revisions */
  /* $permissions['delete revisions'] = array( */
  /*   'name' => 'delete revisions', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: delete terms in 1 */
  /* $permissions['delete terms in 1'] = array( */
  /*   'name' => 'delete terms in 1', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'taxonomy', */
  /* ); */

  /* // Exported permission: delete terms in 2 */
  /* $permissions['delete terms in 2'] = array( */
  /*   'name' => 'delete terms in 2', */
  /*   'roles' => array(), */
  /* ); */

  /* // Exported permission: delete terms in 3 */
  /* $permissions['delete terms in 3'] = array( */
  /*   'name' => 'delete terms in 3', */
  /*   'roles' => array(), */
  /* ); */

  /* // Exported permission: edit any article content */
  /* $permissions['edit any article content'] = array( */
  /*   'name' => 'edit any article content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit any correction content */
  /* $permissions['edit any correction content'] = array( */
  /*   'name' => 'edit any correction content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit any forum content */
  /* $permissions['edit any forum content'] = array( */
  /*   'name' => 'edit any forum content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit any group content */
  /* $permissions['edit any group content'] = array( */
  /*   'name' => 'edit any group content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit any image content */
  /* $permissions['edit any image content'] = array( */
  /*   'name' => 'edit any image content', */
  /*   'roles' => array(), */
  /* ); */

  /* // Exported permission: edit any news content */
  /* $permissions['edit any news content'] = array( */
  /*   'name' => 'edit any news content', */
  /*   'roles' => array(), */
  /* ); */

  /* // Exported permission: edit any page content */
  /* $permissions['edit any page content'] = array( */
  /*   'name' => 'edit any page content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit any poll content */
  /* $permissions['edit any poll content'] = array( */
  /*   'name' => 'edit any poll content', */
  /*   'roles' => array(), */
  /* ); */

  /* // Exported permission: edit any problem content */
  /* $permissions['edit any problem content'] = array( */
  /*   'name' => 'edit any problem content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit any request content */
  /* $permissions['edit any request content'] = array( */
  /*   'name' => 'edit any request content', */
  /*   'roles' => array(), */
  /* ); */

  /* // Exported permission: edit any solution content */
  /* $permissions['edit any solution content'] = array( */
  /*   'name' => 'edit any solution content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit own article content */
  /* $permissions['edit own article content'] = array( */
  /*   'name' => 'edit own article content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit own comments */
  /* $permissions['edit own comments'] = array( */
  /*   'name' => 'edit own comments', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'comment', */
  /* ); */

  /* // Exported permission: edit own correction content */
  /* $permissions['edit own correction content'] = array( */
  /*   'name' => 'edit own correction content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit own forum content */
  /* $permissions['edit own forum content'] = array( */
  /*   'name' => 'edit own forum content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit own group content */
  /* $permissions['edit own group content'] = array( */
  /*   'name' => 'edit own group content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit own image content */
  /* $permissions['edit own image content'] = array( */
  /*   'name' => 'edit own image content', */
  /*   'roles' => array( */
  /*     0 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit own news content */
  /* $permissions['edit own news content'] = array( */
  /*   'name' => 'edit own news content', */
  /*   'roles' => array( */
  /*     0 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit own page content */
  /* $permissions['edit own page content'] = array( */
  /*   'name' => 'edit own page content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit own poll content */
  /* $permissions['edit own poll content'] = array( */
  /*   'name' => 'edit own poll content', */
  /*   'roles' => array( */
  /*     0 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit own problem content */
  /* $permissions['edit own problem content'] = array( */
  /*   'name' => 'edit own problem content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit own request content */
  /* $permissions['edit own request content'] = array( */
  /*   'name' => 'edit own request content', */
  /*   'roles' => array( */
  /*     0 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit own solution content */
  /* $permissions['edit own solution content'] = array( */
  /*   'name' => 'edit own solution content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: edit relations */
  /* $permissions['edit relations'] = array( */
  /*   'name' => 'edit relations', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'relation', */
  /* ); */

  /* // Exported permission: edit terms in 1 */
  /* $permissions['edit terms in 1'] = array( */
  /*   'name' => 'edit terms in 1', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'taxonomy', */
  /* ); */

  /* // Exported permission: edit terms in 2 */
  /* $permissions['edit terms in 2'] = array( */
  /*   'name' => 'edit terms in 2', */
  /*   'roles' => array(), */
  /* ); */

  /* // Exported permission: edit terms in 3 */
  /* $permissions['edit terms in 3'] = array( */
  /*   'name' => 'edit terms in 3', */
  /*   'roles' => array(), */
  /* ); */

  /* // Exported permission: edit userpoints */
  /* $permissions['edit userpoints'] = array( */
  /*   'name' => 'edit userpoints', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'userpoints', */
  /* ); */

  /* // Exported permission: execute php code */
  /* $permissions['execute php code'] = array( */
  /*   'name' => 'execute php code', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'devel', */
  /* ); */

  /* // Exported permission: export relation types */
  /* $permissions['export relation types'] = array( */
  /*   'name' => 'export relation types', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'relation', */
  /* ); */

  /* // Exported permission: inspect all votes */
  /* $permissions['inspect all votes'] = array( */
  /*   'name' => 'inspect all votes', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'poll', */
  /* ); */

  /* // Exported permission: manage features */
  /* $permissions['manage features'] = array( */
  /*   'name' => 'manage features', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'features', */
  /* ); */

  /* // Exported permission: migration information */
  /* $permissions['migration information'] = array( */
  /*   'name' => 'migration information', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'migrate_ui', */
  /* ); */

  /* // Exported permission: moderate userpoints */
  /* $permissions['moderate userpoints'] = array( */
  /*   'name' => 'moderate userpoints', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'userpoints', */
  /* ); */

  /* // Exported permission: notify of path changes */
  /* $permissions['notify of path changes'] = array( */
  /*   'name' => 'notify of path changes', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'pathauto', */
  /* ); */

  /* // Exported permission: post comments */
  /* $permissions['post comments'] = array( */
  /*   'name' => 'post comments', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'comment', */
  /* ); */

  /* // Exported permission: revert revisions */
  /* $permissions['revert revisions'] = array( */
  /*   'name' => 'revert revisions', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: search content */
  /* $permissions['search content'] = array( */
  /*   'name' => 'search content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'anonymous user', */
  /*     2 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'search', */
  /* ); */

  /* // Exported permission: select account cancellation method */
  /* $permissions['select account cancellation method'] = array( */
  /*   'name' => 'select account cancellation method', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'user', */
  /* ); */

  /* // Exported permission: skip comment approval */
  /* $permissions['skip comment approval'] = array( */
  /*   'name' => 'skip comment approval', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'comment', */
  /* ); */

  /* // Exported permission: switch shortcut sets */
  /* $permissions['switch shortcut sets'] = array( */
  /*   'name' => 'switch shortcut sets', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'shortcut', */
  /* ); */

  /* // Exported permission: switch users */
  /* $permissions['switch users'] = array( */
  /*   'name' => 'switch users', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'devel', */
  /* ); */

  /* // Exported permission: translate interface */
  /* $permissions['translate interface'] = array( */
  /*   'name' => 'translate interface', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'locale', */
  /* ); */

  /* // Exported permission: use PHP for settings */
  /* $permissions['use PHP for settings'] = array( */
  /*   'name' => 'use PHP for settings', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'php', */
  /* ); */

  /* // Exported permission: use advanced search */
  /* $permissions['use advanced search'] = array( */
  /*   'name' => 'use advanced search', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'anonymous user', */
  /*     2 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'search', */
  /* ); */

  /* // Exported permission: view Terms and Conditions */
  /* $permissions['view Terms and Conditions'] = array( */
  /*   'name' => 'view Terms and Conditions', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'legal', */
  /* ); */

  /* // Exported permission: view devel_node_access information */
  /* $permissions['view devel_node_access information'] = array( */
  /*   'name' => 'view devel_node_access information', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'devel_node_access', */
  /* ); */

  /* // Exported permission: view own unpublished content */
  /* $permissions['view own unpublished content'] = array( */
  /*   'name' => 'view own unpublished content', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: view own userpoints */
  /* $permissions['view own userpoints'] = array( */
  /*   'name' => 'view own userpoints', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'userpoints', */
  /* ); */

  /* // Exported permission: view revisions */
  /* $permissions['view revisions'] = array( */
  /*   'name' => 'view revisions', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'node', */
  /* ); */

  /* // Exported permission: view the administration theme */
  /* $permissions['view the administration theme'] = array( */
  /*   'name' => 'view the administration theme', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*   ), */
  /*   'module' => 'system', */
  /* ); */

  /* // Exported permission: view userpoints */
  /* $permissions['view userpoints'] = array( */
  /*   'name' => 'view userpoints', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'userpoints', */
  /* ); */

  /* // Exported permission: vote on polls */
  /* $permissions['vote on polls'] = array( */
  /*   'name' => 'vote on polls', */
  /*   'roles' => array( */
  /*     0 => 'administrator', */
  /*     1 => 'authenticated user', */
  /*   ), */
  /*   'module' => 'poll', */
  /* ); */


  // Create a default role for site administrators, with all available permissions assigned.
  $admin_role = new stdClass();
  $admin_role->name = 'administrator';
  $admin_role->weight = 2;
  user_role_save($admin_role);
  user_role_grant_permissions($admin_role->rid, array_keys(module_invoke_all('permission')));
  // Set this as the administrator role.
  variable_set('user_admin_role', $admin_role->rid);

  // Assign user 1 the "administrator" role.
  db_insert('users_roles')
    ->fields(array('uid' => 1, 'rid' => $admin_role->rid))
    ->execute();
  return NULL;
}

function planetmath_profile_setup_menus () {
  dd("In planetmath_profile_setup_menus");
  // Create a Home link in the main menu.
  $item = array(
                'link_title' => st('Home'),
                'link_path' => '<front>',
                'menu_name' => 'main-menu',
                );
  menu_link_save($item);

  // Update the menu router information.
  menu_rebuild();
  return NULL;
}

function planetmath_profile_setup_theme () {
  dd("In planetmath_profile_setup_theme");
  $enable = array(
                  'theme_default' => 'zen',
                  'admin_theme' => 'seven',
                  );

  theme_enable($enable);

  foreach ($enable as $var => $theme) {
    if (!is_numeric($var)) {
      variable_set($var, $theme);
    }
  }

  // Disable the default Bartik theme
  theme_disable(array('bartik'));
  return NULL;
}

// just sample code because I think we'll have to do a lot of database updating
//function planetmath_profile_sample_database_updating (){
//  db_update('system')
//    ->fields(array('status' => 1))
//    ->condition('type', 'theme')
//    ->condition('name', 'seven')
//    ->execute();
//}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Utility functions for the above
////////////////////////////////////////////////////////////////////////////////////////////////////

function planetmath_profile_docreate_field ($machine_name, $bundle, $description) {
  dd("In planetmath_profile_docreate_field");
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