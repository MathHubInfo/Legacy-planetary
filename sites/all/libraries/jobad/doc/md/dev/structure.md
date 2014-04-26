# The JOBAD Structure
JOBAD is structured into several different areas. 

The `JOBAD` variable holds everything related to JOBAD. It is also a constructor for JOBAD Instances. The JOBAD Core uses this as a namespace. 

`JOBAD.modules` is a namespace which hold module related functions. These are functions which handle module loading, module dependencies etc. 

`JOBAD.Events` contains all JOBAD Events code. 

`JOBAD.UI` contains all UI related functions. 

## Extendability
The JOBAD Core is written in such a way that it can be modified very easily without having to change the existing functions. 
 **This API should not be used by module developers but only by developers who wish to extend the core.**
### JOBAD.ifaces
`JOBAD.ifaces` is an array of functions. They are called every time the JOBAD constructor is called in order to allow extending JOBAD instances. 


### JOBAD.modules.ifaces
`JOBAD.modules.ifaces` is an array of function pairs: 

`[onCreateProperObject(properObject, ModuleObject), onModuleLoad(ServiceObject)]`

* **function** `onCreateProperObject(properObject, ModuleObject)` called every time a proper module object is created. 
	* **Object** `properObject` The proper Object to be created. May already contain previous registrations. 
	* **Object** `moduleObject` The module Object that was registered with JOBAD. #
	* **returns** `properObject`
* **function** `onModuleLoad(ServiceObject)` called every time a module is loaded. 
	* **Instance[JOBAD.modules.loadedModule]** `this` The current loaded module. 
	* **Object** `ServiceObject` A fully parsed Service Object which reprsensts the Service / Module currently being loaded. 

### JOBAD.modules.extensions
`JOBAD.modules.extensions` provides a similar interface but allows to actually extend the module Objects. 

* **Object** `JOBAD.modules.extensions.[name]`
	* **string** `name` The name of the property to be added to the Module object. 
* **Boolean** `JOBAD.modules.extensions.[name].required` States if the property is required. 
* **Function** `JOBAD.modules.extensions.[name].validate(prop)` Validates a property. 
	* **Object** `prop` The value of the property to validate. 
	* **returns** a boolean indicating success. 
	
* **Function** `JOBAD.modules.extensions.[name].init(available, value, ModuleObject, properObject)` Initialises the module and adds it to the properModule Object 
	* **Boolean** `available` States if the property is available. 
	* **Object** `value` The value of the property, if available. 
	* **Object** `ModuleObject` The original module object which was registered with JOBAD. 
	* **Object** `properObject` The proper ModuleObject. 
	* **returns** the new value of the property. 

* **Function** `JOBAD.modules.extensions.[name].onFirstLoad(globalStore)` Called when the module is loaded for the first time. 
	* **Object** `globalStore` Module globalStore. 

* **Function** `JOBAD.modules.extensions.[name].onLoad(value, properObject, moduleObject)` Called when the module is loaded. 
	* **Object** `value` Value of the property to be added. 
	* **Object** `properObject` The proper Module Object. 
	* **Instance[JOBAD.modules.loadedModule]** `this`, `moduleObject` The currently loaded module object

### JOBAD.Events
`JOBAD.Events` provides an easy way to add events to JOBAD modules. DOC TBD. 
