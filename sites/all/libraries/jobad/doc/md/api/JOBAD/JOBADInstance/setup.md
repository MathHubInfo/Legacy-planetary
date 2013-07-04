# JOBADInstance.Setup
* **Function** `.Setup()` Toggles the state of this JOBAD instance. 
* **Function** `.Setup.isEnabled()` Checks if this JOBAD instance is currently enabled. 
	* **returns** a boolean indicating if this instance of JOBAD is active. 
* **Function** `.Setup.enable()` Enables this JOBAD instance. 
	* **returns** boolean indicating success. 
* **Function** `.Setup.disable()` Disables this JOBAD instance. 
	* **returns** boolean indicating success. 
* **Function** `.Setup.deferUntilEnabled(func)` Defers a function until until this instance is enabled. 
	* **Function** `func()` Function to defer. 
* **Function** `.Setup.deferUntilDisabled(func)` Defers a function until until this instance is disabled. 
	* **Function** `func()` Function to defer. 