var fs = require('fs');
var Path = require('path');

module.exports = SlideServer;

function SlideServer () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function (slideHome) {
        this.slideHome = slideHome;
        this.prefix = '/api/deck';
    };

    proto.handle = function (request, response) {
        this.handleGetDeckIndex(request, response);
        return;
    };

    proto.handleGetDeckIndex = function (request, response) {
        var self = this;
        fs.readdir(this.slideHome, handler);

        function handler (error, files) {
            var message, body;
            if (error) {
                self.handleError(request, response, error);
                return;
            }

            message = {
                decks: []
            };
            body = JSON.stringify(message);
            response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
            response.write(body);
            response.end();
        }
    };

    proto.handleError = function (request, response, error) {
        var message, body;

        message = {
            error: error.message,
            stack: error.stack
        };
        body = JSON.stringify(message, undefined, 2);

        response.statusCode = 500;
        response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
        response.write(body, 'utf-8');
        response.end();
    };

}(SlideServer.prototype));
