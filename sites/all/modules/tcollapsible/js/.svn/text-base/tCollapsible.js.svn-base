/**
 * tCollapsible - jQuery Mathematica-like Content Collapsible Plugin
 * Developed by: Stefan Mirea
 * Contact: steven.mirea@gmail.com
 *
 * Contains a wrapper plugin: tLoadable
**/

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

(function($){
	
	$.extend($.expr[':'], {
		tLoadable : function(a){
			return !!$(a).data('tLoadable');
		},
		contextPoint : function(a){
			return !!$(a).data('contextPoint');
		}
	});
	
	$.tLoadable = {
		// whether or not to re-apply the tLoadable selection upon the new elements of the loaded content
		recursive		: false,
		// override the default href of the link
		href				: null,
		// path to a loading image
		ajaxImage		: 'images/ajax.gif',
		// whether to show the content upon loading or toggle it
		hideOnLoad		: true,
		// options to specify for the tCollapsible function
		tCollapsible	: {},
		// whether to use the text of the link you clicked as the title, and remove the link
		linkAsTitle		: false,
		// execute a function when content has finished loading. Takes as parameter the components object
		onLoad			: null
	};

	/**
	 * jQuery().tLoadable(options)
	 * This is an application of the tCollapsible plugin.
	 * Apply tLoadable to a Link element and once that link is clicked, this plugin
	 * will get the contents of its href and paste it into a new tCollapsible element.
	 * The link also becomes a second handler for the tCollapsible content
	 * NOTE: To avoid javascript origin error, specify absolute hrefs to your links
	**/
	$.fn.tLoadable = function(options){
		
		var opt = {};
		$.extend(opt, $.tLoadable, options);
		
		if(opt.linkAsTitle) opt.tCollapsible.blockTitle = null;
		
		opt.selector = this.selector;
		
		return this.each(function(){
			
			var com = {
				// a dummy div that will be initialized with tCollapsible
				content	: null,
				// link to the tCollapsible's handle
				handle 	: null,
				// the link from where the content was retrieved
				origin	: null
			};
			
			/*
			$(this)
				.css('background', 'yellow');
			$(this)
				.children()
				.css('background', 'yellow');
			$(this).find('p').prepend('<span style="background:yellow">[+]</span> ');
			*/
			
			$(this).bind('click.load', function(e){
				e.preventDefault();
		
				var x = $(this);
				
				if(x.data('tLoadable')){
				
					x.data('tLoadable-com').handle.trigger('click.toggleState');
					
				} else {
					com.origin = opt.href ? opt.href : x.attr('href');
					
					com.content = $(document.createElement('div'));
					com.content
						.attr('origin', com.origin)
						.data('contextPoint', true)
						.append($(document.createElement('img')).attr({'src':opt.ajaxImage, 'height':18}));
					
					x.after(com.content);
					
					$.get(com.origin, function(r){
						
						if(opt.linkAsTitle) {
							opt.tCollapsible.defaultTitle = x.html();
							x.hide();
						}
						
						com.handle = com.content
							.html(r)
							.tCollapsible(opt.tCollapsible);
							
						if(opt.hideOnLoad){
							com.handle
								.data('tCollapsible-com')
								.handle
								.trigger('click.toggleState', [1]);
						}
						
						x.data('tLoadable', true)
							.data('tLoadable-opt', opt)
							.data('tLoadable-com', com);
						
						if(opt.recursive) $(opt.selector, com.content).tLoadable(options);
						
						if(typeof opt.onLoad == 'function') opt.onLoad(x, com);
						x.trigger('onContentLoad', [com]);
					});
				}
					
		
			});
			
		});
		
	}
	
})(jQuery);

