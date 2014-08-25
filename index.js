var static = require('node-static');
var HTTP = require('http');
var winston = require('winston');

var SlideServer = require('./lib/slide-server');

var port = 8081;
var fileServer, server;
var slideServer;

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    level: 'debug',
    timestamp: true
});

fileServer = new static.Server('./public');
slideServer = new SlideServer('./slides');
server = HTTP.createServer(serverHandler);

function serverHandler (request, response) {
    if (request.url.indexOf(slideServer.prefix) === 0) {
        slideServer.handle(request, response);
    } else {
        fileServer.serve(request, response);
    }
}

server.listen(port);
winston.info('listening on port: ' + port);
