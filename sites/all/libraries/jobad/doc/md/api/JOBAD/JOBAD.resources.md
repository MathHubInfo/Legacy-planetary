# JOBAD.resources

* **Function** `JOBAD.resources.provide(type, name, value)` - Provide a new resource for others to use
	* **String** `type` Either 'text' or 'icon'
	* **String** `name` Name of new resource to provide. Can also be a `name` - `value` map
	* **String** `value` Resource value
* **Function** `JOBAD.resources.available(type, name)` - Checks if a resource is available
	* **String** `type` Either 'text' or 'icon'
	* **String** `name` Name of resource to check for
* **Function** `JOBAD.resources.getIconResource(name, alternatives)` - Gets the specefied icon resource. May also be a url to an unknown resource
	* **String** `name` Name of resource to get.
	* **Object** `alternatives` Optional. An object to override resource names
* **Function** `JOBAD.resources.getTextResource(name)` - Gets the specefied text resource
	* **String** `name` Name of resource to get

* **Object** `JOBAD.resources.text` - Contains text resources
* **String** `JOBAD.resources.text.gpl_v3_text` - The GPL v3 License Text
* **String** `JOBAD.resources.text.jquery_license` - jQuery License Text
* **String** `JOBAD.resources.text.jqueryui_license` - jQuery UI License Text
* **String** `JOBAD.resources.text.jobad_license` - JOBAD License Text
* **String** `JOBAD.resources.text.underscore_license` - Underscore License Text
* **Object** `JOBAD.resources.icons` - Contains urls for icons. Mostly used for notifications