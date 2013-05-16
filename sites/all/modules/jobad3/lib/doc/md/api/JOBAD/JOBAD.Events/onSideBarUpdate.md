# JOBAD.Events.onSideBarUpdate

The onSideBarUpdate event is triggered every time the sidebar is updated. 

* **Function** `JOBAD.Events.onSideBarUpdate.default()` The default Event Handler for onSideBarUpdate Events. Just returns false. 

* **Function** `JOBAD.Events.onSideBarUpdate.Setup.enable(root)` Enables the onSideBarUpdate event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to enable onSideBarUpdate on. 
* **Function** `JOBAD.Events.onSideBarUpdate.Setup.disable(root)` Disables the onSideBarUpdate event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to disable onSideBarUpdate on. 

* **Function** `JOBAD.Events.onSideBarUpdate.namespace.getResult()` Get the Result of the onSideBarUpdate event handlers. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 

* **Function** `JOBAD.Events.onSideBarUpdate.namespace.trigger()` Trigger the onSideBarUpdate event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 

* **Object** `JOBAD.Events.onSideBarUpdate.Setup.init.Sidebar` - Namespace for [JOBADInstance](../JOBADInstance/index.md) related sidebar functions. 

* **Function** `JOBAD.Events.onSideBarUpdate.Setup.init.Sidebar.redraw()` Redraws the sidebar. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 

* **Function** `JOBAD.Events.onSideBarUpdate.Setup.init.Sidebar.registerNotification(element, config)` Registers a new notification on the sidebar. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `element` An element to register the notification on. 
	* **Object** `config` A map which may contain any of the following members: 
		* **String** `config.class` Notification class. If provided should be one of "info", "warning" or "error". 
		* **String** `config.icon` An icon to use for the notification. Default depends on `config.class`. 
		* **String** `config.menu` A context menu for the notification. 
		* **String** `config.text` A text to use for the notification. 
		* **Boolean** `config.trace` Highlight the original element when hovering the notification ? 
		* **Function** `config.click` On click callback. 
	* **returns** a jQuery element representing the added notification. 

* **Function** `JOBAD.Events.onSideBarUpdate.Setup.init.Sidebar.removeNotification(notification)` Removes a notification from the sidebar. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `notification` A jQuery element represnting the notification. 
