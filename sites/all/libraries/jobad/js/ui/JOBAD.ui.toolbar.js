/*
	JOBAD 3 UI Functions - Toolbar
	JOBAD.ui.toolbar.js
		
	Copyright (C) 2013 KWARC Group <kwarc.info>
	
	This file is part of JOBAD.
	
	JOBAD is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	JOBAD is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	
	You should have received a copy of the GNU General Public License
	along with JOBAD.  If not, see <http://www.gnu.org/licenses/>.
*/

JOBAD.UI.Toolbar = {};

/*
	Clears the toolbar and removes it. 
	@param element The element the toolbar belongs to. 
*/
JOBAD.UI.Toolbar.clear = function(element){

	var element = JOBAD.refs.$(element);

	if(element.length > 1){
        var me = arguments.callee;
        return element.each(function(i, e){
            me(element);
        });
    }

	if(element.data("JOBAD.UI.Toolbar.active")){
		element.data("JOBAD.UI.Toolbar.ToolBarElement").remove();
	
		JOBAD.refs.$(window).off("resize", element.data("JOBAD.UI.Toolbar.resizeFunction"));
		
		element
		.removeData("JOBAD.UI.Toolbar.ToolBarElement")
		.removeData("JOBAD.UI.Toolbar.active")
		.removeData("JOBAD.UI.Toolbar.resizeFunction")
		.removeData("JOBAD.UI.Toolbar.hide")
	}
}

/*
	Updates the toolbar. 
	@param element The element the toolbar belongs to. 
*/
JOBAD.UI.Toolbar.update = function(element){

	var element = JOBAD.refs.$(element);

	if(element.length > 1){
        var me = arguments.callee;
        return element.each(function(i, e){
            me(element);
        });
    }

	if(element.data("JOBAD.UI.Toolbar.active")){
		var toolbar = element.data("JOBAD.UI.Toolbar.ToolBarElement");
		toolbar.children().button("refresh");
		
		var position = /*JOBAD.util.closest(element, function(e){
				//check if an element is visible
				return !JOBAD.util.isHidden(e);
		}).*/element.offset();
		
		toolbar.css({
			"position": "absolute",
			"top": position.top,
			"left": position.left
		});
		
		if(JOBAD.util.isHidden(element) /* && element.data("JOBAD.UI.Toolbar.hide")*/){
		  toolbar.hide();
		} else {
		  toolbar.show();
		}
		
		if(toolbar.children().length == 0){
			JOBAD.UI.Toolbar.clear(element);
		}
	}
	
}

/*
	adds an items to the toolbar. 
	@param element The element the toolbar belongs to. 
	@param config Configuration of new item. Eitehr an object or a string tobe used as text.  
		config.class:	Notificaton class. Default: none.
		config.icon:	Icon
		config.text:	Text
		config.menu:	Context Menu
		config.menuThis: This for menu callbacks
		config.click:	Callback on click. Default: Open Context Menu
		config.hide:	Currently unimplemented. Should we hide this element (true) when it is not visible or travel up the dom tree (false, default)?

	@returns The new item as a jquery element. 
*/
JOBAD.UI.Toolbar.addItem = function(element, config){
	var element = JOBAD.refs.$(element);

	if(element.length > 1){
        var me = arguments.callee;
        return element.each(function(i, e){
            me(element, config);
        });
    }

	//create toolbar if required
	if(!element.data("JOBAD.UI.Toolbar.active")){
		element.data("JOBAD.UI.Toolbar.ToolBarElement", 
			JOBAD.refs.$("<div class='ui-widget-header ui-corner-all'>")
				.css({
					"padding": 4,
		    		"display": "inline-block"
				}).appendTo("body")
			.hover(function(){
				JOBAD.refs.$(this).stop().fadeTo(300, 1);
			}, function(){
				JOBAD.refs.$(this).stop().fadeTo(300, 0.5);
			}).fadeTo(0, 0.5)
			.bind("contextmenu", function(e){return e.ctrlKey;})
		);
		
		var cb = function(){
			JOBAD.UI.Toolbar.update(element); 
		};
	
	
		element.data("JOBAD.UI.Toolbar.resizeFunction", cb)
	
		JOBAD.refs.$(window).on("resize", cb);
	
	}
	
	
	//toolbar config
	
	if(typeof config == "string"){
		var config = {
			"text": config
		}
	} else if(typeof config == "undefined"){
		var config = {}
	}

	var icon = "none";  
	
	//get icon and class
	if(typeof config["class"] == 'string'){	
		var notClass = config["class"];	
		if(JOBAD.resources.available("icon", notClass)){
			icon = notClass;
		}
	}

	if(typeof config.icon == "string"){
		icon = config.icon; 
	}
	
	//new Item

	
	var newItem = JOBAD.refs.$("<span>");
	
	//text text 
	if(typeof config.text == 'string'){
		newItem.text(config.text);
	}
	
	if(typeof callback == 'function'){
		newItem.click(callback);
	} else {
		newItem.click(function(){newItem.trigger("contextmenu");});
	}
	
	
	//menu
	if(typeof config.menu != 'undefined'){
		var entries = JOBAD.UI.ContextMenu.fullWrap(config.menu, function(org, args){
			return org.apply(newItem, [element, config.menuThis]);
		});
		JOBAD.UI.ContextMenu.enable(newItem, function(){return entries;});
	}

	newItem.appendTo(element.data("JOBAD.UI.Toolbar.ToolBarElement")).button();

	//icon
	if(icon != "none"){
		icon = JOBAD.resources.getIconResource(icon); //get icon url
		JOBAD.refs.$("<span class='JOBAD JOBAD_InlineIcon'>")
		.css({
			"position": "absolute",
			"top": "50%",
			"margin-top": "-8px",
			"left": ".5em",
			"background-image": "url('"+icon+"')"
		}).prependTo(newItem); 

		newItem.find(".ui-button-text").css({
			"padding": ".4em 1em .4em 2.1em"
		}) 
	}
	
	newItem.data("JOBAD.UI.Toolbar.element", element);
	
	//store the data
	element
	.data("JOBAD.UI.Toolbar.active", true)
	
	
	JOBAD.UI.Toolbar.update(element);
	
	
	return newItem; 
}

/*
	Removes an item from the toolbar. 
	@param item Item to remove. 
*/
JOBAD.UI.Toolbar.removeItem = function(item){
	var element = JOBAD.refs.$(item).data("JOBAD.UI.Toolbar.element");
	
	item.remove();
	
	JOBAD.UI.Toolbar.update(element);
}