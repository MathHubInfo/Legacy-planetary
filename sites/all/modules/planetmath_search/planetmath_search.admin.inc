<?php

/**
 * @file
 * Administration page callbacks for the PlanetMath Search module.
 */

/**
 * Form builder. Configure PlanetMath Search.
 */
function planetmath_search_admin_settings() {
   $form['math_results_number'] = array(
      '#type' => 'textfield',
      '#title' => t('How many results should be displayed on a page'),
      '#default_value' => variable_get('planetmath_search_results_per_page_number',5),
      '#description' => t('Enter a number from 3 to 30'),
      '#size' => 4,
      );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Set',
  );
   return $form;//system_settings_form($form);
}

/**
 * Process planetmath search settings submission.
 */
function planetmath_search_admin_settings_submit($form,$form_state) {
   $nr = $form_state['values']['math_results_number'];
   if ($nr >= 3 && $nr <= 30)
   {
      variable_set('planetmath_search_results_per_page_number',$nr);
      drupal_set_message('Good!');
   }
   else 
      drupal_set_message('Bad input, try something else!');
}
