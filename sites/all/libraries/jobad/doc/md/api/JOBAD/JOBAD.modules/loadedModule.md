# JOBAD.modules.loadedModule

* **Function** `JOBAD.modules.loadedModule(name, args, JOBADInstance, callback)` Loads a module, assuming the dependencies are already available. 
	* **String** `name` Module to load.
	* **Array[Mixed]** Arguments to pass to this module instance. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` The instance of JOBAD the module is initiated on. 
	* **Function** `callback(state)` Callback. Will be called when the module has finsihed loading or fails to do so. 
	* **returns** a new `JOBAD.modules.loadedModule` instance. 

## Instance Functions

* **Function** `.info()` Returns the info object of this module. 
* **Function** `.getJOBAD()` Gets the `JOBADInstance` this module is bound to. 
* **Function** `.getOrigin(what)` Gets the origin of this module, the repository it comes from. 
	* **String** `what`. Optional. If set to `file`, will get the file this module is defined in. If set to `group` will get the group this module was loaded in. FileName and group may be wrong if the module is registered within some callback. 

* **Function** `.isActive()` Checks if this module is active. 
* **Function** `.setHandler(event, handlerName)` - Binds a member function to an event. Only triggers if active. 
    * **String** `event` Event to listen to. 
    * **String** `handlerName` Name of the handler Function of the module. 
* **Function** `.activate()` Activates this module. 
* **Function** `.deactivate()` Deactivates this module

## Toolbar

* **Function** `.Toolbar(JOBADInstance, Toolbar)` Requests a toolbar for this module. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` A reference to `.getJOBAD()`. 
	* **jQuery** `Toolbar` A jQuery element representing the possible toolbar. 

* **Function** `.Toolbar.get()` Gets the jQuery element representing the Toolbar or undefined. 
	* **returns** jQuery `Toolbar` A jQuery element representing the possible toolbar.

* **Function** `.Toolbar.show()` Shows or hides the Toolbar depending on current settings. 
* **Function** `.Toolbar.moveUp()` Moves the toolbar up. 
* **Function** `.Toolbar.moveDown()` Moves the toolbar down. 

* **Function** `.Toolbar.isVisible()` Checks if the Toolbar state is visible. 
	* **returns** boolean
* **Function** `.Toolbar.setVisible()` Sets the Toolbar state to visible. 
* **Function** `.Toolbar.setHidden()` Sets the Toolbar state to hidden. 

* **Function** `.Toolbar.isEnabled()` Checks if the toolbar is enabled. 
	* **returns** boolean
* **Function** `.Toolbar.enable()` Enables the toolbar. 
	* **returns** `true` if it was enabled, false if not. 
* **Function** `.Toolbar.disable()` Disables the toolbar. 
	* **returns** `true` if it was disabled, false if not. 


## UserConfiguration

* **Function** `.UserConfig.set(prop, value)` Updates user configuration. 
	* **String** `prop` Property to set. 
	* **Mixed** `value` Value to set. 

* **Function** `.UserConfig.canSet(prop, value)` Checks if a user configuration can be set with the specefied value. 
	* **String** `prop` Property to set. 
	* **Mixed** `value` Value to set. 
	* **returns** boolean. 

* **Function** `.UserConfig.get(prop)` Reads user configuration. 
	* **String** `prop` Property to get. 
	* **returns** value. 

* **Function** `.UserConfig.setMessage(msg)` Sets the current message (displayed in config UI). 
	* **String** `msg` Message to set. 
* **Function** `.UserConfig.getMessage()` Gets the current message (displayed in config UI). 


* **Function** `.UserConfig.reset()` Resets the user configuration. 
* **Function** `.UserConfig.getTypes()` Gets the user configuration types. 



## Event functions

These functions represent event handlers. If an event is globally disabled (via  [`JOBAD.config.disabledEvents`](../JOBAD.config.md)) it will not show up in the JOBAD.modules.loadedModule Instance. 

