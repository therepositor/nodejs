/*
* Example TCP (NET) server
* Listens to port 6000 and sends the word 'pong' to clients
*/

// Dependencies
const net = require('net');

// create a server
const server = net.createServer(connection => {
    // send the word 'pong'
    const outBoundMessage = 'pong';
    connection.write(outBoundMessage);

    // when the client write something, log it out
    connection.on('data', inBoundMessage => {
        const messageString = inBoundMessage.toString();
        console.log('I wrote '+outBoundMessage+ ' and they said '+messageString)
    })
});
// listen
server.listen(6000);
