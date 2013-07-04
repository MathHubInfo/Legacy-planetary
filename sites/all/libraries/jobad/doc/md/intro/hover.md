# Tooltips in JOBAD

JOBAD also provides the `hoverText` event which makes it really easy to provdie tooltips. You can either return a jQuery element to use as tooltip or you can provide a text to use as tooltip: 

```js
var myModule = {
    //other stuff here
    'hoverText': function(target, JOBADInstance){
        return "I am a cool hover text. "; //may also depend on target. target is the element currently hovered. 
    }
};
```

The tooltip automatically appears over an element after a short delay (which can be configured using `JOBAD.UI.hover.config.hoverdelay`). Ife you do not want to provide a tooltip for a specific element but rather want to pass it on to the next highest element, return `false`. If you want to provide some other hover functionailty for this element, call it and return `true`. This will stop JOBAD from attempting to query higher elements for tooltips. 

You may also want to read: 

* [Context Menu](contextmenu.md) - How to use the context menu
* [Sidebar](sidebar.md) - How does the sidebar work?
* [Folding](folding.md) - Folding the DOM
* [Config UI](config.md) - How can I configure JOBAD modules?