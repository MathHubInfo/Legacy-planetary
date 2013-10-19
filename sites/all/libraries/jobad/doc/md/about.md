# About

JOBAD (JavaScript API for OMDoc-based Active Documents) is a javascript framework which makes it easy to create interactive web pages. 

JOBAD should work in all modern browsers. JOBAD has been tested successfully in: 

* Google Chrome 28
* Firefox 20
* Internet Explorer 10

It is known not to be compatible with: 

* Internet Explorer 9 and below. 

The official JOBAD repository is located at [https://github.com/KWARC/jobad](https://github.com/KWARC/jobad). 

## Changelog
### Version 3.2.0 (Stable)
* added auto focus for JOBADInstances
* added the keypress event (finally)
* bug Fix: EventHandler .off was not working
* added support for CSS scoped bootstrap
	* compatibility with jQuery UI, no CSS is broken
		* added a new jQuery UI Testing page for this
	* this currently breaks BS fade animations


### Version 3.1.9 
* Change in dependencies
	* removed jQuery UI dependency, we now only need Bootstrap 2.x
	* support for jQuery 1.8+
	* added bundled jQuery Color for color animations
* added JOBAD.Instances
	* added the focus and the unfocus Events
	* only one JOBAD Instance focused at the same time
	* no auto focusing for now
* added Toolbars
	* per-module
	* UI left to module
	* can be shifted up and down
	* have to be enable via config UI or via code
	* only visible on the currently focused JOBADInstance
* improved the Event System
	* Dynamic listening to event via `.Event.on(evt, handler)` and `.Event.once(evt, handler)`
	* added `.Event.bind` and `loadedModule.setHandler` to create custom events for modules
	* added folding.enable and folding.disable events
* changes to the Sidebar
	* removed "bound to element" Sidebar Style 
	* added a "hidden" Sidebar Style, which hides the Sidebar
		* should be used for clients where the sidebar takes away space
* improved JOBAD.util.getOrigin()
	* better compatibility when using inline-scripts
* more rotation for the radial context menu
* updated the config module
* updated Makefile

### Version 3.1.8
* improved contextMenu
	* added Ids for menus
	* added the contextMenuOpen Event to onEvent. 
	* added the contextMenuClose Event to onEvent. 
* added new example module `test.menu3`

### Version 3.1.7
* refactored the build system, now easy with `make`
	* also compressing all required libraries in a js and css file
	* building will automatically pull all dependencies (npm & pip needed)
* added bootstrap compatibility via jQuery Bootstrap
* updated the config dialog
	* ported the config dialog to bootstrap
	* moved to the module `jobad.config`
* added `moduleInstance.getOrigin()` to get the origin of a module. 
	* all urls on modules are now resolved relative to the module. 
* added `JOBAD.util.loadExternalCSS`
* added CSS external dependencies for modules
* added disabled menu items (use `false` instead of a callback)
* better default handling of sidebar icons. 
* improved styles
* updated underscore to version 1.5.1


### Version 3.1.6
* improved repository override urls
* removed build submodules, made them static
* fixed 'failed to load module: undefined' error messages

### Version 3.1.5
* made module loading asynchronous 
* added repositories
	* a nice way to store modules in
	* can be loaded dynamically loaded from code
* added "externals" to module info
	* allows to load external scripts as dependencies
	* added a MathJax module which uses this
	* allowing globalinit functions to be async if a module info peropety `async` is set to true. 
* added `url` to module info, to provide a module homepage
* improved globalStore, localStore and UserConfig
	* you can now get and set multiple values at once
	* UserConfig and globalStore now accessible outside of loadedModule Instances (via JOBAD.modules.globalStore and JOBAD.UserConfig)
* added `.UserConfig.setMessage` and `.UserConfig.getMessage`
* improved ToolBar, now supports icons
* minor CSS fixes
* more doc updates

### Version 3.1.0
* improved Sidebar
	* added sidebar postions: left, right and bound to element. 
	* default width reduced to 50px. 
* improved UserConfig
	* added cookie storageBackend
	* improved the config UI
* removed Underscore as a dependency
	* it is now included in the `JOBAD.util` namespace, `JOBAD.refs._` has been removed. 
* added marking elements as hidden or visible so they can be ignored by events & UI. 
* split up JOBAD into event more files; added folders for more structure in code. 
* added JOBAD Folding
	* allows to fold elements, at the moment only usable via code. 
	* either on the left or on the right. 
	* always inside of the sidebar. 
* added the radial menu (also known as the icon menu)
	* as an alternative to the normal menu. 
	* only configurable via code. 
	* also allowing custom icons
* added configUpdate event
* added doubleClick event
* split up the CSS in one JOBAD.css file and one user-configurable JOBAD.theme.css file. 
* updated jQuery to version 2.0.2
* updated the documentation (a lot)

### Version 3.0.1
* minor bug fixes

### Version 3.0.0
* Initial stable release

## License

	Copyright (C) 2013 KWARC Group <kwarc.info>
	
	JOBAD is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	
	JOBAD is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.
	
	You should have received a copy of the GNU General Public License
	along with JOBAD.  If not, see <http://www.gnu.org/licenses/>.

This project includes Underscore 1.5.1, which is licensed under [MIT License](https://github.com/documentcloud/underscore/blob/master/LICENSE). 

## See also

* [LICENSE](../../LICENSE)