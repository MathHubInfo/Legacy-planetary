# JOBAD.events.keyPress

The keyPress event is triggered every time a key (combination) is pressed. (Note: If, for example, just the ctrl key is pressed it shows up as "ctrl+" as it belongs to some combination. )

* **Function** `JOBAD.events.keyPress.default()` The default Event Handler for keyPress Events. Just returns false. 

* **Function** `JOBAD.events.keyPress.Setup.enable(root)` Enables the keyPress event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to enable leftClick on. 
* **Function** `JOBAD.events.keyPress.Setup.disable(root)` Disables the keyPress event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to disable leftClick on. 
* **Function** `JOBAD.events.keyPress.namespace.getResult(key)` Get the Result of the keyPress event handlers. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **String** `key` The key combination that is being pressed. 
	* **returns** a boolean indicating if some action was taken. 

* **Function** `JOBAD.events.keyPress.namespace.trigger(key)` Trigger the keyPress event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **String** `key` The key combination that is being pressed. 
	* **returns** a boolean indicating if some action was taken. 
