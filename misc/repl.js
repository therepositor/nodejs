/*
* Example REPL server
* take in fizz and log out buzz
*/

// Dependencies
const repl = require('repl');

// start the REPL
repl.start({
    'prompt': '>',
    'eval': (str) => {
        // Evaluation function for incoming inputs
        console.log('At the evaluation stage', str);
        // if the user say 'fizz' log out 'buzz' back to them
        if(str.indexOf('fizz') > -1) {
            console.log('buzz');
        }
    }
})