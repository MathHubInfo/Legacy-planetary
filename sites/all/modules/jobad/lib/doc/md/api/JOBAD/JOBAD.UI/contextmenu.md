# JOBAD.UI.ContextMenu

* **Object** `JOBAD.UI.ContextMenu.config` - JOBAD ContextMenu UI Configuration namespace
* **Number** `JOBAD.UI.ContextMenu.config.margin` - Number of pixels to keep the context menu away from the right and bottom end of the page. Default: 20. 
* **Number** `JOBAD.UI.ContextMenu.config.width` - Width of the context menu. Default: 250. 
* **Function** `JOBAD.UI.ContextMenu.enable(element, demandFunction, onEnable, onDisable)` - Registers a context menu on an element.
	* **jQuery** `element` The element to register the menu on. 
	* **Function** `demandFunction(element, elementOrg)` Function to call when a menu is requested. 
		* **Undefined** `this`
		* **jQuery** `element` The element the context menu has been requested on. 
		* **jQuery** `elementOrg` The element the context menu call originates from. 
		* **returns** a list of `[name, callback]` and `[name, submenu]` pairs or `false` if no menu should be generated. 
	* **Function** `onEnable(element)` Optional. Called when the menu is shown. 
		* **Undefined** `this`
		* **jQuery** `element` The element the menu was originally registered on. 
	* **Function** `onDisable(element)` Optional. Called when the menu is hidden. 
		* **Undefined** `this`
		* **jQuery** `element` The element the menu was originally registered on. 
	* **returns** The `element` the menu was registered on. 
* **Function** `JOBAD.UI.ContextMenu.disable(element)` - Disables the context menu. 
	* **jQuery** `element` The element to remove the menu from. 
	* **returns** The `element` the menu was registered on. 
* **Function** `JOBAD.UI.ContextMenu.buildMenuList(items, element, elementOrg)` Builds the menu html element. 
	* **Array** `items` a list of `[name, callback]` and `[name, submenu]` pairs representing the menu to be built. 
	* **jQuery** `element` The element the context menu has been requested on. 
	* **jQuery** `elementOrg` The element the context menu call originates from. 
	* **returns** a **jQuery** element representing the menu. 
