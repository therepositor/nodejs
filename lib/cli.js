/*
 * CLI-related tasks
 *
 */

 // Dependencies
 var readline = require('readline');
 var util = require('util');
 var debug = util.debuglog('cli');
 var events = require('events');
 class _events extends events{};
 var e = new _events();
 const os = require('os');
 const v8 = require('v8');
 const _data = require('./data');
 const _libs = require('./logs');
 const helpers = require('./helpers');
 const childProcess = require('child_process');
 
 // Instantiate the cli module object
 var cli = {};

 // input handlers
e.on('man', (str) => {
    cli.responders.help();
})

e.on('help',(str) => {
    cli.responders.help();
})

e.on('exit',() => {
    cli.responders.exit();
})

e.on('stats',(str) => {
    cli.responders.stats();
})

e.on('list users',(str) => {
    cli.responders.listUsers();
})

e.on('more user info',(str) => {
    cli.responders.moreUserInfo(str);
})

e.on('list checks',(str) => {
    cli.responders.listChecks(str);
})

e.on('more check info',(str) => {
    cli.responders.moreCheckInfo(str);
})

e.on('list logs',(str) => {
    cli.responders.listLogs();
})

e.on('more log info',(str) => {
    cli.responders.moreLogInfo(str);
})
 // responders object
 cli.responders = {};

 // help / man
 cli.responders.help = () => {
     const commands = {
        'exit': 'Kill the CLI (and the rest of the application)',
        'man': 'Show this help page',
        'help': 'Alias of the "man" command',
        'stats': 'Get statistics on the underline operating system and resource utilization',
        'list users': 'Show a list of all the registers (undeleted) users in the system',
        'more user info --{userId}': 'Show details of a specific user',
        'list checks --up --down': 'Show a list of all the active checks in the system, including their state, the --up and --down flag are optional, ',
        'more check info --{checkId}': 'Show details of a specified check',
        'list logs': 'Show a list of all the log files availbale to be read, compressed and uncompressed',
        'more log info --{fileName}': 'Show details of a specified log file'
     }

     // show a header for the help page that is as wide as the screen
     cli.horizontalLine();
     cli.centered('CLI MANUAL');
     cli.horizontalLine();
     cli.verticalSpace(2);

     // show each command, followed by it's explanantion in white and yellow respectively
     for(let key in commands){
         if(commands.hasOwnProperty(key)){
            const value = commands[key];
            let line = '\x1b[33m'+key+'\x1b[0m';
            const padding = 60 - line.length;
            for(let i=0; i<padding; i++){
                line += ' ';
            }
          
         line += value;
         console.log(line);
         cli.verticalSpace();
        }
    }
    cli.verticalSpace(1);
    // End with another horizontal line
    cli.verticalSpace(1);
}
// create a vertical space
cli.verticalSpace = () => {
    lines = typeof(lines) === 'number' && lines > 0 ? lines : 1;
    for(i=0; i<lines; i++){
        console.log('')
    }
}
// create a horzontal line
cli.horizontalLine = () => {
    // get the available screen size
    const width = process.stdout.columns;
    let line = '';
    for(let i=0; i<width; i++){
        line += '-';
    }
    console.log(line)
}
// create a centered text on the screen
cli.centered = (str) => {
    str = typeof(str) === 'string' && str.trim().length > 0 ? str.trim() : ''
;    
    // get the available scren size
    const width = process.stdout.columns;

    // calculate the left padding there should be
    const leftPadding = Math.floor((width - str.length) / 2);

    // put in left padded spaces before the string itself
    let line = '';
    for(let i=0; i<leftPadding; i++){
        line += ' ';
    }
    line += str;
    console.log(line);

}
 // exit
 cli.responders.exit = () => {
    process.exit(0);
}

// stats
cli.responders.stats = () => {
   // compile an object of stats
   const stats = {
       'Load Average': os.loadavg().join(' '),
       'CPU Count': os.cpus().length,
       'Free Memory': os.freemem(),
       'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
       'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
       'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
       'Available Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
       'Uptime': os.uptime() + ' seconds'
   }
   // create a header for the stats page
   cli.horizontalLine();
   cli.centered('SYSYEM STATISTICS');
   cli.horizontalLine();
   cli.verticalSpace(2);

   // log out each stat
   for(let key in stats){
       if(stats.hasOwnProperty(key)){
           const value = stats[key];
           let line = '\x1b[33m'+key+'\x1b[0m';
           const padding = 60 - line.length;
           for(let i=0; i<padding; i++){
               line += ' ';
           }
           line += value;
           console.log(line);
           cli.verticalSpace()
       }
   }
   cli.verticalSpace(1);
   cli.verticalSpace()
}

// list users
cli.responders.listUsers = () => {
    _data.list('users', (err,userIds) => {
        if(!err && userIds && userIds.length > 0){
            cli.verticalSpace();
            userIds.forEach(userId => {
                _data.read('users',userId,(err,userData)=> {
                    if(!err && userData){
                        const line = 'Name: '+userData.firstName+' '+userData.lastName+' '+'Phone: '+userData.phone
                        const numberOfChecks = typeof(userData.checks) === 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
                        line += numberOfChecks;
                        console.log(line);
                        cli.verticalSpace();
                    }
                })
            });
        }
    })
}

