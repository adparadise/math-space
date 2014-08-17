var static = require('node-static');
var HTTP = require('http');
var winston = require('winston');

var port = 8081;
var fileServer, server;

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    level: 'debug',
    timestamp: true
});

fileServer = new static.Server('./public');
server = HTTP.createServer(serverHandler);

function serverHandler (request, response) {
    fileServer.serve(request, response);
}

server.listen(port);
winston.info('listening on port: ' + port);
