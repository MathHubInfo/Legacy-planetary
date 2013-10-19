#!/usr/bin/env node

var gear = require('gear');
var gear_lib = require('gear-lib');
var path = require("path"); 

var files  = require("fs").readFileSync(__dirname + "/config/css-libs.txt").toString().split('\n').map(function(e){
    return path.resolve(__dirname+"/../css/libs/"+e); 
});
files.pop();

var build = new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})})
    .read(files)
    .concat()
    .less()
    .write([__dirname + "/release/libs/css/libs.css"]);

build.run(function (error, results) {
    if (error) {
        console.log(error); 
    	process.exit(1); 
    } else {
    	process.exit(0); 
    }
});