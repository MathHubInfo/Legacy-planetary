# Setting up JOBAD
This page will give instructions on how to include JOBAD into your website. 
## Getting the JOBAD code
The source code for JOBAD can be found at [https://github.com/KWARC/jobad](https://github.com/KWARC/jobad). 
To get the code use 

    git clone https://github.com/KWARC/jobad
    
If you want to build jobad, please use

    git clone --recursive  https://github.com/KWARC/jobad
    
in order to check out the build dependencies. 
## Including JOBAD in a website
To include JOBAD in your website, you will have to include several files in your HTML document. 
JOBAD itself depends on: 

* [jQuery](http://jquery.com) - tested with version 2.0.0
* [jQuery UI](http://jqueryui.com/) - tested with version 1.10.3
* [UNDERSCORE.JS](http://underscorejs.org/) - tested with version 1.4.4

All 3 dependencies are bundled with JOBAD. You can include them in your HTML document header like so:
 
```html
<head>
	<!-- other header tags -->
	<script src="js/deps/jquery/jquery-2.0.0.min.js"></script>
	<script src="js/deps/jquery/jquery-ui-1.10.3.js"></script>
	<script src="js/deps/underscore/underscore-min.js"></script>
	<link href="css/jquery-ui.css" rel="stylesheet">
	<!-- More files to include -->
</head>
```
	
After this you have a choice. You can either include the development version with comments or minimized version. 
It is also possible to include each file individually. 

As a developer who wants to work on the JOBAD core you can load the JOBAD Core files: 

```html
	<script src='js/JOBAD.core.js'></script>
	<script src='js/resources.js'></script>
	<script src='js/JOBAD.utils.js'></script>
	<script src='js/JOBAD.core.modules.js'></script>
	<script src='js/JOBAD.core.events.js'></script>
	<script src='js/JOBAD.ui.js'></script>
	<script src='js/JOBAD.events.js'></script>
	<script src='js/JOBAD.config.js'></script>
	<script src='js/JOBAD.wrap.js'></script>
```

As a developer who develops JOBAD modules, you can include the built development version: 

```html
	<script src="./build/release/JOBAD.js"></script>
```

If you want to minimize bandwith and just want to embed JOBAD onto your webpage, you can include the minified version: 

```html
	<script src="./build/release/JOBAD.min.js"></script>
```

Finally, you should include the JOBAD CSS file in your website: 

```html
	<link href="./build/release/JOBAD.css" rel="stylesheet">
```

That's it. JOBAD is now included in your web page. Additionally you should include some modules by loading their files as well, see the individual modules. 
Then you can start JOBAD: 

```javascript
$(function(){
	var JOBAD1 = new JOBAD($("#my_JOBAD_area")); //bind JOBAD to an element on the page. 
	JOBAD1.modules.load('some.awesome.module', ['with', 'options']); //Load a module
	JOBAD1.Setup.enable(); //Enable JOBAD
});
```

If jQuery's "$" or Underscore's "_", cause conflicts with other libraries, you can simply use

```javascript
var conflicts = JOBAD.noConflict();

conflicts.$ //now contains a reference to jQuery. 
$ //contains whatever it contained before jQuery was loaded

conflicts._ //now contains a reference to Underscore
_ //contains whatever it contained before Underscore was loaded
```


## See also

* [API Documentation](api/index.md)