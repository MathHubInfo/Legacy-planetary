<?php

/**
 * @file
 * This is the Form API Tutorial from the handbook.
 * TODO: Update this URL, and update it in the dynamic text below.
 * @see http://drupal.org/node/262422
 *
 * It goes through nine form examples in increasing complexity to demonstrate
 * Drupal 7 Form API.
 *
 * Links are provided inline for the related handbook pages.
 */

/**
 * Main Form tutorial page.
 *
 * @see form_example_tutorial_1()
 * @see form_example_tutorial_2()
 * @see form_example_tutorial_3()
 * @see form_example_tutorial_4()
 * @see form_example_tutorial_5()
 * @see form_example_tutorial_6()
 * @see form_example_tutorial_7()
 * @see form_example_tutorial_8()
 * @see form_example_tutorial_9()
 * @see form_example_tutorial_10()
 *
 */
function form_example_tutorial() {
  return t('This is a set of nine form tutorials tied to the <a href="http://drupal.org/node/262422">Drupal handbook</a>.');
}

//////////////// Tutorial Example 1 //////////////////////
/**
 * This first form function is from the @link http://drupal.org/node/717722 Form Tutorial handbook page @endlink
 *
 * It just creates a very basic form with a textfield.
 *
 * This function is called the "form constructor function". It builds the form.
 * It takes a two arguments, $form and $form_state, but if drupal_get_form()
 * sends additional arguments, they will be provided after $form_state.
 *
 * @ingroup form_example
 */
function form_example_tutorial_1($form, &$form_state) {

  $form['description'] = array(
    '#type' => 'item',
    '#title' => t('A form with nothing but a textfield'),
  );
  // This is the first form element. It's a textfield with a label, "Name"
  $form['name'] = array(
    '#type' => 'textfield',
    '#title' => t('Name'),
  );
  return $form;
}


//////////////// Tutorial Example 2 //////////////////////

/**
 * This is Example 2, a basic form with a submit button.
 *
 * @see http://drupal.org/node/717726
 * @ingroup form_example
 */
function form_example_tutorial_2($form, &$form_state) {
  $form['description'] = array(
    '#type' => 'item',
    '#title' => t('A simple form with a submit button'),
  );

  $form['name'] = array(
    '#type' => 'textfield',
    '#title' => t('Name'),
  );

  // Adds a simple submit button that refreshes the form and clears its contents -- this is the default behavior for forms.
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Submit',
  );
  return $form;
}

//////////////// Tutorial Example 3 //////////////////////

/**
 * Example 3: A basic form with fieldsets.
 *
 * We establish a fieldset element and then place two text fields within
 * it, one for a first name and one for a last name. This helps us group
 * related content.
 *
 * Study the code below and you'll notice that we renamed the array of the first
 * and last name fields by placing them under the $form['name']
 * array. This tells Form API these fields belong to the $form['name'] fieldset.
 *
 * @ingroup form_example
 */
function form_example_tutorial_3($form, &$form_state) {
  $form['description'] = array(
    '#type' => 'item',
    '#title' => t('A form with a fieldset'),
  );

  $form['name'] = array(
    '#type' => 'fieldset',
    '#title' => t('Name'),
  );
  $form['name']['first'] = array(
    '#type' => 'textfield',
    '#title' => t('First name'),
  );
  $form['name']['last'] = array(
    '#type' => 'textfield',
    '#title' => t('Last name'),
  );


  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Submit',
  );
  return $form;
}


//////////////// Tutorial Example 4 //////////////////////

/**
 * Example 4: Basic form with required fields.
 *
 * @ingroup form_example
 */
function form_example_tutorial_4($form, &$form_state) {
  $form['description'] = array(
    '#type' => 'item',
    '#title' => t('A form with validation'),
  );

  $form['name'] = array(
    '#type' => 'fieldset',
    '#title' => t('Name'),
    // Make the fieldset collapsible.
    '#collapsible' => TRUE, // Added
    '#collapsed' => FALSE,  // Added
  );

  // Make these fields required.
  $form['name']['first'] = array(
    '#type' => 'textfield',
    '#title' => t('First name'),
    '#required' => TRUE, // Added
  );
  $form['name']['last'] = array(
    '#type' => 'textfield',
    '#title' => t('Last name'),
    '#required' => TRUE, // Added
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Submit',
  );
  return $form;
}


//////////////// Tutorial Example 5 //////////////////////

