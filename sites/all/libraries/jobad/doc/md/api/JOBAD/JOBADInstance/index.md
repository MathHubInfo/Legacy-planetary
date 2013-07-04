# JOBADInstance
An instance of `JOBAD` has the following properties: 

* **jQuery** `.element` The element this JOBAD instance is bound to. 
* **String** `.ID` An Id identifiing this JOABD Instance. (Note: This changes every time the JOBADInstance is re-created)

* **Object** [`.Setup`](setup.md) Namespace for setup functions
* **Object** [`.modules`](modules.md) Namespace for module related functions. 
* **Object** [`.Config`](Config.md) JOBAD Configuration namespace. 
* **Object** [`.Event`](event/index.md) Namespace for event related functions. 
* **Object** [`.Sidebar`](sidebar.md) Namespace for Sidebar Functions. 
* **Object** [`.Folding`](folding.md) Namespace for Folding Functions. 
* **Array** `.args` An array containing the parameters originally parsed to the module constructor. 
* **Function** `.showConfigUI()` Displays the configuration UI. 
* **Function** `.contains(element)` - Checks if `element` is a memer of this JOBADInstance. 
	* **jQuery** Element to check. 
	* **returns** boolean. 