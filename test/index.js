/*
* Test runner
*
*/

// Application logic for the test runner
_app = {};


// Container for the tests.
_app.tests = {};

// Add on the unit tests
_app.tests.unit = require('./unit')
_app.tests.api = require('./api')


// count all test
_app.countTests = () => {
    let counter = 0;
    for(let key in _app.tests){
        if(_app.tests.hasOwnProperty(key)){
            const subTests = _app.tests[key];
            for(let testName in subTests){
                if(subTests.hasOwnProperty(testName)){
                    counter++;
                }
            }
        }
    }
    return counter;
}
// Run all the tests, collecting the errors and successes from the test
_app.runTest = () => {
    const errors = [];
    let successes = 0;
    const limit = _app.countTests();
    let counter = 0;
    for(let key in _app.tests){
        if(_app.tests.hasOwnProperty(key)){
            const subTests = _app.tests[key]
            for(let testName in subTests){
                if(subTests.hasOwnProperty(testName)){
                    (function () {
                        const tempTestName = testName;
                        const testValue = subTests[testName];
                        try {
                            testValue(function(){
                                // if it calls back without throwing, then it succeeded, log it in green 
                                console.log('\x1b[32m%s\x1b[0m', tempTestName);
                                counter++;
                                successes++;
                                if(counter === limit){
                                    _app.produceTestReport(limit,successes,errors);
                                }
                            })
                        } catch (e) {
                            // if it throws, then it failed, capture the error thrown and log it in red.
                            errors.push({
                                'name': testName,
                                'error': e
                            })
                            console.log('\x1b[31m%s\x1b[0m', tempTestName);
                            counter++;
                            if(counter === limit){
                                _app.produceTestReport(limit,successes,errors);
                            }
                        }
                    })();
                }
            }
        }
    }
}
// PRoduce a test outcome report 
_app.produceTestReport = (limit,successes,errors) => {
    console.log('');
    console.log('---------------------BEGIN TEST REPORT---------------------');
    console.log('');
    console.log('Total tests: ',limit);
    console.log('Pass: ', successes);
    console.log('Fail: ', errors.length);
    console.log('');

        if(errors.length > 0){
            console.log('---------------------BEGIN ERROR DETAILS---------------------');
            console.log(''); 

            errors.forEach(testError => {
                console.log('\x1b[31m%s\x1b[0m', testError.name);
                console.log(testError.Error)
                console.log('');
            });

            console.log('');
            console.log('---------------------End ERROR DETAILS---------------------');
        }



    console.log('');
    console.log('---------------------End TEST REPORT---------------------');
    process.exit(0);
}


// Run the test
_app.runTest();