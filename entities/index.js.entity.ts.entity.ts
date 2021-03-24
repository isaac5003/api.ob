"use strict";
exports.__esModule = true;
//requiring path and fs modules
var path = require("path");
var fs = require("fs");
//joining path of directory
console.log('hola');
var directoryPath = path.join(__dirname);
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        fs.renameSync(directoryPath + '/' + ("" + file), directoryPath + '/' + (file.replace('.ts.entity.ts', '') + ".entity.ts"));
        console.log(file);
    });
});
