
# Dependencies

This page contains an overview of which dependencies are used. 

## jQuery 

* current testing with version 2.0.2
	* works with >= 1.8
* accessible as `JOBAD.refs.$`
* noConflict mode supported

* The following functions are required (sorted by jQuery version)

	* `>= 1.0`
		* `jQuery.noConflict`
		* `.appendTo()`
		* `.attr()`
		* `.children()`
		* `.css()`
		* `.each()`
		* `.get()`
		* `.height()`
		* `.hover()`
		* `.html()`
		* `.parent()`
		* `.parents()`
		* `.prependTo()`
		* `.remove()`
		* `.removeAttr()`
		* `.text()`
		* `.width()`

	* `>= 1.2`
		* `.hasClass()`
		* `.replaceWith()`
		* `.wrapInner()`

	* `>= 1.2.6`
		* `.outerHeight()`
		* `.outerWidth()`
		* `.scrollLeft()`
		* `.scrollTop()`

	* `>= 1.3`
		* `.trigger()`

	* `>= 1.4`
		* `jQuery()` 
		* `.add()` 
		* `.addClass()` 
		* `.append()` 
		* `.detach()` 
		* `.eq()` 
		* `.filter()` 
		* `.first()` 
		* `.has()` 
		* `.index()` 
		* `.not()` 
		* `.prepend()` 
		* `.removeClass()` 
		* `.unwrap()` 
		* `.val()` 
		* `.wrap()` 

	* `>= 1.4.3`
		* `.change()`
		* `.click()`
		* `.data()`
		* `.delegate()`
		* `.hide()`
		* `.show()`

	* `>= 1.6`
		* `.animate()`
		* `.closest()`
		* `.find()`
		* `.is()`
		* `.prop()`
		* `.undelegate()`

	* `>= 1.7`
		* `.off()`
		* `.on()`
		* `.one()`

## Bootstrap

* currently version 2.x
	* will not work with Bootstrap 3.x
* unknown version of jQuery needed
	* tested to work with jQuery >= 1.8

* Tabs
* Modal
* Progressbar
* Button
* Dropdown
	* with submenus (hence 3.x is not supported)

## Underscore

* current version: 1.5.1
* should work with older versions also
* almost all functions
* would be difficult to remove as it is used almost everywhere
* is bundled with JOBAD
* can be found as `JOBAD.util`