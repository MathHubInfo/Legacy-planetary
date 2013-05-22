/*
	JOBAD 3 Events
	depends:
		JOBAD.core.modules.js
		JOBAD.core.events.js
		JOABD.core.js
*/

/* left click */
JOBAD.Events.leftClick = 
{
	'default': function(){
		return false;
	},
	'Setup': {
		'enable': function(root){
			var me = this;
			root.delegate("*", 'click.JOBAD.leftClick', function(event){
				var element = JOBAD.refs.$(event.target); //The base element.  
				switch (event.which) {
					case 1:
						/* left mouse button => left click */
						me.Event.leftClick.trigger(element);
						event.stopPropagation(); //Not for the parent. 
						break;
					default:
						/* nothing */
				}
				root.trigger('JOBAD.Event', ['leftClick', element]);
			});
		},
		'disable': function(root){
			root.undelegate("*", 'click.JOBAD.leftClick');	
		}
	},
	'namespace': 
	{
		
		'getResult': function(target){
			return this.modules.iterateAnd(function(module){
				module.leftClick.call(module, target, module.getJOBAD());
				return true;
			});
		},
		'trigger': function(target){
			var evt = this.Event.leftClick.getResult(target);
			return evt;
		}
	}
};

/* onEvent */
JOBAD.Events.onEvent = 
{
	'default': function(){},
	'Setup': {
		'enable': function(root){
			var me = this;
			root.on('JOBAD.Event', function(jqe, event, args){
				me.Event.onEvent.trigger(event, args);
			});
		},
		'disable': function(root){
			root.off('JOBAD.Event');
		}
	},
	'namespace': 
	{
		
		'getResult': function(event, element){
			return this.modules.iterateAnd(function(module){
				module.onEvent.call(module, event, element, module.getJOBAD());
				return true;
			});
		},
		'trigger': function(event, element){
			return this.Event.onEvent.getResult(event, element);
		}
	}
};

/* context menu entries */
JOBAD.Events.contextMenuEntries = 
{
	'default': function(){
		return [];
	},
	'Setup': {
		'enable': function(root){
			var me = this;
			JOBAD.UI.ContextMenu.enable(root, function(target){
				var res = me.Event.contextMenuEntries.getResult(target);
				root.trigger('JOBAD.Event', ['contextMenuEntries', target]);
				return res;
			});
		},
		'disable': function(root){
			JOBAD.UI.ContextMenu.disable(root);
		}
	},
	'namespace': 
	{
		'getResult': function(target){
			var res = [];
			var mods = this.modules.iterate(function(module){
				var entries = module.contextMenuEntries.call(module, target, module.getJOBAD());
				return (JOBAD.refs._.isArray(entries))?entries:JOBAD.util.generateMenuList(entries);
			});
			for(var i=0;i<mods.length;i++){
				var mod = mods[i];
				for(var j=0;j<mod.length;j++){
					res.push(mod[j]);
				}
			}
			if(res.length == 0){
				return false;		
			} else {
				return res;		
			}
		}
	}
}


/*
	Generates a list menu representation from an object representation. 
	@param menu Menu to generate. 
	@returns the new representation. 
*/
JOBAD.util.generateMenuList = function(menu){
	if(typeof menu == 'undefined'){
		return [];
	}
	var res = [];
	for(var key in menu){
		if(menu.hasOwnProperty(key)){
			var val = menu[key];
			if(typeof val == 'function'){
				res.push([key, val]);		
			} else {
				res.push([key, JOBAD.util.generateMenuList(val)]);
			}
		}
	}
	return res;
};
/*
	Wraps a menu function
	@param menu Menu to generate. 
	@returns the new representation. 
*/
JOBAD.util.fullWrap = function(menu, wrapper){
	var menu = (JOBAD.refs._.isArray(menu))?menu:JOBAD.util.generateMenuList(menu);
	var menu2 = [];
	for(var i=0;i<menu.length;i++){
		if(typeof menu[i][1] == 'function'){
			(function(){
				var org = menu[i][1];
				menu2.push([menu[i][0], function(){
					return wrapper(org, arguments)
				}]);
			})();
		} else {
			menu2.push([menu[i][0], JOBAD.util.fullWrap(menu[i][1])]);
		}
		
	}
	return menu2;
};

