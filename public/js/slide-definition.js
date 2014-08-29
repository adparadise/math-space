
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
        this.content = definition.content;
        try {
            this.data = JSON.parse(definition.javaScript);
        } catch (e) {
            this.error = e;
        }
    };

    // Pair this executable definition with a DOM element while the
    // slide is active.
    proto.bind = function (element, slideElements) {
        this.element = element;
        this.slideElements = slideElements
        this.isBound = true;
        this.element.setAttribute('class', 'slide');
        this.createMainContent();
    };

    proto.createMainContent = function () {
        this.element.innerHTML = this.content.Main;
    };

    proto.setTransition = function (percent) {
        var opacity;

        opacity = percent.toFixed(20);
        if (opacity) {
            this.element.setAttribute('style', 'opacity: ' + opacity);
        } else {
            this.element.deleteAttribute('style');
        }
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
