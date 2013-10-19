# JOBADInstance.Setup
* **Function** `.Setup()` Toggles the state of this JOBAD instance. 
* **Function** `.Setup.isEnabled()` Checks if this JOBAD instance is currently enabled. 
	* **returns** a boolean indicating if this instance of JOBAD is active. 
* **Function** `.Setup.enable()` Enables this JOBAD instance. 
	* **returns** boolean indicating success. 
* **Function** `.Setup.disable()` Disables this JOBAD instance. 
	* **returns** boolean indicating success. 

* **Function** `.Setup.deferUntilEnabled(func)` Defers a function until until this instance is enabled. 
    * deprecated, use `.Event.once('instance.enable', func)` instead. 
	* **Function** `func()` Function to defer. 
* **Function** `.Setup.deferUntilDisabled(func)` Defers a function until until this instance is disabled. 
    * deprecated, use `.Event.once('instance.disable', func)` instead. 
	* **Function** `func()` Function to defer. 

* **Function** `.Setup.enabled(func)` Calls a function if this JOBADInstance is enabled, otherwise calls it once the JOBDInstance is enabled. 
	* **Function** `func()` Function to defer. 

* **Function** `.Setup.disabled(func)` Calls a function if this JOBADInstance is disabled, otherwise calls it once the JOBDInstance is disabled. 
	* **Function** `func()` Function to defer. 