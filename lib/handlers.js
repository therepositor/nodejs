
const  config  = require('./config');
const _data = require('./data');
const helpers = require('./helpers');
const _url = require('url');
const dns = require('dns');
const _performance = require('perf_hooks').performance;
const util  = require('util');
const debug = util.debuglog('performance');

// define the handlers
const handlers = {};

/*
* HTML handlers
*
*/

// Index Handler
handlers.index = function(data,callback){
    // Reject any request that isn't a GET
    if(data.method == 'get'){
        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Uptime monitoring - Made Simple',
            'head.description': 'We offer free, simple uptime monitoring for HTTP/HTTPS sites of all kinds, when your site goes down, we\'ll send you a text to let you know',
            'body.class': 'index'
        }
      // Read in a template as a string
      helpers.getTemplate('index', templateData, function(err,str){
        if(!err && str){
            // Add the universal header and footer
            helpers.addUniversalTemplate(str, templateData, (err,str) => {
                if(!err && str){
                    // return that page as html
                    callback(200,str,'html');
                } else {
                    callback(500,undefined,'html')
                }
            })
        } else {
          callback(500,undefined,'html')
        }
      });
      // Return that template as HTML
    } else {
      callback(405,undefined,'html');
    }
}
// Account create 
handlers.accountCreate = (data,callback) => {
     // Reject any request that isn't a GET
     if(data.method == 'get'){
        // Prepare data for interpolation
        const templateData = {
            'head.title': 'Create an Account',
            'head.description': 'Sign Up is easy, and only takes a few seconds',
            'body.class': 'accountCreate'
        }
      // Read in a template as a string
      helpers.getTemplate('accountCreate', templateData, function(err,str){
        if(!err && str){
            // Add the universal header and footer
            helpers.addUniversalTemplate(str, templateData, (err,str) => {
                if(!err && str){
                    // return that page as html
                    callback(200,str,'html');
                } else {
                    callback(500,undefined,'html')
                }
            })
        } else {
          callback(500,undefined,'html')
        }
      });
      // Return that template as HTML
    } else {
      callback(405,undefined,'html');
    }
}
// Create new session 
handlers.sessionCreate = (data,callback) => {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
       // Prepare data for interpolation
       const templateData = {
           'head.title': 'Login to your Account',
           'head.description': 'Please enter your phone number and password to access your account',
           'body.class': 'sessionCreate'
       }
     // Read in a template as a string
     helpers.getTemplate('sessionCreate', templateData, function(err,str){
       if(!err && str){
           // Add the universal header and footer
           helpers.addUniversalTemplate(str, templateData, (err,str) => {
               if(!err && str){
                   // return that page as html
                   callback(200,str,'html');
               } else {
                   callback(500,undefined,'html')
               }
           })
       } else {
         callback(500,undefined,'html')
       }
     });
     // Return that template as HTML
   } else {
     callback(405,undefined,'html');
   }
}
// Edit your account
handlers.accountEdit = (data,callback) => {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
       // Prepare data for interpolation
       const templateData = {
           'head.title': 'Account Settings',
           'body.class': 'accountEdit'
       }
     // Read in a template as a string
     helpers.getTemplate('accountEdit', templateData, function(err,str){
       if(!err && str){
           // Add the universal header and footer
           helpers.addUniversalTemplate(str, templateData, (err,str) => {
               if(!err && str){
                   // return that page as html
                   callback(200,str,'html');
               } else {
                   callback(500,undefined,'html')
               }
           })
       } else {
         callback(500,undefined,'html')
       }
     });
     // Return that template as HTML
   } else {
     callback(405,undefined,'html');
   }
}
// Account has been deleted
handlers.accountDeleted = (data,callback) => {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
       // Prepare data for interpolation
       const templateData = {
           'head.title': 'Account Deleted',
           'head.description': 'Your account has been deleted',
           'body.class': 'accountDeleted'
       }
     // Read in a template as a string
     helpers.getTemplate('accountDeleted', templateData, function(err,str){
       if(!err && str){
           // Add the universal header and footer
           helpers.addUniversalTemplate(str, templateData, (err,str) => {
               if(!err && str){
                   // return that page as html
                   callback(200,str,'html');
               } else {
                   callback(500,undefined,'html')
               }
           })
       } else {
         callback(500,undefined,'html')
       }
     });
     // Return that template as HTML
   } else {
     callback(405,undefined,'html');
   }
}
// Create a new check
handlers.checksCreate = (data,callback) => {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
       // Prepare data for interpolation
       const templateData = {
           'head.title': 'Create a new check',
           'body.class': 'checksCreate'
       }
     // Read in a template as a string
     helpers.getTemplate('checksCreate', templateData, function(err,str){
       if(!err && str){
           // Add the universal header and footer
           helpers.addUniversalTemplate(str, templateData, (err,str) => {
               if(!err && str){
                   // return that page as html
                   callback(200,str,'html');
               } else {
                   callback(500,undefined,'html')
               }
           })
       } else {
         callback(500,undefined,'html')
       }
     });
     // Return that template as HTML
   } else {
     callback(405,undefined,'html');
   }
}
// Session has been deleted
handlers.sessionDeleted = (data,callback) => {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
       // Prepare data for interpolation
       const templateData = {
           'head.title': 'Logged Out',
           'head.description': 'You have been logged out from your account',
           'body.class': 'sessionDeleted'
       }
     // Read in a template as a string
     helpers.getTemplate('sessionDeleted', templateData, function(err,str){
       if(!err && str){
           // Add the universal header and footer
           helpers.addUniversalTemplate(str, templateData, (err,str) => {
               if(!err && str){
                   // return that page as html
                   callback(200,str,'html');
               } else {
                   callback(500,undefined,'html')
               }
           })
       } else {
         callback(500,undefined,'html')
       }
     });
     // Return that template as HTML
   } else {
     callback(405,undefined,'html');
   }
}
// favicon
handlers.favicon = (data, callback) => {
    // Reject any method that is not a Get
    if(data.method === 'get'){
        // Read the favicon's data
        helpers.getStaticAsset('favicon.ico', (err,data) => {
            if(!err && data){
                // callback the data
                callback(200, data, 'favicon')
            } else {
                callback(500)
            }
        })
    } else {
        callback(405)
    }
}
// Public asset
handlers.public = (data, callback) => {
    // reject any method that is not a Get
    if(data.method === 'get'){
        // Get the file name been requested
        const trimmedAssetName = data.trimmedPath.replace('/public/', '').trim();
        if(trimmedAssetName.length > 0){
            // Read in the asset data
            helpers.getStaticAsset(trimmedAssetName, (err,data) => {
                if(!err && data){
                    // determine the content type and (default to plain)
                    const contentType = 'plain';
                    if(trimmedAssetName.indexOf('.css') > -1){
                        contentType = 'css'
                    }
                    if(trimmedAssetName.indexOf('.png') > -1){
                        contentType = 'png'
                    }
                    if(trimmedAssetName.indexOf('.jpg') > -1){
                        contentType = 'jpg'
                    }
                    if(trimmedAssetName.indexOf('.ico') > -1){
                        contentType = 'favicon'
                    }
                    // callback the data
                    callback(200, data, contentType)
                } else {
                    callback(404)
                }
            })
        } else {
            callback(404)
        }

    } else {
        callback(405)
    }
}
// Dashboard view all checks
handlers.checksList = (data,callback) => {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
       // Prepare data for interpolation
       const templateData = {
           'head.title': 'Dashboard',
           'body.class': 'checksList'
       }
     // Read in a template as a string
     helpers.getTemplate('checksList', templateData, function(err,str){
       if(!err && str){
           // Add the universal header and footer
           helpers.addUniversalTemplate(str, templateData, (err,str) => {
               if(!err && str){
                   // return that page as html
                   callback(200,str,'html');
               } else {
                   callback(500,undefined,'html')
               }
           })
       } else {
         callback(500,undefined,'html')
       }
     });
     // Return that template as HTML
   } else {
     callback(405,undefined,'html');
   }
}
// Edit a check
handlers.checksEdit = (data,callback) => {
    // Reject any request that isn't a GET
    if(data.method == 'get'){
       // Prepare data for interpolation
       const templateData = {
           'head.title': 'Check Details',
           'body.class': 'checksEdit'
       }
     // Read in a template as a string
     helpers.getTemplate('checksEdit', templateData, function(err,str){
       if(!err && str){
           // Add the universal header and footer
           helpers.addUniversalTemplate(str, templateData, (err,str) => {
               if(!err && str){
                   // return that page as html
                   callback(200,str,'html');
               } else {
                   callback(500,undefined,'html')
               }
           })
       } else {
         callback(500,undefined,'html')
       }
     });
     // Return that template as HTML
   } else {
     callback(405,undefined,'html');
   }
}
/*
* JSON  API handlers
*
*/
// Example error
handlers.exampleError = (data,callback) => {
    const err = new Error('This is an example error');
    throw(err);
}
// sample handlers
handlers.ping = (data, callback) => {
    callback(200);
}

