# JOBAD.UI.ContextMenu

* **Object** `JOBAD.UI.ContextMenu.config` - JOBAD ContextMenu UI Configuration namespace
* **Number** `JOBAD.UI.ContextMenu.config.margin` - Number of pixels to keep the context menu away from the right and bottom end of the page. Default: 20. 
* **Number** `JOBAD.UI.ContextMenu.config.width` - Width of the context menu. Default: 250. 
* **Number** `JOBAD.UI.ContextMenu.config.radius` - Radius for radial context menu entries. Default: 20. 
* **Number** `JOBAD.UI.ContextMenu.config.radiusConst` - Constant for calculating radius. Default: 30. 
* **Function** `JOBAD.UI.ContextMenu.enable(element, demandFunction, config, typeFunction, onEnable, onDisable)` - Registers a context menu on an element.
	* **jQuery** `element` The element to register the menu on. 
	* **Function** `demandFunction(element, elementOrg)` Function to call when a menu is requested. 
		* **Undefined** `this`
		* **jQuery** `element` The element the context menu has been requested on. 
		* **jQuery** `elementOrg` The element the context menu call originates from. 
		* **returns** a list of `[name, callback]` and `[name, submenu]` pairs or `false` if no menu should be generated. 
	* **Object** `config` Configuration. 
		* **Function|String** `config.type(element, elementOrg)` Optional. Type of menu to use. Either a fixed string or a function returning the type of menu to use. Types are: `standard` (0) and `radial` (1). 
		* **Function** `config.open()` Optional. Will be called before the context menu is opened. 
		* **Function** `config.close()`Optional. Will be called after the context menu has been closed. 
		* **Function** `config.callback()` Optional. Will be called after a callback is called. 
		* **jQuery** `config.parents` Optional. Menus not to keep open when this menu is opened. 
		* **Boolean** `config.block` Optional. Always block the Browser context menu. 
		* **jQuery** `config.element` Optional. Force to use this as an element for searching for menus. 
		* **jQuery** `config.unbindListener` Element to additionally listen to for unbinds. 
		* **jQuery** `config.callBackTarget` Optional. Element to use for callback. Defaults to found element. 
		* **jQuery** `config.callBackOrg`	Optional. Element to use for callback. 
	* **returns** The `element` the menu was registered on.
* **Function** `JOBAD.UI.ContextMenu.clear(keepers)` - Clears all context menus
	* **jQuery** `keepers` Menus to keep open
* **Function** `JOBAD.UI.ContextMenu.disable(element)` - Disables the context menu. 
	* **jQuery** `element` The element to remove the menu from. 
	* **returns** The `element` the menu was registered on. 
* **Function** `JOBAD.UI.ContextMenu.buildContextMenuList(items, element, elementOrg, callback)` - Builds the menu html element for the standard menu element. 
	* **Array** `items` a list of `[name, callback, icon]` and `[name, submenu, icon]` pairs representing the menu to be built. 
	* **jQuery** `element` The element the context menu has been requested on. 
	* **jQuery** `elementOrg` The element the context menu call originates from. 
	* **Function** `callback(element)` Callback whenever some callback is called. 
	* **returns** a **jQuery** element representing the menu. 
* **Function** `JOBAD.UI.ContextMenu.buildPieMenuList(items, element, elementOrg, callback)` - Builds the menu html element for the pie menu element. 
	* **Array** `items` a list of `[name, callback, icon]` and `[name, submenu, icon]` pairs representing the menu to be built. 
	* **jQuery** `element` The element the context menu has been requested on. 
	* **jQuery** `elementOrg` The element the context menu call originates from. 
	* **Function** `callback(element)` Callback whenever some callback is called. 
	* **Number** `x` x-Coordinate of menu center. 
	* **Number** `y` y-Coordinate of menu center. 
	* **returns** a **jQuery** element representing the menu. 

* **Function** `JOBAD.UI.ContextMenu.generateMenuList(menu)` - Generates a list menu representation from an object representation. 
	* **Object** `menu` an object representation of the menu. 
	* **returns** the new representation. 
* **Function** `JOBAD.UI.ContextMenu.fullWrap(menu, wrapper)` - Wraps a menu callback with the spacefied wrapper. 
	* **Object** `menu` The menu to wrap. 
	* **Function** `wrapper(org, arguments)` The wrapper function. 
	* **returns** the new representation. 