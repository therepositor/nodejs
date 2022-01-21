/*
* Unit Tests
*
*/

// Dependencies
const helpers = require('./../lib/helpers');
const assert = require('assert');
const logs = require('./../lib/logs');
const exampleDebuggingProblem = require('./../lib/exampleDebuggingProblem')

// Holder for test
const unit = {};

// Assert that the getANumber function is returning a number 
unit['helpers.getANumber should return a number'] = (done) => {
    const val = helpers.getANumber();
    assert.equal(typeof(val),'number');
    done();
}
// Assert that the getANumber function is returning 1 
unit['helpers.getANumber should return 1'] = (done) => {
    const val = helpers.getANumber();
    assert.equal(val,1);
    done();
}
// Assert that the getANumber function is returning 2 
unit['helpers.getANumber should return 2'] = (done) => {
    const val = helpers.getANumber();
    assert.equal(val,2);
    done();
}

// logs.list should call back an array and false error
unit['logs.list should call back an array of log names and a false error'] = (done) => {
    logs.list(true,(err,logFileNames) => {
        assert.equal(err, false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);
        done();
    });  
}
// logs.truncate should not throw if the logId does not exist
unit['logs.truncate should not throw if the logId does not exist, it should call back an error instead'] = (done) => {
    assert.doesNotThrow(() => {
        logs.truncate('I do not exist', (err) => {
            assert.ok(err);
            done();
        })
    }, TypeError)
}
// exampleDebuggingProblem should not throw, but it does
unit['exampleDebuggingProblem should not throw when called'] = (done) => {
    assert.doesNotThrow(() => {
        exampleDebuggingProblem.init();
        done(); 
    }, TypeError)
}
// export the module
module.exports = unit;
