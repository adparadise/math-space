var fs = require('fs');

var Slide = require('./slide');

module.exports = SlideReader;

function SlideReader () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function () {

    };

    proto.read = function (filename, callback) {
        var self = this;
        fs.readFile(filename, function (error, buffer) {
            self.readFromString(buffer.toString, callback);
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
            break;
        }

        context = this.readJavaScriptBlock(contents, context);
        if (context.results) {

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

        hrContext = this.scanForHR(contents, context);
        if (hrContext.results.index !== -1) {
            context.results = {
                text: contents.slice(hrContext.results.offset,
                                     hrContext.results.offset + hrContext.results.index)
            };
            context.offset += hrContext.results.index;
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

            extract.comments.push(match[1].trim());
            // Always break until the algorithm works.
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
        if (!context) {
            context = {
                offset: 0
            };
        }

        delete context.results;

        return context;
    };

    proto.scanForHR = function (contents, context) {
        var portion, index;
        if (!context) {
            context = {
                offset: 0
            };
        }

        portion = contents.slice(context.offset);
        context.results = {
            offset: context.offset,
            index: portion.indexOf('---')
        };

        return context;
    };
}(SlideReader.prototype));
