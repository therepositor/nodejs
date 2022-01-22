/*
* Example HTTP2 Client
*
*/

// Dependencies

const http2 = require('http2');

// create client
const client = http2.connect('http://localhost:6000');

// create a request
const req = client.request({
    ':path': '/'
});

// When a message is received, add a pieces of together until you reach the end
let str = '';
req.on('data', chunk => {
    str += chunk
});
// when the message ends, log it out
req.on('end', () => {
    console.log(str);
});
// End the request
req.end();