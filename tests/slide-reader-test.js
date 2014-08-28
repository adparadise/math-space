var assert = require('assert');

var SlideReader = require('../lib/slide-reader');

describe('SlideReader', function () {
    describe('readFromString', function () {

        it('should read the text per section', function (done) {
            var reader, contents;
            reader = new SlideReader();

            contents = [
                '/* Main */',
                '# Welcome',
                '---',
                '{}'
            ].join('\n');
            reader.readFromString(contents, callback);

            function callback (error, slide) {
                assert.equal(error, undefined);
                assert.equal(slide.getContentBlock('Main'), '<h1>Welcome</h1>');
                done();
            }
        });

        it('should read multiple content blocks', function (done) {
            var reader, contents;
            reader = new SlideReader();

            contents = [
                '/* Main */',
                '# Welcome',
                '---',
                '/* Other */',
                '# Noice',
                '---',
                '{}'
            ].join('\n');
            reader.readFromString(contents, callback);

            function callback (error, slide) {
                assert.equal(error, undefined);
                assert.equal(slide.getContentBlock('Other'), '<h1>Noice</h1>');
                done();
            }
        });

        it('should read the JavaScript block', function (done) {
            var reader, contents;
            reader = new SlideReader();

            contents = [
                '/* Main */',
                '# Welcome',
                '---',
                '{ config: true }'
            ].join('\n');
            reader.readFromString(contents, callback);

            function callback (error, slide) {
                assert.equal(error, undefined);
                assert.equal(slide.getJavaScriptBlock(), '{ config: true }');
                done();
            }
        });
    });

    describe('readDeck', function () {
        it.only('should', function (done) {
            var reader;

            reader = new SlideReader();
            reader.readDeck('slides/01-ratios', deckCallback);

            function deckCallback (error, definitions) {
                assert.equal(error, undefined);
                assert.notEqual(definitions[0], undefined);
                assert.notEqual(definitions[0].content, undefined);
                done();
            };
        });
    });
});
