/**
 *
 *
**/

(function($){
   
   $.extend($.expr[':'], {
      'tInfoBar'   : function(a){
         return $(a).data('tInfoBar');
      }
   });

   $.tInfoBar = {
      options   : {
         // specify the floating of the bar. Only supported values are left/right
         position    : 'right',
         // specify data for the menu animation: time and distance
         menu              : { // check tIconMenu.js for info regarding the options
                                 time                 : 400, 
                                 distance             : 40,
                                 mousePositioning     : false,
                                 liveBind             : true
                              },
         // specify options for the tooltip. You can also modify them later
         tooltip           :  { // check tTooltip.js for info regarding the options
                                 position : 'left',
                                 color    : 'blue'
                              },
         // specify the elements to which to bind the showMenu events
         handle            : $('.clickable'),
         // associative object of attributes -> values to be added upon infoBar token hover to the elements
         hoverAttr         : null,
         // whether to use absolute positioning for tokens and refresh it every time the window resizes or leave it to the CSS to decide
         hardPositioning   : false,
         // specify the token types. By default, only the 'info' token type is defined
         tokenTypes        : {
            info  : {
               img   : 'images/sIcon_info.png',
               msg   : 'Click to expand'
            }
         }
      },   classes   : {
         main           : 'tInfoBar',
         token          : 'tInfoBar-token',
         highlighted    : 'tInfoBar-highlighted',
         wrapper        : 'tInfoBar-wrapper',
         tooltip        : 'tTooltip scheme-blue-left',
         comments       : 'commentHolder',
         clearBoth      : 'clearBoth'
      }, images : {
         ajax  : 'images/ajax.gif'
      }
   };
   
})(jQuery);

