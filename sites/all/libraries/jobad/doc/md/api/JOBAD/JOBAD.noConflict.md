# JOBAD.noConflict

* **Function** `JOBAD.noConflict()` Restores the variables $ and _ created by JOBADs dependencies to their previous state. 
	* **returns** a `conflict` object: 
		* **jQuery** `conflict.$` A reference to jQuery. 
		* **Underscore** `conflict._` A reference to Underscore. 
* **Function** `JOBAD.noConflict.$()` Restores the variable $ to its original content. 
	* **returns** a reference to jQuery. 
* **Function** `JOBAD.noConflict._()` Restores the variable _ to its original content. 
	* **returns** a reference to Underscore. 
