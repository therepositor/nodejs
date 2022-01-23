/*
* Example TLS/SSL client
* Connect to port 6000 ad sends the word 'ping' to the servers
*/

// Dependencies
const tls = require('tls');
const path = require('path');
const fs = require('fs');


// Server options
const options = {
    'ca': fs.readFileSync(path.join(__dirname, '/../https/cert.pem')) // only required because we are using a self-signed certificate
}
// Define the message to read
const outBoundMessage = 'ping'
// create a client
const client = tls.connect(6000,options, () => {
    // send the message
    client.write(outBoundMessage);
});

// when the server writes back, log what it says and kill the client
client.on('data', inBoundMessage => {
    const messageString = inBoundMessage.toString();
    console.log('I wrote '+outBoundMessage+ ' and they said '+messageString);
    client.end()
})