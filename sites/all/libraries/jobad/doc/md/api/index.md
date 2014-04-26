# API Documentation

* [JOBAD](JOBAD/index.md) - Main JOBAD Namespace
* [template](template.md) - A Module template

* [Undocumented](undocumented.md) - Contains a list of currently undocumented things. 

## Documentation Convention
An Object is documented like this:

* **Type** `Name`: Description
	* description of properties
	* **returns** Return value. 

If **returns** is omitted then the Object is either not a function or it returns `undefined`. 

The following types are available: 

* `Undefined` Javascripts undefined. 
* `Object` A javascript object of string / object pairs. Often used as namespace. 
* `Boolean` A javascript boolean object. Is either `true` or `false`. 
* `Number` A javascript number object. This should not be `NaN`, `Infinity` or `-Infinity` unless specefied otherwise. 
* `String` A javascript string. 
* `Function` A javascript function. 
* `Instance[`**Function**`]` Instance of the specefied function. Addtionally has the following abbreviations: 
	* `jQuery` is the same as `Instance[jQuery]`. Note that any jQuery element may also just be a jQuery selector. 
	* `JOBAD` is the same as `Instance[JOBAD]`
* `Array[`**Type**`][`**Length**`]` Array of specefied type and length. Unless specefied otherwise, this may be empty. If length is omitted, the array can have any length. 
* `Mixed` May be any of the types specefied above. May be further restricted by the appopriate description.  
