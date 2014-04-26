/*
	JOBAD 3 UI Functions
	JOBAD.ui.sidebar.js
		
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

JOBAD.UI.Sidebar = {}; 

JOBAD.UI.Sidebar.config = 
{
	"width": 50, //Sidebar Width
	"iconDistance": 15 //Minimal Icon distance
};

/*
	Wraps an element to create a sidebar UI. 
	@param element The element to wrap. 
	@param align Alignment of the new sidebar. 
	@returns the original element, now wrapped. 
*/
JOBAD.UI.Sidebar.wrap = function(element, align){

	var org = JOBAD.refs.$(element);

	if(org.length > 1){
        var me = arguments.callee;
        return org.each(function(i, e){
            me(e, align);
        });
    }

    //get alignement and sidebar css class
	var sbar_align = (align === 'left')?'left':'right';
	var sbar_class = "JOBAD_Sidebar_"+(sbar_align);


	//wrap the original element
	var orgWrapper = JOBAD.refs.$("<div>").css({"overflow": "hidden"});

	var sideBarElement = JOBAD.refs.$("<div class='JOBAD "+sbar_class+" JOBAD_Sidebar_Container'>").css({
		"width": JOBAD.UI.Sidebar.config.width
	});

	var container = JOBAD.refs.$("<div class='JOBAD "+sbar_class+" JOBAD_Sidebar_Wrapper'>");

	org.wrap(orgWrapper);
	orgWrapper = org.parent();

	orgWrapper.wrap(container);
	container = orgWrapper.parent();

	container.prepend(sideBarElement);
	
	JOBAD.refs.$(window).on("resize.JOBAD.UI.Sidebar", function(){
		var children = sideBarElement.find("*").filter(function(){
			var me = JOBAD.refs.$(this);
			return me.data("JOBAD.UI.Sidebar.isElement")===true;
		});
		var cs = [];
		children.each(function(i, e){
			var e = JOBAD.refs.$(e).detach().appendTo(sideBarElement).addClass("JOBAD_Sidebar_Single");
			var el = JOBAD.util.closest(e.data("JOBAD.UI.Sidebar.orgElement"), function(element){
				//check if an element is visible
				return !JOBAD.util.isHidden(element);
			});
			var offset = el.offset().top - sideBarElement.offset().top; //offset
			e.data("JOBAD.UI.Sidebar.hidden", false);
			

			if(e.data("JOBAD.UI.Sidebar.orgElement").is(":hidden") && e.data("JOBAD.UI.Sidebar.hide")){
			     e.data("JOBAD.UI.Sidebar.hidden", true);
			} else {
			     e.data("JOBAD.UI.Sidebar.hidden", false);
			}

			e.css("top", offset).css(sbar_align, 0);
		});
		
		//Sort the children in some way
		children = JOBAD.refs.$(children.sort(function(a, b){
			a = JOBAD.refs.$(a);
			b = JOBAD.refs.$(b);
			if(parseInt(a.css("top")) < parseInt(b.css("top"))){
				return -1;
			} else if(parseInt(a.css("top")) > parseInt(b.css("top"))){
				return 1;
			} else {
				return 0;
			}
		}));
		
		var prev = children.eq(0);
		var me = children.eq(1);
		var groups = [[prev]];
		for(var i=1;i<children.length;i++){
			var prevTop = parseInt(prev.css("top"));
			var myTop = parseInt(me.css("top"));
			if(myTop-(prevTop+prev.height()) < JOBAD.UI.Sidebar.config.iconDistance){
				groups[groups.length-1].push(me); //push me to the last group; we're to close
				me = children.eq(i+1);
			} else {
				groups.push([me]);
				prev = me;
				me = children.eq(i+1);
			}
		}

		JOBAD.refs.$(children).detach();
		
		sideBarElement.find("*").remove(); //clear the sidebar now
		
		for(var i=0;i<groups.length;i++){
			(function(){
				//Group them together
				var unhidden_count = 0;
				var last_unhidden = -1;
				for(var j=0;j<groups[i].length;j++){
					if(!groups[i][j].data("JOBAD.UI.Sidebar.hidden")){
						unhidden_count++;
						last_unhidden = j;
					}
				}


				if(unhidden_count > 1){
						var group = JOBAD.refs.$(groups[i]);
						var top = parseInt(JOBAD.refs.$(group[0]).css("top"));

						var par = JOBAD.refs.$("<div class='JOBAD "+sbar_class+" JOBAD_Sidebar_Group'><img src='"+JOBAD.resources.getIconResource("open")+"' width='16' height='16'></div>")
						.css("top", top).appendTo(sideBarElement);

						par.on("contextmenu", function(e){return (e.ctrlKey)}); 

						var img = par.find("img");
						var state = false;
						par.click(function(){
							if(state){
								for(var j=0;j<group.length;j++){
									group[j].hide();
								}
								img.attr("src", JOBAD.resources.getIconResource("open"));
							} else {
								for(var j=0;j<group.length;j++){
									if(!group[j].data("JOBAD.UI.Sidebar.hidden")){
									    group[j].show();
									}
								}
								img.attr("src", JOBAD.resources.getIconResource("close"));
							}
							state = !state;
							
						});
						for(var j=0;j<group.length;j++){
							JOBAD.refs.$(group[j]).appendTo(par).hide().removeClass("JOBAD_Sidebar_Single").addClass("JOBAD_Sidebar_group_element")
							.css("top", -16)
							.css(sbar_align, 20);
						}
				} else {
					if(last_unhidden != -1){
						var single = JOBAD.refs.$(groups[i][last_unhidden]);
					    sideBarElement.append(JOBAD.refs.$(groups[i][last_unhidden]).removeClass("JOBAD_Sidebar_group_element").show());
					}
				     
				    for(var j=0;j<groups[i].length;j++){
				    	if(j != last_unhidden){
				    		sideBarElement.append(JOBAD.refs.$(groups[i][j]).removeClass("JOBAD_Sidebar_group_element"));
				    	}
				   	}
				     
				}
			})()
		}
	})
	
	JOBAD.refs.$(window).on("resize", function(){
		JOBAD.UI.Sidebar.forceNotificationUpdate();
	});

	org.data("JOBAD.UI.Sidebar.active", true);
	org.data("JOBAD.UI.Sidebar.align", sbar_align);
	return org;
};

