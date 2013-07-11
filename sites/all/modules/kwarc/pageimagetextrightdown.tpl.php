<?php
  drupal_add_css(drupal_get_path("module", "kwarc")."/kwarc.css");
?>


<div>
	<div style="float:right; margin-left: 30px; margin-right: 30px;">
	 <?php echo drupal_render($content["field_image"]); ?>
	</div>
	
	<div style="margin-top: 30px">
	 <?php echo drupal_render($content["field_image_text"]);?>
	</div>
	
	<div style="clear:both; margin-top: 30px; margin-right: 30px; ">
	<div>
	 <?php echo drupal_render($content["body"]); ?>
	</div>

</div>