/*
	JOBAD Core Module logic
		
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


JOBAD.ifaces.push(function(me, args){

	//modules namespace
	this.modules = {};

	var InstanceModules = {}; //Modules loaded
	var disabledModules = []; //Modules disabled

	var loadQuenue = []; //the quenue of things to load
	var loadQuenueIndex = -1; //the loadQuenueIndex

	var loadQuenueOptions = {}; //options Array
	var loadQuenueAutoActivate = []; //auto activate
	var execQuenue = []; //quenue of exec callbacks

	var loadFail = []; //load failed

	var isQuenueRunning = false;
	
	/*
		runs the load Quenue
	*/
	var runLoadQuenue = function(){
		isQuenueRunning = true; //we are running

		//run the quenue
		loadQuenueIndex++;
		if(loadQuenue.length > loadQuenueIndex){ //do we have memebers
			var modName = loadQuenue[loadQuenueIndex];
			var options = loadQuenueOptions[modName];
			if(typeof options == "undefined"){
				options = [];
			}
			doLoad(modName, options, runFinishQuenue);
		} else {
			runFinishQuenue(function(){
				loadQuenueIndex--; //reset the index
				isQuenueRunning = false; //STOP
			});
		}
	};

	var runFinishQuenue = function(next){
		window.setTimeout(function(){
			//run the finish quenue
			execQuenue = execQuenue.filter(function(m){
				if(me.modules.loaded(m[0])){
					try{
						m[1].call(m[2], me.modules.loadedOK(m[0]), m[0]);
					} catch(e){}
					return false;
				} else {
					return true;
				}
			});

			window.setTimeout(next, 0); //run the load quenue again
		}, 0);
	}

	/*
		Loads a module
		@param	options	Options to pass to the module
		@param	callback	Callback to execute
	*/
	var doLoad = function(module, options){
		var auto_activate = loadQuenueAutoActivate.indexOf(module) != -1; //TODO: Add option somewhere
		try{
			InstanceModules[module] = new JOBAD.modules.loadedModule(module, options, me, function(suc, msg){
				if(!suc){
					markLoadAsFailed(module, msg);
				} else {
					disabledModules.push(module); //we are disabled by default

					if(auto_activate){
						me.modules.activate(module);
					}
				}
				runFinishQuenue(runLoadQuenue);
				
			});
		} catch(e){
			markLoadAsFailed(module, String(e));
			runFinishQuenue(runLoadQuenue);
		}
	 };

	var markLoadAsFailed = function(module, message){
		loadFail.push(module);
		try{
			delete InstanceModules[module];
		} catch(e){}

		JOBAD.console.error("Failed to load module '"+module+"': "+String(message));
	};

	var properLoadObj = function(obj){
		var res = [];

		if(JOBAD.util.isArray(obj)){
			for(var i=0;i<obj.length;i++){
				var proper = JOBAD.util.forceArray(obj[i]);

				if(typeof proper[1] == "boolean"){
					proper[2] = proper[1];
					proper[1] = [];
				}

				res.push(proper); 
			}
		} else {
			for(var key in obj){
				res.push([key, obj[key]]);
			}
		}

		return res;
	};

	/*
		Loads a module
		@param	modules	Modules to load
		@param config	Configuration. 
			config.ready	Callback when ready
			config.load		Callback on singular load
			config.activate	Should we automatically activate all modules? Default: True
	*/
	this.modules.load = function(modules, config, option){
		if(typeof modules == "string"){
			if(JOBAD.util.isArray(config)){
				return me.modules.load([[modules, config]], option);
			} else {
				return me.modules.load([modules], config, option);
			}
		}

		config = JOBAD.util.defined(config);
		config = (typeof config == "function")?{"ready": config}:config; 
		config = (typeof config == "booelan")?{"activate": config}:config; 


		var ready = JOBAD.util.forceFunction(config.ready, function(){});
		var load = JOBAD.util.forceFunction(config.load, function(){});

		var activate = JOBAD.util.forceBool(config.activate, true);

		var triggers = [];

		var everything = JOBAD.util.map(properLoadObj(modules), function(m){
			var mod = m[0];
			var opt = m[1];
			var act = m[2];

			triggers.push(mod); //add to the trigegrs

			if(typeof loadQuenueOptions[mod] == "undefined" && JOBAD.util.isArray(opt)){
				loadQuenueOptions[mod] = opt;
			}

			if(typeof act == "undefined"){
				act = activate; 
			}

			if(act){
				loadQuenueAutoActivate.push(mod); //auto activate
			}

			if(!JOBAD.modules.available(mod)){
				markLoadAsFailed(mod, "Module not available. (Did loading fail?)");
				return [];
			}

			if(!me.modules.inLoadProcess(mod)){
				var deps = JOBAD.modules.getDependencyList(mod);
				if(!deps){
					markLoadAsFailed(mod, "Failed to resolve dependencies (Is a dependent module missing? )");
					return [];
				} else {
					return deps;
				}
			} else {
				if(act && me.modules.loadedOK(mod) && !me.modules.isActive(mod)){
					me.modules.activate(mod); 
				}
				return []; //it's already in load process
			}
		});

		//clean up
		everything = JOBAD.util.flatten(everything);
		everything = JOBAD.util.union(everything);
		triggers = JOBAD.util.union(triggers)

		//register all the callbacks
		JOBAD.util.map(triggers, function(m){
			me.modules.once(m, load, me, false);
		});
		me.modules.once(triggers, ready, me, false);

		//add them to the quenue and run it
		loadQuenue = JOBAD.util.union(loadQuenue, everything);

		if(!isQuenueRunning){
			runLoadQuenue(); 
		}
	}

	 /*
	 	Defers a callback until the specefied modules are loaded. 
	 */
	this.modules.once = function(modules, cb, scope, run){
		execQuenue.push([modules, cb, (typeof scope == "undefined")?me:scope]);

		var run = JOBAD.util.forceBool(run, true);

		//if we are inactive run the quenue
		if(!isQuenueRunning && run){
			runLoadQuenue(); 
		}
	 };

	/*
		Checks if a module is loaded. 
		@param module Name of the module(s) to check. 
		@returns boolean
	*/
	this.modules.loaded = function(module){
		return (me.modules.loadedOK(module) || me.modules.loadedFail(module)); 
	}

	this.modules.loadedOK = function(module){
		if(JOBAD.util.isArray(module)){
			return JOBAD.util.lAnd(JOBAD.util.map(module, function(m){
				return me.modules.loadedOK(m);
			}));
		} else {
			return InstanceModules.hasOwnProperty(module);
		}
	}

	this.modules.loadedFail = function(module){
		if(JOBAD.util.isArray(module)){
			return JOBAD.util.lOr(JOBAD.util.map(module, function(m){
				return me.modules.loadedFail(m);
			}));
		} else {
			return (JOBAD.util.indexOf(loadFail, module) != -1);
		}
	}

	this.modules.inLoadProcess = function(module){
		if(JOBAD.util.isArray(module)){
			return JOBAD.util.lAnd(JOBAD.util.map(module, function(m){
				return me.modules.inLoadProcess(m);
			}));
		} else {
			return (JOBAD.util.indexOf(loadQuenue, module) != -1);
		}
	};

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
		this.element.trigger('JOBAD.Event', ['deactivate', module]);
		InstanceModules[module].onDeactivate(me);
	}

	/*
		Activates a module if it is not yet actiavted
		@param module Module to be activated. 
	*/
	this.modules.activate = function(module){
	
		if(me.modules.isActive(module)){
			return false; 	
		}

		var todo = function(){
			if(me.modules.isActive(module)){
				return; 	
			}

			disabledModules = JOBAD.util.without(disabledModules, module);

			var deps = JOBAD.modules.getDependencyList(module);		
			for(var i=0;i<deps.length-1;i++){
				me.modules.activate(deps[i]); // i am last
			}
			

			InstanceModules[module].onActivate(me);
			me.element.trigger('JOBAD.Event', ['activate', module]);
		}

		if(me.Setup.isEnabled()){
			todo();
		} else {
			me.Setup.deferUntilEnabled(todo);
		}

		return true; 
	};
	
	/*
		Checks if a module is active. 
		@param module Module to check. 
	*/
	this.modules.isActive = function(module){
		return (JOBAD.util.indexOf(disabledModules, module)==-1 && me.modules.loadedOK(module)); 
	};

	/*
		Checks if a module is inactive. 
		@param module Module to check. 
	*/
	this.modules.isInActive = function(module){
		return (JOBAD.util.indexOf(disabledModules, module)!=-1 && me.modules.loadedOK(module)); 
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
	
	
	var onDisable = function(){
		var cache = [];
		
		//cache all the modules
		me.modules.iterate(function(mod){
			var name = mod.info().identifier;
			cache.push(name);
			me.modules.deactivate(name);
			return true;
		});
		
		//reactivate all once setup is called again
		me.Setup.deferUntilEnabled(function(){
			for(var i=0;i<cache.length;i++){
				var name = cache[i];
				if(!me.modules.isActive(name)){
					me.modules.activate(name);
				}
			}
			me.Setup.deferUntilDisabled(onDisable); //reregister me
		});
	};
	
	this.Event = onDisable; 
	
	this.modules = JOBAD.util.bindEverything(this.modules, this);
});

