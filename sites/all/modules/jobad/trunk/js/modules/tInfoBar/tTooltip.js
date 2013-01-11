// Copyright (C) 2010-2011, Planetary System Developer Group. All rights reserved.

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>

var tTooltip = (function(){
	
	var defaults = {
		options :{
			// Pointer position: top, right, left, bottom
			'position'					: 'bottom',
			// Color scheme
			'color'						: 'blue',
			// The content to be inserted into the tooltip
			'html'						: '',
			// Position the tooltip upon creation
			'target'						: null,
			// The name of the CSS class
			'className'					: 'tTooltip',
			// override all other scheme options and use this custom scheme
			// NOTE: for positioning purposes, you should specify a valid position option compliant to the schem
			'scheme'						: null,
			// If you don't modify the position/size of the arrow-pointer in the CSS file, let this enabled
			'useDefaultPositioning'	: true,
			// Custom functions for relative positioning from the origin
			'offset'						: {
				left	: function(object, origin){ return 0; },
				top	: function(object, origin){ return -object.outerHeight() - 10; }
			}
		}
	}
	
	return function(options){
		var opt = {};
		
		$.extend(opt, defaults.options, options);
		var com = {
			// Pointer to self - who knows when you might need it
			self		: this,
			// The actual tooltip element
			tooltip	: $(document.createElement('div'))
		}
		
		this.target = function(obj){
		
			com.tooltip
				.insertAfter( obj )
				.css({
				   position : 'absolute'
				});
			
			this.show();

			if(opt.useDefaultPositioning){
				switch(opt.position){
					case 'top':
						com.tooltip.offset({
							left	: $(obj).offset().left - 24,
							top	: $(obj).offset().top + $(obj).outerHeight() + 15
						});
					break;
					case 'right':
						com.tooltip.offset({
							left	: $(obj).offset().left - $(com.tooltip).outerWidth() - 15,
							top	: $(obj).offset().top - 24
						});
					break;
					case 'bottom':
						com.tooltip.offset({
							left	: $(obj).offset().left - 34,
							top	: $(obj).offset().top - $(com.tooltip).outerHeight() - $(obj).outerHeight() + 15
						});
					break;
					default: case 'left':
						com.tooltip.offset({
							left	: $(obj).offset().left + $(obj).outerWidth() + 15,
							top	: $(obj).offset().top - 24
						});
					break;
				}
			} else {
				com.tooltip.offset({
					left	: $(obj).offset().left + opt.offset.left(com.tooltip, obj),
					top	: $(obj).offset().top + opt.offset.top(com.tooltip, obj)
				});
			}
			
			return this;
		}
		
		this.get		= function(){ return com.tooltip; }
		this.toggle = function(){ com.tooltip.fadeToggle(); }
		this.hide 	= function(){ com.tooltip.fadeOut(); };
		this.show 	= function(){ com.tooltip.fadeIn(); };
		
		setup(opt, com);
		
		return this;
	}
	
	function setup(opt, com){
		com.tooltip
			.attr('class', opt.className + ' ' + scheme(opt))
			.html( opt.html )
			.prependTo($('body'))
		
		com.self.hide();
		
		if(opt.target) com.self.target( opt.target );
	}
	
	function scheme(o){
		return o.scheme ? o.scheme : 'scheme-'+o.color+'-'+o.position;
	}
	
})();


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
			case "log"		: console.log( obj ); break;
			case "info"		: console.info( obj ); break;
			case "warn"		: console.warn( obj ); break;
			case "error"	: console.error( obj ); break;
		}
	}
}
