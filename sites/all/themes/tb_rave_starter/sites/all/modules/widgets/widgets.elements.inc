<?php

/**
 * @file
 * Implements widgets API to create base elements
 */

/**
 * Implements hook_widgets_element_info().
 */
function widgets_widgets_element_info() {
  $elements = array(
    'widgets_custom-markup' => array(
      'label' => t('Custom markup'),
      'help' => t('Enables custom input of text and markup'),
      'group' => t('Misc'),
      'template' => '[?text=test?]',
      'form callback' => 'widgets_template_custom_markup_form',
    ),
  );
 
  return $elements;
}