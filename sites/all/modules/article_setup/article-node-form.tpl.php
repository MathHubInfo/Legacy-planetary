<div class="node-add-wrapper clear-block">
    <div class="node-column-main">
        <?php
        global $user;
        //dd($user);
        ?>
        <?php if ($form): ?>
           <?php if (0!=strcmp("CanonicalName",$form['field_canonicalname']['und'][0]['value']['#default_value'] ) ) :  ?>
              <h3>Canonical Name:
               <?php
                    print l($form['field_canonicalname']['und'][0]['value']['#default_value'], $form['field_canonicalname']['und'][0]['value']['#default_value']);
               ?>
             </h3>
            <?php endif; ?>
            <?php hide($form['field_canonicalname']); ?>
            <?php print drupal_render_children($form); ?>
        <?php endif; ?>
    </div>
    <div class="clear"></div>
</div>