// not found handlers
handlers.notFound = (data, callback) => {
    // callback a http status code
    callback(404);
}
// users handlers
handlers.users = (data, callback) => {
    const acceptableMethods = ['post', 'put', 'get', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._users[data.method](data,callback)
    } else {
        callback(405)
    }
}
// container for the users submethods
handlers._users = {};

// Users - post
// required data: firstname, lastname, phone, password, tosAgreement
//optional data: none
handlers._users.post = (data, callback) => {
    const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const tosAgreement = typeof(data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement === true ? true : false;

    if(firstName && lastName && phone && password && tosAgreement)  {
        // make sure that the user doesn't already exist
        _data.read('users', phone, (err, data) => {
            if(err) {
                // hash the password
                const hashedPassword = helpers.hash(password);

                // create the userObject
                if(hashedPassword) {
                    const userObject = {
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'phone' : phone,
                        'hashedPassword' : hashedPassword,
                        'tosAgreement' : true
                    }
    
                    // store the user
                    _data.create('users', phone, userObject, (err) => {
                        if(!err) {
                            callback(200)
                        } else {
                            console.log(500, {'Error' : 'Could not create the new user'})
                        }
                    }  )
                } else {
                    console.log(500, {'Error': 'Could not hash user\'s password'})
                }
                
            } else {
                callback(400, {'Error': 'A user with that phone number already exist'})
            }
        })
    } else {
        callback(400, {'error': 'missing required fields'})
    }
}
// Users - get
// required data: phone
// optopnal data: none
// @Todo only let an authenticated user access their object, don't let them access other user's object
handlers._users.get = (data, callback) => {
    // check that the phone number provided is valid
    const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone.trim() : false;
    if(phone) {

        // get the token from the headers
        const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
        // verify that the given phone number is valid for the token
        handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
            if(tokenIsValid) {
                // lookup the user
                 _data.read('users', phone, (err, data) => {
                 if(!err && data) {
                // removed the hashed password from the user object before returning it to the requester
                delete _data.hashedPassword;
                callback(200, data)
                 } else {
                callback(404)
                 }
            })
            } else {
                callback(403, {'Error': 'Missing required token in header, or token is invalid'})
            }
        })  
    } else {
        callback(400, {'Error': 'Missing required field'})
    }
}
// Users - put
// required data: phone
// optional data: firstname, lastname, password (at least one must be specified)
//@todo only let the authenticated user update their own object, don't let them update anyone else object
handlers._users.put = (data, callback) => {
    // check for the required field
    const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
    // check for the optional fields
    const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    // Error if phone is invalid
    if(phone) {
        // Error if nothing is seen to update
        if(firstName || lastName || password){
            //get the token from the headers
            const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
            // verify that the given token is valid for the phone number
            handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
                if(tokenIsValid) {
                    // lookup the user
                    _data.read('users', phone, (err,userData) => {
                        if(!err && data){
                            // update the fields necessary
                            if(firstName) {
                                userData.firstName = firstName;
                            }
                            if(lastName) {
                                userData.lastName = lastName;
                            }
                            if(password) {
                                userData.hashedPassword = helpers.hash(password);
                            }
                            // store the new user
                            _data.update('users', phone, userData, (err) => {
                                if(!err) {
                                    callback(200)
                                } else {
                                    console.log(err);
                                    callback(500, {'Error': 'Could not update the user'})
                                }
                            })
                        } else {
                            callback(400, {'Error': 'The specified user does not exist'})
                        }
                    })
                } else {
                    callback(403, {'Error': 'Missing required token in header, or token is invalid'})
                }
            })  
        } else {
            callback(400, {'Error': 'Missing fields to update'})
        }
    } else {
        callback(400, {'Error' : 'Missing required field'})
    }

}
// Users - delete
// required data: phone
// @TODO only let the authenticated user to delete their own object, don't let them delete other object/user
//@TODO delete any other data files associated with this user
handlers._users.delete = (data, callback) => {
    // check that the user's phone is valid
    const phone = typeof(data.queryStringObject.phone) === 'string' && data.queryStringObject.phone.trim().length === 10 ? data.queryStringObject.phone.trim() : false;
    
    if(phone) {
        // get the token from the headers
        const token = typeof(data.headers.token) === 'string' ? data.headers.token : data.headers.token;
        // verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, phone, (tokenIsValid) => {
            if(tokenIsValid) {
                //  lookup the user
                    _data.read('user', phone, (err, data) => {
                     if(!err && data) {
                        _data.delete('users', phone, (err) => {
                        if(!err) {
                        callback(200);
                         } else {
                        callback(500, {'Error': 'Could not delete the specified user'})
                        }
                        })
                    } else {
                        callback(400, {'Error': 'Could not find the specified user'})
                    }
                 })
            } else {
                callback(403, {'Error': 'Missing required token in header, or token is invalid'})
            }
        })
        
    } else {
        callback(400, {'Error': 'Missing required field'})
    }

}
// token handlers 
handlers.token = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
}
// container for all tokens methods
handlers._tokens = {};

