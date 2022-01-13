// library for storing and rotating logs

// dependencies

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// container for the module
const lib = {};

// base directory for the logs folder
lib.baseDir = path.join(__dirname, '/../.logs');

// append a string to a file, create the file if it doesn't exist
lib.append = (file, str, callback) =>{
    // open the file for appending 
    fs.open(lib.baseDir+file+'.log', 'a', (err,fileDescriptor) => {
        if(!err && fileDescriptor){
            // append to the file and close it
            fs.appendFile(fileDescriptor, str+'\n', (err) => {
                if(!err){
                    fs.close(fileDescriptor, (err) => {
                        if(!err){
                            callback(false)
                        } else {
                            callback('Error closing file that was been appended')
                        }
                    })
                } else {
                    callback('Error appending to a file')
                }
            })
        } else {
            callback('Error: could not open file for appending')
        }
    })
}

// list all the logs, and optionally include the compressed files
lib.list = (includeCompressedLogs, callback) => {
    fs.readdir(lib.baseDir, (err, data) => {
        if(!err && data && data.length > 0) {
            const trimmedFileNames = [];
            data.forEach(fileName => {
                // add the log files
                if(fileName.indexOf('.log') > -1) {
                    trimmedFileNames.push(fileName.replace('.log', ''))
                }
                // add on the .gz file
                if(fileName.indexOf('.gz.b64') > -1) {
                    trimmedFileNames.push(fileName.replace('.gz.b64', ''))
                }
            })
            callback(false, trimmedFileNames)
        } else {
            callback(err, data)
        }
    })
}
// compress the contents of one .log file into a .gz.b64 file within the same directory
lib.compress = (logId, newFileId, callback) => {
    const sourceFile = logId+'.log';
    const destFile = newFileId+'.gz.b64';

    // read the source file
    fs.readFile(lib.baseDir,sourceFile,'utf8',(err, inputString) => {
        if(!err && inputString){
            // compress the data using gzip
            zlib.gzip(inputString, (err, buffer) => {
                if(!err && buffer){
                    // send the data to the destination file
                    fs.open(lib.baseDir+destFile, 'wx', (err, fileDescriptor) => {
                       if(!err && fileDescriptor){
                        // write to the destination file
                        fs.writeFile(fileDescriptor, buffer.toString('base64'), (err) => {
                            if(!err){
                                // close the destination file
                                fs.close(fileDescriptor, (err) => {
                                    if(!err) {
                                        callback(false);
                                    } else {
                                        callback(err);
                                    }
                                })
                            } else {
                                callback(err);
                            }
                        })
                       } else {
                           callback(err)
                       }
                    })
                } else {
                    callback(err)
                }
            })

        } else {
            callback(err)
        }
    })
}
// decompress the content of a .gz.b64 file into a string variable
lib.decompress = (fileId, callback) => {
    const fileName = fileId+'.gz.b64'
    fs.readFile(lib.baseDir+fileName, 'utf8', (err, str) => {
        if(!err && str) {
            // decompress the data
            const inputBuffer = Buffer.from(str, 'base64');
            zlib.unzip(inputBuffer, (err, outputBuffer) => {
                if(!err, outputBuffer) {
                    // callback
                    const str = outputBuffer.toString();
                    callback(false, str)
                } else {
                    callback(err)
                }
            })
        } else {
            callback(err)
        }
    } )
}
// truncate a log file
lib.truncate = (logId, callback) => {
    fs.truncate(lib.baseDir+logId+'.log', 0 , (err) => {
        if(!err) {
            callback(false);
        } else {
            callback(err);
        }
    })
}



// export the module
module.exports = lib;