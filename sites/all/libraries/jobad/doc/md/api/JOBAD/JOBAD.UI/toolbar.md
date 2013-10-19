# JOBAD.UI.Toolbar

* **Object** `JOBAD.UI.Toolbar.config` - JOBAD Toolbar UI Configuration namespace
* **Number** `JOBAD.UI.Toolbar.config.height` - Default height for new sidebars. (Default: 20)

* **Function** `JOBAD.UI.Toolbar.add()` - Adds a toolbar to the page and returns a reference to it 
    * **returns** jQuery reference to the new sidebar

* **Function** `JOBAD.UI.Toolbar.update()` - Updates the toolbar display for all current toolbars. Should be called after a toolbar is removed. 

* **Function** `JOBAD.UI.Toolbar.moveUp(TB)` - Moves a Toolbar up. 
	* **jQuery** `TB` the jQuery element representing the Toolbar. 

* **Function** `JOBAD.UI.Toolbar.moveDown(TB)` - Moves a Toolbar down. 
	* **jQuery** `TB` the jQuery element representing the Toolbar. 