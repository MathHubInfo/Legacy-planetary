# JOBADInstance.Modules
	
* **Object** `.modules` Namespace for module related functions. 

* **Function** `.modules.load(module, options, config)` Overloaded. See also below. Loads a JOBAD module if not yet loaded.
	* **String** `module` Name of module to load. 
	* **Array[Mixed]** `options` Array of options to pass to the module. 
	* **Mixed** `config` Configuration for module loading. You can also use only `config.activate` or `config.ready` instead. 
		* **Boolean** `activate` Should the module be activated automatically? Default: True. 
		* **Function** `load(state, module)` Callback when a single module in all the modules to load is loaded. 
			* **Boolean** `state` Was loading successfull?
			* **Array[String]** `modules` An array containing the module loaded
		* **Function** `ready(state, modules)` Callback when all modules have loaded. 
			* **Boolean** `state` Was loading successfull?
			* **Array[String]** `modules` An array of modules loaded. 
* **Function** `.modules.load(modules, config)` Overloaded. See also above. Loads JOBAD modules if not yet loaded.
	* **Mixed** `modules` Names of module to load. May be a name-option map or an array of names or an array of `[name, option, activate]` pairs. 
	* **Mixed** `config` Configuration for module loading. You can also use only `config.activate` or `config.ready` instead. 
		* **Boolean** `activate` Should the module be activated automatically? Default: True. 
		* **Function** `load(state, module)` Callback when a single module in all the modules to load is loaded. 
			* **Boolean** `state` Was loading successfull?
			* **Array[String]** `modules` An array containing the module loaded
		* **Function** `ready(state, modules)` Callback when all modules have loaded. 
			* **Boolean** `state` Was loading successfull?
			* **Array[String]** `modules` An array of modules loaded. 

* **Function** `.modules.loaded(modules)` Checks if a set of modules is loaded. 
	* **String|Array[String]** `modules` Name of the modules to check. 
	* **returns** boolean indicating if the modules loaded. 
* **Function** `.modules.loadedOK(modules)` Checks if a set of modules is loaded fine. 
	* **String|Array[String]** `modules` Name of the modules to check. 
	* **returns** boolean indicating if the modules loaded without problems.
* **Function** `.modules.loadedFail(modules)` Checks if a set of modules is loaded with problems. 
	* **String|Array[String]** `modules` Name of the modules to check. 
	* **returns** boolean indicating if the modules loaded with problems.
* **Function** `.modules.inLoadProcess(modules)` Checks if a set of modules is somewhere in the loading process (either loading or loaded or quenued for loading)
	* **String|Array[String]** `modules` Name of the modules to check. 
	* **returns** boolean indicating if the modules are referenced somewhere.

* **Function** `.modules.once(modules, callback, scope, run)` Registers a callback once a certain set of modules is registered. 
	* **String|Array[String]** `modules` Name of the modules to wait for. 
	* **Function** `callback(modules, state)` Callback. 
	* **Object** `scope` Scope to use for callback. Optional. Default: Current JOBADInstance. 
	* **Boolean** `run` Should the loop for executing triggers be run immediatly? Default: True. 

* **Function** `.modules.activate(module)` Activates a module. 
	* **String** `module` The module to activate. 
* **Function** `.modules.deactivate(module)` Deactivates a module. 
	* **String** `module` The module to deactivate. 
* **Function** `.modules.isActive(module)` Checks if a module is loaded and active. 
	* **String** `module` The module to check for.
	* **returns** boolean indicating if the module is loaded and active. 
* **Function** `.modules.getIdentifiers()` Gets the identifiers of all loaded modules. 
* **Function** `.modules.getLoadedModule(id)` Gets the specefied loaded module. 
	* **String** `id` Identifier of the module to get. 
* **Function** `.modules.iterate(callback)` Iterate over all active modules with callback. 
	* **Function** `callback(module)`
		* **Undefined** `this`
		* **Instance[ [JOBAD.modules.loadedModule](../JOBAD.modules/loadedModule.md) ]** `module` The current module
		* **should return** `false` to abort iteration. Otherwise `true`. 
	* **returns** an array of results of `callback`. 
* **Function** `.modules.iterateAnd(callback)` Iterate over all active modules with callback. 
	* **Function** `callback(module)`
		* **Undefined** `this`
		* **Instance[ [JOBAD.modules.loadedModule](../JOBAD.modules/loadedModule.md) ]** `module` The current module
		* **should return** `false` to abort iteration. Otherwise `true`. 
	* **returns** `true` if no `callback` returned `false`, otherwise `false`. 
