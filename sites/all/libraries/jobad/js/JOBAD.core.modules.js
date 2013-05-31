/*
	JOBAD Core Module logic
	depends:
		JOBAD.core.js
		
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


//JOBAD module iface for JOBADInstances
JOBAD.ifaces.push(function(me, args){
	var InstanceModules = {};
	var disabledModules = [];
	
	this.modules = {};

	/*
		loads a JOBAD module if not yet loaded. 
		@param module Name of module to load. 
		@param options Array of options to pass to the module. 
		@param ignoredeps Boolean. Ignore dependencies? (Default: false). 
		@returns boolean
	*/
	this.modules.load = function(module, options, ignoredeps){
		if(me.modules.loaded(module)){
			return;	
		}

		var ignoredeps = (typeof ignoredeps == 'boolean')?ignoredeps:false;
	
		if(ignoredeps){
			if(!JOBAD.modules.available(module)){
				JOBAD.error('Error loading module '+module);			
			}
			InstanceModules[module] = new JOBAD.modules.loadedModule(module, options, me);
			InstanceModules[module].onActivate(me);
			return true;
		} else {
			var deps = JOBAD.modules.getDependencyList(module);
		        if(!deps){
				JOBAD.console.warn("Unresolved dependencies for module '"+module+"'. "); //Module not found (has no dependecnies)
				return false;	
			}
			for(var i=0;i<deps.length;i++){
				me.modules.load(deps[i], options, true);
			}
			return true;
		}
		

	 };

	/*
		Checks if a module is loaded. 
		@param module Name of the module to check. 
		@returns boolean
	*/
	this.modules.loaded = function(module){
		return InstanceModules.hasOwnProperty(module);
	}

	/*
		Deactivates a module
		@param module Module to be deactivated. 
	*/
	this.modules.deactivate = function(module){
		if(!me.modules.isActive(module)){
			JOBAD.console.warn("Module '"+module+"' is already deactivated. ");
			return;
		}
		disabledModules.push(module);
		this.element.trigger('JOBAD.Event', ['deactivate']);
		InstanceModules[module].onDeactivate(me);
	}

	/*
		Activates a module
		@param module Module to be activated. 
	*/
	this.modules.activate = function(module){
		if(me.modules.isActive(module)){
			JOBAD.console.warn("Module '"+module+"' is already activated. ");
			return;	
		}
		disabledModules = JOBAD.refs._.without(disabledModules, module);
		this.element.trigger('JOBAD.Event', ['activate']);
		InstanceModules[module].onActivate(me);
	};
	
	/*
		Checks if a module is active. 
		@param module Module to check. 
	*/
	this.modules.isActive = function(module){
		return (JOBAD.refs._.indexOf(disabledModules, module)==-1); 
	};
	
	/*
		Gets the identifiers of all loaded modules. 
	*/	
	this.modules.getIdentifiers = function(){
		var keys = [];
		for(var key in InstanceModules){
			if(InstanceModules.hasOwnProperty(key)){
				keys.push(key);
			}	
		}
		return keys;
	};
	
	/*
		Gets the loaded module with the specefied identifier. 
	*/	
	this.modules.getLoadedModule = function(id){
		if(!InstanceModules.hasOwnProperty(id)){
			JOBAD.console.warn("Can't find JOBAD.modules.loadedModule instance of '"+id+"'");
			return;
		}
		return InstanceModules[id];
	};
	
	/*
		Iterate over all active modules with callback. 
		if cb returns false, abort. 
		@param callback Function to call. 
		@returns Array of results. 
	*/
	this.modules.iterate = function(callback){
		var res = [];
		for(var key in InstanceModules){
			if(InstanceModules.hasOwnProperty(key)){
				if(me.modules.isActive(key)){
					var cb = callback(InstanceModules[key]);
					if(!cb){
						return res;					
					} else {
						res.push(cb);					
					}
				}			
			}		
		}
		return res;
	};
	
	/*
		Iterate over all active modules with callback. Abort once some callback returns false. 
		@param callback Function to call. 
		@returns true if no callback returns false, otherwise false. 
	*/
	this.modules.iterateAnd = function(callback){
		for(var key in InstanceModules){
			if(InstanceModules.hasOwnProperty(key)){
				if(me.modules.isActive(key)){
					var cb = callback(InstanceModules[key]);
					if(!cb){
						return false;					
					}
				}			
			}		
		}
		return true;
	};
	
	this.modules = JOBAD.util.bindEverything(this.modules, this);
});

JOBAD.modules = {};
JOBAD.modules.extensions = {}; //EXtensions for modules
JOBAD.modules.ifaces = []; //JOABd Module ifaces
JOBAD.modules.cleanProperties = ["init", "activate", "deactivate", "globalinit", "info"];

