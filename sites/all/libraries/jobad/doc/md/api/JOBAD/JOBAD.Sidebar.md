# JOBAD.Sidebar

* **Object** `JOBAD.Sidebar.styles` - Contains JOBAD Sidebar styles
* **Array** `JOBAD.Sidebar.types` An array of all available sidebar styles
* **Array** `JOBAD.Sidebar.desc` An array of JOBAD Sidebar style descriptions

* **Function** `JOBAD.Sidebar.registerSidebarStyle = function(styleName, styleDesc, registerFunc, deregisterFunc, updateFunc)` - Register a new Sidebar style
	* **String** `styleName` Name of the style
	* **String** `styleDesc` Description of the style
	* **Function** `registerFunc()` Function to call if a new sidebar element should be registered
	* **Function** `deregisterFunc()` Function to call if a sidebar element should be removed
	* **Function** `updateFunc()` Function to call if the sidebar should be redrawn
	* **Function** `emptyFunc()` optional. Function to call to completly empty the sidebar