


function Space () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function (canvas) {
        this.canvas = canvas;
        this.setCurrentCamera(0,0,1,1);
        this.bakeDims();
    };

    proto.bakeDims = function () {
        var clientWidth, clientHeight;

        clientWidth = this.canvas.clientWidth;
        clientHeight = this.canvas.clientHeight;

        this.width = clientWidth;
        this.height = clientHeight;
        this.canvas.setAttribute('width', clientWidth);
        this.canvas.setAttribute('height', clientHeight);

        this.shouldRedraw = true;
    };

    proto.setCurrentCamera = function (x, y, rangeX, rangeY) {
        this.camera = {
            x: x,
            y: y,
            rangeX: rangeX,
            rangeY: rangeY
        };

        this.shouldRedraw = true;
    };

    proto.tick = function () {

    };

}(Space.prototype));

