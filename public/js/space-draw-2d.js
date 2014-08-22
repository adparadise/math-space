

function SpaceDraw2d () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function (space) {
        this.space = space;
        this.context = space.canvas.getContext('2d');
        this.margin = {
            x: 50,
            y: 0
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
        var i, j;
        var drawMethod;

        bounds = space.bounds;
        rangeLog = Math.round(Math.log(space.bounds.range) / Math.log(10));
        unit = Math.pow(10, rangeLog - 1);

        this.drawYAxis(context, space, unit);
        this.drawXAxis(context, space, unit);
    };

    proto.drawYAxis = function (context, space, unit) {
        var bounds, i, labelPos;

        bounds = space.bounds;

        i = -bounds.x.low * bounds.scale;
        if (i < 0) {
            labelPos = 0;
        } else if (i < this.space.width - this.margin.x) {
            labelPos = i;
        } else {
            labelPos = space.width - this.margin.x;
        }
        this.strokeYAxis(context, space);
        this.placeYLabels(context, space, unit, labelPos);
    }

    proto.drawXAxis = function (context, space, unit) {
        var bounds, j, labelPos;

        bounds = space.bounds;
        j = -bounds.y.low * bounds.scale;
        if (j < this.margin.y) {
            labelPos = this.margin.y;
        } else if (j < this.space.height) {
            labelPos = j;
        } else {
            labelPos = space.height;
        }

        this.strokeXAxis(context, space);
        this.placeXLabels(context, space, unit, labelPos);
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
        var labelMethod;
        labelMethod = this.placeXLabelsHorizontally;
        if (unit < 0.01 || unit > 100) {
            labelMethod = this.placeXLabelsVertically;
        }
        labelMethod.apply(this, [context, space, unit, j]);
    };

    proto.placeXLabelsHorizontally = function (context, space, unit, j) {
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

    proto.placeXLabelsVertically = function (context, space, unit, j) {
        var self = this;
        var bounds, offset;
        bounds = space.bounds;

        context.save();

        context.font = "25px arial";
        offset = 5;
        context.rotate(Math.PI / 2);

        this.eachXUnit(space, unit, function (i, x) {
            var coord;

            coord = self.coordToText(x, unit, true);
            context.fillText(coord, j + offset, -offset - i);
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