// more user info
cli.responders.moreUserInfo = (str) => {
    // Get the ID from the string
    const arr = str.split('--');
    const userId = typeof(arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if(userId){
        // look the user up
        _data.read('users',userId,(err,userData) => {
            if(!err && userData){
                // remove the hash password
                delete userData.hashedPassword;

                // print the JSON with text highlighting
                cli.verticalSpace();
                console.dir(userData,{'colors': true});
                cli.verticalSpace();
            }
        })
    } 
}
// list checks
cli.responders.listChecks = (str) => {
    _data.list('checks',(err,checkIds) => {
        if(!err && checkIds && checkIds.length > 0){
            cli.verticalSpace();
            checkIds.forEach(checkId => {
                _data.read('checks',checkId,(err, checkData) => {
                    if(!err && checkData){
                        const includeCheck = false;
                        const lowerString = str.toLowerCase();

                        // Get the state, default to down
                        const state = typeof(checkData.state) === 'string' ? checkData.state : 'down';
                        // Get the state, default to unknown
                        const stateOrUnknown = typeof(checkData.state) === 'string' ? checkData.state : 'unknown';
                        // if the user has specified the state, or hasn't specified the state, include the client check accordingly
                        if(lowerString.indexOf('--'+state) > -1 || lowerString.indexOf('--down') === -1 && lowerString.indexOf('--up') === -1){
                            const line = 'ID: '+checkData.id+' '+checkData.method.toUpperCase()+' '+checkData.protocol+'://'+checkData.url+' state: '+stateOrUnknown ;
                            console.log(line);
                            cli.verticalSpace();
                        }
                    }
                })
            })
        }
    })
}
// more check info
cli.responders.moreCheckInfo = (str) => {
    // Get the ID from the string
    const arr = str.split('--');
    const checkId = typeof(arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if(checkId){
        // look the check
        _data.read('checks',checkId,(err,checkData) => {
            if(!err && checkData){
                

                // print the JSON with text highlighting
                cli.verticalSpace();
                console.dir(checkData,{'colors': true});
                cli.verticalSpace();
            }
        })
    } 
}
// list logs 
cli.responders.listLogs = () => {
    // _logs.list(true,(err,logFileNames) => {
    //     if(!err && logFileNames && logFileNames.length > 0){
           
    //     }
    // })
    const ls = childProcess.spawn('ls',['./.logs/']);
    ls.stdout.on('data',(dataObj) => {
        // Explode into seperate lines 
        const dataStr = dataObj.toString();
        const logFileNames = dataStr.split('\n');
        cli.verticalSpace();
        logFileNames.forEach(logFileName => {
            
            if(typeof(logFileName) === 'string' && logFileName.length > 0 && logFileName.indexOf('-') > -1){
            console.log(logFileName.trim().split.split('.')[0])
            cli.verticalSpace();
             }
        })
    })
}

// more log info
cli.responders.moreLogInfo = (str) => {
    // Get the logFileName from the string
    const arr = str.split('--');
    const logFileName = typeof(arr[1]) === 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
    if(logFileName){
        cli.verticalSpace();
        // decompress the log
        _logs.decompress(logFileName,(err,strData)=> {
            if(!err && strData){
                // split into lines
                const arr = strData.split('\n');
                arr.forEach(jsonString => {
                    const logObject = helpers.parseJsonToObject(jsonString);
                    if(logObject && JSON.stringify(logObject) !== '{}'){
                        console.dir(logObject, {'colors': true});
                        cli.verticalSpace();
                    }
                })

            }
        })

    } 
}
 // Input processor
 cli.processInput = function(str){
   str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
   // Only process the input if the user actually wrote something, otherwise ignore it
   if(str){
     // Codify the unique strings that identify the different unique questions allowed be the asked
     var uniqueInputs = [
       'man',
       'help',
       'exit',
       'stats',
       'list users',
       'more user info',
       'list checks',
       'more check info',
       'list logs',
       'more log info'
     ];
 
     // Go through the possible inputs, emit event when a match is found
     var matchFound = false;
     var counter = 0;
     uniqueInputs.some(function(input){
       if(str.toLowerCase().indexOf(input) > -1){
         matchFound = true;
         // Emit event matching the unique input, and include the full string given
         e.emit(input,str);
         return true;
       }
     });
 
     // If no match is found, tell the user to try again
     if(!matchFound){
       console.log("Sorry, try again");
     }
 
   }
 };
 
 // Init script
 cli.init = function(){
 
   // Send to console, in dark blue
   console.log('\x1b[34m%s\x1b[0m','The CLI is running');
 
   // Start the interface
   var _interface = readline.createInterface({
     input: process.stdin,
     output: process.stdout,
     prompt: ''
   });
 
   // Create an initial prompt
   _interface.prompt();
 
   // Handle each line of input separately
   _interface.on('line', function(str){
     // Send to the input processor
     cli.processInput(str);
 
     // Re-initialize the prompt afterwards
     _interface.prompt();
   });
 
   // If the user stops the CLI, kill the associated process
   _interface.on('close', function(){
     process.exit(0);
   });
 
 };
 
 
  // Export the module
  module.exports = cli;
 