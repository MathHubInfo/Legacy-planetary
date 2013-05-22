# JOBAD.modules

* **Function** [`JOBAD.modules.loadedModule(name, args, JOBADInstance)`](loadedModule.md) Represents a loaded module. 
* **Array** `JOBAD.modules.ifaces` An array containing extensions to JOBAD modules. 
* **Object** `JOBAD.modules.extensions` A map containing module extensions. 
* **Array** `JOBAD.modules.cleanProperties` A list of clean module properties. 
* **Function** `JOBAD.modules.register(moduleObject)` Registers a new JOBAD module with JOBAD. 
	* **Object** `moduleObject` The object representing the module to register with JOBAD. See [`template`](../../template.md). 
	* **returns** `true` if successfull, otherwise `false`
* **Function** `JOBAD.modules.createProperModuleObject(moduleObject)` Creates a proper Module Object. 
	* **Object** `moduleObject` The object representing the module to register with JOBAD. 
	* **returns** The proper `moduleObject` (adding omitted properties etc. ) If it fails, it returns `false`. 
* **Function** `JOBAD.modules.available(name, checkDeps)` Checks if a module is registered with JOBAD. 
	* **String** `name` Name of the module to check. 
	* **Boolean** `checkDeps` Also checks if that modules dependencies are available. 
	* **returns** a boolean indicating if the module is available. 
* **Function** `JOBAD.modules.getDependencyList(name)` checks the complete dependency tree of a module. Warning: Does not check for circular dependencies. May hang up it in a loop in that case. 
	* **String** `name` Name of the module to check. 
	* **returns** an array of dependencies of name including name in such an order, thet they can all be loaded without unresolved dependencies. 
