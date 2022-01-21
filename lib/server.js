// server related task

const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');

// instantiate the server module object
const server = {};

helpers.sendTwilioSms('7038399981', 'Hi, you sent your first twilio message', (err) => {
    debug('this is the error message', err)
})
//testing
// _data.delete('test', 'newFile', (err) =>   {
//     debug('this was the error', err)
// })

// instantiate the http server
server.httpServer = http.createServer((req,res) => {
    server.unifiedServer(req, res);
});
// instantiate the https server
server.httpsServerOption = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
}
server.httpsServer = https.createServer(server.httpsServerOption, (req, res) => {
    server.unifiedServer(req, res)
})



// create a unified server logic for both the http and https server

server.unifiedServer = (req, res) => {
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);

    // get the pathname
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    
    // get the http method
    const method = req.method.toLowerCase();

    // get the query string as an object
    const queryObject = parsedUrl.query;

    // get the headers as an object
    const headers = parsedUrl.headers;

    // get the payload, if any
    const decoder = new stringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        // choose the handler this request should go to, if any else go to not found
        let chooseHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        // if the request is within the public directory, use the public handler instead
        chooseHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chooseHandler;
        // construct the data object to send to the handler
        const data = {
            'trimmedPath': trimmedPath,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer),
            'queryObject': queryObject

        }
        //Route the request to the handler specified in the router
        chooseHandler(data, (statusCode, payload, contentType) => {
            try {
                server.processHandlerResponse(res,method,trimmedPath,statusCode,payload,contentType)
            } catch (e) {
                debug(e);
                server.processHandlerResponse(res,method,trimmedPath,500,{'Error': 'An unknown error has occured'}, 'json')
            }
           
        })
        
        
    })
}
// Process the response from the handler
server.processHandlerResponse = (res,method,trimmedPath,statusCode,payload,contentType) => {
    // determine the type of response (fall back to JSON)
    contentType = typeof(contentType) === 'string' ? contentType : 'json';
    // use the statuscode called back by the handler, or use default
    statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

    // return the response-parts that are content specific
    let payloadString = '';
    if(contentType === 'json'){
        res.setHeader('Content-Type', 'application/json ; charset=utf-8');
        payload = typeof(payload) === 'object' ? payload : {};
        payloadString = JSON.stringify(payload);
    }
    if(contentType === 'html'){
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        payload = typeof(payload) === 'string' ? payload : '';
    }
    if(contentType === 'css'){
        res.setHeader('Content-Type', 'text/css ; charset=utf-8');
        payload = typeof(payload) !== undefined ? payload : '';
    }
    if(contentType === 'favicon'){
        res.setHeader('Content-Type', 'image/x-icon; charset=utf-8');
        payload = typeof(payload) !== undefined ? payload : '';
    }
    if(contentType === 'png'){
        res.setHeader('Content-Type', 'image/png; charset=utf-8');
        payload = typeof(payload) !== undefined ? payload : '';
    }
    if(contentType === 'jpg'){
        res.setHeader('Content-Type', 'image/jpeg; charset=utf-8');
        payload = typeof(payload) !== undefined ? payload : '';
    }
    if(contentType === 'plain'){
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        payload = typeof(payload) !== undefined ? payload : '';
    }
    // return the response-parts that are common to all content-types
    res.writeHead(statusCode);
    res.end(payloadString);

    // if the response is 200, print in green else red
    if(statusCode === 200){
        debug('\x1b[31m%s\x1b[0m', method.toUpperCase()+'/'+trimmedPath+' '+statusCode);
    } else {
        debug('\x1b[32m%s\x1b[0m', method.toUpperCase()+'/'+trimmedPath+' '+statusCode);
    }
}
// define a request router
server.router = {
    '': handlers.index,
    'account/create': handlers.accountCreate,
    'account/edit': handlers.accountEdit,
    'account/deleted': handlers.accountDeleted,
    'session/create' : handlers.sessionCreate,
    'session/deleted' : handlers.sessionDeleted,
    'checks/all' : handlers.checksList,
    'checks/create' : handlers.checksCreate,
    'checks.edit' : handlers.checksEdit,
    'ping': handlers.ping,
    'api/users': handlers.users,
    'api/tokens': handlers.tokens,
    'api/checks': handlers.checks,
    'favicon.ico': handlers.favicon,
    'public': handlers.public,
    'examples/error': handlers.exampleError
}
// init script 
server.init = () => {
    
    // start the http server
    server.httpServer.listen(config.httpPort, () => {
    console.log('\x1b[35m%s\x1b[0m', 'listening on port ' + config.httpPort)
    })

    // start the https server
    server.httpsServer.listen(config.httpsPort, () =>  {
    console.log('\x1b[36m%s\x1b[0m', 'listening on port ' + config.httpsPort)
    })
}
module.exports = server