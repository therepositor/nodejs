/*
* Example TLS/SSL server
* Listens to port 6000 and sends the word 'pong' to clients
*/

// Dependencies
const tls = require('tls');
const path = require('path');
const fs = require('fs');

// Server options
const options = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
}

// create a server
const server = tls.createServer(options, connection => {
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
