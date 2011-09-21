_newModule({
   
   info  : {
      'identifier'   : 'tooltip',
      'title'        : 'Tooltip',
      'author'       : 'Stefan Mirea',
      'description'  : 'Provides basic tooltip functionality',
      'dependencies' : []
   },
   
   scripts  : [
      tContextMenu._opt.baseURL + 'js/modules/tooltip/tooltip.css'
   ],
   
   options  : {
		// Pointer position: top, right, left, bottom
		'position'              : 'bottom',
		// Color scheme
		'color'                 : 'blue',
		// The content to be inserted into the tooltip
		'html'                  : '',
		// Position the tooltip upon creation
		'target'                : null,
		// The name of the CSS class
		'className'             : 'tooltip',
		// override all other scheme options and use this custom scheme
		// NOTE                 : for positioning purposes, you should specify a valid position option compliant to the schem
		'scheme'                : null,
		// If you don't modify the position/size of the arrow-pointer in the CSS file, let this enabled
		'useDefaultPositioning' : true,
		// Custom functions for relative positioning from the origin
		'offset'                : {
			left	: function(object, origin){ return 0; },
			top	: function(object, origin){ return -object.outerHeight() - 10; }
		}
   },
   
   com   : {
	   // The actual tooltip element
	   tooltip	: $(document.createElement('div'))
   },
   
   init  : (function(){
      
      return function(){
         
		   this.com.tooltip
			   .attr('class', this.options.className + ' ' + scheme(this.options))
			   .html( this.options.html )
			   .prependTo( $('body') );
		
		   this.hide();
		
		   if(this.options.target) com.self.target( opt.target );
      }
      
	   function scheme(o){
		   return o.scheme ? o.scheme : 'scheme-'+o.color+'-'+o.position;
	   }
	   
   })(),
   
   target   : function(obj, position){
      position = position || this.options.position;

		this.com.tooltip
			.insertAfter( obj )
			.css({
			   position : 'absolute'
			});
		
		this.show();

		if( this.options.useDefaultPositioning ){
			switch( position ){
				case 'top':
					this.com.tooltip.offset({
						left	: $(obj).offset().left - 24,
						top	: $(obj).offset().top + $(obj).outerHeight() + 15
					});
				break;
				case 'right':
					this.com.tooltip.offset({
						left	: $(obj).offset().left - $(this.com.tooltip).outerWidth() - 15,
						top	: $(obj).offset().top - 24
					});
				break;
				case 'bottom':
					this.com.tooltip.offset({
						left	: $(obj).offset().left - 34,
						top	: $(obj).offset().top - $(this.com.tooltip).outerHeight() - $(obj).outerHeight() + 15
					});
				break;
				default: case 'left':
					this.com.tooltip.offset({
						left	: $(obj).offset().left + $(obj).outerWidth() + 15,
						top	: $(obj).offset().top - 24
					});
				break;
			}
		} else {
			this.com.tooltip.offset({
				left	: $(obj).offset().left + this.options.offset.left( this.com.tooltip, obj ),
				top	: $(obj).offset().top + this.options.offset.top( this.com.tooltip, obj )
			});
		}
		
		return this;
	},
	
	set      : function( content ){ 
	   this.com.tooltip.html( content ); 
	   return this; 
	},
	get      : function(){ 
	   return this.com.tooltip; 
	},
	toggle   : function(){ 
	   this.com.tooltip.fadeToggle(); 
	   return this;
	},
	hide     : function(){ 
	   this.com.tooltip.fadeOut(); 
	   return this;
	},
	show 	   : function(){ 
	   this.com.tooltip.fadeIn(); 
	   return this;
	},
	position : function( val ){
	   this.options.position = val;
	},
		
   
   validate : (function(){
      
      return function( event, container ){
         var self    = this;
         var target  = event.target;

         var obj = {};
         $.extend( obj, tContextMenu.templates.moduleOutput, {
            element     : container,
            text        : 'Tooltip',
            description : 'Tooltip options',
            icon        : tContextMenu._opt.baseURL + 'js/modules/icons/tooltip.png',
            smallIcon   : tContextMenu._opt.baseURL + 'js/modules/icons/tooltip_small.png',
            weight      : 90
         });
         
         return null;
      }
      
   })()
   
});
