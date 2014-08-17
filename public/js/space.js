


function Space () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function (canvas) {
        this.canvas = canvas;
        this.bakeDims();
        this.setCurrentCamera(0, 0, 1, 1);

        this.mousedown = this.mousedown.bind(this);
        this.mousemove = this.mousemove.bind(this);
        this.mouseup = this.mouseup.bind(this);
    };

    proto.start = function () {
        this.bindEvents();
    };

    proto.bakeDims = function () {
        var style, transform;
        var matrixPattern, match;
        var scaleX, scaleY;

        this.width = this.canvas.getAttribute('width');
        this.height = this.canvas.getAttribute('height');

        scaleX = 1;
        scaleY = 1;
        style = window.getComputedStyle(this.canvas);
        transform = style.getPropertyValue('transform');
        matrixPattern = /matrix\(([^,]+), ([^,]+), ([^,]+), ([^,]+), ([^,]+), ([0-9\.]+)/;
        match = matrixPattern.exec(transform);
        if (match) {
            scaleX = match[1];
            scaleY = match[4];
        }

        this.scale = {
            x: (this.width / this.canvas.clientWidth) * scaleX,
            y: (this.height / this.canvas.clientHeight) * scaleY
        };

        this.shouldRedraw = true;
    };

    proto.bindEvents = function () {
        this.canvas.addEventListener('mousedown', this.mousedown);
        this.canvas.addEventListener('mousemove', this.mousemove);
        this.canvas.addEventListener('mouseup', this.mouseup);
    };

    proto.tick = function () {

    };

    proto.clearFlags = function () {
        delete this.shouldRedraw;
    };

    proto.setCurrentCamera = function (x, y, rangeX, rangeY) {
        var range;
        this.camera = {
            x: x,
            y: y,
            rangeX: rangeX,
            rangeY: rangeY
        };

        range = 1;
        this.bounds = {
            unit: 0.1,
            scale: 1000,
            x: {
                low: x - range / 2,
                high: x + range / 2
            },
            y: {
                low: y - range / 2,
                high: y + range / 2
            }
        };

        this.shouldRedraw = true;
    };

    proto.mousedown = function (event) {
        this.isDragging = true;
        this.drag = {
            initial: {
                x: event.x,
                y: event.y
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
        var scaleX, scaleY;
        if (!this.isDragging) {
            return;
        }
        scaleX = this.drag.scale * this.scale.x;
        scaleY = this.drag.scale * this.scale.y;
        this.setCurrentCamera(this.drag.camera.x + (this.drag.initial.x - event.x) / scaleX,
                              this.drag.camera.y + (this.drag.initial.y - event.y) / scaleY,
                              this.drag.camera.rangeX,
                              this.drag.camera.rangeY);
    };

    proto.mouseup = function (event) {
        this.isDragging = false;
    };
}(Space.prototype));