// tokens
// tokens - post
// required fields: phone and password
// optional fields: none
handlers._tokens.post = (data, callback) => {
    _performance.mark('entered function');
    const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length === 10 ? data.payload.phone.trim() : false;
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    _performance.mark('inputs validated');

    if(phone && password) {
        // lookup user that matches that phone number 
        _performance.mark('beginning user lookup')
        _data.read('users', phone, (err, userData) => {
            _performance.mark('user lookup complete')
            if(!err && userData) {
                //hash the sent password and confirm if the sent password is same to the one in the user object
                _performance.mark('beginning password hashing')
                const hashedPassword = helpers.hash(password);
                _performance.mark('password hashing complete')
                if(hashedPassword === userData.hashedPassword){
                    // if valid, create a new token with expiration date, one hour into the future
                    _performance.mark('creating data for the token')
                    const tokenid = helpers.createRandomString(20);
                    const expires = Date.now() * 1000 * 60 * 60;
                    const tokenObject = {
                        'phone' : phone,
                        'id' : tokenid,
                        'expires': expires
                    }
                    // store the token
                    _performance.mark('beginning storing token')
                    _data.create('tokens', tokenid, tokenObject, (err) => {
                        _performance.mark('storing token complete')

                        // Gather all the measurements
                        _performance.measure('Beginning to end', 'entered function', 'storing token complete');
                        _performance.measure('validating user input', 'entered function', 'inputs validated');
                        _performance.measure('user lookup', 'beginning user lookup', 'user lookup complete');
                        _performance.measure('Password hashing', 'beginning password hashing', 'password hashing complete');
                        _performance.measure('Token data creation', 'creating data for the token', 'beginning storing token');
                        _performance.measure('Token storing', 'beginning storing token', 'storing token complete');

                        // Log out all the measurements
                        const measurements = _performance.getEntriesByType('measure');
                        measurements.forEach(measurement => {
                            debug('\x1b[33m%s\x1b[0m', measurement.name+': '+measurement.duration)
                        })
                        if(!err) {
                            callback(200, tokenObject)
                        } else {
                            callback(500, {'Error': 'Could not create token'})
                        }
                    })
                } else {
                    callback(400, {'Error': 'Password did not match the specified user\'s stored password'})
                }
            } else {
                callback(400, {'Error': 'Could not find the specified user'})
            }
        })
    } else {
        callback(400, {'Error': 'Missing required field(s)'})
    }
}

