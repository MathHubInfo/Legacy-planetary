


<div>
	<div class="project-desc-img-<?php echo $view_mode?>" >
	 <?php echo drupal_render($content["field_image"]); ?>
	</div>
	
	<div class="project-desc-desc-<?php echo $view_mode?>" >
	 <?php echo drupal_render($content["field_project_description"]);?>
	</div>


	<div class="project-desc-small-<?php echo $view_mode?>" >
	 <?php echo drupal_render($content["field_project_small_description"]);?>
	</div>
	


	<div class="project-desc-dateandpeople-<?php echo $view_mode?>" >

	<div class="project-desc-people-<?php echo $view_mode?>" >
	 <?php  echo drupal_render($content["my_additional_field"]); ?>
	 <?php  echo drupal_render($content["field_grant_identifier"]); ?>	
	</div>

	<div class="project-desc-date-<?php echo $view_mode?>">	
	 <?php  echo drupal_render($content["field_project_start_date"]); ?>	
	 <?php  echo drupal_render($content["field_project_end_date"]); ?>
	</div> 

	</div>



</div>