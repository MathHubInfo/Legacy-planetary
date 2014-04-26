# JOBAD.events.focus

The focus event is triggered every time a JOBADInstance is focused. 

* **Function** `JOBAD.events.focus.default()` The default Event Handler for focus Events. Just returns false. 

* **Function** `JOBAD.events.focus.Setup.enable()` Enables the focus event. Does nothing. 
* **Function** `JOBAD.events.focus.Setup.disable(root)` Disables the focus event. Does nothing. 
* **Function** `JOBAD.events.focus.namespace.getResult(prevFocus)` Get the Result of the focus event handlers. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **JOBAD** `prevFocus` The previous JOBADInstance which was focused or undefined. 
	* **returns** a boolean indicating if some action was taken. 

* **Function** `JOBAD.events.focus.namespace.trigger(prevFocus)` Trigger the focus event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **JOBAD** `prevFocus` The previous JOBADInstance which was focused or undefined. 
	* **returns** a boolean indicating if some action was taken. 