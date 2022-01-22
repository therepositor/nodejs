/*
* Example UDP server
* Creating a user datagram protocol(udp) server on 6000
*/

// Dependencies
const dgram = require('dgram');

// create a udp server
const server = dgram.createSocket('udp4');

server.on('message', (messageBuffer,sender) => {
    // Do something with an incoming message or do something with the sender
    const messageString = messageBuffer.toString();
    console.log(messageString);
});
// Bind to 6000
server.bind(6000);