var moduleList = {};
var moduleStorage = {};

/* 
	Registers a new JOBAD module with JOBAD. 
	@param ModuleObject The ModuleObject to register. 
	@returns boolean if successfull
*/
JOBAD.modules.register = function(ModuleObject){
	var moduleObject = JOBAD.modules.createProperModuleObject(ModuleObject);
	if(!moduleObject){
		return false;	
	}
	var identifier = moduleObject.info.identifier;
	if(JOBAD.modules.available(identifier)){
		return false;	
	} else {
		moduleList[identifier] = moduleObject;
		moduleStorage[identifier] = {};
		return true;
	}
};

/* 
	Creates a proper Module Object. 
	@param ModuleObject The ModuleObject to register. 
	@returns proper Module Object (adding omitted properties etc. Otherwise false. 
*/
JOBAD.modules.createProperModuleObject = function(ModuleObject){
	if(!JOBAD.refs._.isObject(ModuleObject)){
		return false;
	}
	var properObject = 
	{
		"globalinit": function(){},
		"init": function(){},
		"activate": function(){},
		"deactivate": function(){}
	};
	
	for(var key in properObject){
		if(properObject.hasOwnProperty(key) && 	ModuleObject.hasOwnProperty(key)){
			var obj = ModuleObject[key];
			if(typeof obj != 'function'){
				return false;			
			}
			properObject[key] = ModuleObject[key];
		}
	}

	if(ModuleObject.hasOwnProperty("info")){
		var info = ModuleObject.info;
		properObject.info = {
			'version': '',
			'dependencies': []	
		};
		
		if(info.hasOwnProperty('version')){
			if(typeof info['version'] != 'string'){
				return false;			
			}
			properObject.info['version'] = info['version'];
		}

		if(info.hasOwnProperty('hasCleanNamespace')){
			if(info['hasCleanNamespace'] == false){
				properObject.info.hasCleanNamespace = false;
			} else {
				properObject.info.hasCleanNamespace = true;
			}
		} else {
			properObject.info.hasCleanNamespace = true;			
		}

		if(info.hasOwnProperty('dependencies')){
			var arr = info['dependencies'];
			if(!JOBAD.refs._.isArray(arr)){
				return false;			
			}
			properObject.info['dependencies'] = arr;
		}

		try{
			JOBAD.refs._.map(['identifier', 'title', 'author', 'description'], function(key){
				if(info.hasOwnProperty(key)){
					var infoAttr = info[key];
					if(typeof infoAttr != 'string'){
						throw ""; //return false;
					}
					properObject.info[key] = infoAttr;
				} else {
					throw ""; //return false;
				}
			});
		} catch(e){
			return false;		
		}

		properObject.namespace = {};

		for(var key in ModuleObject){
			if(ModuleObject.hasOwnProperty(key) && JOBAD.modules.cleanProperties.indexOf(key) == -1){
				if(properObject.info.hasCleanNamespace){
					JOBAD.console.warn("Warning: Module '"+properObject.info.identifier+"' says its namespace is clean, but property '"+key+"' found. Check ModuleObject.info.hasCleanNamespace. ");	
				} else {
					properObject.namespace[key] = ModuleObject[key];
				}
			}
		}
		
		for(var i=0;i<JOBAD.modules.ifaces.length;i++){
			var mod = JOBAD.modules.ifaces[i];
			properObject = mod[0].call(this, properObject, ModuleObject);
		}
		
		for(var key in JOBAD.modules.extensions){
			var mod = JOBAD.modules.extensions[key];
			var av = ModuleObject.hasOwnProperty(key);
			var prop = ModuleObject[key];
			if(mod.required && !av){
				JOBAD.error("Error: Cannot load module '"+properObject.info.identifier+"'. Missing required core extension '"+key+"'. ");
			}

			if(av){
				if(!mod.validate(prop)){
					JOBAD.error("Error: Cannot load module '"+properObject.info.identifier+"'. Core Extension '"+key+"' failed to validate. ");
				}
			}
			
			properObject[key] = mod.init(av, prop, ModuleObject, properObject);
		}
		
		return properObject;

	} else {
		return false;	
	}

};

/* 
	Checks if a module is available. 
	@param name The Name to check. 
	@param checkDeps Optional. Should dependencies be checked? (Will result in an endless loop if circular dependencies exist.) Default false. 
	@returns boolean.
*/
JOBAD.modules.available = function(name, checkDeps){
	var checkDeps = (typeof checkDeps == 'boolean')?checkDeps:false;
	var selfAvailable = moduleList.hasOwnProperty(name);
	if(checkDeps && selfAvailable){
		var deps = moduleList[name].info.dependencies;
		for(var i=0;i<deps.length;i++){
			if(!JOBAD.modules.available(deps[i], true)){
				return false;			
			}
		}
		return true;
	} else {
		return selfAvailable;
	}
};