(function($){
	
	$.fn.disableTextSelect = function() {
		/** jqueryElement.disableTextSelect() -> disables the highlighting of text. I personally find it very annoying and like to disable it.
				You can disable the feature when setting up a menu if you want.
		*/
		return this.each(function(){
			if($.browser.mozilla) $(this).css('MozUserSelect','none');
			else if($.browser.msie) $(this).bind('selectstart',function(){return false;});
			else $(this).mousedown(function(){return false;});
		});
	};	
	
	// create custom selectors for our items
	$.extend($.expr[':'], {
		tCollapsible : function(a){
			return !!$(a).data('tCollapsible');
		},
		collapsed : function(a){
			return !!$(a).data('collapsed');
		}
	});
	
	$.tCollapsible = {
		options	: {
			// enable this to wrap around non-display:block elements
			forceWrap		: true,
			// enable this so that the wrapper will take the margins of the content it wraps
			swapMargins		: false,
			// By default, any element will be wrapped in a table with fluid width. Override that
			width				: null,
			// Mouse over function (on handle)
			handleOver		: null,
			// Mouse out function (on handle)
			handleOut		: null,
			// jQuery selector for title tags. If null, will use a part of the text as title when collapsing
			blockTitle		: ' > h4',
			// If the above is null or empty, the one bellow will be used
			defaultTitle	: 'Click to expand...',
			// Whether to perform a on-hover effect on the handle or not. Must provide a string suffix if true
			handleSwap 		: '-2',
			// whether or not to toggle a class upon the content on hover
			focusContent 	: false
		},	classes	: {
			main					: 'tCollapsible',
			handle				: 'tCollapsible-handle',
			handleT				: 'tCollapsible-handle-top',
			handleM				: 'tCollapsible-handle-middle',
			handleB				: 'tCollapsible-handle-bottom',
			content 				: 'tCollapsible-content',
			titleHolder			: 'tCollapsible-titleHolder',
			title 				: 'tCollapsible-title',
			focusContent 		: 'tCollapsible-focusContent'
		}
	};
	
	$.fn.tCollapsible = function(options, classes){
	
		var opt = {};
		var cls = {};
	
		$.extend(opt, $.tCollapsible.options, options);
		$.extend(cls, $.tCollapsible.classes, classes);
		
		return this.each(function(){
			
			var com = {		// will hold all the important components in the object
				// remember the display of the element
				display			: $(this).css('display'),
				// the content wrapper
				wrapper			: $(document.createElement('div')),
				// a link to self
				content			: $(this),
				// the handle that will toggle the content visibility
				handle			: $(document.createElement('a')),
				// holds the title. Visible only when the block is collapsed
				titleHolder		: $(document.createElement('div'))
			};
			
			if(!opt.forceWrap && com.display != 'block'){
					M("tCollapsible only possible on block elements", "warn");
				} else {
					
					// ADD CLASSES
					com.wrapper.addClass( cls.main );
					com.content.addClass( cls.content );
					com.handle.addClass( cls.handle );
					com.titleHolder.addClass( cls.titleHolder );
					
					// CREATE STRUCTURE
					com.wrapper
						.insertBefore( com.content )
						.append( com.handle )
						.append( com.titleHolder )
						.append( com.content );
						
					com.handle
						.append( $(document.createElement('div')).addClass( cls.handleT ) )
						.append( $(document.createElement('div')).addClass( cls.handleM ) )
						.append( $(document.createElement('div')).addClass( cls.handleB ) );
					
					com.title = $(document.createElement('a'))
						.attr('href', 'javascript:void(0)')
						.addClass( cls.title )
						.append( document.createTextNode("\u00a0") )
						.bind('focus.blurMe', function(){ $(this).blur(); });
							
					com.titleHolder
						.bind('click.expandContent', function(){ com.handle.trigger('click.toggleState'); })
						.append( com.title )
						.hide();

					com.handle
						.data('content', com.content)
						.data('titleHolder', com.titleHolder)
						.data('title', com.title)
						.attr('href', 'javascript:void(0)')
						.bind('focus.blurMe', function(){ $(this).blur(); })
						.bind('click.toggleState', {com:com, selector: opt.blockTitle, noTitle: opt.defaultTitle}, toggleState)
						.bind('focus.swap blur.swap mouseover.swap mouseout.swap', {
								text	: opt.handleSwap, 
								focus : opt.focusContent ? cls.focusContent : false
							}, swapHandle);

					
					// Setup Options
					if(opt.width) com.wrapper.css('width', opt.width);
					if(opt.swapMargins){ 
						com.wrapper.css({
							marginTop		: com.content.css('marginTop'),
							marginRight		: com.content.css('marginRight'),
							marginBottom	: com.content.css('marginBottom'),
							marginLeft		: com.content.css('marginLeft')
						});
						com.content.css({
							marginTop		: 0,
							marginRight		: 0,
							marginBottom	: 0,
							marginLeft		: 0
						});
					}

					if(opt.handleOver) {
						com.handle.disableTextSelect();
						if(opt.handleOut) com.handle.hover(opt.handleOver, opt.handleOut);
							else com.handle.hover(opt.handleOver);
					}
					
					// Final config and remember objects
					com.content
						.data('tCollapsible', true)		// set initialized
						.data('tCollapsible-opt', opt)	// remember the options used
						.data('tCollapsible-cls', cls)	// remember the classes used
						.data('tCollapsible-com', com);	// remember the components used
				}

		});
		
		/**
		 * Collapses/expands the block of content
		 * @param e the event
		 * @param speed the speed at which to animate
		**/
		function toggleState(e, speed){
			var com = e.data.com;
			
			if( $(this).is(':collapsed') ) {
					
					var T = $(this).data('content');
					$(this)
						.data('titleHolder')
						.fadeOut(speed ? speed : 600, function(){ T.show(); });
						
					$(this).data('collapsed', false);
					
					$(this).trigger('onExpand');
				} else {
				
					var title;
					if(e.data.selector) title = $(this).data('content').find(e.data.selector).eq(0).html();
						
					title = (title && title != '') ? title : e.data.noTitle;
					$(this).data('title').html(title);
					
					var TH = $(this).data('titleHolder');
					$(this)
						.data('content')
						.hide();
					TH.fadeIn();
					
					$(this).data('collapsed', true); 
					
					$(this).trigger('onCollapse');
				}
		}
		
	}
	
	/**
	 * Swaps the background of a handle by adding/substracting a suffix before the extension
	**/
	function swapHandle(e){
		if(!e.data.text) return;
		
		if(e.data.focus) $(this).data('content').toggleClass(e.data.focus);
		
		if($(this).data('isFocused')){
			$('div', $(this)).each(function(){
				var img = $(this).css('background-image');
				$(this).css( 'background-image', img.slice(0, img.lastIndexOf('.')-e.data.text.length) + img.slice(img.lastIndexOf('.')) );
			});
			$(this).data('isFocused', false);
			
		} else {
			$('div', $(this)).each(function(){
				var img = $(this).css('background-image');
				$(this).css( 'background-image', img.slice(0, img.lastIndexOf('.')) + e.data.text + img.slice(img.lastIndexOf('.')) );
			});
			$(this).data('isFocused', true);
		}
	}
	
})(jQuery);


/**
 * A Message function. checks to see if firebug is enabled
 * @param obj the object to output. If firebut is disable, will only work for: string, int, float
 * @param type log, info, err
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