// tokens - get
// required data: id
// optional data: none
handlers._tokens.get = (data, callback) => {
    // check that the id is valid
    const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
    if(id){
        //lookup the id
        _data.read('tokens', id, (err, tokenData) => {
            if(!err && tokenData){
                callback(200, tokenData)
            } else {
                callback(404)
            }
        })
    } else {
        callback(400, {'Error': 'Missing required field'})
    }
}

// tokens - put
// required data: id, extend
// optional data: none
handlers._tokens.put = (data, callback) => {
    // check that the id is valid
    const id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;
    const extend = typeof(data.payload.extend) === 'boolean' && data.payload.extend === true ? true : false;

    if (id && extend) {
        // lookup the data
        _data.read('tokens', id, (err, tokenData) => {
            if(!err && tokenData) {
                // check to make sure isn't already expired
                if(tokenData.expires > Date.now()) {
                    // set the expiration an hour from now
                    tokenData.expires = Date.now() * 1000 * 60 * 60

                    // store the new update
                    _data.update('token', id, tokenData, (err) => {
                        if(!err) {
                            callback(200)
                        } else {
                            callback(500, {'Error': 'Could not extend token'})
                        }
                    })
                } else {
                    callback(400, {'Error': 'The token has already expired, and can no longer be extended'})
                }
            } else {
                callback(400, {'Error': 'Specified token does not exist'})
            }
        })
    } else {
        callback(400, {'Error': 'Missing required field(s) or field(s) are invalid'})
    }
}

