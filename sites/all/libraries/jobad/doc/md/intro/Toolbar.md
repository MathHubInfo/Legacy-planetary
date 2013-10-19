# The Toolbar

The Toolbar is a Bar at the bottom of the page which is visible whenever a JOBADInstance is focused. 
Each module can have a Toolbar. A toolbar can be specified via the Toolbar function of a module like so: 

```js
var myModule = {
	//other module things here
	"Toolbar": function(JOBADInstance, Toolbar){
		//Toolbar is a jQuery Toolbar element. 
		//Fill it with anything you want. 
		Toolbar.text("I'm a Toolbar! "); //Lets give it a simple text. 
		return true; //if there is no Toolbar, you should return false. 
	}
}
```

Toolbars are only shown if 

* the module the Toolbar belongs to is active and
* the JOBADInstance the module belongs to is focused and
* the Toolbar state is visible. 

By default, the Toolbar state is hidden. To change it to visible, load the module and then do: 

```js
myLoadedModule.Toolbar.setVisible(); 
```

This can be done in the init handler, but that is not recommended. 