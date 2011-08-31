<?php 

  function advanced_books_field_info() {
  	return array(
      'field_counter' => array(
        'label' => t('Book counter'),
        'description' => t('Book chapter counter'),
        'default_widget' => 'field_counter_widget',
        'default_formatter' => 'field_counter_formatter',
  	),
  	);
  }
  
 /**
  * Implements hook_field_is_empty().
  */  
  function advanced_books_field_is_empty($item, $field) {
  	return empty($item['counter_name']);
  }
  
  /**
  * Implements hook_field_formatter_info().
  */
  function advanced_books_field_formatter_info() {
  	return array(
  	// This formatter just displays the hex value in the color indicated.
      'field_counter_formatter' => array(
        'label' => t('Null formatter'),
        'field types' => array('field_counter'),
  	),
  	);
  }
  
  /**
  * Implements hook_field_formatter_view().
  *
  */
  function advanced_books_field_formatter_view($entity_type, $entity, $field, $instance, $langcode, $items, $display) {
  	$element = array();
  
  	switch ($display['type']) {
  		// This formatter simply outputs the field as text and with a color.
  		case 'field_counter_formatter':
  			break;
  	}  
  	return $element;
  }
  
  /**
  * Implements hook_field_widget_info().
  *
  * Three widgets are provided.
  * - A simple text-only widget where the user enters the '#ffffff'.
  * - A 3-textfield widget that gathers the red, green, and blue values
  *   separately.
  * - A farbtastic colorpicker widget that chooses the value graphically.
  */
  function advanced_books_field_widget_info() {
  	return array(
      'field_counter_widget' => array(
        'label' => t('Counter widget'),
        'field types' => array('field_counter'),
  	)
  	);
  }
  
  /**
  * Implements hook_field_widget_form().
  *
  * Three different forms are provided, for the three widget types.
  *
  * The 'field_example_colorpicker' and 'field_example_text' are essentially
  * the same, but field_example_colorpicker adds a javascript colorpicker
  * helper.
  *
  * field_example_3text displays three text fields, one each for red, green,
  * and blue. However, the field type defines a single text column,
  * rgb, which needs an HTML color spec. Define an element validate
  * handler that converts our r, g, and b fields into a simulated single
  * 'rgb' form element.
  */
  function advanced_books_field_widget_form(&$form, &$form_state, $field, $instance, $langcode, $items, $delta, $element) {
  	$value = isset($items[$delta]['counter_name']) ? $items[$delta] : array();
  	$element = array(
      '#delta' => $delta,
      '#type' => "fieldset"
  	);
  	$state = $form_state['input'];
  
  	switch ($instance['widget']['type']) {
  
  		case 'field_counter_widget':
  		   $element['counter_name'] = array(
  		   		"#type" => "textfield",
  		   		"#title" => "Counter name",
  		   		"#default_value" => isset($value["counter_name"])?$value["counter_name"]:"",
  		   );
  		   
  		   $element['counter_parent'] = array(
  		   		"#type" => "select",
  		   		"#title" => "Counter parent",
  		   		"#default_value" => isset($value["counter_parent"])?$value["counter_parent"]:"",
  		   		"#options" => array("No parent")
  		   );
  		   $element['counter_formatter'] = array(
  		   		"#type" => "select",
  		   		"#title" => "Counter formatter",
  		   		"#default_value" => isset($value["counter_formatter"])?$value["counter_formatter"]:"",
  		   		"#options" => array("Arabic", "Roman")
  		   );
  		   if (isset($delta))
  		   	for ($i = 0; $i<$delta; $i++) {
  		   		if (isset($items[$i]["counter_name"])) {
  		   			$element['counter_parent']["#options"][] =$items[$i]["counter_name"];   		   			
  		   		}
  		   	}
  		   break;
  	}
  	return $element;
  }
?>