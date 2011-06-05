<?php

/**
 * @file
 * Page/form showing image styles in use.
 */

/**
 * Form for uploading and displaying an image using selected style.
 *
 * This page provides a form that allows the user to upload an image and choose
 * a style from the list of defined image styles to use when displaying the
 * the image. This serves as an example of integrating image styles with your
 * module and as a way to demonstrate that the styles and effects defined by
 * this module are available via Drupal's image handling system.
 *
 * @see theme_image_style()
 */
function image_example_style_form($form, &$form_state) {
  // If there is already an uploaded image display the image here.
  if ($image_fid = variable_get('image_example_image_fid', FALSE)) {
    $image = file_load($image_fid);
    $style = variable_get('image_example_style_name', 'thumbnail');
    $form['image'] = array(
      '#markup' => theme('image_example_image', array('image' => $image, 'style' => $style)),
    );
  }

  // Use the #managed_file FAPI element to upload an image file.
  $form['image_example_image_fid'] = array(
    '#title' => t('Image'),
    '#type' => 'managed_file',
    '#description' => t('The uploaded image will be displayed on this page using the image style choosen below.'),
    '#default_value' => variable_get('image_example_image_fid', ''),
    '#upload_location' => 'public://image_example_images/',
  );

  // Provide a select field for choosing an image style to use when displaying
  // the image.
  $form['image_example_style_name'] = array(
    '#title' => t('Image style'),
    '#type' => 'select',
    '#description' => t('Choose an image style to use when displaying this image.'),
    // The image_style_options() function returns an array of all available
    // image styles both the key and the value of the array are the image
    // style's name. The fucntion takes on paramater, a boolean flag
    // signifying wether or not the array should include a <none> option.
    '#options' => image_style_options(TRUE),
    '#default_value' => variable_get('image_example_style_name', ''),
  );

  // Submit Button.
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
  );

  return $form;
}

/**
 * Verify that the user supplied an image with the form..
 */
function image_example_style_form_validate($form, &$form_state) {
  if (!isset($form_state['values']['image_example_image_fid']) || !is_numeric($form_state['values']['image_example_image_fid'])) {
    form_set_error('image_example_image_fid', t('Please select an image to upload.'));
  }
}

/**
 * Form Builder; Display a form for uploading an image.
 */
function image_example_style_form_submit($form, &$form_state) {
  // When using the #managed_file form element the file is automatically
  // uploaded an saved to the {file} table. The value of the corresponding
  // form element is set to the {file}.fid of the new file.


  // If fid is not 0 we have a valid file.
  if ($form_state['values']['image_example_image_fid'] != 0) {
    // The new file's status is set to 0 or temporary and in order to ensure
    // that the file is not removed after 6 hours we need to change it's status
    // to 1. Save the ID of the uploaded image for later use.
    $file = file_load($form_state['values']['image_example_image_fid']);
    $file->status = FILE_STATUS_PERMANENT;
    file_save($file);

    // When a module is managing a file, it must manage the usage count.
    // Here we increment the usage count with file_usage_add().
    file_usage_add($file, 'image_example', 'sample_image', 1);

    // Save the fid of the file so that the module can reference it later.
    variable_set('image_example_image_fid', $file->fid);
    drupal_set_message(t('The image @image_name was uploaded and saved with an ID of @fid and will be displayed using the style @style.', array('@image_name' => $file->filename, '@fid' => $file->fid, '@style' => $form_state['values']['image_example_style_name'])));
  }
  // If the file was removed we need to remove the module's reference to the
  // removed file's fid, and remove the file.
  elseif ($form_state['values']['image_example_image_fid'] == 0) {
    // Retrieve the old file's id.
    $fid = variable_get('image_example_image_fid', FALSE);
    $file = $fid ? file_load($fid) : FALSE;
    if ($file) {
      // When a module is managing a file, it must manage the usage count.
      // Here we decrement the usage count with file_usage_delete().
      file_usage_delete($file, 'image_example', 'sample_image', 1);

      // The file_delete() function takes a file object and checks to see if
      // the file is being used by any other modules. If it is the delete
      // operation is cancelled, otherwise the file is deleted.
      file_delete($file);
    }

    // Either way the module needs to update it's reference since even if the
    // file is in use by another module and not deleted we no longer want to
    // use it.
    variable_set('image_example_image_fid', FALSE);
    drupal_set_message(t('The image @image_name was removed.', array('@image_name' => $file->filename)));
  }

  // Save the name of the image style choosen by the user.
  variable_set('image_example_style_name', $form_state['values']['image_example_style_name']);
}

/**
 * Theme function displays an image rendered using the specified style.
 */
function theme_image_example_image($variables) {
  $image = $variables['image'];
  $style = $variables['style'];

  // theme_image_style() is the primary method for displaying images using
  // one of the defined styles. The $variables array passed to the theme
  // contains the following two important values:
  //   'style_name': the name of the image style to use when displaying the
  //   image.
  //   'path': the $file->uri of the image to display.
  // When given a style and an image path the function will first determine
  // if a derivative image already exists, in which case the existing image
  // will be displayed. If the derivative image does not already exist the
  // function returns an <img> tag with a specially crafted callback URL
  // as the src attribute for the tag. When accessed, the callback URL will
  // generate the derivative image and serve it to the browser.
  $output = theme('image_style', array('style_name' => $style, 'path' => $image->uri, 'getsize' => FALSE));
  $output .= '<p>' . t('This image is being displayed using the image style %style_name.', array('%style_name' => $style)) . '</p>';
  return $output;
}
