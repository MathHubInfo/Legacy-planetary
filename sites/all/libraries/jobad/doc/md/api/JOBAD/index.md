# JOBAD
This object is the main JOBAD Namespace. 

* **Function** `JOBAD(element, config)` Creates a new instance of `JOBAD` bound to `element` 
	* **jQuery** `element` a jQuery Object to bind this JOBAD INstance to. May not be empty. Collections containing more than one element may cause problems 
	* **Object** `config` JOBAD Configuration. 
		* **Array** `config.restricted_user_config` An array of configuration items which can not be changed by the user
		* **Boolean** `config.auto_show_toolbar` Should toolbars be shows automatically? 
	* **returns** a new [`JOBAD`](JOBADInstance/index.md) instance

* **String** `JOBAD.version` - The current JOBAD Version ('3.2.0')
* **Function** `JOBAD.error(msg)` - Produces an error message
    * **String** `msg` The message to produce
* **Function** `JOBAD.isEventDisabled(name)` - Checks if an event is globally disabled
    * **String** `name` Name of the event to check
    * **returns** a boolean
* **Function** `JOBAD.noConflict()` - Restores the variable $ created by jQuery to its previous state. 
    * **returns** a reference to jQuery
* **Array** [`JOBAD.ifaces`](JOBAD.ifaces/index.md) - JOBAD ifaces
* **Object** [`JOBAD.Instances`](JOBAD.Instances.md) - Namespace for JOBAD Instances.  
* **Object** [`JOBAD.config`](JOBAD.config.md) - Configuration namespace
* **Object** [`JOBAD.console`](JOBAD.console.md) - Wraps the native console object if available
* **Object** [`JOBAD.events`](JOBAD.events/index.md) - Event namespace
* **Object** [`JOBAD.modules`](JOBAD.modules/index.md) - Module namespace
* **Object** [`JOBAD.refs`](JOBAD.refs.md) - Contains internal references to  JOBADs dependencies
* **Object** [`JOBAD.resources`](JOBAD.resources.md) - Text and icon resources namespace
* **Object** [`JOBAD.Sidebar`](JOBAD.Sidebar.md) - Namespace for the sidebar
* **Object** [`JOBAD.storageBackend`](JOBAD.storageBackend.md) - Storage Backend namespace
* **Object** [`JOBAD.UI`](JOBAD.UI/index.md) - UI Namespace
* **Object** [`JOBAD.util`](JOBAD.util.md) - Contains Utility functions
