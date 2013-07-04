# JOBADInstance.Sidebar

* **Function** `.Sidebar.getSidebarImplementation(type)` - Gets the specefied sidebar implementation. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **String** `type` implementation to get. 

* **Function** `.Sidebar.forceInit()` - Forces an initialisation of the sidebar. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **String** `type` implementation to get. 

* **Function** `.Sidebar.makeCache()` Creates a cache of all objects currently in the sidebar. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **returns** the cache. 

* **Function** `.Sidebar.transit(to)` Changes the sidebar type to the specefied type. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **String** `to` New type to use. 

* **Function** `.Sidebar.redraw()` Redraws the sidebar. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 

* **Function** `.Sidebar.redrawT(type)` Redraws the sidebar using the specefied type. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **String** `type` Type to use. 

* **Function** `.Sidebar.registerNotification(element, config)` Registers a new notification on the sidebar. 
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

* **Function** `.Sidebar.removeNotification(notification, autoRedraw)` Removes a notification from the sidebar. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `notification` A jQuery element represnting the notification. 
	* **Boolean** `autoRedraw` Optional. Should the sidebar be redrawn? (default: true)

* **Function** `.Sidebar.removeNotificationT(notification, autoRedraw, type)` Removes a notification from the sidebar. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `notification` A jQuery element represnting the notification. 
	* **Boolean** `autoRedraw` Optional. Should the sidebar be redrawn? (default: true)
	* **String** `type` Type of Sidebar to use. 


* **Array** `.Sidebar.ElementRequestCache` Cache for elements yet to register to the sidebar. **Do not modify**
* **Object** `.Sidebar.PastRequestCache` Request cache for elements registered with the sidebar. **Do not modify** 
* **Object** `.Sidebar.Elements` All elements currently registered with the sidebar. **Do not modify**


## See also
* [`JOBADInstance.Event.onSideBarUpdate`](event/onSideBarUpdate.md)
