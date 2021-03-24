//requiring path and fs modules
import * as path from 'path';
import * as fs from 'fs';
//joining path of directory
console.log('hola');
const directoryPath = path.join(__dirname);
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }
  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    fs.renameSync(
      directoryPath + '/' + `${file}`,
      directoryPath + '/' + `${file.replace('.ts.entity.ts', '')}.entity.ts`,
    );
    console.log(file);
  });
});
