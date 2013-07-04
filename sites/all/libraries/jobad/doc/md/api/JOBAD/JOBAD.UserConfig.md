# JOBAD.UserConfig

* **Function** `JOBAD.UserConfig.set(id, prop, value)` Updates user configuration. 
	* **String** `id` Identifier of module to access. 
	* **String** `prop` Property to set or a (prop, value) map. 
	* **Mixed** `value` Value to set. 

* **Function** `JOBAD.UserConfig.canSet(id, prop, value)` Checks if a user configuration can be set with the specefied value. 
	* **String** `id` Identifier of module to access. 
	* **String** `prop` Property to set. 
	* **Mixed** `value` Value to set. 
	* **returns** boolean. 

* **Function** `JOBAD.UserConfig.get(id, prop)` Reads user configuration. 
	* **String** `id` Identifier of module to access. 
	* **String** `prop` Property(s) to get. May be an array. 
	* **returns** value or map of values. 

* **Function** `.UserConfig.setMessage(id, msg)` Sets the current message (displayed in config UI). 
	* **String** `id` Identifier of module to access. 
	* **String** `msg` Message to set. 
* **Function** `.UserConfig.getMessage(id)` Gets the current message (displayed in config UI). 
	* **String** `id` Identifier of module to access. 

* **Function** `JOBAD.UserConfig.reset(id)` Resets the user configuration. 
	* **String** `id` Identifier of module to access. 
* **Function** `JOBAD.UserConfig.getTypes(id)` Gets the user configuration types. 
	* **String** `id` Identifier of module to access. 