

/**
 * This class serves as the translation layer between the
 * HTML/Canvas/CSS on the page and the more idealized coordinate space
 * it represents.
 */
function Space () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function (canvas) {
        this.canvas = canvas;
        this.bakeDims();
        this.setCurrentCamera(0.5, 0.5, 1.1, 1.1);

        this.mousedown = this.mousedown.bind(this);
        this.mousemove = this.mousemove.bind(this);
        this.mouseup = this.mouseup.bind(this);
        this.touchstart = this.touchstart.bind(this);
        this.touchmove = this.touchmove.bind(this);
        this.touchend = this.touchend.bind(this);
    };

    proto.start = function () {
        this.bindEvents();
    };

    proto.bakeDims = function () {
        this.width = this.canvas.getAttribute('width');
        this.height = this.canvas.getAttribute('height');
        this.minDim = Math.min(this.width, this.height);

        this.calculateScale();

        this.shouldRedraw = true;
    };

    // Account for additional scaling done with CSS which might alter
    // screen pixels per canvas pixel.
    proto.calculateScale = function () {
        var style, transform;
        var matrixPattern, match;
        var scaleX, scaleY;

        scaleX = 1;
        scaleY = 1;
        style = window.getComputedStyle(this.canvas);
        transform = style.getPropertyValue('transform');
        if (transform) {
            matrixPattern = /matrix\(([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+), ([0-9\.]+)/;
            match = matrixPattern.exec(transform);
            if (match) {
                scaleX = match[1];
                scaleY = match[4];
            }
        }

        this.scale = {
            x: (this.width / this.canvas.clientWidth) * scaleX,
            y: (this.height / this.canvas.clientHeight) * scaleY
        };
    }

    proto.bindEvents = function () {
        this.canvas.addEventListener('mousedown', this.mousedown);
        this.canvas.addEventListener('mousemove', this.mousemove);
        this.canvas.addEventListener('mouseup', this.mouseup);

        this.canvas.addEventListener('touchstart', this.touchstart);
        this.canvas.addEventListener('touchmove', this.touchmove);
        this.canvas.addEventListener('touchend', this.touchend);
    };

    proto.tick = function () {

    };

    proto.clearFlags = function () {
        delete this.shouldRedraw;
    };

    proto.setCurrentCamera = function (x, y, rangeX, rangeY) {
        var range, scale, rangeLog, unit;
        var paddingX, paddingY;
        this.camera = {
            x: x,
            y: y,
            rangeX: rangeX,
            rangeY: rangeY
        };

        range = Math.min(rangeX, rangeY);
        scale = this.minDim / range;
        paddingX = (this.width - range * scale) / scale;
        paddingY = (this.height - range * scale) / scale;
        this.bounds = {
            range: range,
            scale: scale,
            x: {
                low: x - range / 2 - paddingX / 2,
                high: x + range / 2 + paddingX / 2
            },
            y: {
                low: y - range / 2 - paddingY / 2,
                high: y + range / 2 + paddingY / 2
            }
        };

        this.shouldRedraw = true;
    };

    proto.mousedown = function (event) {
        this.dragstart(event.x, event.y);
    };

    proto.touchstart = function (event) {
        this.dragstart(event.touches[0].clientX, event.touches[0].clientY);
    };

    proto.dragstart = function (x, y) {
        this.isDragging = true;
        this.drag = {
            initial: {
                x: x,
                y: y
            },
            scale: this.bounds.scale,
            camera: {
                x: this.camera.x,
                y: this.camera.y,
                rangeX: this.camera.rangeX,
                rangeY: this.camera.rangeY
            }
        };
    };

    proto.mousemove = function (event) {
        this.dragmove(event.x, event.y);
    };

    proto.touchmove = function (event) {
        event.preventDefault();
        this.dragmove(event.touches[0].clientX,
                      event.touches[0].clientY);
    };

    proto.dragmove = function (x, y) {
        var scaleX, scaleY;
        if (!this.isDragging) {
            return;
        }
        scaleX = this.bounds.scale * this.scale.x;
        scaleY = this.bounds.scale * this.scale.y;
        this.setCurrentCamera(this.drag.camera.x + (this.drag.initial.x - x) / scaleX,
                              this.drag.camera.y + (this.drag.initial.y - y) / scaleY,
                              this.camera.rangeX,
                              this.camera.rangeY);
    };

    proto.mouseup = function (event) {
        this.isDragging = false;
    };

    proto.touchend = function (event) {
        this.isDragging = false;
    };
}(Space.prototype));
