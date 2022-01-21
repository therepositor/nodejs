// primary file for the api

const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');


// declare the app
const app = {};

foo = 'bar'
// init the function
app.init = () => {
    // start the server
    server.init();

    // start the worker
    workers.init();
    
    // start the cli, but make sure it starts last
    setTimeout(() => {
        cli.init();
    }, 50);
}
// execute
app.init();


// export the app
module.exports = app