JOBAD.modules = {};
JOBAD.modules.extensions = {}; //Extensions for modules
JOBAD.modules.ifaces = []; //JOABD Module ifaces

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
	if(!JOBAD.util.isObject(ModuleObject)){
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

		if(info.hasOwnProperty('externals')){
			if(JOBAD.util.isArray(info["externals"])){
				properObject.info.externals = info["externals"];
			} else {
				return false;
			}
		} else {
			properObject.info.externals = [];
		}

		if(info.hasOwnProperty('async')){
			properObject.info.async = JOBAD.util.forceBool(info.async);
		} else {
			properObject.info.async = false;
		}

		if(!properObject.info.async){
			var sync_init = properObject.globalinit;
			properObject.globalinit = function(next){
				sync_init(); 
				window.setTimeout(next, 0);
			}
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
			if(!JOBAD.util.isArray(arr)){
				return false;			
			}
			properObject.info['dependencies'] = arr;
		}

		if(info.hasOwnProperty('url')){
			if(!JOBAD.util.isUrl(info.url)){
				return false;			
			}
			properObject.info['url'] = info.url;
		} else {
			info.url = false; 
		}

		try{
			JOBAD.util.map(['identifier', 'title', 'author', 'description'], function(key){
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
			if(ModuleObject.hasOwnProperty(key) && JOBAD.util.indexOf(JOBAD.modules.cleanProperties, key) == -1){
				if(properObject.info.hasCleanNamespace){
					JOBAD.console.warn("Warning: Module '"+properObject.info.identifier+"' says its namespace is clean, but property '"+key+"' found. Check ModuleObject.info.hasCleanNamespace. ");	
				} else {
					properObject.namespace[key] = ModuleObject[key];
				}
			}
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

			if(typeof mod["onRegister"] == "function"){
				mod.onRegister(properObject[key], properObject, ModuleObject);
			}
		}
		
		for(var i=0;i<JOBAD.modules.ifaces.length;i++){
			var mod = JOBAD.modules.ifaces[i];
			properObject = mod[0].call(this, properObject, ModuleObject);
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
		depArray = JOBAD.util.union(depArray, JOBAD.modules.getDependencyList(deps[i]));
	}

	depArray.reverse(); //reverse it

	return depArray;
};

/*
	Storage shared accross all module instances. 
*/
JOBAD.modules.globalStore = 
{
	"get": function(name, prop){
		if(JOBAD.util.isObject(prop) && !JOBAD.util.isArray(prop)){
			var prop = JOBAD.util.keys(prop);
		}

		if(JOBAD.util.isArray(prop)){
			var res = {};

			JOBAD.util.map(prop, function(key){
				res[key] = JOBAD.modules.globalStore.get(name, key); 
			});

			return res;
		}

		return  moduleStorage[name][prop+"_"];
	},
	"set": function(name, prop, val){
		if(JOBAD.util.isObject(prop) && !JOBAD.util.isArray(prop)){
			var prop = JOBAD.util.keys(prop);
		}

		if(JOBAD.util.isArray(prop)){

			return JOBAD.util.map(prop, function(key){
				return JOBAD.modules.globalStore.set(name, key, prop[key]); 
			});
		}

		moduleStorage[name][prop+"_"] = val;

		return prop;
	},
	"delete": function(name, prop){
		delete moduleStorage[name][prop+"_"];
	},
	"keys": function(name){
		var keys = [];
		for(var key in moduleStorage[name]){
			if(moduleStorage[name].hasOwnProperty(key) && key[key.length-1] == "_"){
				keys.push(key.substr(0, key.length-1));
			}
		}
		return keys;
	},
	"getFor": function(name){
		return {
			"get": function(prop){
				return JOBAD.modules.globalStore.get(name, prop);	
			},
			"set": function(prop, val){
				return JOBAD.modules.globalStore.set(name, prop, val);	
			},
			"delete": function(prop){
				return JOBAD.modules.globalStore["delete"](name, prop);	
			},
			"keys": function(){
				JOBAD.modules.globalStore.keys(name);	
			}
		};
	}
};

/*
	Loads a module, assuming the dependencies are already available. 
	@param name Module to loads
	@param args Arguments to pass to the module. 
	@returns new JOBAD.modules.loadedModule instance. 
*/
JOBAD.modules.loadedModule = function(name, args, JOBADInstance, next){

	var me = this;
	var next = JOBAD.util.forceFunction(next, function(){});

	if(!JOBAD.modules.available(name)){
		JOBAD.error("Module is not available and cant be loaded. ");	
	}

	if(!JOBAD.util.isArray(args)){
		var args = []; //we force arguments
	}

	this.globalStore = JOBAD.modules.globalStore.getFor(name);
	
	var storage = {};
	/*
		Storage contained per instance of the module.  
	*/
	this.localStore = 
	{
		"get": function(prop){
			if(JOBAD.util.isObject(prop) && !JOBAD.util.isArray(prop)){
				var prop = JOBAD.util.keys(prop);
			}

			if(JOBAD.util.isArray(prop)){
				var res = {};

				JOBAD.util.map(prop, function(key){
					res[key] = storage[key];
				});

				return res;
			}
			return  storage[prop];		
		},
		"set": function(prop, val){
			if(JOBAD.util.isObject(prop) && !JOBAD.util.isArray(prop)){
				var prop = JOBAD.util.keys(prop);
			}

			if(JOBAD.util.isArray(prop)){

				return JOBAD.util.map(prop, function(key){
					storage[key] = prop[key];
				});

			}

			storage[prop] = val;
			return prop;
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

	//add JOBADINstance
	var params = args.slice(0);
	params.unshift(JOBADInstance);

	var limited = {}; //limited this for globalinit
	limited.info = ServiceObject.info;
	limited.globalStore = this.globalStore;

	if(JOBAD.config.cleanModuleNamespace){
		if(!ServiceObject.info.hasCleanNamespace){
			JOBAD.console.warn("Warning: Module '"+name+"' may have unclean namespace, but JOBAD.config.cleanModuleNamespace is true. ");		
		}

	} else {
		var orgClone = JOBAD.util.clone(ServiceObject.namespace);
		
		for(var key in orgClone){
			if(!JOBAD.modules.cleanProperties.hasOwnProperty(key) && orgClone.hasOwnProperty(key)){
				this[key] = orgClone[key];
				limited[key] = orgClone[key];
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
		if(JOBAD.util.isArray(mod["globalProperties"])){
			for(var i=0;i<mod["globalProperties"].length;i++){
				var prop = mod["globalProperties"][i];
				limited[prop] = this[prop];
			}
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

	var do_next = function(){
		ServiceObject.init.apply(me, params); 
		next(true);
	};

	if(!moduleStorage[name]["init"]){
		moduleStorage[name]["init"] = true;

		for(var key in JOBAD.modules.extensions){
			var mod = JOBAD.modules.extensions[key];
			var val = ServiceObject[key];
			if(typeof mod["onFirstLoad"] == 'function'){
				mod.onFirstLoad(me.globalStore);
			}
		}

		JOBAD.util.loadExternalJS(ServiceObject.info.externals, function(urls, suc){
			if(!suc){
				next(false, "Can't load external dependencies: Timeout. "); 
			} else {
				ServiceObject.globalinit.call(limited, do_next);
			}
			
		});
	} else {
		do_next();
	}
	
	
};