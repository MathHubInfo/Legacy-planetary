<?php

/**
 * @file fieldset.tpl.php
 * Default template implementation to display the value of a fieldset.
 *
 * @see nucleus_preprocess_fieldset()
 */
?>
<fieldset <?php if (!empty($attributes)) print drupal_attributes($attributes) ?>>
  <?php if (!empty($title)): ?>
    <legend>
      <span class="<?php print $hook ?>-title fieldset-legend">
        <?php print $title ?>
      </span>
    </legend>
  <?php endif; ?>

  <?php if (!empty($content)): ?>
    <div class="<?php print $hook ?>-content fieldset-wrapper clearfix"<?php if (!empty($attributes)) print drupal_attributes($attributes) ?>>
      <?php print $content ?>
    </div>
  <?php endif; ?>
</fieldset>
