

function MainView () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function (document) {
        this.document = document;

        this.bind();
        this.createSpace();
        this.createSlides('01-ratios');

        this.tick = this.tick.bind(this);
    };

    proto.start = function () {
        this.tick();
    };

    proto.bind = function () {
        this.canvas = document.getElementsByClassName('main')[0];
        this.slideMain = document.getElementsByClassName('slides')[0];
    };

    proto.createSpace = function () {
        this.space = new Space(this.canvas);
        this.space.start();
        this.spaceDraw = new SpaceDraw2d(this.space);
    };

    proto.createSlides = function (deckName) {
        var self = this;
        var slideElements, slideLoader;

        slideElements = {
            main: this.slideMain,
            space: this.space
        };

        slideLoader = new SlideLoader();
        slideLoader.getSlides(deckName, function (error, slides) {
            var slideElement;
            if (error) {
                console.log(error);
                return;
            }
            self.slides = slides;
            self.slides.setSlideElements(slideElements);

            self.slides.transitionToSlide(0);
        });
    };

    proto.tick = function () {
        this.space.tick();
        if (this.space.shouldRedraw) {
            this.spaceDraw.draw();
        }
        this.space.clearFlags();

        this.slides && this.slides.tick();

        requestAnimationFrame(this.tick);
    };
}(MainView.prototype));
