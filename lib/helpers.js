// // helpers for various tasks
// const crypto = require('crypto');
// const config = require('./config');
// const https = require('https');
// const {URLSearchParams} = require('url')
// // create a container for all the helpers

// const helpers = {};
// // create a SHA256 hash 
// helpers.hash = (str) => {
//     if(typeof(str) === 'string' && str.length > 0) {
//         const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
//         return hash;
//     } else {
//         return false;
//     }
// }
// // parse a Json string to an object in all cases wwithot throwing
// helpers.parseJsonToObject = (str) => {
//     try {
//         const obj = Json.parse(str);
//         return obj
//     } catch (e) {
//         return {};
//     }
// }
// // create a random alphanumeric string with length of 20
// helpers.createRandomString = (strLength) => {
//    strLength = typeof(strLength) === 'number' && strLength > 0 ? strLength : false;
//    if(strLength){
//        // define all possible characters that could go into a string
//        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';

//        // start the final string
//        const str = '';
//        for(i=1; i < strLength; i++) {
//            // get a random character from the possibleCharacters string
//            const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
//            // append this character to the final str
//            str += randomCharacter;
//        }
//        return str
//    }
// }
// // send an sms via twilio
// helpers.sendTwilioSms = (phone, msg, callback) => {
//     // validate parameters
//     phone = typeof(phone) === 'string' && phone.trim().length === 10 ? phone.trim() : false;
//     msg = typeof(msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

//     if(phone && msg){
//         // configure the request payload
//         const payload = {
//             'From': config.twilio.fromPhone,
//             'To': '+234'+phone,
//             'Body': msg
//         }
        
//         // stringify the payload
//         const urlSearchParams = URLSearchParams;
//         const stringPayload =  urlSearchParams.toString(payload);

//         // configure the request details
//         const requestDetails = {
//             'protocol': 'https:',
//             'hostName': 'api.twilio.com',
//             'method': 'POST',
//             'path': '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
//             'auth': config.twilio.accountSid+':'+config.twilio.authToken,
//             'headers': {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 'Content-Length': Buffer.byteLength(stringPayload)
//             }
//         }
//         // instantiate the request object
//         const req = https.request(requestDetails, (res) => {
//             // grab the status of the sent request
//             const status = res.statusCode;
//             // callback successfully if the request went through
//             if(status === 200 || status === 201){
//                 callback(false);
//             } else {
//                 callback('status code retrun was '+status);
//             }
//         })
//         // bind to the error event so it doesn't get thrown
//         req.on('error', (e) => {
//             callback(e);
//         })
//         // add the payload to req
//         req.write(stringPayload);

//         // end the request
//         req.end();
//     } else {
//         callback('Give parameters were missing or invalid')
//     }
    
// }
// //export the module
// module.exports = helpers;

/*
 * Helpers for various tasks
 *
 */

// Dependencies
var config = require('./config');
var crypto = require('crypto');
var https = require('https');
var querystring = require('querystring');

// Container for all the helpers
var helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength){
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength){
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    var str = '';
    for(i = 1; i <= strLength; i++) {
        // Get a random charactert from the possibleCharacters string
        var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        // Append this character to the string
        str+=randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    return false;
  }
};

helpers.sendTwilioSms = function(phone,msg,callback){
  // Validate parameters
  phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
  msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
  if(phone && msg){

    // Configure the request payload
    var payload = {
      'From' : config.twilio.fromPhone,
      'To' : '+1'+phone,
      'Body' : msg
    };
    var stringPayload = querystring.stringify(payload);


    // Configure the request details
    var requestDetails = {
      'protocol' : 'https:',
      'hostname' : 'api.twilio.com',
      'method' : 'POST',
      'path' : '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
      'auth' : config.twilio.accountSid+':'+config.twilio.authToken,
      'headers' : {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload)
      }
    };

    // Instantiate the request object
    var req = https.request(requestDetails,function(res){
        // Grab the status of the sent request
        var status =  res.statusCode;
        // Callback successfully if the request went through
        if(status == 200 || status == 201){
          callback(false);
        } else {
          callback('Status code returned was '+status);
        }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error',function(e){
      callback(e);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();

  } else {
    callback('Given parameters were missing or invalid');
  }
};


// Export the module
module.exports = helpers;
