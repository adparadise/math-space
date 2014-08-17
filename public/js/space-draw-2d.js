

function SpaceDraw2d () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function (space) {
        this.space = space;
        this.context = space.canvas.getContext('2d');
    };

    proto.draw = function () {
        this.drawGridlines(this.context);
        this.drawAxes(this.context);
    };

    proto.drawGridlines = function (context) {

    };

    proto.drawAxes = function (context) {

    };
}(SpaceDraw2d.prototype));
