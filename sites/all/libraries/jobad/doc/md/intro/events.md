# Events
Every JOBAD Module can register event handlers. An event is something that occurs on the page, for example a click on an element. 
The following events are currently available: 

* `leftClick`: When an element is left clicked on. 
* `dblClick`: When an element is double clicked. 
* `contextMenu`: When an element is right clicked on, a context menu may appear. Is not triggered when the control key is pressed to allow access to the native context menu. 
* `hoverText`: A text which will appear in a tooltip hovering over the hovered element. Warning: If there are `title` attributes on the element, they might interfere with this event. 
* `SideBarUpdate`: Called when the sidebar is upated. 
* `configUpdate`: Called whenever the config is updated. 
* `onEvent`: Called whenever another event is raised. 

To register to an event, a module simply has to provide a property with the specefied name: 

```javascript
var myModule = {
    //other things here
    'leftClick': function(target, JOBADInstance){
        alert("Something was left clicked on. "); 
    }
}
```

To any event there are usually two parameters. The first one is where the event occured (usually a jQuery element) and the second parameter is the JOBADInstance the module is bound to. `this` within the module refers to the current `JOBAD.Modules.loadedModule` Instance. For a more detailed description, please refer to the [API documentation](../api/template.md) of the template module. 

Apart from the events above there are also 4 special events which are not bound to the page: 

* `globalinit` - The globalinit event is called once globally when the module is first initialised with some JOBADInstance. 
* `init` - The init event is called once the module is initialised with a new JOBADInstance. 
* `activate` - The activate event is called every time the module is activated. 
* `deactivate` - The deactivate event is called every time the module is deactivated. 

*Event handling and DOM nodes*  JOBAD catches events at every level of the DOM tree up to the JOBAD root node. Then it performs the following algorithm to try to handle the event: 

* Does a module provide event handling for this event at this DOM node?
	* If yes, allow the module to handle the event and prevent the browser from handling it. 
	* If not, continue below. 
* Does this node have a parent for which JOBAD is active?
	* If so, allow the parent element to handle this event (i. e. pass it back to browser which will automatically bubble it up. )
	* If not, allow the browser to handle the event. 

This means that if, for example, the user click on a &lt;b&gt; element within a &lt;div&gt;, 
JOBAD will first check if any active module handles the left click on the &lt;b&gt;
element. If so **only** that specific module will handle this event. If not, JOBAD will check the parent &lt;div&gt; if some module can handle a click on 
the &lt;div&gt; element. 

If there are multiple event handlers for one event, JOBAD might only execute only one. 

* `contextMenu`: Context Menu entries will be merged. 
* `hoverText`: Every handler is triggered, however only the first tooltip is shown. 

For any other event, every handler will be called. 

You may also want to read more on 

* [Tooltips](hover.md) - How to use tooltips in JOBAD
* [Context Menu](contextmenu.md) - How to use the context menu
* [Sidebar](sidebar.md) - How does the sidebar work?
* [Folding](folding.md) - Folding the DOM
* [Config UI](config.md) - How can I configure JOBAD modules?