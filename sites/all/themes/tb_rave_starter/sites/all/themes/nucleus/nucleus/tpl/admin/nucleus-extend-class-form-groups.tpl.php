<?php

/**
 * @file nucleus-extend-class-form-groups.tpl.php
 * Default theme implementation to display a group in extend class popup.
 * This is only a feature in backend.
 *
 * @see nucleus_create_popup_extend_classes()
 */
?>
<?php foreach ($groups as $group_key => $group): ?>
  <div id="<?php print $group_key;?>-group" class="extend-class-group clearfix">
    <h4 class="popup-title extend-class-group-title"><?php print $group['group_title'];?></h4>
    <?php print $group['classes_content'];?>
  </div>
<?php endforeach; ?>
