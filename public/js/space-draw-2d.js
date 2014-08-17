

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
        var unit, bounds;
        var lowX, highX, strideX;
        var lowY, highY, strideY;
        var x, y;
        var i, j;

        bounds = this.space.bounds;
        unit = bounds.unit;

        lowX = Math.ceil(bounds.x.low / unit) * unit;
        highX = Math.floor(bounds.x.high / unit) * unit;
        lowY = Math.ceil(bounds.y.low / unit) * unit;
        highY = Math.floor(bounds.y.high / unit) * unit;

        context.save();

        context.strokeStyle = "#ccc";
        context.lineWidth = 1;

        for (x = lowX; x < highX; x += unit) {
            i = (x - bounds.x.low) * bounds.scale;
            context.moveTo(i, 0);
            context.lineTo(i, this.space.height);
            context.stroke();
        }

        for (y = lowY; y <= highY; y += unit) {
            j = (y - bounds.y.low) * bounds.scale;
            context.moveTo(0, j);
            context.lineTo(this.space.width, j);
            context.stroke();
        }

        context.restore();
    };

    proto.drawAxes = function (context) {

    };
}(SpaceDraw2d.prototype));
