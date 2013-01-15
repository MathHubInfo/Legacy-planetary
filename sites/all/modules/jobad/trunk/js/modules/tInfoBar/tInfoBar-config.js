
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

	var imgDir  = Drupal.extraInfo.baseURL + 'sites/all/modules/tinfobar/images/';

 /*
   var c = 0;
   $('p, b, u, i').each(function(){
      $(this).attr('id', 'UID_'+(++c));
   });
// */

   var infoBar_options = {
		handle		      : null,
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
	}

	var infoBar_classes = {};

   var infoBar_images = { // redefine path to images
		ajax				: imgDir+'ajax.gif',
		info				: imgDir+'sIcon_info.png',
		bug				: imgDir+'icon_bug.png',
		comment			: imgDir+'icon_comment.png'
	}

   if( $.browser.mozilla ){
      infoBar_options.handle = $('p[id], :math, .omdoc-image[id]', content);
      setup_infoBar();
   } else {
      infoBar_options.handle = $('p[id], .math, .omdoc-image[id]', content);
/*      if( MathJax )
         MathJax.Hub.Queue( setup_infoBar );
      else */
         setup_infoBar();
   }

   var opt;
   var cls;
   var img;
   var com;
   var menu;
   var tooltip;


   /**********************\
   |** Helper Functions **|
   \**********************/

   function setup_infoBar(){

//      infoBar_options.handle = infoBar_options.handle.add( $('b, u, i', content) );
//      infoBar_options.handle = $('p, b, u, i', content);

      infoBar = new tInfoBar( infoBar_options, infoBar_classes, infoBar_images );

	   infoBar.attach( content );

      $.get( '?q=tInfoBar/getTokens/'+getContext(),
         function(r){
            for( var i in r )
               infoBar.addToken( $("[id='"+r[i].wordID+"']"), r[i].type );
      });

      opt 	= infoBar.data.opt;
      cls 	= infoBar.data.cls;
      img 	= infoBar.data.img;
      com 	= infoBar.data.com;

      menu    = com.menu.menu();
      tooltip = com.tooltip.get();

	   iconMenu_setup( infoBar );

	   infoBar.tooltipView = function( view ){
	      tooltip.find('.tokenView').hide();
	      tooltip.find('#'+view).show();
	   }

   }

   function iconMenu_setup( infoBar ){

	   com.menu
		   .add( menuItem('Report an error', img.bug, {view:'commentView'}), null, 'error');

	   tooltip
		   .html(	'<table cellspacing="0" cellpadding="0" id="commentView" class="tokenView">'+
						   '<tr><td class="'+cls.comments+'"></td></tr>'+
						   '<tr><td><textarea style="width:155px;resize:none"></textarea></td></tr>'+
						   '<tr><td style="text-align:right">'+
							   '<input type="button" value="Cancel" class="closeMe" />'+
							   '<input type="button" value="Submit" class="submit" />'+
						   '</td></tr>'+
					   '</table>'
		   ).hide()
		   .find('.closeMe')
		   .live('click.closeMe', function(){ com.tooltip.hide(); })
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

	   menu
	      .append( tooltip )
		   .data('tooltip', tooltip)
		   .data('lastSelection', $())
		   .data('lastSelectionCSS', $())
		   .bind('onShowMenu-before', function( e, origin ){
/*		      var lscss = menu.data('lastSelectionCSS');
            menu
		         .attr( 'mathbackground', lscss.mathbackground );
		         
		      menu.data('lastSelectionCSS', {
		         mathbackground : $(origin.target).attr('mathbackground')}
		      );
		      */
		      menu.data('lastSelection').removeClass( 'tInfoBar-selected' );
		      menu.data('lastSelection', $(origin.target));
		      $(origin.target).addClass( 'tInfoBar-selected' );
		   })
		   .bind('onHideMenu', function(){
		   /*
		      var lscss = menu.data('lastSelectionCSS');
		      menu.data('lastSelection')
		         .removeClass( 'tInfoBar-selected' )
		         .attr( 'mathbackground', lscss.mathbackground );
		     */    
			   menu.data('tooltip').hide();
		   });

      com.menu
         .get('error')
         .bind('click.errorToken', { type:'error' }, getItems );

	   /** Inner Functions defined bellow **/
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
   }

   function getItems( e ){

      var type = e.data.type;

	   infoBar.getTooltip().target( $(this) );
   	infoBar.tooltipView( 'commentView' );

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
