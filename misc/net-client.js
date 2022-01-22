/*
* Example NET (TCP) client
* Connect to port 6000 ad sends the word 'ping' to the servers
*/

// Dependencies
const net = require('net');

// Define the message to read
const outBoundMessage = 'ping'
// create a client
const client = net.createConnection({'port': 6000}, () => {
    // send the message
    client.write(outBoundMessage);
});

// when the server writes back, log what it says and kill the client
client.on('data', inBoundMessage => {
    const messageString = inBoundMessage.toString();
    console.log('I wrote '+outBoundMessage+ ' and they said '+messageString);
    client.end()
})