/*
	Unwraps an element, destroying the sidebar. 
	@param The element which has a sidebar. 
	@returns the original element unwrapped. 
*/
JOBAD.UI.Sidebar.unwrap = function(element){
	var org = JOBAD.refs.$(element);

	if(org.length > 1){
        var me = arguments.callee;
        return org.each(function(i, e){
            me(e);
        });
    }
	
	if(!org.data("JOBAD.UI.Sidebar.active")){
		return;
	}
	
	org
	.unwrap()
	.parent()
	.find("div")
	.first().remove();

	org
	.removeData("JOBAD.UI.Sidebar.active")
	.removeData("JOBAD.UI.Sidebar.align");

	return org.unwrap();
};

/*
	Adds a new notification to the sidebar. Will be auto created if it does not exist. 
	@param sidebar The element which has a sidebar. 
	@param element The element to bind the notification to. 
	@param config The configuration. 
			config.class:	Notificaton class. Default: none. 
			config.icon:	Icon (Default: Based on notification class. 
			config.text:	Text
			config.menu:	Context Menu
			config.trace:	Trace the original element on hover?
			config.click:	Callback on click
			config.menuThis: This for menu callbacks
			config.hide: 	Should we hide this element (true) when it is not visible or travel up the dom tree (false, default)?
	@param align Alignment of sidebar if it still has to be created. 
	@returns an empty new notification element. 
*/
JOBAD.UI.Sidebar.addNotification = function(sidebar, element, config, align){	
	var config = (typeof config == 'undefined')?{}:config;
	
	var sbar = JOBAD.refs.$(sidebar);
	
	if(sbar.data("JOBAD.UI.Sidebar.active") !== true){
		sbar = JOBAD.UI.Sidebar.wrap(sbar, align); //init the sidebar first. 
	}
	
	var sbar_class = "JOBAD_Sidebar_"+((sbar.data("JOBAD.UI.Sidebar.align") === 'left')?'left':'right');
	
	var child = JOBAD.refs.$(element);
	var offset = child.offset().top - sbar.offset().top; //offset
	sbar = sbar.parent().parent().find("div").first();

	var newGuy =  JOBAD.refs.$("<div class='JOBAD "+sbar_class+" JOBAD_Sidebar_Notification'>").css({"top": offset}).appendTo(sbar)
	.data("JOBAD.UI.Sidebar.orgElement", element)
	.data("JOBAD.UI.Sidebar.isElement", true)
	.data("JOBAD.UI.Sidebar.hide", config.hide === true);
	
	//config
	if(typeof config.menu != 'undefined'){
		var entries = JOBAD.UI.ContextMenu.fullWrap(config.menu, function(org, args){
			return org.apply(newGuy, [element, config.menuThis]);
		});
		JOBAD.UI.ContextMenu.enable(newGuy, function(){return entries;});
	}
	
	
	if(config.hasOwnProperty("text")){
		newGuy.text(config.text);
	}

	var icon = false;
	var class_color = "#C0C0C0";
	var class_colors = {
		"info": "#00FFFF",
		"error": "#FF0000",
		"warning": "#FFFF00",
		"none": "#FFFF00"
	};

	config["class"] = (typeof config["class"] == "string")?config["class"]:"none";
		
	if(typeof config["class"] == 'string'){
		var notClass = config["class"];
		
		if(JOBAD.resources.available("icon", notClass)){
			icon = JOBAD.resources.getIconResource(notClass);
		}
		
		if(class_colors.hasOwnProperty(notClass)){
			class_color = class_colors[notClass];
		}
	}
	
	if(config.trace){
		//highlight the element
		newGuy.hover(
		function(){
			JOBAD.UI.Folding.show(element);
			JOBAD.UI.highlight(element, class_color);
		},
		function(){
			JOBAD.UI.unhighlight(element);
		});
	}
	
	if(typeof config.click == "function"){
		newGuy.click(config.click);
	} else {
		newGuy.click(function(){
			newGuy.trigger("contextmenu");
			return false;
		})
	}
	
	if(typeof config.icon == 'string'){
		icon =  JOBAD.resources.getIconResource(config.icon);
	}
	if(typeof icon !== 'string'){
		icon =  JOBAD.resources.getIconResource("none");
	}
	if(typeof icon == 'string'){
		newGuy.html("<img src='"+icon+"' width='16px' height='16px'>")
		.hover(function(){
			JOBAD.UI.hover.enable(JOBAD.refs.$("<div>").text(config.text).html(), "JOBAD_Sidebar_Hover JOBAD_Sidebar "+((typeof config["class"] == 'string')?" JOBAD_Notification_"+config["class"]:""));
		}, function(){
			JOBAD.UI.hover.disable();
		});
	}
	
	return newGuy;
};

/*
	Forces a sidebar notification position update. 
	@returns nothing. 
*/
JOBAD.UI.Sidebar.forceNotificationUpdate = function(){
	JOBAD.refs.$(window).trigger("resize.JOBAD.UI.Sidebar");
};

/*
	Removes a notification
	@param notification The notification element. 
	@returns nothing. 
*/
JOBAD.UI.Sidebar.removeNotification = function(notification){
	notification.remove();
};