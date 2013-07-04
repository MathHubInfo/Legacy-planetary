# About

JOBAD (JavaScript API for OMDoc-based Active Documents) is a javascript framework which makes it easy to create interactive web pages. 

JOBAD should work in all modern browsers. JOBAD has been tested successfully in: 

* Google Chrome 26
* Firefox 20
* Internet Explorer 10

It is known not to be compatible with: 

* Internet Explorer 9 and below. 

The official JOBAD repository is located at [https://github.com/KWARC/jobad](https://github.com/KWARC/jobad). 

## Changelog
### Version 3.1.6 (Stable)
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

This project includes Underscore 1.4.4, which is licensed under [MIT License](https://github.com/documentcloud/underscore/blob/master/LICENSE). 

## See also

* [LICENSE](../../LICENSE)