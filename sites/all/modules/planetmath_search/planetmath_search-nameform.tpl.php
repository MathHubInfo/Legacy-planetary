<?php

/*
 * @file 
 * This is the template file for rendering the form
 */
  
?>

<div class="container-inline" style="float: right;  text-align: right;">
  <?php if (empty($variables['form']['#block']->subject)): ?>
    <h2 class="element-invisible"><?php print t('Search form'); ?></h2>
  <?php endif; ?>
  <?php print $planetmath_search_nameform_form; ?>
</div>
