var assert = require('assert');

var SlideReader = require('../lib/slide-reader');

describe('SlideReader', function () {
    describe('readFromString', function () {

        it('should read', function (done) {
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
                assert.equal(slide.getContentBlock('Main'), '\n# Welcome\n');
                done();
            }
        });
    });
});
