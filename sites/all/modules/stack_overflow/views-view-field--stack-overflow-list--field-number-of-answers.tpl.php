<?php

/**
 * @file
 * This template is used to print a single field in a view.
 *
 * It is not actually used in default Views, as this is registered as a theme
 * function which has better performance. For single overrides, the template is
 * perfectly okay.
 *
 * Variables available:
 * - $view: The view object
 * - $field: The field handler object that can process the input
 * - $row: The raw SQL result that can be used
 * - $output: The processed output that will normally be used.
 *
 * When fetching output from the $row, this construct should be used:
 * $data = $row->{$field->field_alias}
 *
 * The above will guarantee that you'll always get the correct data,
 * regardless of any changes in the aliasing that might happen if
 * the view is modified.
 */
?>
<?php 


 // Unseen answers processing
	
    $question_id = $row->nid;
    $views_ans = views_get_view("answers_of_a_question");
    $views_ans->set_arguments(array($question_id));
    $views_ans->init();

    $views_ans->execute();
   // dpm($views_ans->result);

    $ans_not_viewed = 0;
    $no_ans = 0;

    foreach($views_ans->result as $res2){
      $no_ans++;
      $id_ans = $res2->nid;
      $ans_visits = node_view_count_count_node_view(node_load($id_ans), $user) ;
      if($ans_visits == 0) $ans_not_viewed++;
    }
    //dpm($no_ans);


 
    if(count($row->field_field_number_of_answers) > 0){
    	print $no_ans;
 		if ($ans_not_viewed > 0) {
 				$datetime_develop = date_create('2013-10-06');
 				//  Apply this only since datetime_develop
 				// We don't want all the previous question to look unread

 				if ($datetime_develop  < date_create('@'.$row->node_created))
 		   			print "<div style='color:red;'><strong>".$ans_not_viewed." new</strong></div>";
 		   	}   	
    }







          









?>