
const http = require('http');
const https = require('https');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./lib/config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');
// const _data = require('./lib/data');

helpers.sendTwilioSms('7038399981', 'Hi, you sent your first twilio message', (err) => {
    console.log('this is the error message', err)
})
//testing
// _data.delete('test', 'newFile', (err) =>   {
//     console.log('this was the error', err)
// })

// instantiate the http server
const httpServer = http.createServer((req,res) => {
    unifiedServer(req, res);
});
// instantiate the https server
const httpsServerOption = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}
const httpsServer = https.createServer(httpsServerOption, (req, res) => {
    unifiedServer(req, res)
})

// start the https server
httpsServer.listen(config.httpsPort, () =>  {
    console.log('listening on port ' + config.httpsPort);
})
// start the http server
httpServer.listen(config.httpPort, () => {
    console.log('listening on port ' + config.httpPort);
})
// create a unified server logic for both the http and https server

const unifiedServer = (req, res) => {
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
        const chooseHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // construct the data object to send to the handler
        const data = {
            'trimmedPath': trimmedPath,
            'method' : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer),
            'queryObject': queryObject

        }
        //Route the request to the handler specified in the router
        chooseHandler(data, (statusCode, payload) => {
            // use the statuscode called back by the handler, or use default
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            //  use the payload called back by the handler, or use default to bw an empty object
            payload = typeof(payload) === 'object' ? payload : {};
            // convert payload to a string
            const payloadString = JSON.stringify(payload);

            //return the response
            res.setHeader('Content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('Returning this response: ', statusCode, payloadString);
        })
        
        
    })
}

// define a request router
const router = {
    'ping': handlers.ping,
    'users': handlers.users,
    'tokens': handlers.tokens,
    'checks': handlers.checks
}