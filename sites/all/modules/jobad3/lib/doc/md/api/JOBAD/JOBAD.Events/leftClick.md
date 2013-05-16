# JOBAD.Events.leftClick

The leftClick event is triggered every time an element is left clicked. 

* **Function** `JOBAD.Events.leftClick.default()` The default Event Handler for leftClick Events. Just returns false. 

* **Function** `JOBAD.Events.leftClick.Setup.enable(root)` Enables the leftClick event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to enable leftClick on. 
* **Function** `JOBAD.Events.leftClick.Setup.disable(root)` Disables the leftClick event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to disable leftClick on. 
* **Function** `JOBAD.Events.leftClick.namespace.getResult(target)` Get the Result of the leftClick event handlers. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `target` The element that is being clicked. 
	* **returns** a boolean indicating if some action was taken. 

* **Function** `JOBAD.Events.leftClick.namespace.trigger(target)` Trigger the leftClick event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `target` The element that is being clicked. 
	* **returns** a boolean indicating if some action was taken. 
