
var $ = jQuery;
var infoBar;

$(function(){

	$.extend($.expr[':'], {
		math : function(a){
			return a.nodeName.toLowerCase() == 'm:math' || a.nodeName.toLowerCase() == 'math';
		},
		mrow : function(a){
			return a.nodeName.toLowerCase() == 'm:row';
		},
		contextPoint : function(a){
			return !!$(a).data('contextPoint');
		}
	});
   
   var content = $('.node').eq(0); 
   
	var imgDir  = Drupal.extraInfo.root + 'sites/all/modules/tinfobar/images/';
   var c = 0;
   $('b, u, i').each(function(){
      $(this).attr('id', 'UID_'+(++c));
   });
   
   infoBar = new tInfoBar({
			handle		      : $(':math, p[id], .omdoc-image[id], .MathJax_Display', content),
//			handle		      : $('b, u, i', content),
			context		      : getContext(),
			hardPositioning   : true,
			hoverAttr	      : {
				mathbackground	: 'yellow'
			},
			menu			      : {
				liveBind				: true,
				distance				: 45,
				mousePositioning	: true
			},
			tooltip		      : {
//				scheme	: 'scheme-simple-left',
				position	: 'left'
			},
			tokenTypes        : {
			   info  : {
			      img   : imgDir+'sIcon_info.png',
			      msg   : 'Click to expand'
			   },
/*			   comment  : {
			      img   : imgDir+'sIcon_comment.png',
			      msg   : 'Highlight words with comments'
			   },*/
			   error    : {
			      img   : imgDir+'sIcon_bug.png',
			      msg   : 'Show all error type comments on this row'
			   }
			}
		}, null, {		// redefine path to images
			ajax				: imgDir+'ajax.gif',
			info				: imgDir+'sIcon_info.png',
			bug				: imgDir+'icon_bug.png',
			comment			: imgDir+'icon_comment.png'
			
		}
	);
	
	infoBar.attach( content );

   $.get( '?q=tInfoBar/getTokens/'+getContext(),
      function(r){
         for( var i in r )
            infoBar.addToken( $("[id='"+r[i].wordID+"']"), r[i].type );
   });

   var opt 	= infoBar.data.opt;
   var cls 	= infoBar.data.cls;
   var img 	= infoBar.data.img;
   var com 	= infoBar.data.com;
   
   var menu    = com.menu.menu();
   var tooltip = com.tooltip.get();
	
	iconMenu_setup( infoBar );

   /**********************\
   |** Helper Functions **|
   \**********************/

   function iconMenu_setup( infoBar ){
	
	   com.menu
//		   .add( menuItem('Ask a question', img.comment), null, 'question')
		   .add( menuItem('Report an error', img.bug), null, 'error')
	   ;
	
	   tooltip
		   .html(	'<table cellspacing="0" cellpadding="0" id="questionView" class="tokenView">'+
						   '<tr><td class="'+cls.comments+'"></td></tr>'+
						   '<tr><td><textarea style="width:155px;resize:none"></textarea></td></tr>'+
						   '<tr><td style="text-align:right">'+
							   '<input type="button" value="Cancel" class="closeMe" />'+
							   '<input type="button" value="Submit" class="submit" />'+
						   '</td></tr>'+
					   '</table>'
		   ).hide()
		   .find('.closeMe')
		   .bind('click.closeMe', function(){ com.tooltip.hide(); })
		   .end()
		   .find('.submit')
		   .bind('click.sendMessage', function(){
			   var s 		= menu.data('source');
            
            var context = getContext();
            var type    = menu.data('source-type');
            
			   $.get( '?q=tInfoBar/add/' + 
			            type + '/' +
      		   	   (s.attr('id') || 'ERROR') + '/' + 
			            context + '/' + 
			            GI('username') + '/' + 
			            escape( tooltip.find('textarea').eq(0).val() ), 
			      function(r){
					   if(r['result'] == 'true'){
						   if(!s.data('infoBarIcon')) com.self.addToken(s, type);
						   tooltip.find('textarea').eq(0).val('');
						   com.menu.hideMenu();
					   } else M(r, 'error');
			   });
		   });
		
	   menu.append( tooltip )
		   .data('tooltip', tooltip)
		   .bind('onHideMenu', function(){
			   menu.data('tooltip').hide();
		   });
	
/*	   com.menu
		   .get('question')
		   .bind('click.questionToken', { type:'comment' }, getItems ); */
		
      com.menu
         .get('error')
         .bind('click.errorToken', { type:'error' }, getItems );
			
	   /** Inner Functions defined bellow **/
	   function menuItem(title, path){
		   return $(document.createElement('a'))
					   .attr({
						   'href'	: 'javascript:void(0)',
						   'class'	: cls.popItem,
						   'title'	: title
					   })
					   .append( 
						   $(document.createElement('img'))
							   .attr({
							      src   : path,
							      alt   : title
							   }) 
					   );
	   }
   }

   function getItems( e ){
      
      var type = e.data.type;
      
	   infoBar.getTooltip().target( $(this) );
	
	   menu
	      .data('source-type', type)
		   .find('.'+cls.comments)
		   .html( $(document.createElement('img')).attr({'src':img.ajax, 'height':16}) );
	
	   $.get( '?q=tInfoBar/get/' + 
	            type + '/' +
			      menu.data('source').attr('id') + '/' + 
			      getContext(), 
	      function(r){
			   var h = '';
			   for(var i in r)
				   h += '<div><b>'+r[i].user+'</b>: '+r[i].text+'</div>';

			   menu.find('.'+cls.comments).html(h);
	   });
   }

   function getContext(){
      return GI('nodeId');
   }

   /** Get global info script **/
   function GI( name ){
      var wrapper = 'tInfoBar_info';
      var prefix  = 'info_';
      return $('#'+wrapper).find('#'+prefix+name).html();
   }

});
