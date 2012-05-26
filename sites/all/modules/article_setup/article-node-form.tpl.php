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
   <?php if(db_table_exists('field_user_preamble_value AS preamble')) {
    $preamble = db_query('SELECT field_user_preamble_value AS preamble
    FROM field_data_field_user_preamble 
    WHERE entity_id=' . $user->uid)->fetchObject();
    $preamble = $preamble->preamble;

    if (empty($preamble)) {
        $preamble = '%SITEWIDE DEFAULT SHOULD GO HERE';
    }} else {$preamble = '%SITEWIDE DEFAULT SHOULD GO HERE';}
    ?>

    <script>
// There's probably a "cooler" way to do this.

//remove grippies code
var addNewEvent;

if (document.addEventListener) {
	addNewEvent= function(element, type, handler) {
		element.addEventListener(type, handler, false);
	};
} else if (document.attachEvent) {
	addNewEvent= function(element, type, handler) {
		element.attachEvent("on" + type, handler);
	};
} else {
	addNewEvent= new Function;
}

addNewEvent(window, 'load', RemoveGrippies);

function RemoveGrippies() {

	var objs = document.getElementsByTagName("div");
	var oi = 0;
	var thisObj;

	for (oi = 0; oi != objs.length; oi++) {
		thisObj = objs[oi];
		if (thisObj.className == 'grippie') {
		        thisObj.className = "";
		}
	}

	return;

}
     //end of remove grippies code        
        
        jQuery(document).ready(function(){
	    jQuery('.form-item-field-latex-und-0-metadata').hide();

            jQuery('#edit-field-latex-und-0-preamble').html(<?php
    echo json_encode($preamble);
    ?>);                
        });
        var preambleShown =0;
        jQuery('.form-item-field-latex-und-0-preamble label').text('Show preamble »').
            css('color','#06799F').
            css('cursor','pointer');
        jQuery('#edit-field-latex-und-0-preamble').hide();
	// jQuery('.grippie').remove();
        jQuery('.form-item-field-latex-und-0-preamble label,.grippie').click(function(){
            jQuery('#edit-field-latex-und-0-preamble').toggle(500,function(){
                if (preambleShown==0){
                    jQuery('.form-item-field-latex-und-0-preamble label').text('« Hide preamble');
                    preambleShown=1;
                }else {
                    jQuery('.form-item-field-latex-und-0-preamble label').text('Show preamble »');
                    preambleShown=0;
                }
                //jQuery('.form-item-field-latex-und-0-preamble label').text('Hide preamble');
            });
        });
    
    </script>
    <div class="clear"></div>
</div>