/**
 * Example 5: Basic form with additional element attributes.
 *
 * This demonstrates additional attributes of text form fields.
 *
 * For a more extensive example on element types
 * @see http://drupal.org/node/751826
 *
 * See the @link http://api.drupal.org/api/file/developer/topics/forms_api.html complete form reference @endlink
 *
 * @ingroup form_example
 */
function form_example_tutorial_5($form, &$form_state) {
  $form['description'] = array(
    '#type' => 'item',
    '#title' => t('A form with additional attributes'),
    '#description' => t('This one adds #default_value and #description'),
  );
  $form['name'] = array(
    '#type' => 'fieldset',
    '#title' => t('Name'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );

  $form['name']['first'] = array(
    '#type' => 'textfield',
    '#title' => t('First name'),
    '#required' => TRUE,
    '#default_value' => "First name", // added default value.
    '#description' => "Please enter your first name.", // added description
    '#size' => 20, // added
    '#maxlength' => 20, // added
  );
  $form['name']['last'] = array(
    '#type' => 'textfield',
    '#title' => t('Last name'),
    '#required' => TRUE,
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Submit',
  );
  return $form;
}


//////////////// Tutorial Example 6 //////////////////////

/**
 * Example 6: A basic form with a validate handler.
 *
 * From http://drupal.org/node/717736
 * @see form_example_tutorial_6_validate()
 *
 */
function form_example_tutorial_6($form, &$form_state) {
  $form['description'] = array(
    '#type' => 'item',
    '#title' => t('A form with a validation handler'),
  );

  $form['name'] = array(
    '#type' => 'fieldset',
    '#title' => t('Name'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );
  $form['name']['first'] = array(
    '#type' => 'textfield',
    '#title' => t('First name'),
    '#required' => TRUE,
    '#default_value' => "First name",
    '#description' => "Please enter your first name.",
    '#size' => 20,
    '#maxlength' => 20,
  );
  $form['name']['last'] = array(
    '#type' => 'textfield',
    '#title' => t('Last name'),
    '#required' => TRUE,
  );

  // New form field added to permit entry of year of birth.
  // The data entered into this field will be validated with
  // the default validation function.
  $form['year_of_birth'] = array(
    '#type' => 'textfield',
    '#title' => "Year of birth",
    '#description' => 'Format is "YYYY"',
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Submit',
  );
  return $form;
}



/**
 * Now we add a handler/function to validate the data entered into the
 * "year of birth" field to make sure it's between the values of 1900
 * and 2000. If not, it displays an error. The value report is
 * $form_state['values'] (see http://drupal.org/node/144132#form-state).
 *
 * Notice the name of the function. It is simply the name of the form
 * followed by '_validate'. This is always the name of the default validation
 * function. An alternate list of validation functions could have been provided
 * in $form['#validate'].
 *
 * @see form_example_tutorial_6()
 *
 */
function form_example_tutorial_6_validate($form, &$form_state) {
  $year_of_birth = $form_state['values']['year_of_birth'];
  if ($year_of_birth && ($year_of_birth < 1900 || $year_of_birth > 2000)) {
    form_set_error('year_of_birth', t('Enter a year between 1900 and 2000.'));
  }
}



//////////////// Tutorial Example 7 //////////////////////

/**
 * Example 7: With a submit handler.
 *
 * From the handbook page:
 * http://drupal.org/node/717740
 *
 * @see form_example_tutorial_7_validate()
 * @see form_example_tutorial_7_submit()
 * @ingroup form_example
 *
 */
function form_example_tutorial_7($form, &$form_state) {
  $form['description'] = array(
    '#type' => 'item',
    '#title' => t('A form with a submit handler'),
  );
  $form['name'] = array(
    '#type' => 'fieldset',
    '#title' => t('Name'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
  );
  $form['name']['first'] = array(
    '#type' => 'textfield',
    '#title' => t('First name'),
    '#required' => TRUE,
    '#default_value' => "First name",
    '#description' => "Please enter your first name.",
    '#size' => 20,
    '#maxlength' => 20,
  );
  $form['name']['last'] = array(
    '#type' => 'textfield',
    '#title' => t('Last name'),
    '#required' => TRUE,
  );
  $form['year_of_birth'] = array(
    '#type' => 'textfield',
    '#title' => "Year of birth",
    '#description' => 'Format is "YYYY"',
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Submit',
  );
  return $form;
}


/**
 * Validation function for form_example_tutorial_7().
 *
 */
function form_example_tutorial_7_validate($form, &$form_state) {
  $year_of_birth = $form_state['values']['year_of_birth'];
  if ($year_of_birth && ($year_of_birth < 1900 || $year_of_birth > 2000)) {
    form_set_error('year_of_birth', t('Enter a year between 1900 and 2000.'));
  }
}

/**
 * Submit function for form_example_tutorial_7().
 *
 * Adds a submit handler/function to our form to send a successful
 * completion message to the screen.
 */
function form_example_tutorial_7_submit($form, &$form_state) {
  drupal_set_message(t('The form has been submitted. name="@first @last", year of birth=@year_of_birth',
    array('@first' => $form_state['values']['first'], '@last' => $form_state['values']['last'], '@year_of_birth' => $form_state['values']['year_of_birth'])));
}


//////////////// Tutorial Example 8 //////////////////////

/**
 * Example 8: A simple multistep form with a Next and a Back button.
 *
 * Handbook page: http://drupal.org/node/717750.
 *
 * For more extensive multistep forms, see
 * @link form_example_wizard.inc form_example_wizard.inc @endlink
 *
 *
 * Adds logic to our form builder to give it two pages.
 * The @link ajax_example_wizard AJAX Example's Wizard Example @endlink
 * gives an AJAX version of this same idea.
 *
 * @see form_example_tutorial_8_submit()
 * @see form_example_tutorial_8_validate()
 * @see form_example_tutorial_8_page_two()
 * @see form_example_tutorial_8_page_two_submit()
 * @see form_example_tutorial_8_next_submit()
 * @see form_example_tutorial.inc
 * @ingroup form_example
 */
function form_example_tutorial_8($form, &$form_state) {

  // Display page 2 if $form_state['page_num'] == 1
  if (!empty($form_state['page_num']) && $form_state['page_num'] == 2) {
    return form_example_tutorial_8_page_two($form, $form_state);
  }

  // Otherwise we build page 1.
  $form_state['page_num'] = 1;

  $form['description'] = array(
    '#type' => 'item',
    '#title' => t('A basic multistep form (page 1)'),
  );

  $form['first'] = array(
    '#type' => 'textfield',
    '#title' => t('First name'),
    '#description' => "Please enter your first name.",
    '#size' => 20,
    '#maxlength' => 20,
    '#required' => TRUE,
    '#default_value' => !empty($form_state['values']['first']) ? $form_state['values']['first'] : '',
  );
  $form['last'] = array(
    '#type' => 'textfield',
    '#title' => t('Last name'),
    '#default_value' => !empty($form_state['values']['last']) ? $form_state['values']['last'] : '',
  );
  $form['year_of_birth'] = array(
    '#type' => 'textfield',
    '#title' => "Year of birth",
    '#description' => 'Format is "YYYY"',
    '#default_value' => !empty($form_state['values']['year_of_birth']) ? $form_state['values']['year_of_birth'] : '',
  );
  $form['next'] = array(
    '#type' => 'submit',
    '#value' => 'Next >>',
    '#submit' => array('form_example_tutorial_8_next_submit'),
    '#validate' => array('form_example_tutorial_8_next_validate'),
  );
  return $form;
}

/**
 * Returns the form for the second page of form_example_tutorial_8().
 */
function form_example_tutorial_8_page_two($form, &$form_state) {
  $form['description'] = array(
    '#type' => 'item',
    '#title' => t('A basic multistep form (page 2)'),
  );

  $form['color'] = array(
    '#type' => 'textfield',
    '#title' => t('Favorite color'),
    '#required' => TRUE,
    '#default_value' => !empty($form_state['values']['color']) ? $form_state['values']['color'] : '',
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
    '#submit' => array('form_example_tutorial_8_page_two_submit'),
  );
  $form['back'] = array(
    '#type' => 'submit',
    '#value' => t('<< Back'),
    '#submit' => array('form_example_tutorial_8_page_two_back'),
    // We won't bother validating the required 'color' field, since they
    // have to come back to this page to submit anyway.
    '#limit_validation_errors' => array(),
  );
  return $form;
}


/**
 * Validate handler for the next button on first page.
 *
 */
function form_example_tutorial_8_next_validate($form, &$form_state) {
  $year_of_birth = $form_state['values']['year_of_birth'];
  if ($year_of_birth && ($year_of_birth < 1900 || $year_of_birth > 2000)) {
    form_set_error('year_of_birth', t('Enter a year between 1900 and 2000.'));
  }
}

/**
 * Submit handler for form_example_tutorial_8() next button.
 *
 * Capture the values from page one and store them away so they can be used
 * at final submit time.
 *
 */
function form_example_tutorial_8_next_submit($form, &$form_state) {

  // Values are saved for each page.
  // to carry forward to subsequent pages in the form.
  // and we tell FAPI to rebuild the form.
  $form_state['page_values'][1] = $form_state['values'];

  if (!empty($form_state['page_values'][2])) {
    $form_state['values'] = $form_state['page_values'][2];
  }

  // When form rebuilds, it will look at this to figure which page to build.
  $form_state['page_num'] = 2;
  $form_state['rebuild'] = TRUE;
}

/**
 * Back button handler submit handler.
 *
 * Since #limit_validation_errors = array() is set, values from page 2
 * will be discarded. We load the page 1 values instead.
 */
function form_example_tutorial_8_page_two_back($form, &$form_state) {
  $form_state['values'] = $form_state['page_values'][1];
  $form_state['page_num'] = 1;
  $form_state['rebuild'] = TRUE;
}

/**
 * The page 2 submit handler.
 *
 * This is the final submit handler. Gather all the data together and output
 * it in a drupal_set_message().
 */
function form_example_tutorial_8_page_two_submit($form, &$form_state) {
  // Normally, some code would go here to alter the database with the data
  // collected from the form. Instead sets a message with drupal_set_message()
  // to validate that the code worked.
  $page_one_values = $form_state['page_values'][1];
  drupal_set_message(t('The form has been submitted. name="@first @last", year of birth=@year_of_birth',
  array('@first' => $page_one_values['first'], '@last' => $page_one_values['last'], '@year_of_birth' => $page_one_values['year_of_birth'])));

  if (!empty($page_one_values['first2'])) {
    drupal_set_message(t('Second name: name="@first @last", year of birth=@year_of_birth',
    array('@first' => $page_one_values['first2'], '@last' => $page_one_values['last2'], '@year_of_birth' => $page_one_values['year_of_birth2'])));
  }
  drupal_set_message(t('And the favorite color is @color', array('@color' => $form_state['values']['color'])));

  // If we wanted to redirect on submission, set $form_state['redirect']
  // $form_state['redirect'] = 'node'; // Redirects the user to /node.
}

//////////////// Tutorial Example 9 //////////////////////

/**
 * Example 9: A form with a dynamically added new fields.
 *
 * This example adds default values so that when the form is rebuilt,
 * the form will by default have the previously-entered values.
 *
 * From handbook page http://drupal.org/node/717746.
 *
 * @see form_example_tutorial_9_add_name()
 * @see form_example_tutorial_9_remove_name()
 * @see form_example_tutorial_9_submit()
 * @see form_example_tutorial_9_validate()
 * @ingroup form_example
 *
 */
function form_example_tutorial_9($form, &$form_state) {

  // We will have many fields with the same name, so we need to be able to
  // access the form hierarchically.
  $form['#tree'] = TRUE;

  $form['description'] = array(
    '#type' => 'item',
    '#title' => t('A form with dynamically added new fields'),
  );

  if (empty($form_state['num_names'])) {
    $form_state['num_names'] = 1;
  }

  // Build the number of name fieldsets indicated by $form_state['num_names']
  for ($i = 1; $i <= $form_state['num_names']; $i++) {
    $form['name'][$i] = array(
      '#type' => 'fieldset',
      '#title' => t('Name #@num', array('@num' => $i)),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
    );

    $form['name'][$i]['first'] = array(
      '#type' => 'textfield',
      '#title' => t('First name'),
      '#description' => t("Enter first name."),
      '#size' => 20,
      '#maxlength' => 20,
      '#required' => TRUE,
    );
    $form['name'][$i]['last'] = array(
      '#type' => 'textfield',
      '#title' => t('Enter Last name'),
      '#required' => TRUE,
    );
    $form['name'][$i]['year_of_birth'] = array(
      '#type' => 'textfield',
      '#title' => t("Year of birth"),
      '#description' => t('Format is "YYYY"'),
    );
  }
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Submit',
  );

  // Adds "Add another name" button
  $form['add_name'] = array(
    '#type' => 'submit',
    '#value' => t('Add another name'),
    '#submit' => array('form_example_tutorial_9_add_name'),
  );

  // If we have more than one name, this button allows removal of the
  // last name.
  if ($form_state['num_names'] > 1) {
    $form['remove_name'] = array(
      '#type' => 'submit',
      '#value' => t('Remove latest name'),
      '#submit' => array('form_example_tutorial_9_remove_name'),
      // Since we are removing a name, don't validate until later.
      '#limit_validation_errors' => array(),
    );
  }

  return $form;
}

/**
 * Submit handler for "Add another name" button on form_example_tutorial_9().
 *
 * $form_state['num_names'] tells the form builder function how many name
 * fieldsets to build, so here we increment it.
 *
 * All elements of $form_state are persisted, so there's no need to use a
 * particular key, like the old $form_state['storage']. We can just use
 * $form_state['num_names'].
 */
function form_example_tutorial_9_add_name($form, &$form_state) {
  // Everything in $form_state is persistent, so we'll just use
  // $form_state['add_name']
  $form_state['num_names']++;

  // Setting $form_state['rebuild'] = TRUE causes the form to be rebuilt again.
  $form_state['rebuild'] = TRUE;
}


function form_example_tutorial_9_remove_name($form, &$form_state) {
  if ($form_state['num_names'] > 1) {
    $form_state['num_names']--;
  }

  // Setting $form_state['rebuild'] = TRUE causes the form to be rebuilt again.
  $form_state['rebuild'] = TRUE;
}

/**
 * Validate function for form_example_tutorial_9().
 *
 * Adds logic to validate the form to check the validity of the new fields,
 * if they exist.
 */
function form_example_tutorial_9_validate($form, &$form_state) {

  for ($i = 1; $i <= $form_state['num_names']; $i++) {
    $year_of_birth = $form_state['values']['name'][$i]['year_of_birth'];

    if ($year_of_birth && ($year_of_birth < 1900 || $year_of_birth > 2000)) {
      form_set_error("name][$i][year_of_birth", t('Enter a year between 1900 and 2000.'));
    }
  }
}

/**
 * Submit function for form_example_tutorial_9().
 */
function form_example_tutorial_9_submit($form, &$form_state) {
  $output = t("Form 9 has been submitted.");
  for ($i = 1; $i <= $form_state['num_names']; $i++) {
    $output .= t("@num: @first @last (@date)... ", array('@num' => $i, '@first' => $form_state['values']['name'][$i]['first'],
      '@last' =>  $form_state['values']['name'][$i]['last'], '@date' =>  $form_state['values']['name'][$i]['year_of_birth']));
  }
  drupal_set_message($output);
}

//////////////// Tutorial Example 10 //////////////////////

/**
 * Example 10: A form with a file upload field.
 *
 * This example allows the user to upload a file to Drupal which is stored
 * physically and with a reference in the database.
 *
 * @see form_example_tutorial_10_submit()
 * @see form_example_tutorial_10_validate()
 * @ingroup form_example
 *
 */
function form_example_tutorial_10($form_state) {
  // enctype="multipart/form-data" required by browsers to handle files.
  $form = array(
    '#attributes' => array('enctype' => "multipart/form-data"),
  );

  $form['file'] = array(
    '#type' => 'file',
    '#title' => t('Image'),
    '#description' => t('Upload a file, allowed extensions: jpg, jpeg, png, gif'),
  );

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Submit'),
  );

  return $form;
}

/**
 * Validate handler for form_example_tutorial_10().
 */
function form_example_tutorial_10_validate($form, &$form_state) {
  $file = file_save_upload('file', array(
    'file_validate_is_image' => array(), // Validates file is really an image.
    'file_validate_extensions' => array('png gif jpg jpeg'), // Validate extensions.
  ));
  // If the file passed validation:
  if ($file) {
    // Move the file, into the Drupal file system
    if ($file = file_move($file, 'public://')) {
      // Save the file for use in the submit handler.
      $form_state['storage']['file'] = $file;
    }
    else {
      form_set_error('file', t('Failed to write the uploaded file the site\'s file folder.'));
    }
  }
  else {
    form_set_error('file', t('No file was uploaded.'));
  }
}

/**
 * Submit handler for form_example_tutorial_10().
 */
function form_example_tutorial_10_submit($form, &$form_state) {
  $file = $form_state['storage']['file'];
  // We are done with the file, remove it from storage.
  unset($form_state['storage']['file']);
  // Make the storage of the file permanent
  $file->status = FILE_STATUS_PERMANENT;
  // Save file status.
  file_save($file);
  // Set a response to the user.
  drupal_set_message(t('The form has been submitted and the image has been saved, filename: @filename.', array('@filename' => $file->filename)));
}
