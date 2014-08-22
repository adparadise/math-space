

function SpaceDraw2d () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function (space) {
        this.space = space;
        this.context = space.canvas.getContext('2d');
        this.margin = {
            x: 50,
            y: 25
        };
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
        var rangeLog, unit, opacity;

        rangeLog = Math.round(Math.log(space.bounds.range) / Math.log(10));
        unit = Math.pow(10, rangeLog - 1);
        this.drawUnitGridlines(context, space, unit);
    };

    proto.drawUnitGridlines = function (context, space, unit, opacity) {
        var bounds;

        bounds = this.space.bounds;
        context.save();

        context.strokeStyle = "#ccc";
        context.lineWidth = 1;

        context.beginPath();

        this.eachXUnit(space, unit, function (i, x) {
            i = (x - bounds.x.low) * bounds.scale;
            context.moveTo(i, 0);
            context.lineTo(i, space.height);
        });

        this.eachYUnit(space, unit, function(j, y) {
            j = (y - bounds.y.low) * bounds.scale;
            context.moveTo(0, j);
            context.lineTo(space.width, j);
        });

        context.stroke();

        context.restore();
    };

    proto.drawAxes = function (context, space) {
        var rangeLog, unit, opacity;

        rangeLog = Math.round(Math.log(space.bounds.range) / Math.log(10));
        unit = Math.pow(10, rangeLog - 1);
        this.drawUnitAxes(context, space, space.bounds.unit);
    };

    proto.drawUnitAxes = function (context, space, unit, opacity) {
        var rangeLog, unit, bounds;
        var lowX, highX;
        var lowY, highY;
        var i, j;
        var drawMethod;

        bounds = space.bounds;
        rangeLog = Math.round(Math.log(space.bounds.range) / Math.log(10));
        unit = Math.pow(10, rangeLog - 1);

        lowX = Math.ceil(bounds.x.low / unit) * unit;
        highX = Math.floor(bounds.x.high / unit) * unit;
        lowY = Math.ceil(bounds.y.low / unit) * unit;
        highY = Math.floor(bounds.y.high / unit) * unit;

        i = -bounds.x.low * bounds.scale;
        if (i < 0) {
            drawMethod = this.drawYAxisLeft;
        } else if (i < this.space.width - this.margin.x) {
            drawMethod = this.drawYAxisMiddle;
        } else {
            drawMethod = this.drawYAxisRight;
        }
        drawMethod.apply(this, [context, space, unit]);

        j = -bounds.y.low * bounds.scale;
        if (j < this.margin.y) {
            drawMethod = this.drawXAxisTop;
        } else if (j < this.space.height) {
            drawMethod = this.drawXAxisMiddle;
        } else {
            drawMethod = this.drawXAxisBottom;
        }
        drawMethod.apply(this, [context, space, unit]);
    };

    proto.drawYAxisLeft = function (context, space, unit) {
        this.placeYLabels(context, space, unit, 0);
    };

    proto.drawYAxisMiddle = function (context, space, unit) {
        this.strokeYAxis(context, space);
        this.placeYLabels(context, space, unit, -space.bounds.x.low * space.bounds.scale);
    };

    proto.drawYAxisRight = function (context, space, unit) {
        this.strokeYAxis(context, space);
        this.placeYLabels(context, space, unit, space.width - this.margin.x);
    };

    proto.drawXAxisTop = function (context, space, unit) {
        this.strokeYAxis(context, space);
        this.placeXLabels(context, space, unit, this.margin.y);
    };

    proto.drawXAxisMiddle = function (context, space, unit) {
        this.strokeXAxis(context, space);
        this.placeXLabels(context, space, unit, -space.bounds.y.low * space.bounds.scale);
    };

    proto.drawXAxisBottom = function (context, space, unit) {
        this.placeXLabels(context, space, unit, space.height);
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

    proto.placeYLabels = function (context, space, unit, i) {
        var self = this;
        var bounds, offset;

        bounds = space.bounds;
        context.save();

        context.font = "25px arial";
        offset = 5;

        this.eachYUnit(space, unit, function (j, y) {
            var coord;

            coord = self.coordToText(y, unit, true);
            context.fillText(coord, i + offset, j - offset);
        });

        context.restore();
    };

    proto.placeXLabels = function (context, space, unit, j) {
        var self = this;
        var bounds, offset;
        bounds = space.bounds;

        context.save();

        context.font = "25px arial";
        offset = 5;

        this.eachXUnit(space, unit, function (i, x) {
            var coord;

            coord = self.coordToText(x, unit, true);
            context.fillText(coord, i + offset, j - offset);
        });

        context.restore();
    };

    proto.coordToText = function (u, unit, isBlankAtOrigin) {
        var coord, places;

        places = -Math.floor(Math.log(unit) / Math.log(10));
        coord = u.toFixed(places);
        coord = '' + coord;
        if (coord[0] !== '-') {
            coord = ' ' + coord;
        }

        return coord;
    };

    proto.eachXUnit = function (space, unit, callback) {
        var bounds, x, i;

        bounds = space.bounds;

        lowX = Math.ceil(bounds.x.low / unit) * unit;
        highX = Math.floor(bounds.x.high / unit) * unit;

        for (x = highX + unit; x >= lowX - unit; x -= unit) {
            i = (x - bounds.x.low) * bounds.scale;
            callback(i, x);
        }
    };

    proto.eachYUnit = function (space, unit, callback) {
        var bounds, y, j;

        bounds = space.bounds;

        lowY = Math.ceil(bounds.y.low / unit) * unit;
        highY = Math.floor(bounds.y.high / unit) * unit;

        for (y = highY + unit; y >= lowY - unit; y -= unit) {
            j = (y - bounds.y.low) * bounds.scale;
            callback(j, y);
        }
    };
}(SpaceDraw2d.prototype));
