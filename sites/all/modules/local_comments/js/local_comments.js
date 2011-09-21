
var $ = jQuery;

(function($) {

      return; // TEMPORARY DISABLED!!!
      
      var imgDir = Drupal.extraInfo.baseURL + 'sites/all/modules/local_comments/images/';
      
      infoBar
         .data
         .com
         .menu
         .add( menuItem( 'Create a new local thread', imgDir+'icon_comment.png', {view:'localCommentView'} ), 
            function(e){
		         infoBar.getTooltip().target( $(this) )
         	   infoBar.tooltipView( 'localCommentView' );
		         
		         var menu = infoBar.data.com.menu.menu();
		         var id   = infoBar.data.com.menu.menu().data('source').attr('id');
		         var view = menu.find('#localCommentView');
		         
	            view
		            .find('.'+infoBar.data.cls.comments)
		            .html( $(document.createElement('img')).attr({'src':infoBar.data.img.ajax, 'height':16}) );
	
	            $.get( Drupal.extraInfo.baseURL + 'local_comments/get/' + 
	                     Drupal.extraInfo.node.nid + '/' +
			               menu.data('source').attr('id'),
	               function(r){
			            var h = '<div style="text-align:center"><a href="'+getThreadsLink()+'">View threads</a></div>';
			            for(var i in r)
				            h += '<div class="localComments-thread">' +
				                     '<div class="localComments-subject">' + r[i].subject + '</div>' +
				                     '<div class="localComments-meta">' + r[i].name + '</div>' +
				                 '</div>';

			            view.find('.'+infoBar.data.cls.comments).html( h );
	            });
		         
/*		         var selectedClass = 'discussion-selected';
		         
		         var id         = infoBar.data.com.menu.menu().data('source').attr('id');
		         var textfield  = CKEDITOR ? $(CKEDITOR.instances['edit-comment-body-und-0-value'].document.getBody().$) : $('#edit-comment-body-und-0-value');
		         
		         $('#comments .'+selectedClass).removeClass( selectedClass );
		         $('.discussion-for-'+id.replace(/\./g, '\\.')).addClass( selectedClass );
		         
               $('input[name="eid"]').val( id );
               
               textfield.focus();
               $.scrollTo({
                     top   : $('#comment-body-add-more-wrapper').offset().top - 200, 
                     left  : $('#comment-body-add-more-wrapper').offset().left - 50
                  },
                  1500
               )
               */
		      }, 
		      'local_comments_add'
         )
         .add( 
            menuItem( 'View local threads for this item', imgDir+'icon_comments.png' ),
            function(e){
               e.preventDefault();
               window.location = getThreadsLink();
            }, 
            'local_comments_view'
         );
      
      infoBar
         .setTokenType(
            'localComment', {
               img   : imgDir+'sIcon_comments.png',
               msg   : 'View items with local comments attached'
      });
      
      infoBar
         .data
         .com
         .tooltip
         .get()
         .append( '<table cellspacing="0" cellpadding="0" id="localCommentView" class="tokenView">'+
						   '<tr><td class="'+infoBar.data.cls.comments+'"></td></tr>'+
						   '<tr><td><input type="text" style="width:155px;resize:none" id="localComments_subject" /></td></tr>'+
						   '<tr><td><textarea style="width:155px;resize:none" id="localComments_text" ></textarea></td></tr>'+
						   '<tr><td style="text-align:right">'+
							   '<input type="button" value="Cancel" class="closeMe" />'+
							   '<input type="button" value="Create Thread" id="submitLocalComment" />'+
						   '</td></tr>'+
					   '</table>'
		   )
		   .find('#submitLocalComment')
		   .bind('click.sendMessage', function(){
		      var s       = infoBar.data.com.menu.menu().data('source');
            var id      = s.attr('id');
            var type    = 'localComment';
            
			   $.get( Drupal.extraInfo.baseURL + 'local_comments/add/' +
			            0 + '/' +
			            Drupal.extraInfo.node.nid + '/' + 
      		   	   (id || 'ERROR') + '/' + 
			            escape( $('#localComments_subject').val() ) + '/' + 
			            escape( $('#localComments_text').val() ), 
			      function(r){
					   if( r['result'] === true ){
						   if( !s.data('infoBarIcon') ) infoBar.addToken(s, type);
						   infoBar.data.com.tooltip.get().find('#localComments_subject, #localComments_text').val('');
						   infoBar.data.com.menu.hideMenu();
					   } else M(r.error, 'warn');
			   });
		   });
      
       $("a.local_comments").click(function(e){
          var href = $(this).attr("href");
          if (href) {
            e.preventDefault();
            href = href.slice( href.lastIndexOf('/')+1 );
            var comment = $('#'+href.replace(/\./g, '\\.'));
            $.scrollTo({top:comment.offset().top - 200, left:comment.offset().left}, 1500);
            comment.glow('#FFFF99', 5000);
          } else
        	  return false;
      });
      
	   function menuItem( title, path, attributes ){
	      attributes = attributes || {};
		   return $(document.createElement('a'))
					   .attr({
						   'href'	: 'javascript:void(0)',
						   'class'	: infoBar.data.cls.popItem,
						   'title'	: title
					   })
					   .attr( attributes )
					   .append( 
						   $(document.createElement('img'))
							   .attr({
							      src   : path,
							      alt   : title
							   }) 
					   );
	   }
   
   function getThreadsLink( id ){
      id = id || infoBar.data.com.menu.menu().data('source').attr('id');
      
      return Drupal.extraInfo.baseURL + 'local_comments/showthread/' + Drupal.extraInfo.node.nid + '/' + id;
   }   
   
})(jQuery);
