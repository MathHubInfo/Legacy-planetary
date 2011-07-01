
var $ = jQuery;

$(function() {
      
      var imgDir = '/sites/all/modules/local_comments/images/';
      
      infoBar
         .data
         .com
         .menu
         .add(
            $(document.createElement('a'))
				   .attr({
					   'href'	: 'javascript:void(0)',
					   'class'	: infoBar.data.cls.popItem,
					   'title'	: 'Add a local comment'
				   })
				   .append( 
					   $(document.createElement('img'))
						   .attr({
						      'src' : imgDir+'icon_comments.png',
						      'alt' : 'Local Comment'
						   }) 
				   )
		      , function(e){
		         
		         var selectedClass = 'discussion-selected';
		         
		         var id         = infoBar.data.com.menu.menu().data('source').attr('id');
		         var textfield  = CKEDITOR ? $(CKEDITOR.instances['edit-comment-body-und-0-value'].document.getBody().$) : $('#edit-comment-body-und-0-value');
		         
		         $('#comments .'+selectedClass).removeClass( selectedClass );
		         $('.discussion-for-'+id).addClass( selectedClass );
		         
		         
               $('#edit-eid').val( id );
               
               textfield.focus();
               $.scrollTo({
                     top   : $('#comment-body-add-more-wrapper').offset().top - 200, 
                     left  : $('#comment-body-add-more-wrapper.offset().left - 50
                  },
                  1500
               )
		      }, 'local_comments'
         );
      
      infoBar
         .setTokenType(
            'localComment', {
               img   : imgDir+'sIcon_comments.png',
               msg   : 'View items with local comments attached'
      });
      
       $("a.local_comments").click(function(e){
          var href = $(e.target).attr('href');
          if (href) {
            e.preventDefault();
            $.scrollTo({top:$(href).offset().top - 200, left:$(href).offset().left}, 1500);
            $(href).glow('#FFFF99', 5000);
          }
      });

});
