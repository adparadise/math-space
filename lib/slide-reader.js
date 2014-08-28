var fs = require('fs');
var Path = require('path');
var Markdown = require('markdown');
var async = require('async');

var Slide = require('./slide');

module.exports = SlideReader;

// Class to read slides from disk
function SlideReader () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function () {


    };

    proto.readDeck = function (dirname, callback) {
        var self = this;
        var pathname;

        pathname = Path.resolve(dirname);
        fs.readdir(pathname, readdirCallback);

        function readdirCallback (error, listing) {
            if (error) {
                return callback(error);
            }

            listing = listing.sort();

            async.map(listing, readOne, finish);
        }

        function readOne (filename, continueCallback) {
            self.readOne(Path.join(pathname, filename), continueCallback);
        };

        function finish (error, definitions) {
            if (error) {
                return callback(error);
            }
            callback(undefined, definitions);
        }
    };

    proto.readOne = function (filename, callback) {
        var self = this;
        fs.readFile(filename, function (error, buffer) {
            if (error) {
                return callback(error);
            }
            self.readFromString(buffer.toString(), callback);
        });
    };

    proto.readFromString = function (contents, callback) {
        var context;
        var slide;

        slide = new Slide();
        while (true) {
            context = this.readContentBlock(contents, context);
            if (context.error) {
                return callback(context.error);
            }
            if (!context.results) {
                break;
            }
            this.evaluateContent(context, slide);
            delete context.results;
        }

        context = this.readJavaScriptBlock(contents, context);
        if (context.results) {
            slide.setJavaScriptBlock(context.results.text);
        }

        callback(undefined, slide);
    };

    proto.readContentBlock = function (contents, context) {
        var hrContext;
        if (!context) {
            context = {
                offset: 0
            };
        }

        delete context.results;

        hrContext = this.scanForHR(contents, {
            offset: context.offset
        });
        if (hrContext.results &&
            hrContext.results.index !== -1) {
            context.results = {
                text: contents.slice(context.offset,
                                     context.offset + hrContext.results.index)
            };
            context.offset = hrContext.results.afterOffset;
        }

        return context;
    };

    proto.evaluateContent = function (context, slide) {
        var text, extract;

        text = context.results.text;
        extract = this.extractComments(text);

        slide.setContentBlock(extract.comments[0],
                              extract.text);

    };

    var COMMENT_PATTERN = /\/\*+([^\*]+)\*\//;
    proto.extractComments = function (text) {
        var extract, match, index;
        var pre, post;

        extract = {
            comments: []
        };

        while (true) {
            match = COMMENT_PATTERN.exec(text);
            if (!match) {
                break;
            }

            text = this.removeMatchFromText(match, text);
            text = Markdown.markdown.toHTML(text);

            extract.comments.push(match[1].trim());
            break;
        }

        extract.text = text;
        return extract;
    };

    proto.removeMatchFromText = function (match, text) {
        var index, pre, post;

        index = text.indexOf(match[0]);
        pre = text.slice(0, index);
        post = text.slice(index + match[0].length);
        text = pre + post;

        return text;
    };

    proto.readJavaScriptBlock = function (contents, context) {
        var portion;
        if (!context) {
            context = {
                offset: 0
            };
        }
        delete context.results;

        portion = contents.slice(context.offset);
        portion = portion.trim();
        if (portion) {
            context.results = {
                text: portion
            };
        }

        return context;
    };

    proto.scanForHR = function (contents, context) {
        var portion, match, index;
        if (!context) {
            context = {
                offset: 0
            };
        }

        portion = contents.slice(context.offset);
        match = /---+/.exec(portion);
        if (!match) {
            context.index = -1;
            return context;
        }

        index = portion.indexOf(match[0]);
        context.results = {
            offset: context.offset,
            index: index,
            afterOffset: context.offset + index + match[0].length
        };

        return context;
    };
}(SlideReader.prototype));
