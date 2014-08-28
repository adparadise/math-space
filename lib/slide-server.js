var fs = require('fs');
var Path = require('path');

var SlideReader = require('./slide-reader');

module.exports = SlideServer;

function SlideServer () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function (slideHome) {
        this.slideHome = slideHome;
        this.slideReader = new SlideReader();
        this.prefix = '/api/deck';
        this.patterns = {
            deck: new RegExp('^' + this.prefix + '/([^\/]+)')
        };
    };

    proto.handle = function (request, response) {
        var match;

        match = this.patterns.deck.exec(request.url);
        if (match) {
            this.handleGetDeck(request, response, match[1]);
            return;
        }

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

    proto.handleGetDeck = function (request, response, deckName) {
        var self = this;
        var deckHome;

        deckHome = Path.join(this.slideHome, deckName);
        this.slideReader.readDeck(deckHome, handleDeck);

        function handleDeck (error, definitions) {
            var body;

            if (error) {
                return self.handleError(request, response, error);
            }

            body = JSON.stringify(definitions, undefined, 2);
            response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
            response.write(body, 'utf-8');
            response.end();
        };
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