/* 
	Returns an array of dependencies of name including name in such an order, thet they can all be loaded without unresolved dependencies. 
	@param name The Name to check. 
	@returns array of strings or false if some module is not available. 
*/
JOBAD.modules.getDependencyList = function(name){
	if(!JOBAD.modules.available(name, true)){
		return false;	
	}
	var depArray = [name];
	var deps = moduleList[name].info.dependencies;

        for(var i=deps.length-1;i>=0;i--){
		depArray = JOBAD.refs._.union(depArray, JOBAD.modules.getDependencyList(deps[i]));
	}
	return depArray;
};

/*
	Loads a module, assuming the dependencies are already available. 
	@param name Module to loads
	@param args Arguments to pass to the module. 
	@returns new JOBAD.modules.loadedModule instance. 
*/
JOBAD.modules.loadedModule = function(name, args, JOBADInstance){

	if(!JOBAD.modules.available(name)){
		JOBAD.error("Module is not available and cant be loaded. ");	
	}

	/*
		Storage shared accross all module instances. 
	*/
	this.globalStore = 
	{
		"get": function(prop){
			return  moduleStorage[name][prop+"_"];		
		},
		"set": function(prop, val){
			moduleStorage[name][prop+"_"] = val;
		},
		"delete": function(prop){
			delete moduleStorage[name][prop+"_"];
		},
		"keys": function(){
			var keys = [];
			for(var key in moduleStorage[name]){
				if(moduleStorage[name].hasOwnProperty(key) && key[key.length-1] == "_"){
					keys.push(key.substr(0, key.length-1));
				}
			}
			return keys;
		}
	}
	
	var storage = {};
	/*
		Storage contained per instance of the module.  
	*/
	this.localStore = 
	{
		"get": function(prop){
			return  storage[prop];		
		},
		"set": function(prop, val){
			storage[prop] = val;
		},
		"delete": function(prop){
			delete storage[name];
		},
		"keys": function(){
			var keys = [];
			for(var key in storage){
				if(storage.hasOwnProperty(key)){
					keys.push(key);
				}
			}
			return keys;
		}
	}

	var ServiceObject = moduleList[name];
	/*
		Information about this module. 
	*/
	this.info = function(){
		return ServiceObject.info;
	}

	/*
		gets the JOBAD instance bound to this module object
	*/
	this.getJOBAD = function(){
		return JOBADInstance;	
	};


	this.isActive = function(){
		return JOBADInstance.modules.isActive(this.info().identifier);
	}

	//Initilisation

	if(!moduleStorage[name]["init"]){
		moduleStorage[name]["init"] = true;
		ServiceObject.globalinit.apply(undefined, []);
		for(var key in JOBAD.modules.extensions){
			var mod = JOBAD.modules.extensions[key];
			var val = ServiceObject[key];
			if(typeof mod["onFirstLoad"] == 'function'){
				mod.onFirstLoad(this.globalStore);
			}
		}
	}

	var params = [JOBADInstance];
	
	for(var i=0;i<args.length;i++){
		params.push(args[i]);	
	}


	if(JOBAD.config.cleanModuleNamespace){
		if(!ServiceObject.info.hasCleanNamespace){
			JOBAD.console.warn("Warning: Module '"+name+"' may have unclean namespace, but JOBAD.config.cleanModuleNamespace is true. ");		
		}
	} else {
		var orgClone = JOBAD.refs._.clone(ServiceObject.namespace);
		for(var key in orgClone){
			if(!JOBAD.modules.cleanProperties.hasOwnProperty(key) && orgClone.hasOwnProperty(key)){
				this[key] = orgClone[key];
			}
		};
	}
	
	//Init module extensions
	for(var key in JOBAD.modules.extensions){
		var mod = JOBAD.modules.extensions[key];
		var val = ServiceObject[key];
		if(typeof mod["onLoad"] == 'function'){
			mod.onLoad.call(this, val, ServiceObject, this);
		}
	}
	
	//Init module ifaces
	for(var i=0;i<JOBAD.modules.ifaces.length;i++){
		var mod = JOBAD.modules.ifaces[i];
		mod[1].call(this, ServiceObject);
	}
	
	//Core events: activate, deactivate
	this.onActivate = ServiceObject.activate;
	this.onDeactivate = ServiceObject.deactivate;
	
	this.activate = function(){
		return JOBADInstance.modules.activate(this.info().identifier);
	};
	
	this.deactivate = function(){
		return JOBADInstance.modules.deactivate(this.info().identifier);
	}
	
	ServiceObject.init.apply(this, params);		
};
