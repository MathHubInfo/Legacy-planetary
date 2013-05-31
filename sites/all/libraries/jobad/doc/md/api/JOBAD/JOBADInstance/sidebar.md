# JOBADInstance.Sidebar

* **Function** `.Sidebar.forceUpdate()` Forces an update of the sidebar. 

* **Function** `.Sidebar.registerNotification(element, config)` Registers a new notification on the sidebar. 
	* **jQuery** `element` An element to register the notification on. 
	* **Object** `config` A map which may contain any of the following members: 
		* **String** `config.class` Notification class. If provided should be one of "info", "warning" or "error". 
		* **String** `config.icon` An icon to use for the notification. Default depends on `config.class`. 
		* **String** `config.menu` A context menu for the notification. 
		* **String** `config.text` A text to use for the notification. 
		* **Boolean** `config.trace` Highlight the original element when hovering the notification ? 
		* **Function** `config.click` On click callback. 
	* **returns** a jQuery element representing the added notification. 

* **Function** `.Sidebar.removeNotification(notification)` Removes a notification from the sidebar. 
	* **jQuery** `notification` A jQuery element represnting the notification. 

## See also
* [`JOBADInstance.Event.onSideBarUpdate`](event/onSideBarUpdate.md)
