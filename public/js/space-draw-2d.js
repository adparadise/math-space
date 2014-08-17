

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
        this.drawGridlines(this.context);
        this.drawAxes(this.context);
    };

    proto.drawGridlines = function (context) {
        var self = this;
        context.save();

        context.strokeStyle = "#ccc";
        context.lineWidth = 1;

        context.beginPath();

        bounds = this.space.bounds;
        this.eachXUnit(bounds, function (i, x) {
            i = (x - bounds.x.low) * bounds.scale;
            context.moveTo(i, 0);
            context.lineTo(i, self.space.height);
        });

        this.eachYUnit(bounds, function(j, y) {
            j = (y - bounds.y.low) * bounds.scale;
            context.moveTo(0, j);
            context.lineTo(self.space.width, j);
        });

        context.stroke();

        context.restore();
    };

    proto.drawAxes = function (context) {
        var unit, bounds;
        var lowX, highX;
        var lowY, highY;
        var i, j;
        var drawMethod;

        bounds = this.space.bounds;
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
        drawMethod.apply(this, [context, bounds]);

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
        drawMethod.apply(this, [context, bounds]);

    };

    proto.drawYAxisLeftOff = function (context, bounds) {};
    proto.drawYAxisLeftTransition = function (context, bounds) {};
    proto.drawYAxisRightTransition = function (context, bounds) {};
    proto.drawYAxisRightOff = function (context, bounds) {};

    proto.drawYAxisMiddle = function (context, bounds) {
        this.strokeYAxis(context, bounds);
        this.placeYLabels(context, bounds,
                          -bounds.x.low * bounds.scale);
    };


    proto.drawXAxisTopOff = function (context, bounds) {};
    proto.drawXAxisTopTransition = function (context, bounds) {};
    proto.drawXAxisBottomTransition= function (context, bounds) {};
    proto.drawXAxisBottomOff = function (context, bounds) {};

    proto.drawXAxisMiddle = function (context, bounds) {
        this.strokeXAxis(context, bounds);
        this.placeXLabels(context, bounds,
                          -bounds.y.low * bounds.scale);
    };

    proto.strokeYAxis = function (context, bounds) {
        var i;

        context.save();

        context.strokeStyle = "#000";
        context.lineWidth = 4;

        i = -bounds.x.low * bounds.scale;
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, this.space.height);

        context.stroke();

        context.restore();
    };

    proto.strokeXAxis = function (context, bounds) {
        var i;

        context.save();

        context.strokeStyle = "#000";
        context.lineWidth = 4;

        j = -bounds.y.low * bounds.scale;
        context.beginPath();
        context.moveTo(0, j);
        context.lineTo(this.space.width, j);

        context.stroke();

        context.restore();
    };

    proto.placeYLabels = function (context, bounds, i) {
        var self = this;
        var i, offset;

        context.save();

        context.font = "25px arial";
        offset = 5;

        this.eachYUnit(bounds, function (j, y) {
            var coord;

            coord = self.coordToText(y, bounds.unit, true);
            context.fillText(coord, i + offset, j - offset);
        });

        context.restore();
    };

    proto.placeXLabels = function (context, bounds, j) {
        var self = this;
        var i, offset;

        context.save();

        context.font = "25px arial";
        offset = 5;

        this.eachXUnit(bounds, function (i, x) {
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

    proto.eachXUnit = function (bounds, callback) {
        var unit, x, i;

        unit = bounds.unit;

        lowX = Math.ceil(bounds.x.low / unit) * unit;
        highX = Math.floor(bounds.x.high / unit) * unit;

        for (x = lowX; x < highX; x += unit) {
            i = (x - bounds.x.low) * bounds.scale;
            callback(i, x);
        }
    };

    proto.eachYUnit = function (bounds, callback) {
        var unit, y, j;

        unit = bounds.unit;

        lowY = Math.ceil(bounds.y.low / unit) * unit;
        highY = Math.floor(bounds.y.high / unit) * unit;

        for (y = lowY; y < highY; y += unit) {
            j = (y - bounds.y.low) * bounds.scale;
            callback(j, y);
        }
    };
}(SpaceDraw2d.prototype));
