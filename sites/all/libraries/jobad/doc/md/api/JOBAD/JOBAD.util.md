# JOBAD.util

In addition to these functions, JOBAD.util also contains all underscore (version 1.4.4) functions. See their documentation at [underscorejs.org](http://underscorejs.org/). 

* **Function** `JOBAD.util.UID()` - Gets a unique id which can be used as identifier
* **Function** `JOBAD.util.objectEquals(a, b)` - Checks if two objects are equal
* **Function** `JOBAD.util.bindEverything(object, thisObject)` - Binds every function in `object` to `thisObject`. Also includes nested namespaces
	* **object** `object` Object to bind functions in
	* **object** `thisObject` Object to bind functions to
	* **returns** a new object containing the bound functions
* **Function** `JOBAD.util.argWrap(func, wrap)` - Applies a function to the arguments of a function every time it is called
	* **Function** `func()` Function to wrap
	* **Function** `wrap(original_arguments)` Wrapper Function
* **Function** `JOBAD.util.argSlice(func, from, to)` - Applies Array.slice to the arguments of a function every time it is called
	* **Function** `func()` Function to wrap
	* **Number** `from` 
	* **Number** `to`
* **Function** `JOBAD.util.createDropDown(values, texts, start)` - Creates a Dropdown Box.  
	* **Array** `values` Values to use. 
	* **Array** `texts` Texts to use. 
	* **number** `start` Number of the initial value. 
	* **returns** jQuery object
* **Function** `JOBAD.util.createRadio(texts, start)` - Creates a Bootstrap radio button (Button group)
	* **Array** `texts` Texts to use as names
	* **number** `start` Identifier of the initial value
	* **returns** jQuery object
* **Function** `JOBAD.util.createTabs(names, tabs, options, height)` - Creates tab data compatible with Bootstrap. 
	* **Array** `names` Texts to use as names for tab titles
	* **Array** `tabs` Elements to use as tabs
	* **Object** `config` Configuration. Optional. 
		* **String** `config.type` Type of tabs to use. CSS Class. 
		* **Function** `config.select(tabName, tab)` Select Hook. To be called on selection of a tab. 
		* **Function** `config.unselect(tabName, tab)` Deselect Hook. To be called on the deselection of a tab. 
	* **returns** jQuery object
* **Function** `JOBAD.util.closest(element, check)` - Similar to jQuery's closest. Travels up the DOM tree and finds the first element which matches check. This includes element itself
	* **jQuery** `element` Element to start with
	* **String** `check` Check to perform. Either a function `check(element)` or a jQuery selector
	* **returns** object
* **Function** `JOBAD.util.markHidden(element)` - Marks an element as hidden
	* **jQuery** `element` Element to mark as hidden
* **Function** `JOBAD.util.markVisible(element)` - Marks an element as visible
	* **jQuery** `element` Element to mark as visible
* **Function** `JOBAD.util.markDefault(element)` - Removes any marking from an element
	* **jQuery** `element` Element to remove marking from
* **Function** `JOBAD.util.isMarkedHidden(element)` - Checks if an element is marked as hidden
	* **jQuery** `element` Element to check
* **Function** `JOBAD.util.isMarkedVisible(element)` - Checks if an element is marked as visible. 
	* **jQuery** `element` Element to check
* **Function** `JOBAD.util.isHidden(element)` - Checks if an element is hidden
	* **jQuery** `element` Element to check
* **Function** `JOBAD.util.defined(obj)` - Checks if `obj` is defined and returns it if so. Otherwise returns an empty JSON-object
	* **Object** `obj` Object to check
* **Function** `JOBAD.util.forceBool(obj, def)` - Forces `obj` to be of type boolean
	* **Object** `obj` Object to check
	* **Object** `def` Optional. Default to use. If undefined, obj will be forced into a boolean. 
* **Function** `JOBAD.util.forceFunction(obj, def)` - Forces `obj` to be a function
	* **Object** `obj` Object to check
	* **Object** `def` Optional. Default function to use. If not a function, will return a function which retruns def. If omitetd will use `obj` as `def`
* **Function** `JOBAD.util.ifType(obj, type, def)` - If `obj` is not of type `type`, will return `def`, otherwise return `obj`
* **Function** `JOBAD.util.equalsIgnoreCase(a, b)` - Checks if two strings are equal, ignoring case. 
* **Function** `JOBAD.util.orderTree(element)` - Return an order jQuery collection of element, where they are sorted by depth (deepest first)
	* **jQuery** `element` Elements to sort
* **Function** `JOBAD.util.isUrl(url)` - Checks if string is a valid url. Includes data urls. 
	* **String** `url` String to check. 
* **Function** `JOBAD.util.startsWith(str, start)` - Checks if the string `str` starts with the string `start`. 
* **Function** `JOBAD.util.lOr()` - Performs a logical or on all arguments given to it. Note: This method flattens all arguments. 
* **Function** `JOBAD.util.lAnd()` - Performs a logical and on all arguments given to it. Note: This method flattens all arguments. 
* **Function** `JOBAD.util.containsAll(container, contained, includeSelf)` - Checks if all elements in `contained` are contained somewhere in `container`. 
	* **jQuery** `container` Container to look in. 
	* **jQuery** `contained` Contained elements to look for. 
	* **Boolean** `includeSelf` Optional. Include the container element iteself in the search. Default: False. 
* **Function** `JOBAD.util.loadExternalJS(names, callback, scope, preLoadHack)` - Loads one or more external JavaScript files. 
	*  **Array|String** `names` Name (URL) of file to load or array of file names. 
	* **Function** `callback(urls, success)` Callback once files have loaded
		* **this** `scope`
		* **Array** `urls` Originally given urls. 
		* **Boolean** `success` Have the files been loaded or has there been a timeout?
	* **Function** `preLoadHack(url)` Optional. Called directly before a (single) file is loaded. 
* **Function** `JOBAD.util.loadExternalCSS(names, callback, scope, preLoadHack)` - Loads one or more external CSS files. 
	*  **Array|String** `names` Name (URL) of file to load or array of file names. 
	* **Function** `callback(urls, success)` Callback once files have loaded
		* **this** `scope`
		* **Array** `urls` Originally given urls. 
		* **Boolean** `success` Have the files been loaded or has there been a timeout?
	* **Function** `preLoadHack(url)` Optional. Called directly before a (single) file is loaded. 
* **Function** `JOBAD.util.getCurrentOrigin()` - Gets the current file being executed. Works only directly in a script file. 

* **Function** `JOBAD.util.escapeHTML(str)` - Escapes a string for use within html. 
	* **String** `str` String to escape
* **Function** `JOBAD.util.resolve(url, base, isDir)` - Resolves a url. 
	* **String** `url` Url to resolve. 
	* **String** `base` Optional. A Base url. 
	* **Boolean** `isDir` Assume a directory.  
* **Function** `JOBAD.util.on(query, event, handler)` - Adds an event listener to a query. 
	* **jQuery** `query` A jQuery element to use as query. 
	* **String** `event` Event to listen to. 
	* **Function* `handler(param1, param2, ...)` Event listener
	* **returns** Id of the newly added handler. 
* **Function** `JOBAD.util.once(query, event, handler)` - Adds a one-time  event listener to a query. 
	* **jQuery** `query` A jQuery element to use as query. 
	* **String** `event` Event to listen to. 
	* **Function* `handler(param1, param2, ...)` Event listener
	* **returns** Id of the newly added handler. 

* **Function** `JOBAD.util.off(query, id)` - Removes an event listener from a query. 
	* **jQuery** `query` A jQuery element to use as query. 
	* **String** `id` Id of handler to remove. 
* **Function** `JOBAD.util.trigger(query, event, params)` - Triggers an event on a query. 
	* **jQuery** `query` A jQuery element to use as query. 
	* **String** `event` Event to trigger. 
	* **Array** `params` Optional. Array of parameters to pass to event handlers.
	* **returns** `Array of results`

* **Function** `JOBAD.util.EventHandler()` - Creates a new Event Handler which has the functions ".on", ".once", ".off", ".trigger" as above (without the first parameter)


* **Function** `JOBAD.util.limit(x, a, b)` - Limit x to be between a and b. 
	* **Number** `x`
	* **Number** `a`
	* **Number** `b`

* **Function** `JOBAD.util.permuteArray(arr, a, b)` - Return a premuted copy of the array arr. 
	* **Array** `arr` Array to permute
	* **Number** `a` Index of the first element to exchange. 
	* **Number** `b` Index of the second element to exchange. 

* **Function** `JOBAD.util.toKeyString(evt)` - Turns the keydown or keypress event evt into a string for a key. 
	* **Event** `evt` The keydown or keypress event to translate. 
	* **returns** `string` of the form '[ctrl+][alt+][shift+]$key_name'. Note that only a special key shows up as 'ctrl+'. 

* **Function** `JOBAD.util.onKey(callback)` - Registers a listener for a keypress event. 
	* **Function** `callback(key, orgEvent)` The callback
	* **returns** a string. Use `$(document).off(returned_value)` to deregister the listener. 