// tokens - delete
// required data: id
// optional data: none
handlers._tokens.delete = (data, callback) => {
    // check that the id is valid
    const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
    if(id) {
        // lookup the id
        _data.read('tokens', id, (err,data) => {
            if(!err && data) {
                _data.delete('tokens', id, (err) => {
                    if(!err) {
                        callback(200);
                    } else {
                        callback(500, {'Error': 'Could not delete the specified token'});
                    }
                })
            } else {
                callback(400, {'Error': 'Could not find the specified token'});
            }
        })
    } else {
        callback(404, {'Error': 'Missing required fields'});
    }
}
// verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = (id, phone, callback) => {
    // lookup the token
    _data.read('tokens', id, (err, tokenData) => {
        if(!err && tokenData) {
            // check the token is for a given user and has not expired
            if(tokenData.phone === phone && tokenData.expires > Date.now()){
                callback(true)
            } else {
                callback(false)
            }
        } else {
            callback(false)
        }
    })
}

// checks
handlers.checks = (data, callback) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
        handlers._check[data.method](data, callback);
    } else {
        callback(405)
    }
}
// container for all the checks method.
handlers._checks = {}
// post
// required data: protocol, url, method, successCodes, timeOutSeconds
// optional data: none
handlers._checks.post = (data, callback) => {
    // validate inputs
    const protocol = typeof(data.payload.protocol) === 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    const url = typeof(data.payload.url) === 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    const method = typeof(data.payload.method) === 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    const successCodes = typeof(data.payload.successCodes) === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes :false;
    const timeOutSeconds = typeof(data.payload.timeOutSeconds) === 'number' && data.payload.timeOutSeconds % 1 === 0 && data.payload.timeOutSeconds >= 1 && data.payload.timeOutSeconds <= 5 ? data.payload.timeOutSeconds : false;

    if(protocol && url && method && successCodes && timeOutSeconds){
        // get the token from the headers
        const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
        // lookup the user by reading the token
        _data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                const userPhone = tokenData.phone;
                // lookup the user data
                _data.read('users', userPhone, (err, userData) => {
                    if (!err && userData) {
                        const userChecks = typeof(userData.checks) === 'object' && userData.checks instanceof Array ? userData.checks : [];
                        // verify that the user has less than the no of max-checks-per-user

                        if(userChecks.length < config.maxChecks) {
                            // verify that URL given as DNS enteries, and therefore can resolve
                            const parsedUrl = _url.parse(protocol+'://'+url,true);
                            const hostName = typeof(parsedUrl.hostname) === 'string' && parsedUrl.hostname.length > 0 ? parsedUrl.hostname : false;
                            dns.resolve(hostName,(err,records) => {
                                if(!err && records) {
                                     // create a random id for the checks
                            const checkid = helpers.createRandomString(20);
                            // create the check object and include the user's phone
                            const checkObject = {
                                'id': checkid,
                                'userPhone': userPhone,
                                'protocol': protocol,
                                'url': url,
                                'method': method,
                                'successCodes': successCodes,
                                'timeOutSeconds': timeOutSeconds
                            }
                            // save the checkobject
                            _data.create('checks', checkid, checkObject, (err)  => {
                                if(!err) {
                                    // add the check's id to the user's object
                                    userData.checks = userChecks;
                                    userData.checks.push(checkid);

                                    // save the new user data
                                    _data.update('users', userPhone, userData,(err) => {
                                        if(!err) {
                                            // return the data about the new check
                                            callback(200, checkObject)
                                        } else {
                                            callback(500, {'Error': 'Could not update the user with the new check'})
                                        }
                                    })
                                } else {
                                    callback(500, {'Error' : 'Could not create the new check'})
                                }
                            })
                                } else {
                                    callback(400, {'Error': 'The hostname of the URL entered did not resolve to any DNS enteries'})
                                }
                            })
                           
                        } else {
                            callback(400, {'Error': 'The user already has the maximum number of checks ('+config.maxChecks+')'})
                        }
                    } else {
                        callback(403)
                    }
                })
            } else {
                callback(403)
            }
        })
    } else {
        callback(400, {'Error' : 'Missing required inputs, or inputs are invalid'})
    }
}
// get
handlers._checks.get = (data, callback) => {
    // check that the id is valid
    const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // lookup the check
        _data.read('checks', id, (err, checkData) => {
            if(!err && checkData){
                // get the token from the headers object
                const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
                // verify that the given token is valid and belongs to the user who created the check
                helpers._tokens.verifyToken(token, checkData.userPhone, (tokenIsValid) => {
                    if(tokenIsValid){
                        callback(200, checkData)
                    } else {
                        callback(403)
                    }
                })
            } else {
                callback(404);
            }
        })
    } else {
        callback(400, {'Error': 'Missing required field'})
    }
}
// put
// required data: id
// optional data: protocol, url, successCodes, timeOutSeconds, method (one must be sent)
handlers._checks.put = (data, callback) => {
    // check for the required field
    const id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;
    // check for the optional fields
    const protocol = typeof(data.payload.protocol) === 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
    const url = typeof(data.payload.url) === 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    const method = typeof(data.payload.method) === 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method : false;
    const successCodes = typeof(data.payload.successCodes) === 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    const timeOutSeconds = typeof(data.payload.timeOutSeconds) === 'number' && data.payload.timeOutSeconds >= 1 && data.payload.timeOutSeconds <= 5 ? data.payload.timeOutSeconds : false;

    //check to make sure id is valid
    if(id){
        // check if one or more of the optional fields has been sent
        if(protocol || url || method || successCodes || timeOutSeconds){
            // lookup the check
            _data.read('checks', id, (err, checkData) => {
                if(!err && checkData) {
                    // get the token from the headers
                    const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
                    // verify that the given token is valid and belongs to the user that created it
                    handlers._tokens.verifyToken(token, checkData, userPhone, (tokenIsValid) => {
                        if(tokenIsValid){
                            // update the check where necessary
                            if(protocol) {
                                checkData.protocol = protocol;
                            }
                            if(url) {
                                checkData.url = url;
                            }
                            if(method){
                                checkData.method = method;
                            }
                            if(successCodes) {
                                checkData.successCodes = successCodes;
                            }
                            if(timeOutSeconds) {
                                checkData.timeOutSeconds = timeOutSeconds
                            }
                            // store the data
                            _data.update('checks', id, checkData, (err) => {
                                if(!err){
                                    callback(200)
                                } else {
                                    callback(500, {'Error': 'Could not update the check'})
                                }
                            })
                        } else {
                            callback(403)
                        }
                    })
                } else {
                    callback(400, {'Error': 'Check ID did not exist'})
                }
            })
        } else {
            callback(400, {'Error': 'Missing fields to update'})
        }

    } else {
        callback(400, {'Error': 'Missing required fields'})
    }
}
// delete
// required data: id
// optional data: none
handlers._checks.delete = (data, callback) => {
    // check if the id is valid
    const id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false;
    if(id) {
        // lookup the check
        _data.read('checks', id, (err, checkData) => {
            if(!err && checkData) {
                // get the token from the headers
                const token = typeof(data.headers.token) === 'string' ? data.headers.token : false;
                // verify that the given token is valid for the phone number
                handlers._tokens.verifyToken(token, checkData.userPhone, (tokenIsValid) => {
                    if(tokenIsValid) {
                        // delete the check data
                         _data.delete('checks', id, (err) => {
                            if(!err) {
                                // lookup the data
                                _data.read('users', checkData.userPhone, (err, userData) => {
                                    if(!err && userData){
                                        const userChecks = typeof(userData.checks) === 'object' && userData.checks instanceof Array ? userData.checks : [];
                                        // remove the delete check from their list of checks
                                        const checkPosition = userChecks.indexOf(id);
                                        if(checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1)
                                            // re-save the user's data
                                            _data.updata('users', checkData.userPhone, userData, (err) => {
                                                if(!err) {
                                                    // delete each of the checks associated with the user
                                                    const userChecks = typeof(userData.checks) === 'object' && userData.checks instanceof Array ? userData.checks : [];
                                                    const checksToDelete = userChecks.length;
                                                    if(checksToDelete > 0) {
                                                        const checksDeleted = 0;
                                                        const deletionErrors = false;
                                                        // loop through the check
                                                        userChecks.forEach(checkid => {
                                                            // delete the checks
                                                            _data.delete('checks', checkid, (err) => {
                                                                if(err){
                                                                    deletionErrors = true;
                                                                }
                                                                checksDeleted++
                                                                if(checksDeleted === checksToDelete){
                                                                    if(!deletionErrors){
                                                                        callback(200)
                                                                    } else {
                                                                        callback(500, {'Errors': 'Errors encountered while attemptiong to delete'})
                                                                    }
                                                                }
                                                            })
                                                        })
                                                    } else {
                                                        callback(200)
                                                    }
                                                } else {
                                                    callback(500, {'Error': 'Could not update the user'})
                                                }
                                            })
                                        } else {
                                            callback(500, {'Error': 'Could not find the check on the users object,so could not remove it'})
                                        }
                                    } else {
                                        callback(500, {'Error': 'could not find the user who created the checks'})
                                    }
                                })   
                            } else {
                                callback(500, {'Error': 'Could not delete the check data'})
                            }
                         } )
                    } else {
                        callback(403)
                    }
                })
            } else {
                callback(400, {'Error': 'The specified check ID does not exist'});
            }
        })
    } else {
        callback(400, {'Error': 'Missing required fields'})
    }
}

// export the handlers
module.exports = handlers