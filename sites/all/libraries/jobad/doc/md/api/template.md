# template

This object can be used as a termplate for module objects. **Note:** The code for this is not containted within the JOBAD Core files, but is located in the file `modules/template.js`. 

* **Object** `template.info` Module information namespace. 
* **String** `template.info.identifier` A unique identifier for the module. 
* **String** `template.info.title` Module title
* **String** `template.info.author` The module author. 
* **String** `template.info.description` A human readable description of the module. 
* **String** `template.info.version` String containing the version number. May be omitted. 
* **String** `template.info.hasCleanNamespace` Booelan indicating if the namespace of this moudle contains other, custom, properties which should be copied over. If so, they will be copied to any module instance and `this` inside of any of the functions can refer to it. Note that this may be shared among different instances of the module since javascript creates references to JSON-style objects. Can also be disabled globally by configuration in which case non-clean modules will not load. Property may be omitted in which case it is assumed to be true. 
* **Array[String]** `template.info.dependencies` Array of module dependencies. If ommited, assumed to have no dependencies. 

* **Object** `template.config` Specification of user configurable objects. A map containing (`name`, `spec`) values. The `spec` object looks like the following:
	* **Array[3|4]** `spec` Contains the specification. 
		* **String** `spec[0] = type` The type of the setting: `string` (a string), `bool` (a boolean), `number` (a number), `integer` (an integer) or `list` (a list of different values to select from). 
		* **Mixed** `spec[1] = restrictions` Restrictions to apply for setting. Optional if type if not `list`. 
			* for `string`: a regular expression or a function `check(value)` which returns a boolean. 
			* for `bool`: N/A
			* for `number` and `integer`: an array `[min, max]` or a function `check(value)` which returns a boolean. 
			* for `list`: an array of possible values. The values may not be of type function. 
		* **Mixed** `spec[2|1] = default` Default value for the setting. Must match the restrictions (if applicable). 
		* **Mixed** `spec[3|2] = meta` Meta information. If type is not `list`, may either be a string (with name of setting) 
		or an array containg the name of the setting and optionally a longer description of this setting. For `list`, this must be an array containg the setting name 
		and the name of each option.  
		
* **Function** `template.globalinit()` Called exactly once GLOBALLY. Can be used to initialise global module ids, etc. May be ommitted. Will be called once a module is loaded. 
	* **Undefined** `this`
* **Function** `template.init(JOBADInstance, param1, param2, param3 /*, ... */)` Called to intialise a new instance of this module. 
	* **Instance[ [JOBAD.modules.loadedModule](JOBAD/JOBAD.modules/loadedModule.md) ]** `this` The current module instance. 
	* **Instance[ [JOBAD](JOBAD/JOBADInstance/index.md) ]** `JOBADInstance` The instance of JOBAD the module is initiated on. 
	* **Mixed** `*param` Initial parameters passed to [`JOBADInstance.modules.load`](JOBAD/JOBADInstance/modules.md). 
* **Function** `template.activate(JOBADInstance)` Called whenever the module is activated. 
	* **Instance[ [JOBAD.modules.loadedModule](JOBAD/JOBAD.modules/loadedModule.md) ]** `this` The current module instance. 
	* **Instance[ [JOBAD](JOBAD/JOBADInstance/index.md) ]** `JOBADInstance` The instance of JOBAD the module is initiated on. 
* **Function** `template.deactivate(JOBADInstance)` Called whenever the module is deactivated. 
	* **Instance[ [JOBAD.modules.loadedModule](JOBAD/JOBAD.modules/loadedModule.md) ]** `this` The current module instance. 
	* **Instance[ [JOBAD](JOBAD/JOBADInstance/index.md) ]** `JOBADInstance` The instance of JOBAD the module is initiated on. 
* **Function** `template.onSideBarUpdate(target, JOBADInstance)` Called every time the sidebar is updated. May be ommitted. 
	* **Instance[ [JOBAD.modules.loadedModule](JOBAD/JOBAD.modules/loadedModule.md) ]** `this` The current module instance. 
	* **Instance[ [JOBAD](JOBAD/JOBADInstance/index.md) ]** `JOBADInstance` The instance of JOBAD the module is initiated on. 
	* **returns** a text, a jQuery-ish object[^1] or a boolean indicating either the text or if something was done. 
* **Function** `template.leftClick(target, JOBADInstance)` Called when a left click is performed.  Every left click action is performed. May be ommitted. 
	* **Instance[ [JOBAD.modules.loadedModule](JOBAD/JOBAD.modules/loadedModule.md) ]** `this` The current module instance. 
	* **jQuery** `target` The element that was left clicked on. 
	* **Instance[ [JOBAD](JOBAD/JOBADInstance/index.md) ]** `JOBADInstance` The instance of JOBAD the module is initiated on. 
	* **returns** `true` if it performed some action, `false` otherwise. 
* **Function** `template.contextMenuEntries(target, JOBADInstance)` Called when a context menu is requested. Context Menu entries will be merged. May be ommitted. 
	* **Instance[ [JOBAD.modules.loadedModule](JOBAD/JOBAD.modules/loadedModule.md) ]** `this` The current module instance. 
	* **jQuery** `target` The element that was right clicked on. 
	* **Instance[ [JOBAD](JOBAD/JOBADInstance/index.md) ]** `JOBADInstance` The instance of JOBAD the module is initiated on. 
	* **returns** context menu entries as array [[entry_1, function_1], ..., [entry_n, function_1]] or as a map {entry_1: function_1, entry_2: function_2, ...} All entry names must be non-empty. (Empty ones will be ignored). For the first notation, a function may also be a sub menu. If no context menu is available, it should return false. 
		* **Function** `callback(element, originElement)` Callback on menu entries. 
			* **Undefined** `this`
			* **jQuery** `element` The element the context menu was request on. 
			* **jQuery** `originElement` The lowest level element the menu was requested on. 
* **Function** `template.hoverText(target, JOBADInstance)` Called when a hover text is requested. May be ommitted. 
	* **Instance[ [JOBAD.modules.loadedModule](JOBAD/JOBAD.modules/loadedModule.md) ]** `this` The current module instance. 
	* **jQuery** `target` The element that was hovered clicked on. 
	* **Instance[ [JOBAD](JOBAD/JOBADInstance/index.md) ]** `JOBADInstance` The instance of JOBAD the module is initiated on. 
	* **returns** a text, a jQuery-ish object[^1] or a boolean indicating either the text or if something was done. 
* **Function** `template.onEvent(event, element, JOBADInstance)` Called when an onEvent handler is requested. May be ommitted. 
	* **Instance[ [JOBAD.modules.loadedModule](JOBAD/JOBAD.modules/loadedModule.md) ]** `this` The current module instance. 
	* **string** `event` The event that was triggered. 
	* **jQuery** `element` The element the event was triggered on. 
	* **Instance[ [JOBAD](JOBAD/JOBADInstance/index.md) ]** `JOBADInstance` The instance of JOBAD the module is initiated on. 

## See also
* [Getting started with modules](../dev/modules.md)

## Footnotes
[^1]: A jQuery-ish object is any object that can be passed to the main jQuery function, for example a document node or a jQuery selector. 