/* hover Text */
JOBAD.Events.hoverText = 
{
	'default': function(){
		return false;	
	},
	'Setup': {
		'init': function(){
			this.Event.hoverText.activeHoverElement = undefined; //the currently active element. 
		},
		'enable': function(root){
			
			var me = this;
			var trigger = function(event){
				var $element = JOBAD.refs.$(this);
				var res = me.Event.hoverText.trigger($element);
				if(res){//something happened here: dont trigger on parent
					event.stopPropagation();
				} else if(!$element.is(root)){ //I have nothing => trigger the parent
					JOBAD.refs.$(this).parent().trigger('mouseenter.JOBAD.hoverText', event); //Trigger parent if i'm not root. 	
				}
				root.trigger('JOBAD.Event', ['hoverText', $element]);
				return false;
			};


			var untrigger = function(event){
				return me.Event.hoverText.untrigger(JOBAD.refs.$(this));	
			};

			root
			.delegate("*", 'mouseenter.JOBAD.hoverText', trigger)
			.delegate("*", 'mouseleave.JOBAD.hoverText', untrigger);

		},
		'disable': function(root){
			if(typeof this.Event.hoverText.activeHoverElement != 'undefined')
			{
				me.Event.hoverText.untrigger(); //remove active Hover menu
			}
		
			root
			.undelegate("*", 'mouseenter.JOBAD.hoverText')
			.undelegate("*", 'mouseleave.JOBAD.hoverText');
		}
	},
	'namespace': {
		'getResult': function(target){
			var res = false;
			this.modules.iterate(function(module){
				var hoverText = module.hoverText.call(module, target, module.getJOBAD()); //call apply and stuff here
				if(typeof hoverText != 'undefined' && typeof res == "boolean"){//trigger all hover handlers ; display only the first one. 
					if(typeof hoverText == "string"){
						res = JOBAD.refs.$("<p>").text(hoverText)			
					} else if(typeof hoverText != "boolean"){
						try{
							res = JOBAD.refs.$(hoverText);
						} catch(e){
							JOBAD.error("Module '"+module.info().identifier+"' returned invalid HOVER result. ");
						}
					} else if(hoverText === true){
						res = true;
					}
				}
				return true;
			});
			return res;
		},
		'trigger': function(source){
			if(source.data('JOBAD.hover.Active')){
				return false;		
			}

			var EventResult = this.Event.hoverText.getResult(source); //try to do the event
		
			if(typeof EventResult == 'boolean'){
				return EventResult;		
			}

			if(this.Event.hoverText.activeHoverElement instanceof JOBAD.refs.$)//something already active
			{
				if(this.Event.hoverText.activeHoverElement.is(source)){
					return true; //done and die			
				}
				this.Event.hoverText.untrigger(this.Event.hoverText.activeHoverElement);	
			}

			this.Event.hoverText.activeHoverElement = source;

			source.data('JOBAD.hover.Active', true);
			var tid = window.setTimeout(function(){
				source.removeData('JOBAD.hover.timerId');
				JOBAD.UI.hover.enable(EventResult.html(), "JOBAD_Hover");
			}, JOBAD.UI.hover.config.hoverDelay);

			source.data('JOBAD.hover.timerId', tid);//save timeout id
			return true;
						
		},
		'untrigger': function(source){
			if(typeof source == 'undefined'){
				if(this.Event.hoverText.activeHoverElement instanceof JOBAD.refs.$){
					source = this.Event.hoverText.activeHoverElement;
				} else {
					return false;			
				}
			}		

			if(!source.data('JOBAD.hover.Active')){
				return false;		
			}

		

			if(typeof source.data('JOBAD.hover.timerId') == 'number'){
				window.clearTimeout(source.data('JOBAD.hover.timerId'));
				source.removeData('JOBAD.hover.timerId');		
			}

			source.removeData('JOBAD.hover.Active');

			this.Event.hoverText.activeHoverElement = undefined;

			JOBAD.UI.hover.disable();

			if(!source.is(this.element)){
				this.Event.hoverText.trigger(source.parent());//we are in the parent now
				return false;
			}

			return true;
		}
	}
}