* **Function** `.onActivate(JOBADInstance)` Called on module activation. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` A reference to `.getJOBAD()`. 
* **Function** `.onDeactivate(JOBADInstance)` Called on module deactivation. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` A reference to `.getJOBAD()`. 
* **Function** `.onEvent(JOBADInstance, eventName, params)` Simulates an event. Note: This only calls onEvent handlers. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` A reference to `.getJOBAD()`. 
	* **String** `eventName` Name of event to simulate. 
	* **Array** `params` Parameters for event. 
* **Function** `.focus(JOBADInstance, prevFocus)` Called on Instance focus. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` A reference to `.getJOBAD()`. 
	* **JOBAD** `prevFocus` Previously focused instance of JOBAD or undefined. 
* **Function** `.unfoucs(JOBADInstance, prevFocus)` Called on Instance unfocus. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` A reference to `.getJOBAD()`. 
* **Function** `.leftClick(target, JOBADInstance)` Simulate a left click event to pass to the Module. 
	* **jQuery** `target` The element to simulate clicking on. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` A reference to `.getJOBAD()`. 
	* **returns** `true` if it performed some action, `false` otherwise. 
* **Function** `.dblClick(target, JOBADInstance)` Simulate a double click event to pass to the Module. 
	* **jQuery** `target` The element to simulate double clicking on. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` A reference to `.getJOBAD()`. 
	* **returns** `true` if it performed some action, `false` otherwise. 
* **Function** `.contextMenuEntries(target, JOBADInstance)` Simulate a context menu request to the module. 
	* **jQuery** `target` The element to simulate a context menu request on. 
	* **returns** a list of `[name, callback]` and `[name, submenu]` pairs or false if nothing should be done. 
* **Function** `.hoverText(target, JOBADInstance)` Simulate hovering over an element. 
	* **jQuery** `target` The element to simulate hovering on. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` A reference to `.getJOBAD()`. 
	* **returns** a text to use as hover text, a jQuery-ish object[^1] or a boolean. 
* **Function** `.SideBarUpdate(JOBADInstance)` Simulate a sidebar update. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` A reference to `.getJOBAD()`. 
	* **returns** a text to use as hover text, a jQuery-ish object[^1] or a boolean. 
* **Function** `.configUpdate(setting, JOBADInstance)` Simulate a change of a setting. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `JOBADInstance` A reference to `.getJOBAD()`. 
	* **String** `setting` The setting that has changed. 

## .localStore

* **Object** `.localStore` Namespace to store variables bound to this instance of a module. 
* **Function** `.localStore.get(key)` Gets a local variable. 
	* **String** `key` Name of variable to get. 
	* **returns** the variable or undefined. 
* **Function** `.localStore.set(key, value)` Sets a local variable. 
	* **String** `key` Name of variable to get. 
	* **Mixed** `value` Value to set the variable to. 
* **Function** `.localStore.delete(key)` Deletes a local variable. 
	* **String** `key` Key to delete. 
* **Function** `.localStore.keys()` Gets all available keys. 
	
## .globalStore
* **Object** `.globalStore` Namespace to store variables shared among instances of this variable. 
* **Function** `.globalStore.get(key)` Gets a global variable. 
	* **String** `key` Name of variable to get. 
	* **returns** the variable or undefined. 
* **Function** `.globalStore.set(key, value)` Sets a global variable. 
	* **String** `key` Name of variable to get. 
	* **Mixed** `value` Value to set the variable to. 
* **Function** `.globalStore.delete(key)` Deletes a global variable. 
	* **String** `key` Key to delete. 
* **Function** `.globalStore.keys()` Gets all available keys. 

## Further members
A `JOBAD.modules.loadedModule` instance also contains all non-standard properties of the original Module object. Note
that any JSON-style objects are referenced (and thus shared among all instances of this module) and everything else 
is copied. 


## Footnotes
[^1]: A jQuery-ish object is any object that can be passed to the main jQuery function, for example a document node or a jQuery selector. 
