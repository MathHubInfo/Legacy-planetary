# JOBAD.events.contextMenuEntries

The contextMenuEntries event is triggered every time an element is right clicked and a context menu is requested. Does not trigger when the CTRL key is pressed to allow access to the default browser menu. This event provides context menu entries. 


* **Function** `JOBAD.events.contextMenuEntries.default()` The default Event Handler for contextMenuEntries Events. Just returns false. 

* **Function** `JOBAD.events.contextMenuEntries.Setup.enable(root)` Enables the contextMenuEntries event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to enable contextMenuEntries on. 
* **Function** `JOBAD.events.contextMenuEntries.Setup.disable(root)` Disables the contextMenuEntries event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to disable contextMenuEntries on. 
* **Function** `JOBAD.events.contextMenuEntries.namespace.getResult(target)` Get the Result of the contextMenuEntries event handlers. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `target` Element to request context menu on. 
	* **returns** a list of context menu entries for this element. 