/* sidebar: onSideBarUpdate Event */
JOBAD.Events.onSideBarUpdate = 
{
	'default': function(){
		//Does nothing
	},
	'Setup': {
		'init': {
			/* Sidebar namespace */
			'Sidebar': {
				/*
					Redraws the sidebar. 
				*/
				'redraw': function(){
					if(typeof this.Sidebar.Elements == 'undefined'){
						this.Sidebar.Elements = {};
					}
					if(JOBAD.refs._.keys(this.Sidebar.Elements).length == 0){
						if(this.element.data("JOBAD.UI.Sidebar.active")){
							JOBAD.UI.Sidebar.unwrap(this.element);
						}	
					} else {
						if(!this.element.data("JOBAD.UI.Sidebar.active")){
							JOBAD.UI.Sidebar.wrap(this.element);
						}
						for(var id in this.Sidebar.Elements){
							var element = this.Sidebar.Elements[id];
							if(!element.data("JOBAD.Events.Sidebar.id")){
								this.Sidebar.Elements[id] = JOBAD.UI.Sidebar.addNotification(this.element, this.Sidebar.Elements[id], element.data("JOBAD.Events.Sidebar.config"));
							}
						}
					}
					JOBAD.UI.Sidebar.forceNotificationUpdate();
					this.Event.onSideBarUpdate.trigger();
				},
				/*
					Registers a new notification. 
					@param element Element to register notification on. 
					@param config
							config.class:	Notificaton class. Default: none. 
							config.icon:	Icon (Default: Based on notification class. 
							config.text:	Text
							config.menu:	Context Menu
							config.trace:	Trace the original element on hover?
							config.click:	Callback on click
					@return jQuery element used as identification. 
							
				*/
				'registerNotification': function(element, config){
					var me = this;
					if(typeof this.Sidebar.Elements == 'undefined'){
						this.Sidebar.Elements = {};
					}
					var element = JOBAD.refs.$(element);
					var id = (new Date()).getTime().toString();
					var config = (typeof config == 'undefined')?{}:config;
					config.menuThis = me;
					this.Sidebar.Elements[id] = element.data("JOBAD.Events.Sidebar.config", config);
					
					this.Sidebar.redraw();
					
					var sidebar_element = this.Sidebar.Elements[id].data("JOBAD.Events.Sidebar.id", id);

					sidebar_element.data("JOBAD.Events.Sidebar.element", element)					
					
					return sidebar_element;
				}, 
				/*
					removes a notification. 
					@param	item	Notification to remove. 
				*/
				'removeNotification': function(item){
					if(item instanceof JOBAD.refs.$){
						var id = item.data("JOBAD.Events.Sidebar.id");
						JOBAD.UI.Sidebar.removeNotification(item);
						delete this.Sidebar.Elements[id];
						this.Sidebar.redraw();
					} else {
						JOBAD.error("JOBAD Sidebar Error: Tried to remove invalid Element. ");
					}
				}	
			}
		},
		'enable': function(root){
			this.Event.onSideBarUpdate.enabled = true;
			
		},
		'disable': function(root){
			this.Event.onSideBarUpdate.enabled = undefined;
		}
	},
	'namespace': 
	{
		
		'getResult': function(){
			if(this.Event.onSideBarUpdate.enabled){
				this.modules.iterateAnd(function(module){
					module.onSideBarUpdate.call(module, module.getJOBAD());
					return true;
				});
			}
		},
		'trigger': function(){
			this.Event.onSideBarUpdate.getResult();
		}
	}
};

for(var key in JOBAD.Events){
	JOBAD.modules.cleanProperties.push(key);
}
