# JOBAD.events.hoverText

The hoverText event is triggered every time an element is hovered. The event can provide a text to display in a tooltip. 

* **Function** `JOBAD.events.hoverText.default()` The default Event Handler for hoverText Events. Just returns false. 

* **Function** `JOBAD.events.hoverText.Setup.init()` Init for `JOBAD.events.hoverText.Setup.enable`. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 

* **Function** `JOBAD.events.hoverText.Setup.enable(root)` Enables the hoverText event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to enable hoverText on. 
* **Function** `JOBAD.events.hoverText.Setup.disable(root)` Disables the hoverText event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `root` The root element to disable hoverText on. 

* **Function** `JOBAD.events.hoverText.namespace.getResult(target)` Get the Result of the hoverText event handlers. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `target` The element that is being hovered. 
	* **returns** a jquery element representing the hover, a text to display on it or a boolean indicating if something should be done. 

* **Function** `JOBAD.events.hoverText.namespace.trigger(target)` Trigger the hoverText event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `target` The element that is being hovered. 
	* **returns** a boolean indicating if the hover has been added.  
* **Function** `JOBAD.events.hoverText.namespace.untrigger(target)` Untrigger the hoverText event. 
	* **Instance[ [JOBAD](../JOBADInstance/index.md) ]** `this` The JOBAD Instance to work on. 
	* **jQuery** `target` The element that is being hovered. 
	* **returns** a boolean indicating if the hover has been removed. 
