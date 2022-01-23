/*
* Example Async Hooks
* 
*/

// Dependencies
const fs = require('fs');
const async_hooks = require('async_hooks');

// Target execution context
let targetExecutionContext = false;

// write an arbitrary async function
const whatTimeIsIt = (callback) => {
    setInterval(() => {
        fs.writeSync(1, 'when the set interval runs,the execution context is ', +async_hooks.executionAsyncId()+'\n')
        callback(Date.now());
    }, 1000)
}
// call the function
whatTimeIsIt((time) => {
    fs.writeSync(1, 'The time is '+time+'\n');
})

// Hooks
const hooks = {
    init(asyncId,type,triggerAsyncId,resource){
        fs.writeSync(1, 'Hook Init '+asyncId+'\n')
    },
    before(asyncId){
        fs.writeSync(1, 'Hook Before '+asyncId+'\n')
    },
    after(asyncId){
        fs.writeSync(1, 'Hook After '+asyncId+'\n')
    },
    destroy(asyncId){
        fs.writeSync(1, 'Hook Destroy '+asyncId+'\n')
    },
    promiseResolve(asyncId){
        fs.writeSync(1, 'Hook promiseResolve '+asyncId+'\n')
    }
}
// create a new async_hooks instance
const asyncHook = async_hooks.createHook(hooks);
asyncHook.enable();