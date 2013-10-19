#!/usr/bin/env node

var gear = require('gear');
var gear_lib = require('gear-lib');
var path = require("path"); 
process.stdout.write("Building JS libraries ...");

var files  = require("fs").readFileSync(__dirname + "/config/js-libs.txt").toString().split('\n').map(function(e){
    return path.resolve(__dirname+"/../js/deps/"+e); 
});
files.pop(); 

var build = new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})})
    .read(files)
    .concat()
    .jsminify({
        config: {
          mangle: true
        }
      })
    .write([__dirname + "/release/libs/js/libs.js"]);

build.run(function (error, results) {
    if (error) {
        console.log("FAIL");
    	process.exit(1); 
    } else {
        console.log("OK");
    	process.exit(0); 
    }
});