# JOBAD.events.unfocus

The unfocus event is triggered every time a JOBADInstance is unfocused. 

* **Function** `JOBAD.events.unfocus.default()` The default Event Handler for focus Events. Just returns false. 

* **Function** `JOBAD.events.unfocus.Setup.enable()` Enables the unfocus event. Does nothing. 
* **Function** `JOBAD.events.unfocus.Setup.disable(root)` Disables the unfocus event. Does nothing. 
* **Function** `JOBAD.events.unfocus.namespace.getResult()` Get the Result of the unfocus event handlers. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **returns** a boolean indicating if some action was taken. 

* **Function** `JOBAD.events.unfocus.namespace.trigger()` Trigger the unfocus event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **returns** a boolean indicating if some action was taken. 