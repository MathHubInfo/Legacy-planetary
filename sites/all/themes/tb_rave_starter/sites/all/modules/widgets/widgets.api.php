<?php

/**
 * @file
 * Hooks related to widget sets and widgets.
 * TODO: Update API docs
 * NOTICE: This file has been copied from the image module and has not been updated for use with Widgets yet.
 */

/**
 * @addtogroup hooks
 * @{
 */

/**
 * Define information about image elements provided by a module.
 *
 * This hook enables modules to define image manipulation elements for use with
 * an image set.
 *
 * @return
 *   An array of image elements. This array is keyed on the machine-readable
 *   element name. Each element is defined as an associative array containing the
 *   following items:
 *   - "label": The human-readable name of the element.
 *   - "element callback": The function to call to perform this image element.
 *   - "dimensions passthrough": (optional) Set this item if the element doesn't
 *     change the dimensions of the image.
 *   - "dimensions callback": (optional) The function to call to transform
 *     dimensions for this element.
 *   - "help": (optional) A brief description of the element that will be shown
 *     when adding or configuring this image element.
 *   - "form callback": (optional) The name of a function that will return a
 *     $form array providing a configuration form for this image element.
 *   - "summary theme": (optional) The name of a theme function that will output
 *     a summary of this image element's configuration.
 *
 * @see hook_widgets_element_info_alter()
 */
function hook_widgets_element_info() {
  $elements = array();

  $elements['mymodule_resize'] = array(
    'label' => t('Resize'),
    'help' => t('Resize an image to an exact set of dimensions, ignoring aspect ratio.'),
    'element callback' => 'mymodule_resize_element',
    'dimensions callback' => 'mymodule_resize_dimensions',
    'form callback' => 'mymodule_resize_form',
    'summary theme' => 'mymodule_resize_summary',
  );

  return $elements;
}

/**
 * Alter the information provided in hook_widgets_element_info().
 *
 * @param $elements
 *   The array of image elements, keyed on the machine-readable element name.
 *
 * @see hook_widgets_element_info()
 */
function hook_widgets_element_info_alter(&$elements) {
  // Override the Image module's crop element with more options.
  $elements['widgets_crop']['element callback'] = 'mymodule_crop_element';
  $elements['widgets_crop']['dimensions callback'] = 'mymodule_crop_dimensions';
  $elements['widgets_crop']['form callback'] = 'mymodule_crop_form';
}

/**
 * Respond to image set updating.
 *
 * This hook enables modules to update settings that might be affected by
 * changes to an image. For example, updating a module specific variable to
 * reflect a change in the image set's name.
 *
 * @param $set
 *   The image style array that is being updated.
 */
function hook_widgets_set_save($set) {
  // If a module defines an image set and that set is renamed by the user
  // the module should update any references to that set.
  if (isset($set['old_name']) && $set['old_name'] == variable_get('mymodule_widgets_set', '')) {
    variable_set('mymodule_widgets_set', $set['name']);
  }
}

/**
 * Respond to image set deletion.
 *
 * This hook enables modules to update settings when a image set is being
 * deleted. If a set is deleted, a replacement name may be specified in
 * $set['name'] and the set being deleted will be specified in
 * $set['old_name'].
 *
 * @param $set
 *   The image set array that being deleted.
 */
function hook_widgets_set_delete($set) {
  // Administrators can choose an optional replacement set when deleting.
  // Update the modules set variable accordingly.
  if (isset($set['old_name']) && $set['old_name'] == variable_get('mymodule_widgets_set', '')) {
    variable_set('mymodule_widgets_set', $set['name']);
  }
}

/**
 * Respond to image set flushing.
 *
 * This hook enables modules to take element when a set is being flushed (all
 * images are being deleted from the server and regenerated). Any
 * module-specific caches that contain information related to the set should
 * be cleared using this hook. This hook is called whenever a set is updated,
 * deleted, or any element associated with the set is update or deleted.
 *
 * @param $set
 *   The image set array that is being flushed.
 */
function hook_widgets_set_flush($set) {
  // Empty cached data that contains information about the set.
  cache_clear_all('*', 'cache_mymodule', TRUE);
}

/**
 * Modify any image sets provided by other modules or the user.
 *
 * This hook allows modules to modify, add, or remove image sets. This may
 * be useful to modify default sets provided by other modules or enforce
 * that a specific element is always enabled on a set. Note that modifications
 * to these sets may negatively affect the user experience, such as if an
 * element is added to a set through this hook, the user may attempt to remove
 * the element but it will be immediately be re-added.
 *
 * The best use of this hook is usually to modify default sets, which are not
 * editable by the user until they are overridden, so such interface
 * contradictions will not occur. This hook can target default (or user) sets
 * by checking the $set['storage'] property.
 *
 * If your module needs to provide a new set (rather than modify an existing
 * one) use hook_widgets_default_sets() instead.
 *
 * @see hook_widgets_default_sets()
 */
function hook_widgets_sets_alter(&$sets) {
  // Check that we only affect a default set.
  if ($sets['thumbnail']['storage'] == widgets_STORAGE_DEFAULT) {
    // Add an additional element to the thumbnail set.
    $sets['thumbnail']['elements'][] = array(
      'name' => 'widgets_desaturate',
      'data' => array(),
      'weight' => 1,
      'element callback' => 'widgets_desaturate_element',
    );
  }
}

/**
 * Provide module-based image sets for reuse throughout Drupal.
 *
 * This hook allows your module to provide image sets. This may be useful if
 * you require images to fit within exact dimensions. Note that you should
 * attempt to re-use the default sets provided by Image module whenever
 * possible, rather than creating image sets that are specific to your module.
 * Image provides the sets "thumbnail", "medium", and "large".
 *
 * You may use this hook to more easily manage your site's changes by moving
 * existing image sets from the database to a custom module. Note however that
 * moving image sets to code instead storing them in the database has a
 * negligible element on performance, since custom image sets are loaded
 * from the database all at once. Even if all sets are pulled from modules,
 * Image module will still perform the same queries to check the database for
 * any custom sets.
 *
 * @return
 *   An array of image sets, keyed by the set name.
 * @see widgets_widgets_default_sets()
 */
function hook_widgets_default_sets() {
  $sets = array();

  $sets['mymodule_preview'] = array(
    'elements' => array(
      array(
        'name' => 'widgets_scale',
        'data' => array('width' => 400, 'height' => 400, 'upscale' => 1),
        'weight' => 0,
      ),
      array(
        'name' => 'widgets_desaturate',
        'data' => array(),
        'weight' => 1,
      ),
    ),
  );

  return $sets;
}

 /**
  * @} End of "addtogroup hooks".
  */
