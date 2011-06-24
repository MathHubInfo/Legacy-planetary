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

/**
 *
 *
 * !! REQUIRES tIconMenu
**/
(function($){
	
	$.extend($.expr[':'], {
		'tInfoBar'	: function(a){
			return $(a).data('tInfoBar');
		}
	});

	$.tInfoBar = {
		options	: {
			// specify the floating of the bar. Only supported values are left/right
			'position'	: 'right',
			// specify data for the menu animation: time and distance
			'menu'		: 	{ // check tIconMenu.js for info regarding the options
									time 					: 400, 
									distance 			: 40,
									mousePositioning	: false,
									liveBind				: false
								},
			// specify options for the tooltip. You can also modify them later
			'tooltip'	: 	{ // check tTooltip.js for info regarding the options
									position 	: 'left',
									color			: 'blue'
								},
			// specify the elements to which to bind the shoMenu events
			'handle'		: $('.clickable'),
			// associative object of attributes -> values to be added upon infoBar token hover to the elements
			'hoverAttr'	: null,
			// specify the path to the ajax file
			'ajaxFile'	: 'ajax.php',
			// specify the context filter for the IDs in the database if you are using the default ajax file
			'context'	: null
		},	classes	: {
			main			: 'tInfoBar',
			token			: 'tInfoBar-token',
			highlighted	: 'tInfoBar-highlighted',
			wrapper		: 'tInfoBar-wrapper',
			tooltip		: 'tTooltip scheme-blue-left',
			comments		: 'commentHolder',
			clearBoth	: 'clearBoth'
		}, images : {
			ajax			: 'images/ajax.gif'
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
			self		: this,
			// remember the initial selected object
			main		: null,
			// the actual infoBar object
			infoBar	: $(document.createElement('div')).addClass(cls.main),
			// the content wrapper
			wrapper	: null,
			// an object that contains all the items currently being focused on-hover of the infoBar's tokens
			focusObj	: null,
			// an instance of the tIconMenu
			menu 		: new tIconMenu( opt.menu ),
			// an instance of the tTooltip
			tooltip	: new tTooltip( opt.tooltip )
		};
		
		/**
		 * Attaches the bar to an object from the DOM
		 * @param obj the object to whom the bar will be attached
		**/
		this.attach = function(obj){
			com.main = $(obj);
			
			com.main
				.wrapInner( $(document.createElement('div')).addClass(cls.wrapper) )
				.prepend(com.infoBar)
				.append( $(document.createElement('div')).addClass(cls.clearBoth) );
			
			if(com.main.css('position') == 'static') com.main.css('position', 'relative');
			
			com.wrapper = com.main.children().filter('.'+cls.wrapper);
			com.wrapper.css('margin-'+opt.position, com.infoBar.outerWidth() + 3);

			com.infoBar
				.data('tInfoBar', true)
				.data('target', com.wrapper)
				.data('tokenArr', [])
				.css({
					'left'	: opt.position == 'left' ? 0 : 'auto',
					'right'	: opt.position == 'right' ? 0 : 'autp'
				});
			
			var dataPack = { com:com, opt:opt, cls:cls, img:img };
			
			com.self.data = dataPack;
			
			// ---- SETUP ---- //
			setupMenu( dataPack );
			
			// ---- Save for later use ---- //
			
			com.main
				.data('tInfoBar-options', opt)
				.data('tInfoBar-classes', cls)
				.data('tInfoBar-components', com)
				.data('tInfoBar-images', img);
		}
		
		/**
		 * Retrieves the data from the database as JSON and creates the icons in the infoBar
		 * @param href link to the ajax file from where to get the data. By default, opt.ajaxFile is used
		 * @param context The context in which the link is selected from
		**/
		this.getData = function(href, context){
			href		= href || opt.ajaxFile;
			context 	= context || opt.context;
			$.get(href, {
					'action'		: 'getIDs',
					'context'	: context
				}, function(r){
					var res = eval(r);
					for(var i in res){
					   res[i] = res[i].replace(/\./g, '\\\\.');
						com.self.addToken( $('[id="'+res[i]+'"]') );
				   }
			});
		}
		
		/**
		 * Adds a token to the infoBar 
		 * @param obj the object to whom the token will attach itself to. 
		 				If it is a stirng, it will get the id of the element with that id from the specified content
		**/
		this.addToken = function(obj){
		
			if(typeof obj == 'undefined' || obj == null){
					M('tInfoBar.addToken(): obj is null', 'warn');
					return false;
				} else if(typeof obj == 'string') obj = com.main.find('#'+obj);
				
			var t = $(document.createElement('a'));
			t.data('target', obj)
				.addClass( cls.token )
				.append( $(document.createElement('img')).attr('src', img.info) )
				.insertBefore(obj)
				.bind('mouseenter.showInfo', {opt:opt, com:com, cls: cls, show:true}, showInfo)
				.bind('mouseleave.hideInfo', {opt:opt, com: com, cls: cls}, showInfo)
				.attr('title', 'There are some discussions related to the formulas on this row')
				.css('position', 'absolute')
				.offset({ 
					left	: com.infoBar.offset().left + (com.infoBar.outerWidth() - t.width()) / 2 + 1
				});
			obj.data('infoBarIcon', t);
			com.infoBar.data('tokenArr').push(t);
		}
		
		this.getMenu = function(){ return com.menu; };
		this.getTooltip = function(){ return com.tooltip; };
	}
	
	/**
	 * Sets up the tIconMenu
	 * @param data the dataPack containing opt/cls/img/com
	**/
	function setupMenu( data ){
		var opt 		= data.opt;
		var cls		= data.cls;
		var com 		= data.com;
		var menu 	= com.menu.menu();
		var tooltip	= com.tooltip.get();
		
		com.main.prepend( menu );
		
		com.menu.attach( opt.handle, true )
		
		menu
			.append( tooltip )
			.data('tooltip', tooltip )
			.bind('onHideMenu', function(){
				tooltip.hide();
			});
	}
	
	function showInfo(e){
		var opt 	= e.data.opt;
		var cls	= e.data.cls;
		var com 	= e.data.com;
		if(!e.data.show){
				com.focusObj.removeClass(cls.highlighted);
				if(opt.hoverAttr){
					for(var i in opt.hoverAttr) com.focusObj.removeAttr( i );
				}
				
				com.focusObj = null;
			} else {
				var arr 	= com.infoBar.data('tokenArr');
				var top	= $(this).offset().top;
				var obj 	= null;
				for(var i in arr){
					if(arr[i].offset().top == top) {
						if(obj == null) obj = $(arr[i]).data('target');
							else obj = obj.add( $(arr[i]).data('target') );
							
						$(arr[i]).data('target').addClass( cls.highlighted );
						if(opt.hoverAttr) $(arr[i]).data('target').attr( opt.hoverAttr );
					}
				}
				com.focusObj = obj;
			}
	};
	
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
			case "log"		: console.log( obj ); break;
			case "info"		: console.info( obj ); break;
			case "warn"		: console.warn( obj ); break;
			case "error"	: console.error( obj ); break;
		}
	}
}
