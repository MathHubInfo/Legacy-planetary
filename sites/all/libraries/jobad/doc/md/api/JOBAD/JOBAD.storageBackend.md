# JOBAD.storageBackend

* **Function** `JOBAD.storageBackend.getKey(key, def)` Gets a key from storage.  
	* **String** `key` Key to find. 
	* **Mixed** `def` Default value to return in case key is not set. 

* **Function** `JOBAD.storageBackend.setKey(key, val)` Sets a key in storage.  
	* **String** `key` Key to set. 
	* **Mixed** `val` Value to set. 

* **Object** `JOBAD.storageBackend.engines` Contains storage engines. Available engines are currently: `none`. 