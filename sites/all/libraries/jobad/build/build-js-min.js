#!/usr/bin/env node

var gear = require('gear');
var gear_lib = require('gear-lib');
var build = new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})})
    .read([__dirname + "/release/JOBAD.js"])
    .concat()
    .jsminify({
        config: {
          mangle: true
        }
      })
    .write([__dirname + "/release/JOBAD.min.js.tmp"]);

build.run(function (error, results) {
    if (error) {
        console.log(error); 
    	process.exit(1); 
    } else {
    	process.exit(0); 
    }
});