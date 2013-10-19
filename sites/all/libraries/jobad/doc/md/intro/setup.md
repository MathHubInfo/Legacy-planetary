# Setting up JOBAD
This page will give instructions on how to include JOBAD into your website. 

The source code for JOBAD can be found at [https://github.com/KWARC/jobad](https://github.com/KWARC/jobad). 
To get the code use 

    git clone https://github.com/KWARC/jobad

To include JOBAD in your website, you will have to include several files in your HTML document. 
JOBAD itself depends on: 

* [jQuery](http://jquery.com) - works with version >= 1.8
* [Bootstrap](http://getbootstrap.com/2.3.2/) - tested with version v2.3.2, **not** compatible with version 3.x

For Bootstrap you can also use a scoped version (all the CSS is restricted to a certain class) , in which case you should configure this is with: 
```
	JOBAD.config.BootstrapScope = "bootstrap"; //set this to the bootstrap class name
````

All dependencies are bundled with JOBAD, but can also be included from different sources. 

The javascript side of the JOBAD code exists in three different versions: 

* an unbuilt version, which consists of several files. 
* a development version version which consists of one file with comments and readable version: (`JOBAD.js`)
* a release version which consists of one file with compressed code. 

The CSS code version of the code exists in three different versions: 

* an unbuilt version, which consists of several files. 
* a built Version which consists of one file.
* a minimised Version which consists of the minimsed built version file.  

You only need to use one version of the JS code and one version of the CSS code in your page. 

Your html `<head>` should look like this: 

```html
<head>
	<!-- other header tags here -->
	<!-- Include dependencies -->
	<script src='js/deps/jquery/jquery-2.0.2.min.js'></script>
	<script src='js/deps/bootstrap.js'></script>
	<link rel="stylesheet" type="text/css" href="css/libs/bootstrap/css/bootstrap.less.css">
```

The Libraries are also compiled into one JS and CSS file, which both can be included via the following code snippet. This is the recommended method for including the depencies: 

```html
	<script src="build/release/libs/js/libs.js"></script>
	<link href="build/release/libs/css/libs.css" rel="stylesheet">
```

If you want to include the unbuilt js files use this code: 

```html
	<script src='js/core/JOBAD.core.js'></script>
	<script src='js/bundled/jquery-color/jquery.color.plus-names-2.1.2.js'></script>
	<script src='js/bundled/underscore/underscore.js'></script>
	<script src='js/util/JOBAD.util.js'></script>
	<script src='js/JOBAD.resources.js'></script>
	<script src='js/JOBAD.repo.js'></script>
	<script src='js/core/JOBAD.core.modules.js'></script>
	<script src='js/core/JOBAD.core.setup.js'></script>
	<script src='js/ui/JOBAD.ui.js'></script>
	<script src='js/ui/JOBAD.ui.hover.js'></script>
	<script src='js/ui/JOBAD.ui.contextmenu.js'></script>
	<script src='js/ui/JOBAD.ui.sidebar.js'></script>
	<script src='js/ui/JOBAD.ui.overlay.js'></script>
	<script src='js/ui/JOBAD.ui.folding.js'></script>
	<script src='js/ui/JOBAD.ui.toolbar.js'></script>
	<script src='js/events/JOBAD.sidebar.js'></script>
	<script src='js/events/JOBAD.folding.js'></script>
	<script src='js/events/JOBAD.toolbar.js'></script>
	<script src='js/events/JOBAD.events.js'></script>
	<script src='js/JOBAD.config.js'></script>
	<script src='js/core/JOBAD.core.instances.js'></script>
	<script src='js/JOBAD.wrap.js'></script>
```

If you want to use the development version use the following code: 

```html
	<script src="build/release/JOBAD.js"></script>
```

To use the minimized code, use this: 

```html
	<script src="build/release/JOBAD.min.js"></script>
```

To use the unbuilt CSS version, use this version: 

```html
	<link rel="stylesheet" type="text/css" href="css/JOBAD.css">
	<link rel="stylesheet" type="text/css" href="css/JOBAD.theme.css">
```

To use the built CSS version, use this code: 

```html
	 <link href="build/release/JOBAD.css" rel="stylesheet">
```

To use the minimised CSS version, use this code: 

```html
	 <link href="build/release/JOBAD.min.css" rel="stylesheet">
```

Afterwards, you can include any modules you might want to use. Then you can use JOBAD on your page: 

```html
	<!-- Include your awesome modules here -->
	<!-- now you can use JOBAD on your page -->
	<script type="text/javascript">
		$(function(){
			var JOBAD1 = new JOBAD($("#my_JOBAD_area")); //bind JOBAD to an element on the page. 
			JOBAD1.modules.load('some.awesome.module', ['with', 'options']); //Load a module
			JOBAD1.Setup.enable(); //Enable JOBAD
		});
	</script>
</head>
```
If jQuery's "$" causes conflicts with other libraries, you can simply use

```javascript
var conflict = JOBAD.noConflict();

conflicts //now contains a reference to jQuery. 
$ //contains whatever it contained before jQuery was loaded

```