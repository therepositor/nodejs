// primary file for the api

const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');
const cluster = require('cluster');
const os = require('os');


// declare the app
const app = {};

// init the function
app.init = (callback) => {
    if(cluster.isMaster){
        // if we are on the master thread, start the background workers and the cli
        

        // start the worker
        workers.init();
    
        // start the cli, but make sure it starts last
        setTimeout(() => {
        cli.init();
        callback();
        }, 50);

        // fork the process
        for(let i=0; i<os.cpus().length; i++){
            cluster.fork()
        }
    } else {
        // if we are ot on the master thread, start the HTTP server
        server.init();
        
    }
    
}
// self invoking only if required directly
if(require.main === module){
    app.init(function(){});
}


// export the app
module.exports = app