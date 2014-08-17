


function Space () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function (canvas) {
        this.canvas = canvas;
        this.bakeDims();

        this.setCurrentCamera(-0.5, -0.5, 1, 1);
    };

    proto.bakeDims = function () {
        this.width = this.canvas.getAttribute('width');
        this.height = this.canvas.getAttribute('height');

        this.shouldRedraw = true;
    };

    proto.setCurrentCamera = function (x, y, rangeX, rangeY) {
        this.camera = {
            x: x,
            y: y,
            rangeX: rangeX,
            rangeY: rangeY
        };

        this.bounds = {
            unit: 0.1,
            scale: 1000,
            x: {
                low: -0.5,
                high: 0.5
            },
            y: {
                low: -0.5,
                high: 0.5
            }
        };
    };

    proto.tick = function () {

    };

}(Space.prototype));