/**
 *
 *
**/
var tInfoBar = (function(){
   
   return function(options, classes, images){
      
      var opt = {};
      var cls = {};
      var img = {};
      $.extend(true, opt, $.tInfoBar.options, options);
      $.extend(true, cls, $.tInfoBar.classes, classes);
      $.extend(true, img, $.tInfoBar.images, images);
      
      // Preload all images used
      simplePreloader( img );
      
      // Define components
      var com = {
         // remember a selector to self
         self           : this,
         // remember the initial selected object
         main           : null,
         // the actual infoBar object
         infoBar        : $(document.createElement('div')).addClass(cls.main),
         // the content wrapper
         wrapper        : null,
         // an object that contains all the items currently being focused on-hover of the infoBar's tokens
         focusObj       : null,
         // an object of timers and their properties
         timers         : {
            position : {
               timeout     : 100,
               timer       : null,
               window      : $(window),
               windowSize  : $(window).width()
            }
         },
         menu           : null,
         // an instance of the tTooltip
         tooltip        : new tTooltip( opt.tooltip ),
         // the menu to be used to hold the tokens
         tokenMenu      : new tIconMenu({
            distance : 30
         })
      };
      
      /**
       * Attaches the bar to an object from the DOM
       * @param obj the object to whom the bar will be attached
      **/
      this.attach = function( obj ){
         com.main = $(obj);
         
         com.main
            .wrapInner( $(document.createElement('div')).addClass(cls.wrapper) )
            .prepend( com.infoBar )
            .append( $(document.createElement('div')).addClass(cls.clearBoth) );
         
         if(com.main.css('position') == 'static') com.main.css('position', 'relative');
         
         com.wrapper = com.main.children().filter('.'+cls.wrapper);
         com.wrapper.css('margin-'+opt.position, com.infoBar.outerWidth() + 3);

         com.infoBar
            .data('tInfoBar', true)
            .data('target', com.wrapper)
            .data('tokenArr', [])
            .css({
               'left'   : opt.position == 'left' ? 0 : 'auto',
               'right'   : opt.position == 'right' ? 0 : 'auto'
            });
         
         com.main.prepend( com.tooltip );
         $('body').prepend( com.tokenMenu.menu() );
         
         var dataPack = { com:com, opt:opt, cls:cls, img:img };

         com.self.data = dataPack;
         
         // ---- SETUP ---- //
         setupMenu( dataPack );
         
         if( opt.hardPositioning ){
            com.timers
               .position
               .window
               .resize(function() {
                  if( com.timers.position.window.width() != com.timers.position.windowSize && com.infoBar.data('tokenArr').length > 0 ){
                     clearTimeout( com.timers.position.timer );
                     com.timers.position.windowSize = com.timers.position.window.width();
                     com.timers.position.timer = setTimeout(
                        function(){
                           var pos = com.infoBar.offset().left + (com.infoBar.outerWidth() - com.infoBar.data('tokenArr')[0].width()) / 2 + 1;
                           console.log( com.infoBar.offset().left, com.infoBar.outerWidth(), com.infoBar.data('tokenArr')[0].width() );
                           for( var i in com.infoBar.data('tokenArr') )
                              com.infoBar.data('tokenArr')[i].offset({ left: pos });
                        }, 
                        com.timers.position.timeout
                     );
                  }
               });
         }
         
         // ---- Save for later use ---- //
         
         com.main
            .data('tInfoBar-options', opt)
            .data('tInfoBar-classes', cls)
            .data('tInfoBar-components', com)
            .data('tInfoBar-images', img);
      }
            
      /**
       * Adds a token to the infoBar 
       * @param obj the object to whom the token will attach itself to. 
                   If it is a string, it will get the id of the element with that id from the specified content
      **/
      this.addToken = function(obj, type){
      
         if(typeof obj == 'undefined' || obj == null){
               M('tInfoBar.addToken(): obj is null', 'warn');
               return false;
            } else if(typeof obj == 'string') obj = com.main.find('#'+obj);
         
         type = type && opt.tokenTypes[ type ] ? type : 'info'; 
         var token = opt.tokenTypes[ type ];
         
         var t = $(document.createElement('a'));
         t.data('target', obj)
            .data('type', type)
            .addClass( cls.token )
            .append( $(document.createElement('img')).attr({src: img.info, alt: '(!)'}) )
            .attr('title', opt.tokenTypes.info.msg )
            .insertBefore(obj)
            .css({
               position : 'absolute',
               right    : '5px'
            })
            .bind('mouseenter.showInfo', {opt:opt, com:com, cls: cls, show:true}, showInfo)
            .bind('mouseleave.hideInfo', {opt:opt, com: com, cls: cls}, showInfo)
            .bind('click.showTokens', {opt:opt, com: com, cls: cls}, showTokens);
         
         if( opt.hardPositioning ){
            t.css('position', 'absolute');
            com.self.positionToken( t );
         }
            
         obj.data('infoBarIcon', t);
         com.infoBar.data('tokenArr').push( t );
         return true;
      };
      
      this.setTokenType = function( type, value ){
         opt.tokenTypes[ type ] = value;
         return this; 
      };
      
      this.positionToken = function( token ){
         token.offset({
            left  : com.infoBar.offset().left + (com.infoBar.outerWidth() - token.width()) / 2 + 1
         });
      };
      
      this.getMenu = function(){ return com.menu; };
      
      this.getTooltip = function(){ return com.tooltip; };
      
      this.getTokensAt = function( top, type ){
         var arr    = com.infoBar.data('tokenArr');
         var obj    = $();

         for(var i in arr){
            if( arr[i].offset().top == top )
               if( !type || (type && arr[i].data('type') == type) )
                  obj = obj.add( $(arr[i]) );
         }
         
         return obj;
      }
   }
   
   /**
    * Sets up the tIconMenu
    * @param data the dataPack containing opt/cls/img/com
   **/
   function setupMenu( data ){
      var opt     = data.opt;
      var cls     = data.cls;
      var com     = data.com;
      var menu    = com.menu.menu();
      var tooltip = com.tooltip.get();
      
      com.main.prepend( menu );
      
      com.menu.attach( opt.handle, true )
      
      menu
         .append( tooltip )
         .data('tooltip', tooltip )
         .bind('onHideMenu', function(){
            tooltip.hide();
            com.tokenMenu.hideMenu();
         });
   }
   
   function showInfo( e, type ){
      var opt  = e.data.opt;
      var cls  = e.data.cls;
      var com  = e.data.com;
      if(!e.data.show){
            com.focusObj.removeClass(cls.highlighted);
            if(opt.hoverAttr){
               for(var i in opt.hoverAttr) com.focusObj.removeAttr( i );
            }
            
            com.focusObj = null;
         } else {
            var obj        = com.self.getTokensAt( e.data.top ? e.data.top : $(this).offset().top, e.data.type );
            com.focusObj   = $();
            obj.each(function(){ com.focusObj = com.focusObj.add( $(this).data('target') ); });
            com.focusObj.addClass( cls.highlighted );
            if(opt.hoverAttr) com.focusObj.attr( opt.hoverAttr );
         }
   };
   
   function showTokens( e ){
   
      e.stopPropagation();
   
      var opt  = e.data.opt;
      var cls  = e.data.cls;
      var com  = e.data.com;
      
      var count = {};
      
      var top  = $(this).offset().top;
      var obj  = com.self.getTokensAt( top );
      obj.each( function(){
         if( !count[ $(this).data('type') ] )
            count[ $(this).data('type') ] = 0;
         ++count[ $(this).data('type') ];
      });
      
      com.tokenMenu.clear();
      
      var h = $();
      for( var i in count )
         com.tokenMenu
            .add(
               $(document.createElement('a'))
				      .attr({
					      'href'	: 'javascript:void(0)',
					      'class'	: cls.popItem,
					      'title'	: opt.tokenTypes[i].msg
				      })
				      .data('type', i)
				      .addClass( cls.token )
				      .append( $(document.createElement('img')).attr({ 'src' : opt.tokenTypes[i].img, 'alt' : '('+i+')' }) )
                  .bind('mouseenter.showInfo', {opt:opt, com:com, cls: cls, show:true, top:top, type:i}, showInfo)
                  .bind('mouseleave.hideInfo', {opt:opt, com: com, cls: cls}, showInfo),
		         null,
		         i
            );
            
      com.tokenMenu.showMenu( e, $(this) );
      M(com.tokenMenu);
   }
   
})();

/**
 * A rudimentary image preloader
 * @param arr an array of paths to images to load
**/
function simplePreloader(arr){
   if(typeof arr == 'undefined' || arr == null || arr.length < 1) return false;
   for(var i in arr){
      var img = document.createElement('img');
      document.body.appendChild(img);
      img.src = arr[i];
      img.style.display = 'none';
   }
}

/**
 * Global debug function. Checks if firebug is initialized and uses its console.
 * It is degradable (checks forst if console exists so no errors occur when firebug is turned off)
 * @param obj the thing to print
 * @param type the type of logging: log, info, warn, error
**/
function M(obj, type){
   type = type ? type : "log";
   if(typeof console != 'undefined' && console != null){
      switch(type){
         case "log"     : console.log( obj ); break;
         case "info"    : console.info( obj ); break;
         case "warn"    : console.warn( obj ); break;
         case "error"   : console.error( obj ); break;
      }
   }
}
