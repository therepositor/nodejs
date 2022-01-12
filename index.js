// primary file for the api

const server = require('./lib/server');
const workers = require('./lib/workers');


// declare the app
const app = {};

// init the function
app.init = () => {
    // start the server
    server.init();

    // start the worker
    workers.init();
    
}
// execute
app.init();


// export the app
module.exports = app