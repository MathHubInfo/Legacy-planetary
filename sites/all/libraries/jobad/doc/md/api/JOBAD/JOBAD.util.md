# JOBAD.util

* **Function** `JOBAD.util.UID()` Gets a unique id which can be used as identifier. 
* **Function** `JOBAD.util.bindEverything(object, thisObject)` Binds every function in `object` to `thisObject`. Also includes nested namespaces. 
	* **object** `object` Object to bind functions in. 
	* **object** `thisObject` Object to bind functions to. 
	* **returns** a new object containing the bound functions. 
* **Function** `JOBAD.util.generateMenuList(menu)` Generates a list menu representation from an object representation. 
	* **Object** `menu` an object representation of the menu. 
	* **returns** the new representation. 
* **Function** `JOBAD.util.fullWrap(menu, callback)` Wraps a menu callback with the spacefied wrapper
	* **Object** `menu` The menu to wrap. 
	* **Function** `wrapper(org, arguments)` The wrapper function. 
	* **returns** the new representation. 

* **Function** `JOBAD.util.createRadio(texts, start)` Creates a jQuery UI radio button. 
	* **Array** `texts` Texts to use as names. 
	* **number** `start` Identifier of the initial value.  
	* **returns** jQuery object. 
* **Function** `JOBAD.util.createTabs(names, tabs, options, height)` Creates a jQuery UI tabs. 
	* **Array** `names` Texts to use as names for tab titles. 
	* **Array** `tabs` Elements to use as tabs. 
	* **Array** `options` Options to pass to jQuery UI Tabs. 
	* **number** `height` Optional. Height of the tabs. 
	* **returns** jQuery object. 


* **Function** `JOBAD.util.createProperUserSettingsObject(obj, modName)` Creates a proper User Settings Object. 
	* **Object** `obj` Configuration Object
	* **String** `modName` Identifier of the module. 
	* **returns** object
	
* **Function** `JOBAD.util.getDefaultConfigSetting` Gets the default of a configuration object. 
	* **Object** `obj` Configuration Object
	* **String** `key` Key to get. 
	* **returns** object

* **Function** `JOBAD.util.validateConfigSetting(obj, key, val)` Validates if the specefied object of a configuration object can be set. 
	* **Object** `obj` Configuration Object
	* **String** `key` Key to validate. 
	* **Object** `value` Value to vaildate. 
	* **returns** boolean. 
