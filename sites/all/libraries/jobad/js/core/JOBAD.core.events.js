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

//Provides custom events for modules
JOBAD.ifaces.push(function(me, args){

	/* Setup core function */
	/* Setup on an Element */

	var enabled = false;
	
	var activation_cache = [];
	var deactivation_cache = [];

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
		Defer an event until JOBAD is enabled. 
	*/
	this.Setup.deferUntilEnabled = function(func){
		activation_cache.push(func);
	};
	
	/*
		Defer an even until JOBAD is disabled
	*/
	this.Setup.deferUntilDisabled = function(func){
		deactivation_cache.push(func);
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

		for(var key in me.Event){
			JOBAD.events[key].Setup.enable.call(me, root);
		}
		
		while(activation_cache.length > 0){
			try{
				activation_cache.pop()();
			} catch(e){
				JOBAD.console.log("Warning: Defered Activation event failed to execute: "+e.message);
			}
		}
		
		enabled = true; //we are enabled;

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

		for(var key in JOBAD.events){
			if(JOBAD.events.hasOwnProperty(key) && !JOBAD.isEventDisabled(key)){
				JOBAD.events[key].Setup.disable.call(me, root);
			}	
		}
		
		while(deactivation_cache.length > 0){
			try{
				deactivation_cache.pop()();
			} catch(e){
				JOBAD.console.log("Warning: Defered Deactivation event failed to execute: "+e);
			}
		}
		
		enabled = false;

		return true;
	};
	
	//this.Event is a cache for setup events
	this.Setup.deferUntilDisabled(this.Event);
	
	/* Event namespace */
	this.Event = {}; //redefine it
	
	//Setup the events
	for(var key in JOBAD.events){
		if(JOBAD.events.hasOwnProperty(key) && !JOBAD.isEventDisabled(key)){

			me.Event[key] = JOBAD.util.bindEverything(JOBAD.events[key].namespace, me);
			
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