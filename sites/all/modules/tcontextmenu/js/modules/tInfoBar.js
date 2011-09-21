_newModule({
   
   info  : {
      'identifier'   : 'tInfoBar',
      'title'        : 'Info Bar',
      'author'       : 'Stefan Mirea',
      'description'  : 'Adds Info Bar functionality to the container',
      'dependencies' : ['tooltip']
   },
   
   scripts : [
      tContextMenu._opt.baseURL + 'js/modules/tInfoBar/tInfoBar.css'
   ],
   
   options  : {
      main              : $(document.body),
      position          : 'right',
      // whether to use absolute positioning for tokens and refresh it every time the window resizes or leave it to the CSS to decide
      hardPositioning   : false,
      // specify the token types. By default, only the 'info' token type is defined
      tokenTypes        : {
         standard  : {
            img   : tContextMenu._opt.baseURL + 'js/modules/tInfoBar/images/standard.png',
            msg   : 'Click to expand'
         }
      }
   },
   
   init : (function(){
      
      return function(){
      
         var opt = this.options;
         var cls = {
            main           : 'tInfoBar',
            token          : 'tInfoBar-token',
            highlighted    : 'tInfoBar-highlighted',
            wrapper        : 'tInfoBar-wrapper',
            tooltip        : 'tTooltip scheme-blue-left',
            comments       : 'commentHolder',
            clearBoth      : 'clearBoth'
         };
         
         var com = {
            // remember a selector to self
            self           : this,
            // remember the initial selected object
            main           : opt.main,
            // the actual infoBar object
            infoBar        : $(document.createElement('div')),
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
            // the menu to be used to hold the tokens
            tokenMenu      : null
         };

         com.main
            .wrapInner( $(document.createElement('div')).addClass(cls.wrapper) )
            .prepend( com.infoBar )
            .append( $(document.createElement('div')).addClass(cls.clearBoth) );
         
         if(com.main.css('position') == 'static') 
            com.main.css('position', 'relative');
         
         com.wrapper = com.main.children().filter('.'+cls.wrapper);

         com.infoBar
            .data('tInfoBar', true)
            .data('target', com.wrapper)
            .data('tokenArr', [])
            .addClass(cls.main)
            .css({
               'left'   : opt.position == 'left' ? 0 : 'auto',
               'right'  : opt.position == 'right' ? 0 : 'auto'
            });
         
         var dataPack = { com:com, opt:opt, cls:cls };

         // ---- SETUP ---- //
         
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
                           for( var i in com.infoBar.data('tokenArr') )
                              com.infoBar.data('tokenArr')[i].offset({ left: pos });
                        }, 
                        com.timers.position.timeout
                     );
                  }
               });
         }
         
         this._opt = opt;
         this._cls = cls;
         this._com = com;
      
      }
      
   })(),
   
   /**
    * Adds a token to the infoBar 
    * @param obj the object to whom the token will attach itself to. 
                If it is a string, it will get the id of the element with that id from the specified content
   **/
   addToken : (function(){
      return function(obj, type){
         
         var opt = this._opt;
         var cls = this._cls;
         var com = this._com;
         
         if(typeof obj == 'undefined' || obj == null){
               console.warn('tInfoBar.addToken(): obj is null');
               return false;
            } else if(typeof obj == 'string') obj = com.main.find('#'+obj);
         
         type = type && opt.tokenTypes[ type ] ? type : 'standard'; 
         var token = opt.tokenTypes[ type ];
         console.log( this.options.tokenTypes );
         var t = $(document.createElement('a'));
         t.data('target', obj)
            .data('type', type)
            .addClass( cls.token )
            .append( $(document.createElement('img')).attr({src: this.options.tokenTypes.standard.img, alt: '(!)'}) )
            .attr('title', opt.tokenTypes.standard.msg )
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
            
         $(obj).data('infoBarIcon', t);
         com.infoBar.data('tokenArr').push( t );
         return true;
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
         
         tContextMenu.hide();
         
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
      }
   })(),
   
   setTokenType   : function( type, value ){
      opt.tokenTypes[ type ] = value;
      return this; 
   },
   
   positionToken  : function( token ){
      token.offset({
         left  : com.infoBar.offset().left + (com.infoBar.outerWidth() - token.width()) / 2 + 1
      });
   },
   
   getTokensAt : function( top, type ){
      var arr    = this._com.infoBar.data('tokenArr');
      var obj    = $();

      for(var i in arr){
         if( arr[i].offset().top == top )
            if( !type || (type && arr[i].data('type') == type) )
               obj = obj.add( $(arr[i]) );
      }
      
      return obj;
   },
   
   validate : (function(){
      
      return function( event, container ){
         var target = event.target;
         var self = this;

         var obj = {};
         $.extend( obj, tContextMenu.templates.moduleOutput, {
            element     : container,
            text        : 'tInfoBar',
            description : 'tInfoBar settings',
            icon        : tContextMenu._opt.baseURL + 'js/modules/icons/tInfoBar.png',
            smallIcon   : tContextMenu._opt.baseURL + 'js/modules/icons/tInfoBar_small.png',
            weight      : 0
         });
         
//         this.addToken( target );
         
         return obj;
      }
      
   })()
   
});
