// create and export environment variables 


//container for all environments
const environments = {};

// staging environment
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': 'thisIsASecret',
    'maxChecks' : 5,
    'twilio' : {
        'accountSid': 'ACb32d411ad7fe886aac54c665d25e5c5d',
        'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
        'fromPhone' : '+15005550006'
    },
    'templateGlobals' : {
        'appName': 'UptimeChecker',
        'companyName': 'Grey, Inc',
        'yearCreated': '2018',
        'baseUrl': 'http://localhost:3000/'
    }
}

// production environment
environments.production = {
    'httpPort' : 5000,
    'httpsPort' : 5001,
    'envName' : 'production',
    'hashingSecret': 'thisIsASecret',
    'maxChecks' : 5,
    'twilio' : {
        'accountSid': '',
        'authToken' : '',
        'fromPhone' : ''
    },
    'templateGlobals' : {
        'appName': 'UptimeChecker',
        'companyName': 'Grey, Inc',
        'yearCreated': '2018',
        'baseUrl': 'http://localhost:5000/'
    }
}
// determine which environment was passed as a command-line arguement

const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//check that the current environment is one of the environments above, if not, default to staging 
const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// export environment
module.exports = environmentToExport


