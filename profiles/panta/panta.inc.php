function panta_profile_docreate_field ($machine_name, $bundle, $description) {
  dd("Profile- In panta_profile_docreate_field");
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

function panta_profile_docreate_user_field ($myField_name, $label){

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

function panta_profile_docreate_user_field_long ($myField_name, $label, $desc)
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

function panta_profile_docreate_user_field_long_html ($myField_name, $label, $desc)
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

function panta_profile_docreate_user_buddy_list_field ()
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
