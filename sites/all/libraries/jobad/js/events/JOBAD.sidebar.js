/*
	JOBAD 3 Sidebar
	JOBAD.sidebar.js
		
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


JOBAD.Sidebar = {};
JOBAD.Sidebar.styles = {};
JOBAD.Sidebar.types = [];
JOBAD.Sidebar.desc = ["Sidebar position"];


JOBAD.Sidebar.registerSidebarStyle = function(styleName, styleDesc, registerFunc, deregisterFunc, updateFunc){
	if(JOBAD.Sidebar.styles.hasOwnProperty(styleName)){
		JOBAD.console.log("Warning: Sidebar Style with name '"+styleName+"' already exists");
		return true;
	}
	
	JOBAD.Sidebar.types.push(styleName);
	JOBAD.Sidebar.desc.push(styleDesc);
	
	JOBAD.Sidebar.styles[styleName] = {
		"register": registerFunc, //JOBAD.UI.Sidebar.addNotification
		"deregister": deregisterFunc, //JOBAD.UI.Toolbar.removeItem(item);
		"update": updateFunc //JOBAD.UI.Sidebar.redraw
	};
};

JOBAD.Sidebar.registerSidebarStyle("right", "Right", 
	JOBAD.util.argWrap(JOBAD.UI.Sidebar.addNotification, function(args){
		args.push("right"); return args;
	}), 
	JOBAD.UI.Sidebar.removeNotification,
	function(){
		JOBAD.UI.Sidebar.forceNotificationUpdate();
		if(JOBAD.util.objectEquals(this.Sidebar.PastRequestCache, {})){
			JOBAD.UI.Sidebar.unwrap(this.element);
		}
	}
);

JOBAD.Sidebar.registerSidebarStyle("left", "Left", 
	JOBAD.util.argWrap(JOBAD.UI.Sidebar.addNotification, function(args){
		args.push("left"); return args;
	}), 
	JOBAD.UI.Sidebar.removeNotification,
	function(){
		JOBAD.UI.Sidebar.forceNotificationUpdate();
		if(JOBAD.util.objectEquals(this.Sidebar.PastRequestCache, {})){
			JOBAD.UI.Sidebar.unwrap(this.element);
		}
	}
);

JOBAD.Sidebar.registerSidebarStyle("bound", "Bound to element", 
	JOBAD.util.argSlice(JOBAD.UI.Toolbar.addItem, 1),
	JOBAD.UI.Toolbar.removeItem, 
	function(){
		for(var key in this.Sidebar.PastRequestCache){
			JOBAD.UI.Toolbar.update(this.Sidebar.PastRequestCache[key][0]);
		}
	}
);


/* sidebar: SideBarUpdate Event */
JOBAD.events.SideBarUpdate = 
{
	'default': function(){
		//Does nothing
	},
	'Setup': {
		'init': {
			/* Sidebar namespace */
			'Sidebar': {
				'getSidebarImplementation': function(type){
					return JOBAD.util.bindEverything(JOBAD.Sidebar.styles[type], this);
				},
				'forceInit': function(){
					if(typeof this.Sidebar.ElementRequestCache == 'undefined'){
						this.Sidebar.ElementRequestCache = [];
					}
					
					if(typeof this.Sidebar.Elements == 'undefined'){
						this.Sidebar.Elements = {};
					}
					
					if(typeof this.Sidebar.PastRequestCache == 'undefined'){
						this.Sidebar.PastRequestCache = {};
					}
					
					
					if(!this.Event.SideBarUpdate.enabled){
						return;
					}
				
					var new_type = this.Config.get("sidebar_type");
			
					if(this.Event.SideBarUpdate.type != new_type){
						this.Sidebar.transit(new_type); //update sidebar type
					}
				},
				'makeCache': function(){
					var cache = [];
					
					for(var key in this.Sidebar.PastRequestCache){
						cache.push(this.Sidebar.PastRequestCache[key]);
					}
					
					return cache;
				},
				/*
					Post-Config-Switching
				*/
				'transit': function(to){
					var cache = this.Sidebar.makeCache(); //cache the loaded requests
					
					//remove all old requests
					for(var key in this.Sidebar.Elements){
						this.Sidebar.removeNotificationT(this.Event.SideBarUpdate.type, this.Sidebar.Elements[key], false);
					}
					 	
					this.Sidebar.redrawT(this.Event.SideBarUpdate.type); //update it one mroe time (this also clears the toolbar)
					
					
					this.Event.SideBarUpdate.type = to;
					
					
					for(var i=0;i<cache.length;i++){
						this.Sidebar.registerNotification(cache[i][0], cache[i][1], false);
					}
					
					this.Sidebar.redrawT(to); //redraw the sidebar
					
				},				
				/*
					Redraws the sidebar. 
				*/
				'redraw': function(){				
					if(typeof this.Event.SideBarUpdate.enabled == "undefined"){
						return; //do not run if disabled
					}
				
					this.Sidebar.forceInit();
					
					return this.Sidebar.redrawT(this.Event.SideBarUpdate.type);
				},
				/*
					Redraws the sidebar assuming the specefied type. 
				*/
				'redrawT': function(type){
					this.Sidebar.redrawing = true;

					var root = this.element;

					var implementation = this.Sidebar.getSidebarImplementation(type);
					
					for(var i=0;i<this.Sidebar.ElementRequestCache.length;i++){
						var id = this.Sidebar.ElementRequestCache[i][0];
						var element = this.Sidebar.ElementRequestCache[i][1];
						var config = this.Sidebar.ElementRequestCache[i][2];
						
						this.Sidebar.Elements[id] = implementation["register"](this.element, element, config)
						.data("JOBAD.Events.Sidebar.id", id);
						
						this.Sidebar.PastRequestCache[id] = [element, config]; 
						
					}
												
					this.Sidebar.ElementRequestCache = []; //clear the cache
					
					//update and trigger event
					implementation["update"]();
					this.Event.SideBarUpdate.trigger();

					this.Sidebar.redrawing = false;
				},
				
				/*
					Registers a new notification. 
					@param element Element to register notification on. 
					@param config
							config.class:	Notificaton class. Default: none. 
							config.icon:	Icon (Default: Based on notification class. )
							config.text:	Text
							config.menu:	Context Menu
							config.trace:	Trace the original element on hover? (Ignored for direct)
							config.click:	Callback on click, Default: Open Context Menu
					@param autoRedraw Optional. Should the sidebar be redrawn? (default: true)
					@return jQuery element used as identification. 
							
				*/
				'registerNotification': function(element, config, autoRedraw){
				
					this.Sidebar.forceInit(); //force an init
				
					var id = JOBAD.util.UID(); //generate new UID
					
					var config = (typeof config == 'undefined')?{}:config;
					config.menuThis = this;
					
					this.Sidebar.ElementRequestCache.push([id, JOBAD.refs.$(element), JOBAD.util.clone(config)]); //cache the request. 
					
					if((typeof autoRedraw == 'boolean')?autoRedraw:true){
						this.Sidebar.redraw();
						return this.Sidebar.Elements[id];
					}		
					
				},
				/*
					removes a notification. 
					@param	item	Notification to remove.
					@param autoRedraw Optional. Should the sidebar be redrawn? (default: true)
					
				*/
				'removeNotification': function(item, autoRedraw){
					this.Sidebar.forceInit();
					if(!this.Event.SideBarUpdate.enabled){
						//we're disabled; just remove it from the cache
						var id = item.data("JOBAD.Events.Sidebar.id");
						
						for(var i=0;i<this.Sidebar.PastRequestCache.length;i++){
							if(this.Sidebar.PastRequestCache[i][0] == id){
								this.Sidebar.PastRequestCache.splice(i, 1); //remove the element
								break;
							}
						}
					} else {
						return this.Sidebar.removeNotificationT(this.Event.SideBarUpdate.type, item, autoRedraw);
					}
				},
				/*
					removes a notification assuming the specefied sidebar type. 
					@param	item	Notification to remove.
					@param autoRedraw Optional. Should the sidebar be redrawn? (default: true)
					
				*/
				'removeNotificationT': function(type, item, autoRedraw){
					var implementation = this.Sidebar.getSidebarImplementation(type);
					
					if(item instanceof JOBAD.refs.$){
						var id = item.data("JOBAD.Events.Sidebar.id");
	
						implementation["deregister"](item);
						
						delete this.Sidebar.Elements[id];
						delete this.Sidebar.PastRequestCache[id];
						
						if((typeof autoRedraw == 'boolean')?autoRedraw:true){
							this.Sidebar.redrawT(type); //redraw
						}
						return id;
					} else {
						JOBAD.error("JOBAD Sidebar Error: Tried to remove invalid Element. ");
					}
				}
			}
		},
		'enable': function(root){
			var me = this; 

			this.Event.SideBarUpdate.enabled = true;
			this.Event.SideBarUpdate.type = this.Config.get("sidebar_type"); //init the type
			this.Sidebar.redraw(); //redraw the sidebar
		},
		'disable': function(root){
		
			var newCache = []
		
			//remove all old requests
			for(var key in this.Sidebar.Elements){
				newCache.push([key, this.Sidebar.PastRequestCache[key][0], this.Sidebar.PastRequestCache[key][1]]);
				
				this.Sidebar.removeNotification(this.Sidebar.Elements[key], false);
			}
			
			this.Sidebar.redraw(); //redraw it one more time. 
			
			this.Sidebar.ElementRequestCache = newCache; //everything is now hidden
			
			this.Event.SideBarUpdate.enabled = undefined; 
		}
	},
	'namespace': 
	{
		
		'getResult': function(){
			if(this.Event.SideBarUpdate.enabled){
				this.modules.iterateAnd(function(module){
					module.SideBarUpdate.call(module, module.getJOBAD());
					return true;
				});
			}
		},
		'trigger': function(){
			this.Event.SideBarUpdate.getResult();
		}
	}
};