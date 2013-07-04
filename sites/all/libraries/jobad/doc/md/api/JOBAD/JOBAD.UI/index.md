# JOBAD.UI
This object contains the JOBAD User interface

* **Object** [`JOBAD.UI.hover`](hover.md) Namespace for the hover UI. 
* **Object** [`JOBAD.UI.ContextMenu`](contextmenu.md) Namespace for the Context Menu UI. 
* **Object** [`JOBAD.UI.Sidebar`](sidebar.md) Namespace for the Sidebar UI. 
* **Object** [`JOBAD.UI.Toolbar`](toolbar.md) Namespace for the Toolbar UI. 
* **Object** [`JOBAD.UI.Folding`](folding.md) Namespace for the Folding UI. 
* **Object** [`JOBAD.UI.Overlay`](overlay.md) Namespace for the Overlay UI. 
* **Function** `JOBAD.UI.highlight(element, color)` Highlights an element
	* **jQuery** `element` Element to highlight. 
	* **String** `color` Optional. Color to use. 
* **Function** `JOBAD.UI.unhighlight(element)` Reverts an element to its normal state. 
	* **jQuery** `element` Element to unhighlight. 
* **Function** `JOBAD.UI.sortTableBy(element, sortFunction, callback)` - Sorts a table
    * **jQuery** `element` A th in the header of the table representing by which column to sort by. 
    * **String|Function** `sortFunction(a, b)` A string-based sorting function which sorts the table. Can also be a string: 
        * `ascending` - Sort ascending
        * `descending`- Sort descending
        * `reset` - Go back to the original state
        * `rotate` - Rotate through the above. 
    * **Function** `callback(state)` Optional. If `sortFunction == 'rotate'`,  this function will be called with the current (new) state. (0 = 'reset', 1=`ascending`, 2=`descending`)