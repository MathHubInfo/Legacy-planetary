# JOBAD.events.configUpdate

The onConfigUpdate event is triggered every time a setting is updated. 

* **Function** `JOBAD.events.configUpdate.default()` The default Event Handler for configUpdate Events. Does nothing. 

* **Function** `JOBAD.Events.configUpdate.Setup.enable(root)` Enables the configUpdate event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to enable onConfigUpdate on. 
* **Function** `JOBAD.Events.configUpdate.Setup.disable(root)` Disables the configUpdate event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to disable onConfigUpdate on. 
* **Function** `JOBAD.Events.configUpdate.namespace.getResult(setting, moduleId)` Get the Result of the configUpdate event handlers. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **string** `setting` The setting that has been changed. 
	* **string** `moduleId` Id of the module from which the setting was changed. 

* **Function** `JOBAD.Events.configUpdate.namespace.trigger(setting, moduleId)` Trigger the configUpdate event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **string** `setting` The setting that has been changed. 
	* **string** `moduleId` Id of the module from which the setting was changed. 