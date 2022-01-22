/*
* Example UDP client
* Sending a message to udp server on port 6000
*/

// Dependencies
const dgram = require('dgram');

// create a client
const client = dgram.createSocket('udp4');

// Define the message and pull it into a buffer
const messageString = 'This is a message';
const messageBuffer = Buffer.from(messageString);

// send off the message
client.send(messageString, 6000, 'localhost', err => {
    client.close();
});