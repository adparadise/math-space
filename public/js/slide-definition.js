
/**
 * A class to represent the runtime definition of a slide, including
 * all lifecycle management.
 */
function SlideDefinition () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function (definition) {
        this.build(definition);
    };

    // Expand the static, content-managed definition into executable
    // form.
    proto.build = function (definition) {

    };

    // Pair this executable definition with a DOM element while the
    // slide is active.
    proto.bind = function (element) {
        this.element = element;
        this.isBound = true;
        this.element.setAttribute('class', 'slide');
    };

    proto.setTransition = function (percent) {
        this.element.setAttribute('style', 'opacity: ' + percent.toFixed(20));
    };

    // Declare this slide in focus, so that it is interactive.
    proto.focus = function () {
        this.isFocused = true;
    };

    // Make the slide inactive.
    proto.defocus = function () {
        delete this.isFocused;
    };

    // Unbind events and clear any references to the dom, freeing this
    // definition for future reuse.
    proto.release = function () {

        delete this.isBound;
    };
}(SlideDefinition.prototype));
