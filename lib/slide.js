

module.exports = Slide;

function Slide () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function () {
        this.content = {};
    };

    proto.setContentBlock = function (name, content) {
        this.content[name] = content;
    };

    proto.getContentBlock = function (name) {
        return this.content[name];
    };

    proto.setJavaScriptBlock = function (block) {
        this.javaScript = block;
    };

    proto.getJavaScriptBlock = function (block) {
        return this.javaScript;
    };
}(Slide.prototype));
