

function SpaceDraw2d () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function (space) {
        this.space = space;
        this.context = space.canvas.getContext('2d');
        this.margin = 20;
    };

    proto.draw = function () {
        this.clear(this.context, this.space);
        this.drawGridlines(this.context, this.space);
        this.drawAxes(this.context, this.space);
    };

    proto.clear = function (context, space) {
        context.clearRect(0, 0, space.width, space.height);
    };

    proto.drawGridlines = function (context, space) {
        var bounds;

        bounds = this.space.bounds;
        context.save();

        context.strokeStyle = "#ccc";
        context.lineWidth = 1;

        context.beginPath();

        this.eachXUnit(space, function (i, x) {
            i = (x - bounds.x.low) * bounds.scale;
            context.moveTo(i, 0);
            context.lineTo(i, space.height);
        });

        this.eachYUnit(space, function(j, y) {
            j = (y - bounds.y.low) * bounds.scale;
            context.moveTo(0, j);
            context.lineTo(space.width, j);
        });

        context.stroke();

        context.restore();
    };

    proto.drawAxes = function (context, space) {
        var unit, bounds;
        var lowX, highX;
        var lowY, highY;
        var i, j;
        var drawMethod;

        bounds = space.bounds;
        unit = bounds.unit;

        lowX = Math.ceil(bounds.x.low / unit) * unit;
        highX = Math.floor(bounds.x.high / unit) * unit;
        lowY = Math.ceil(bounds.y.low / unit) * unit;
        highY = Math.floor(bounds.y.high / unit) * unit;

        i = -bounds.x.low * bounds.scale;
        if (i < 0) {
            drawMethod = this.drawYAxisLeftOff;
        } else if (i < this.margin) {
            drawMethod = this.drawYAxisLeftTransition;
        } else if (i  < this.space.width - this.margin) {
            drawMethod = this.drawYAxisMiddle;
        } else if (i < this.space.width) {
            drawMethod = this.drawYAxisRightTransition;
        } else {
            drawMethod = this.drawYAxisRightOff;
        }
        drawMethod.apply(this, [context, space]);

        j = -bounds.y.low * bounds.scale;
        if (j < 0) {
            drawMethod = this.drawXAxisTopOff;
        } else if (j < this.margin) {
            drawMethod = this.drawXAxisTopTransition;
        } else if (j < this.space.height - this.margin) {
            drawMethod = this.drawXAxisMiddle;
        } else if (j < this.space.height) {
            drawMethod = this.drawXAxisBottomTransition;
        } else {
            drawMethod = this.drawXAxisBottomOff;
        }
        drawMethod.apply(this, [context, space]);
    };

    proto.drawYAxisLeftOff = function (context, space) {};
    proto.drawYAxisLeftTransition = function (context, space) {};
    proto.drawYAxisRightTransition = function (context, space) {};
    proto.drawYAxisRightOff = function (context, space) {};

    proto.drawYAxisMiddle = function (context, space) {
        this.strokeYAxis(context, space);
        this.placeYLabels(context, space,
                          -space.bounds.x.low * space.bounds.scale);
    };


    proto.drawXAxisTopOff = function (context, space) {};
    proto.drawXAxisTopTransition = function (context, space) {};
    proto.drawXAxisBottomTransition= function (context, space) {};
    proto.drawXAxisBottomOff = function (context, space) {};

    proto.drawXAxisMiddle = function (context, space) {
        this.strokeXAxis(context, space);
        this.placeXLabels(context, space,
                          -space.bounds.y.low * space.bounds.scale);
    };

    proto.strokeYAxis = function (context, space) {
        var i, bounds;
        bounds = space.bounds;

        context.save();

        context.strokeStyle = "#000";
        context.lineWidth = 4;

        i = -bounds.x.low * bounds.scale;
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, space.height);

        context.stroke();

        context.restore();
    };

    proto.strokeXAxis = function (context, space) {
        var i, bounds;
        bounds = space.bounds;

        context.save();

        context.strokeStyle = "#000";
        context.lineWidth = 4;

        j = -bounds.y.low * bounds.scale;
        context.beginPath();
        context.moveTo(0, j);
        context.lineTo(space.width, j);

        context.stroke();

        context.restore();
    };

    proto.placeYLabels = function (context, space, i) {
        var self = this;
        var bounds, i, offset;

        bounds = space.bounds;
        context.save();

        context.font = "25px arial";
        offset = 5;

        this.eachYUnit(space, function (j, y) {
            var coord;

            coord = self.coordToText(y, bounds.unit, true);
            context.fillText(coord, i + offset, j - offset);
        });

        context.restore();
    };

    proto.placeXLabels = function (context, space, j) {
        var self = this;
        var bounds, i, offset;
        bounds = space.bounds;

        context.save();

        context.font = "25px arial";
        offset = 5;

        this.eachXUnit(space, function (i, x) {
            var coord;

            coord = self.coordToText(x, bounds.unit, true);
            context.fillText(coord, i + offset, j - offset);
        });

        context.restore();
    };

    proto.coordToText = function (u, unit, isBlankAtOrigin) {
        var coord, places;

        places = 1;
        coord = u.toFixed(places);
        coord = '' + coord;
        if (coord[0] !== '-') {
            coord = ' ' + coord;
        }

        return coord;
    };

    proto.eachXUnit = function (space, callback) {
        var bounds, unit, x, i;

        bounds = space.bounds;
        unit = bounds.unit;

        lowX = Math.ceil(bounds.x.low / unit) * unit;
        highX = Math.floor(bounds.x.high / unit) * unit;

        for (x = lowX - unit; x <= highX; x += unit) {
            i = (x - bounds.x.low) * bounds.scale;
            callback(i, x);
        }
    };

    proto.eachYUnit = function (space, callback) {
        var unit, bounds, y, j;

        bounds = space.bounds;
        unit = bounds.unit;

        lowY = Math.ceil(bounds.y.low / unit) * unit;
        highY = Math.floor(bounds.y.high / unit) * unit;

        for (y = lowY - unit; y <= highY + unit; y += unit) {
            j = (y - bounds.y.low) * bounds.scale;
            callback(j, y);
        }
    };
}(SpaceDraw2d.prototype));
