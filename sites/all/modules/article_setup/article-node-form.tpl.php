<div class="node-add-wrapper clear-block">
    <div class="node-column-main">
        <?php
        global $user;
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
            <?php print render($form['title']);
                  print render($form['field_latex']);
                  // Only display the revision comment if the article has been
                  // "changed" (i.e. saved).
                  if($form['changed']['#value']!='') {
                    print render($form['field_revisioncomment']);
                  } else {
 	            hide($form['field_revisioncomment']);
		  }
                  print render($form['field_mathtype']);
                  print render($form['field_msc']);
                  print render($form['field_parent']);
           ?>
            <?php print render($form['field_section']);
	      // only show the "site doc" field to people with the "admin role"
                  if ((is_array($user->roles)
		       && in_array('administrator', $user->roles))) {
                  print render($form['field_sitedoc']);
		  } else {
		    hide($form['field_sitedoc']);
		  }
                  print render($form['field_published']); 
            // I'm putting the next bit into a div, so that we can later hide/show it
            // like we did with the preamble, to make things simpler for novice users
            // => The "thesaurus" metadata seems like an "advanced" thing
    ?>
            <div class="thesaurus">
            <label href="#" class="show_hide">Show metadata »</label>
            <div class="thesaurus_content">
   	       <i>Defines</i>, <i>Keywords</i>, <i>Related</i>, and <i>Synonym</i> metadata can help people find this article, but are not required.  See the FAQ for more details.
            <?php print render($form['field_defines']);
                  print render($form['field_keywords']);
                  print render($form['field_related']);
                  print render($form['field_synonym']);
            ?>
            </div>
            </div>
            <?php print drupal_render_children($form); ?>
        <?php endif; ?>
    </div>
    <div class="clear"></div>
</div>

<script type="text/javascript">
  (function($){
	   $(document).ready(function(){
	       $('.thesaurus').each(function(){
		   var dataShown =0;
		   var data = $(this);
		   console.log(data);
		   data.find('label.show_hide')
		       .text('Show thesaurus metadata »')
		       .css('color','#06799F')
        	       .css('cursor','pointer');
		   data.find('div').hide;
		   data.find('label.show_hide').click(function(){
		       data.find('div').eq(0).toggle(500,function(){
			   console.log(dataShown);
			   if (dataShown==0){
			       data.find('label.show_hide').text('Show thesaurus metadata »');
			       dataShown=1;
			   } else {
			       data.find('label.show_hide').text('« Hide thesaurus metadata');
			       dataShown=0;
			   }
		       }); 
		   });
});
$('label.show_hide').click();
});
})(jQuery);
</script>
