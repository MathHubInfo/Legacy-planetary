# JOBAD.UI.Toolbar

* **Function** `JOBAD.UI.Toolbar.clear(element)` - Clears the toolbar and destroys it. 
	* **jQuery** `element` Element to clear toolbar of. 

* **Function** `JOBAD.UI.Toolbar.update(element)` - Updated the toolbar. 
	* **jQuery** `element` Element to updated toolbar from. 

* **Function** `JOBAD.UI.Toolbar.addItem(element, config)` - Adds a new item to the toolbar. 
	* `element` Element to bind notification to. 
	* **Object** `config` A map which may contain any of the following members: 
		* **String** `config.class` Notification class. If provided should be one of "info", "warning" or "error". 
		* **String** `config.icon` An icon to use for the notification. Default depends on `config.class`. 
		* **String** `config.menu` A context menu for the notification. 
		* **Object** `config.menuThis` value of `this` for menu callbacks. 
		* **String** `config.text` A text to use for the notification. 
		* **Boolean** `config.trace` Highlight the original element when hovering the notification. **Ignored.** 
		* **Boolean** `config.hide`	If set to true, the notification will be hidden when the element is hidden. Otherwise, the notification will travel up the dom tree. **Ignored**
		* **Function** `config.click` On click callback. 
	* **returns** a new empty jQuery sidebar notification element. 

* **Function** `JOBAD.UI.Toolbar.removeItem(item)` - Removes an item from the toolbar. 
	* **jQuery** `item` Item to remove. 