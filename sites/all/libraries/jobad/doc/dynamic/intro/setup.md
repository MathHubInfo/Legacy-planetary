# Setting up JOBAD
This page will give instructions on how to include JOBAD into your website. 

The source code for JOBAD can be found at [https://github.com/KWARC/jobad](https://github.com/KWARC/jobad). 
To get the code use 

    git clone https://github.com/KWARC/jobad

To include JOBAD in your website, you will have to include several files in your HTML document. 
JOBAD itself depends on: 

* [jQuery](http://jquery.com) - tested with version 2.0.2
* [jQuery UI](http://jqueryui.com/) - tested with version 1.10.3

Both dependencies are bundled with JOBAD. 

The javascript side of the JOBAD code exists in three different versions: 

* an unbuilt version, which consists of several files. 
* a development version version which consists of one file with comments and readable version: (`JOBAD.js`)
* a release version which consists of one file with compressed code. It is created by running the development version through the [Google Closure Compiler](https://developers.google.com/closure/compiler/). 

The CSS code version of the code exists in two different versions: 

* an unbuilt version, which consists of several files. 
* a built Version which consists of one file. 

You only need to use one version of the JS code and one version of the CSS code in your page. 

Your html `<head>` should look like this: 

```html
<head>
	<!-- other header tags here -->
	<!-- Include dependencies -->
	<script src="js/deps/jquery/jquery-2.0.0.min.js"></script>
	<script src="js/deps/jquery/jquery-ui-1.10.3.js"></script>
	<link href="css/jquery-ui.css" rel="stylesheet">
```
If you want to include the unbuilt js files use this code: 

```html
${JS_INCLUDE}
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
${CSS_INCLUDE}
```

To use the built CSS version, use this code: 

```html
	 <link href="build/release/JOBAD.css" rel="stylesheet">
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