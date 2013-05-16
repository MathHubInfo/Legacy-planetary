# JOBADInstance.Modules
	
* **Object** `.modules` Namespace for module related functions. 

* **Function** `.modules.load(module, options, ignoreDeps=false)` loads a JOBAD module if not yet loaded.
	* **String** `module` Name of module to load. 
	* **Array[Mixed]** `options` Array of options to pass to the module. 
	* **Boolean** `ignoredeps` Set to `true` to load the module without checking if its dependencies are satisfied. Defaults to `false`. 
* **Function** `.modules.loaded(module)` Checks if a module is loaded. 
	* **String** Name of the module to check. 
	* **returns** boolean indicating if the module is loaded. 
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
