/*
* Example HTTP2 server
*
*/

//Dependencies
const http2 = require('http2');

// Init the server
const server = http2.createServer();

// On a stream, send back hello world html
server.on('stream',(stream,headers) => {
    stream.respond({
        'status': 200,
        'Content-Type': 'text/html'
    });
    stream.end('<html><body><p>Hello World!</p></body></html>');
})
// server should listen on 6000
server.listen(6000, () => {
    console.log('Listening on port 6000')
})