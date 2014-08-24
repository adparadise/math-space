

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
}(Slide.prototype));
