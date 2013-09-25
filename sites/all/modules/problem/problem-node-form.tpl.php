<div class="node-add-wrapper clear-block">
    <div class="node-column-main">
        <?php
        global $user;
        //dd($user);
        ?>
        <?php if ($form): ?>
            <?php print drupal_render_children($form); ?>
        <?php endif; ?>
    </div>


    <div class="clear"></div>
</div>
