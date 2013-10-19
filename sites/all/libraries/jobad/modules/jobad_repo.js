/*
	jobad_repo.js
	Official JOBAD Repository
	
	Copyright (C) 2013 KWARC Group <kwarc.info>
	
	This file is part of JOBAD.
	
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
*/

JOBAD.repo.config({
	"provides": [ //which modules are available
			/*
				Core Modules
				Modules from the JOBAD Core
			*/
			"template",
			"jobad.debug",
			"jobad.config",
			"jobad.folding",
			"mathjax.mathjax",
			"test.click", 
			"test.hover", 
			"test.menu1", 
			"test.menu2", 
			"test.menu3",
			"test.sidebar",
			"test.config",
			"test.tb1", 
			"test.tb2", 
			"jobad.showfocus"
	],
	"at": {
			/*
				Core Modules
				loaded from local copy
			*/
			"template": "core/template/template.js", //make a manual override of location of files. 
			"jobad.debug": "core/jobad/jobad.debug.js",
			"jobad.config": "core/jobad/jobad.config.js",
			"jobad.folding": "core/jobad/jobad.folding.js",
			"jobad.showfocus": "core/jobad/jobad.showfocus.js",
			"mathjax.mathjax": "core/mathjax.mathjax.js",
			"test.click": "core/test/test.click.js",
			"test.hover": "core/test/test.hover.js",
			"test.menu1": "core/test/test.menu1.js",
			"test.menu2": "core/test/test.menu2.js",
			"test.menu3": "core/test/test.menu3.js",
			"test.sidebar": "core/test/test.sidebar.js",
			"test.config": "core/test/test.config.js",
			"test.tb1": "core/test/TB1.js",
			"test.tb2": "core/test/TB2.js"
	},
	"versions": ["3.2.0"], //compatible JOBAD versions
	"name": "Core JOBAD Modules Repository", //name
	"description": "JOBAD Modules repository from the Core" //description
});
