/*
	jobad.debug.js - An example module for JOBAD. 
	A module to load all modules useful for debugging. 
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

(function($){
	JOBAD.modules.register({
		info:{
			'identifier':	'jobad.debug',
			'title':	'JOBAD Debug Menu',
			'author':	'Tom Wiesing',
			'description':	'A module to load all modules useful for debugging. ',
			'dependencies': ["jobad.config", "jobad.folding"]
		}
	});
})(JOBAD.refs.$);

