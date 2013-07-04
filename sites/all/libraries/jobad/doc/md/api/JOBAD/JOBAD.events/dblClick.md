# JOBAD.events.dblClick

The leftClick event is triggered every time an element is double clicked. 

* **Function** `JOBAD.events.dblClick.default()` The default Event Handler for dblClick Events. Just returns false. 

* **Function** `JOBAD.events.dblClick.Setup.enable(root)` Enables the dblClick event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to enable dblClick on. 
* **Function** `JOBAD.events.dblClick.Setup.disable(root)` Disables the dblClick event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to disable dblClick on. 
* **Function** `JOBAD.events.dblClick.namespace.getResult(target)` Get the Result of the dblClick event handlers. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `target` The element that is being clicked. 
	* **returns** a boolean indicating if some action was taken. 

* **Function** `JOBAD.events.dblClick.namespace.trigger(target)` Trigger the dblClick event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `target` The element that is being clicked. 
	* **returns** a boolean indicating if some action was taken. 
