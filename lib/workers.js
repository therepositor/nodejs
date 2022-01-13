// worker related files

// dependencies

const path = require('path');
const url = require('url');
const https = require('https');
const http = require('http');
const _data = require('./data');
const helpers = require('./helpers');
const fs = require('fs');
const _logs = require('./logs');
const util = require('util');
const debug = util.debuglog('workers');

// instantiate the workers object
const workers = {};

// lookup all checks, get their data, send to a validator
workers.gatherAllChecks = () => {
    // get all the checks
    _data.list('checks', (err, checks) => {
        if(!err && checks && checks.length > 0) {
            checks.forEach(check => {
                // read in the check data
                _data.read('checks', check, (err, originalCheckData) => {
                    if(!err && originalCheckData) {
                        // pass it to the check validator, and let that function continue or 
                        workers.validateCheckData(originalCheckData);
                    } else {
                        debug('Error: Error reading one of the check\'s data')
                    }
                })
            })
        } else {
            debug('Error: Could not find any error to process')
        }
    })
}
// sanity-check the check-data
workers.validateCheckData = (originalCheckData) => {
    originalCheckData = typeof(originalCheckData) === 'object' && originalCheckData !== null ? originalCheckData : {};
    originalCheckData.id = typeof(originalCheckData.id) === 'string' && originalCheckData.id.trim().length === 20 ? originalCheckData.id : false;
    originalCheckData.userPhone = typeof(originalCheckData.userPhone) === 'string' && originalCheckData.userPhone.trim().length === 10 ? originalCheckData.userPhone : false;
    originalCheckData.protocol = typeof(originalCheckData.protocol) === 'string' && ['hhtp', 'https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;
    originalCheckData.url = typeof(originalCheckData.url) === 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url : false;
    originalCheckData.method = typeof(originalCheckData.method) === 'string' && ['post', 'get', 'put', 'delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;
    originalCheckData.successCodes = typeof(originalCheckData.successCodes) === 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false;
    originalCheckData.timeOutSeconds = typeof(originalCheckData.timeOutSeconds) === 'number' && originalCheckData.timeOutSeconds % 1 === 0 && originalCheckData.timeOutSeconds >= 1 && originalCheckData.timeOutSeconds <= 5 ? originalCheckData.timeOutSeconds : false;

    // set the keys that may not be set (if the workers have never seen this check before)
    originalCheckData.state = typeof(originalCheckData.state) === 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';
    originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) === 'number' && originalCheckData.lastChecked % 1 === 0 && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;

    // if all the checks pass, pass the data along in the next process
    if(originalCheckData.id &&
        originalCheckData.protocol &&
        originalCheckData.url &&
        originalCheckData.method &&
        originalCheckData.successCodes &&
        originalCheckData.timeOutSeconds && 
        originalCheckData.userPhone) {
            workers.performCheck(originalCheckData)
        } else {
            debug('Error: one of the checks is not properly formatted')
        }
}
// perform the check, and send the originalCheckData and the outcome of the process to the next step in the process
workers.performCheck = (originalCheckData) => {
    // prepare the original check outcome
    const checkOutcome = {
        'error': false,
        'responseCode': false
    }
    // mark that the outcome has not been sent yet
    const outcomeSent = false;

    // parse the hostname and the path out of the original check data
    const parsedUrl = url.parse(originalCheckData.protocol+'://'+originalCheckData.url, true);
    const hostName = parsedUrl.hostname;
    const path = parsedUrl.path; // using path and not pathname because we want the query string

    // construct the request
    const requestDetails = {
        'protocol' : originalCheckData.protocol+':',
        'hostname': hostName,
        'method': originalCheckData.method.toUpperCase(),
        'path': path,
        'timeout' : originalCheckData.timeOutSeconds * 1000
    }

    // instantiate the request object (using the http or https module)
    const _moduleToUse = originalCheckData.protocol === 'http' ? http : https;

    const req = _moduleToUse.request(requestDetails, (res) => {
        // grab the status of the res code 
        const status = res.statusCode;

        // update the check outcome and pass the data along
        checkOutcome.responseCode = status;
        if(!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    })
    // bind to the error event so it doesn't get thrown
    req.on('error', (e) => {
        // update the check outcome and pass the data along
        checkOutcome.error = {
            'error' : true,
            'value' : e
        }
        if(!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    })
    // bind to the timeout
    req.on('timeout', (e) => {
        // update the check outcome and pass the data along
        checkOutcome.error = {
            'error' : true,
            'value' : 'timeout'
        }
        if(!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent = true;
        }
    })

    // end the request
    req.end();
}
// process the check outcome, update the check data as needed, trigger an alert if needed
// special logic for accomodating a test that has never been tested before (don't alert on that one)
workers.processCheckOutcome = (originalCheckData, checkOutcome) => {
    // decide if the check is considered up or down
    const state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode) ? 'up' : 'down';
    // decide if an alert is warranted
    const alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;

    // log the outcome
    const timeOfCheck = Date.now();
    workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);
    // delete the check data
    const newCheckedData = originalCheckData;
    originalCheckData.state = state;
    originalCheckData.lastChecked = timeOfCheck;

        
    // save the updates
    _data.update('checks',newCheckedData.id,newCheckedData, (err) => {
        if(!err) {
            // send the new check data to the next phase if needed
            if(alertWarranted) {
                workers.alertUserToStatusChange(newCheckedData);
            } else {
                debug('Check outcome has not changed, no alert needed')
            }
        } else {
            debug('Error: Error trying to save data to one of the checks')
        }
    })
}
workers.log = (originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) => {
    const logData = {
        'check': originalCheckData,
        'outcome': checkOutcome,
        'state': state,
        'alert': alertWarranted,
        'time': timeOfCheck
    }
    // convert data to a string
    const logString = JSON.stringify(logData);

    // determine the name of the log file
    const logFileName = originalCheckData.id;

    // append the log string to the file
    _logs.append(logFileName,logString, (err) =>{
        if(!err){
            debug('Logging to file succeeded');
        } else {
            debug('Logging to file fail')
        }
    })

}
// alert the user as to a change in their status
workers.alertUserToStatusChange = (newCheckedData) => {
    const msg = 'Alert: Your check for '+newCheckedData.method.toUpperCase()+' '+newCheckedData.protocol+'://'+newCheckedData.url+' is currently '+newCheckedData.status;
    helpers.sendTwilioSms(newCheckedData.userPhone,msg, (err) => {
        if(!err){
            debug('Success: User was alerted to a status change in their check, via sms: ', msg)
        } else {
            debug('Error: Could not send sms alert to user who had a state change in their check')
        }
    })
}
// time to execute the worker-process once per minute
workers.loop = () => {
    setInterval(() => {
        workers.gatherAllChecks();
    }, 1000 * 60)
}
// rotate (compress) the log files
workers.rotateLogs = () => {
    // list all the (non compression) log files
    _logs.list(false, (err, logs) => {
        if(!err && logs && logs.length > 0) {
            logs.forEach(logName => {
                //compress the data to a different file
                const logId = logName.replace('.log', '');
                const newFileId = logId+'-'+Date.now();
                _log.compress(logId, newFileId, (err) => {
                    if(!err){
                        // trumcate the logs
                        _logs.truncate(logId, (err) => {
                            if(!err) {
                                debug('Success truncating log file')
                            } else {
                                debug('Error truncating log file')
                            }
                        })
                    } else {
                        debug('Error compressingone of the log files', err)
                    }
                })
            }) 
        } else {
            debug('Error: could not find any logs to rotate')
        }
    })
}
// timer to execute the worker-process once per day
workers.logRotationLoop = () => {
    setInterval(() => {
        workers.rotateLogs();
    }, 1000 * 60 * 60 * 24)
}
// init workers
workers.init = () => {
    // send to console, in yellow
    console.log('\x1b[34m%s\x1b[0m', 'Backgrounnd workers are running')
    // execute all the checks immediately
    workers.gatherAllChecks();

    // call the loops so the checks will execute later on
     workers.loop();
}
// compress all the logs immediately
workers.rotateLogs = () => {
    // call the compression loop so logs will be compressed later on
    workers.logRotationLoop();
}




// export the module
module.exports = workers