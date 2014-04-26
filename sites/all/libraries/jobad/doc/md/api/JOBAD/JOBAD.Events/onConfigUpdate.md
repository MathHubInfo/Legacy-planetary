# JOBAD.Events.onConfigUpdate

The onConfigUpdate event is triggered every time a setting is updated. 

* **Function** `JOBAD.Events.onConfigUpdate.default()` The default Event Handler for onConfigUpdate Events. Does nothing. 

* **Function** `JOBAD.Events.onConfigUpdate.Setup.enable(root)` Enables the onConfigUpdate event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to enable onConfigUpdate on. 
* **Function** `JOBAD.Events.onConfigUpdate.Setup.disable(root)` Disables the onConfigUpdate event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to disable onConfigUpdate on. 
* **Function** `JOBAD.Events.onConfigUpdate.namespace.getResult(setting)` Get the Result of the onConfigUpdate event handlers. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **string** `setting` The setting that has been changed. 

* **Function** `JOBAD.Events.onConfigUpdate.namespace.trigger(setting)` Trigger the onConfigUpdate event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **string** `setting` The setting that has been changed. 
