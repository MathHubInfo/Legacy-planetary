/*
	JOBAD Core Event Logic
		
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


//These are special events
//Do not setup these
var SpecialEvents = ["on", "off", "once", "trigger", "bind", "handle"]; 

//preEvent and postEvent Handlers 
//will be called for module-style events

var preEvent = function(me, event, params){
	me.Event.trigger("event.before."+event, [event, params]);
};

var postEvent = function(me, event, params){
	me.Event.trigger("event.after."+event, [event, params]);
	me.Event.handle(event, params); 
};


//Provides custom events for modules
JOBAD.ifaces.push(function(me, args){

	/* Setup core function */
	/* Setup on an Element */

	var enabled = false;

	/*
		Enables or disables this JOBAD instance. 
		@returns boolean indicating if the status was changed.  
	*/
	this.Setup = function(){
		if(enabled){
			return me.Setup.disable();
		} else {
			return me.Setup.enable();
		}
	}
	
	/*
		Checks if this Instance is enabled. 
	*/
	this.Setup.isEnabled = function(){
		return enabled;
	};


	/*
		Calls the function cb if this JOBADINstance is enabled, 
		otherwise calls it once this JOBADInstance is enabled. 
	*/
	this.Setup.enabled = function(cb){
		var cb = JOBAD.util.forceFunction(cb).bind(me); 

		if(enabled){
			cb(); 
		} else {
			me.Event.once("instance.enable", cb);
		}
	}

	/*
		Calls the function cb if this JOBADINstance is disabled, 
		otherwise calls it once this JOBADInstance is disbaled. 
	*/
	this.Setup.disabled = function(cb){
		var cb = JOBAD.util.forceFunction(cb).bind(me); 

		if(!enabled){
			cb(); 
		} else {
			me.Event.once("instance.disable", cb);
		}
	}

	
	/*
		Defer an event until JOBAD is enabled. 
		depracated
	*/
	this.Setup.deferUntilEnabled = function(func){
		JOBAD.console.warn("deprecated: .Setup.deferUntilEnabled, use .Event.once('instance.enable', callback) instead. "); 
		me.Event.once("instance.enable", func); 
	};
	
	/*
		Defer an even until JOBAD is disabled
	*/
	this.Setup.deferUntilDisabled = function(func){
		JOBAD.console.warn("deprecated: .Setup.deferUntilDisabled, use .Event.once('instance.disable', callback) instead. "); 
		me.Event.once("instance.disable", func);
	};
	
	/*
		Enables this JOBAD instance 
		@returns boolean indicating success. 
	*/
	this.Setup.enable = function(){
		if(enabled){
			return false;
		}

		var root = me.element;

		me.Event.trigger("instance.beforeEnable", []);

		for(var key in me.Event){
			if(JOBAD.util.contains(SpecialEvents, key)){
				continue;
			}

			try{
				JOBAD.events[key].Setup.enable.call(me, root);
			} catch(e){
				JOBAD.console.error("Failed to enable Event '"+key+"': "+e.message);
				JOBAD.console.error(e); 
			}
			
		}

		enabled = true; //we are enabled;
		var res = me.Event.trigger("instance.enable", []); 	

		return true;
	};

	/*
		Disables this JOBAD instance. 
		@returns boolean indicating success. 
	*/
	this.Setup.disable = function(){
		if(!enabled){
			return false;
		}		
		var root = me.element;

		me.Event.trigger("instance.beforeDisable", []);

		for(var key in JOBAD.events){
			if(JOBAD.util.contains(SpecialEvents, key)){
				continue;
			}
			if(JOBAD.events.hasOwnProperty(key) && !JOBAD.isEventDisabled(key)){
				try{
					JOBAD.events[key].Setup.disable.call(me, root);
				} catch(e){
					JOBAD.console.error("Failed to disable Event '"+key+"': "+e.message);
					JOBAD.console.error(e); 
				}
			}	
		}


		enabled = false;
		me.Event.trigger("instance.disable", []); 

		return true;
	};

	//Setup the events
	for(var key in JOBAD.events){
		if(JOBAD.events.hasOwnProperty(key) && !JOBAD.isEventDisabled(key)){

			me.Event[key] = JOBAD.util.bindEverything(JOBAD.events[key].namespace, me);
			
			(function(){
				var k = key; 
				var orgResult = me.Event[k].getResult; 
				me.Event[k].getResult = function(){
					var augmentedResult = me.Event.trigger(k, arguments); //Trigger the event
					var realResult = orgResult.apply(this, arguments); 
					return realResult; 
				}
			})()

			if(typeof JOBAD.events[key].Setup.init == "function"){
				JOBAD.events[key].Setup.init.call(me, me);
			} else if(typeof JOBAD.events[key].Setup.init == "object"){
				for(var name in JOBAD.events[key].Setup.init){
					if(JOBAD.events[key].Setup.init.hasOwnProperty(name)){
						if(me.hasOwnProperty(name)){
							JOBAD.console.warn("Setup: Event '"+key+"' tried to override '"+name+"'")
						} else {
							me[name] = JOBAD.util.bindEverything(JOBAD.events[key].Setup.init[name], me);
						}
					}
				}
			}


		}	
	}
	
});


JOBAD.modules.ifaces.push([
	function(properObject, ModuleObject){
		//Called whenever 
		for(var key in JOBAD.events){
			if(ModuleObject.hasOwnProperty(key)){
				properObject[key] = ModuleObject[key];
			}
		}
		return properObject;
	},
	function(ServiceObject){
		for(var key in JOBAD.events){
			if(ServiceObject.hasOwnProperty(key)){
				this[key] = ServiceObject[key];
			} else {
				this[key] = JOBAD.events[key]["default"];
			}
		}
	}]);

/*
	Checks if an Event is disabled by the configuration. 
	@param evtname Name of the event that is disabled. 
*/
JOBAD.isEventDisabled = function(evtname){
	return (JOBAD.util.indexOf(JOBAD.config.disabledEvents, evtname) != -1);
};

JOBAD.events = {};

//config
JOBAD.config.disabledEvents = []; //Disabled events
JOBAD.config.cleanModuleNamespace = false;//if set to true this.loadedModule instances will not allow additional functions