// primary file for the api

const server = require('./lib/server');
const workers = require('./lib/workers');
const cli = require('./lib/cli');
const exampleDebuggingProblem = require('./lib/exampleDebuggingProblem');


// declare the app
const app = {};

// init the function
app.init = () => {
    // start the server
    debugger;
    server.init();
    debugger;

    debugger;
    // start the worker
    workers.init();
    debugger;

    debugger;
    // start the cli, but make sure it starts last
    setTimeout(() => {
        cli.init();
    }, 50);
    debugger;

    debugger;
    // set foo at 1
    let foo = 1;
    debugger;
    console.log('define foo as 1')

    foo++
    debugger;
    console.log('add one to foo')

    foo = foo * foo;
    debugger;
    console.log('square foo')

    foo = foo.toString();
    debugger;
    console.log('conver foo to a string')

    debugger;
    // call the init script that will throw
    exampleDebuggingProblem.init();
    console.log('Just call the library')
    debugger;
}
// execute
app.init();


// export the app
module.exports = app