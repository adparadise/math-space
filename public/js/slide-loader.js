
// A class to load slide definitions from the server.
function SlideLoader () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function (hostname, AJAX) {
        this.hostname = hostname || '';
        this.AJAX = AJAX || XMLHttpRequest;
    };

    proto.getSlides = function (deckName, callback) {
        var self = this;
        this.performGet(this.hostname + '/api/deck/' + deckName, handleResponse);

        function handleResponse (error, definitions) {
            var slides;
            if (error) {
                return callback(error);
            }

            slides = self.buildSlidesFromDefinitions(definitions);
            callback(undefined, slides);
        }
    };

    proto.buildSlidesFromDefinitions = function (definitions) {
        var index, definition, slide;
        var slideDefinitions, slides;

        slideDefinitions = [];
        for (index = 0; index < definitions.length; index++) {
            definition = definitions[index];
            slide = new SlideDefinition(definition);
            slideDefinitions.push(slide);
        }

        slides = new Slides(slideDefinitions);
        return slides;
    };

    proto.performGet = function (url, callback) {
        var request;

        request = new this.AJAX();
        request.onload = eventListener;
        request.open('get', url, true);
        request.send();

        function eventListener (event) {
            var responseObject;
            if (event.type !== 'load') {
                return;
            }

            if (request.status !== 200) {
                return callback(new Error(request.responseText));
            };

            try {
                responseObject = JSON.parse(request.responseText);
            } catch (e) {
                return callback(e);
            }
            callback(undefined, responseObject);
        };
    };
}(SlideLoader.prototype));
