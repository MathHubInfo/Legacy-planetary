<?php

/**
 * @file nucleus-extend-class-form-classes.tpl.php
 * Default theme implementation to display a extend class in extend class popup .
 * This is only a feature in backend.
 *
 * @see nucleus_create_popup_extend_classes()
 */
?>
<div id="popup-empty-class" class="extend-class-content">
  <label>
    <input type="radio" name="<?php print $group;?>-radio" class="popup-empty-radio" id="group-<?php print $group;?>-empty-radio" value=""/>
    <?php print t('Not use this group');?>
  </label>
</div>

<?php foreach ($classes as $class_key => $class_title): ?>
  <div id="popup-<?php print $class_key;?>-class" class="extend-class-content">
    <label>
      <input type="radio" name="<?php print $group;?>-radio" class="popup-<?php print $class_key;?>-radio" id="group-<?php print $group;?>-<?php print $class_key;?>-radio" value="<?php print $class_key;?>"/>
      <?php print $class_title;?>
    </label>
  </div>
<?php endforeach; ?>
