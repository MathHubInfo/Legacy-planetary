# Introduction to JOBAD

JOBAD (JavaScript API for OMDoc-based Active Documents) is a javascript framework which makes it easy to create interactive web pages. As such it has several components which allow different features to be used on a webpage. 

JOBAD mainly consists of three different components: 

* the `JOBAD Core`, which is responsible for loading modules and delegating their calls to the web page and the UI
* the `JOBAD UI`, which is responsible for providing the functionality required by the modules and modfying the DOM respectively
* and Modules for JOBAD which are written by other people. 

On any page, there can be several JOBAD Instances. A JOBADInstance is bound to a specific jQuery element within the DOM structure. Each instance can load modules whcih can then interact with that part of the page. While the part of the page the JOBADInstance is bound to is determined by the web developer who wants to use JOBAD, the modules are written by other people and provide a more general functionality. Since every module can be given options, the module can be configured individally. 

Before a module can be loaded for a specific JOBADInstance, it has to registered with JOBAD. This is usually done by the module authors, so you only need to include their js-file within your web page. It is done like so

```js
JOBAD.modules.register(myModule); // myModule is a module object; more about that later
```

Once this is done, you can create a JOBADInstance, bind it to an area on the page load a module and setup jobad.  

```js
$(function(){ //run this code once the DOM is ready
    var element = $("#jobad_area"); // some area of the page to bind JOBAD to. Warning: Never bind to "body" or "document" directly. 
    var myJOBADInstance = new JOBAD(element) //create a new jobad instance. 
    //load the module some.awesome.module.name
    myJOBADInstance.modules.load(
        'some.awesome.module.name', 
        [], //the second parameter is options to pass to the module. 
        function(){ //a  callback once everythign is loaded
            myJOBADInstance.Setup(); //setup jobad (start it)
        }
    ); 
});
```

After a module has been loaded and registered with a JOBADInstance, it can be activated or deactivated. If a module is deactivated, no events of it are called. 
Modules are activated by default. To manually (re)activate a module, you can: 

```js
myJOBADInstance.modules.activate('some.awesome.module.name'); 
```

Similarly, it can be deativated using the following code: 

```js
myJOBADInstance.modules.deactivate('some.awesome.module.name'); 
```

You can also do this directly on a loaded module. To get a loaded Module object, use: 

```js
var loadedModule = myJOBADInstance.modules.getLoadedModule('some.awesome.module.name'); //get the specefied module
loadedModule.deactivate(); //deactivate the module
loadedModule.activate(); //activate the module
```

For more information on what you can do with loadedModules, please refer to the [API Documentation](../api/JOBAD/JOBAD.modules/loadedModule.md). 

For more information on what you can do with JOBADInstances, please refer to the respective section in the [API Documentation](../api/JOBAD/JOBADInstance/index.md). 

## More Information

* [Setup](setup.md) - How to quickly include JOBAD on your webpage
* [Writing Modules](modules.md) - General introduction to writing modules
    * [Events](events.md) - What are events?
    * [Tooltips](hover.md) - How to use tooltips in JOBAD
    * [Context Menu](contextmenu.md) - How to use the context menu
    * [Sidebar](sidebar.md) - How does the sidebar work?
    * [Folding](folding.md) - Folding the DOM
    * [Configuration Options](config.md) - How can I configure JOBAD modules?
    * [Module examples](example_modules.md) - Example Modules
* [Repositories](repos.md) - What are module repositories? How can they be provided? 
* [Building](build.md) - Information on how to build JOBAD
* [Extending the Core](extend.md) - How to extend the JOBAD Core