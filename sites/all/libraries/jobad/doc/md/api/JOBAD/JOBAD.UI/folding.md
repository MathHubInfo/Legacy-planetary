# JOBAD.UI.Folding

* **Object** `JOBAD.UI.Folding.config` - JOBAD Folding UI Configuration namespace. 
* **Number** `JOBAD.UI.Folding.config.placeHolderHeight` - Default Height for the folded placeholders. (Default: 50)
* **jQuery** `JOBAD.UI.Folding.config.placeHolderContent` - jQuery-ish stuff in the placeholder. Ignored for livePreview mode. 

* **Function** `JOBAD.UI.Folding.enable(element, config)` - Enables folding on an element. 
	* **jQuery** `element` - Element(s) to enable folding on. 
	* **Object** `config` - Configuration. Optional. `element` is the element that is being folded. 
		* **Function** `config.enable(element)` Callback on enable. 
        * **Function** `config.disable(element)` Callback on disable
        * **Function** `config.fold(element)`  Callback on folding
        * **Function** `config.unfold(element)` Callback on unfold
        * **Function** `config.stateChange(element)` Callback on state change. 
        * **Function** `config.update(element)` Called every time the folding UI is updated. 
        * **Object** `config.align` Alignment of the folding. Either 'left' (default) or 'right'.  
        * **Number** `config.height` Height fo the preview / replacement element. Leave empty to assume default. 
        * **Boolean** `config.livePreview` Enable live preview for an element. Default: true. 
        * **Boolean** `config.autoFold` Automatically fold this element? Default: false. 
        * **String|Function** `config.preview` String or function which describes the element(s). Will be used as preview text. Optional. `
    * **returns** `element`

* **Function** `JOBAD.UI.Folding.disable(element, keep)` - Disables folding on an element. 
	* **jQuery** `element` - Element(s) to disable folding on. 
	* **Boolean** `keep` - If set to true, the element will remain hidden if it currently is hidden. 

        
* **Function** `JOBAD.UI.Folding.update(elements)` - Updates one or more folded elements. 
	* **jQuery** `elements` - Optional. Element(s) to update folding on. 
	* **returns** boolean

* **Function** `JOBAD.UI.Folding.fold(element)` - Folds an element. 
	* **jQuery** `element` - Element(s) to fold. 
	* **returns** boolean

* **Function** `JOBAD.UI.Folding.unfold(element)` - Unfolds an element. 
	* **jQuery** `element` - Element(s) to unfold. 
	* **returns** boolean

* **Function** `JOBAD.UI.Folding.isFoldable(element)` - Checks if an element is foldable. 
	* **jQuery** `element` - Element to check. 
	* **returns** boolean

* **Function** `JOBAD.UI.Folding.show(element)` - Shows an element if it is folded. 
	* **jQuery** `element` - Element to show. 