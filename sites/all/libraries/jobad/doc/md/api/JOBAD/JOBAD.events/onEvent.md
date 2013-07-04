# JOBAD.events.onEvent

The onEvent event is triggered every time another event handler is called. Does not trigger for the `onEvent` event and the `onSideBarUpdate` event

* **Function** `JOBAD.events.onEvent.default()` - The default Event Handler for onEvent Events. Does nothing. 

* **Function** `JOBAD.events.onEvent.Setup.enable(root)` - Enables the onEvent event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to enable onEvent on. 
* **Function** `JOBAD.events.onEvent.Setup.disable(root)` - Disables the onEvent event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to disable onEvent on. 
* **Function** `JOBAD.events.onEvent.namespace.getResult(eventName, element)` - Get the Result of the onEvent event handlers. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **string** `eventName` The event that was triggered. 
	* **jQuery** `element` The element the event was triggered on. 

* **Function** `JOBAD.events.onEvent.namespace.trigger(eventName, element)` - Trigger the onEvent event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **string** `eventName` The event that was triggered. 
	* **jQuery** `element` The element the event was triggered on. 
