// primary file for the api

const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');


// declare the app
const app = {};

// init the function
app.init = (callback) => {
    // start the server
    server.init();

    // start the worker
    workers.init();
    
    // start the cli, but make sure it starts last
    setTimeout(() => {
        cli.init();
        callback();
    }, 50);
}
// execute
app.init(function(){});


// export the app
module.exports = app