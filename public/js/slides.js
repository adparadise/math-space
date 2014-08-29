

/**
 * A class to manage a series of interactive slides to be shown in
 * sequence.
 */
function Slides () {
    this.initialize.apply(this, arguments);
}

(function (proto) {
    proto.initialize = function (definitions) {
        this.definitions = definitions;
        this.slideStates = {};
    };

    // Assign the DOM element that will contain these slides.
    proto.setSlideElements = function (slideElements) {
        this.slideElements = slideElements;
    };

    // Request that we transition to a specific slide.
    proto.transitionToSlide = function (slideNumber) {
        var slideState;

        if (this.currentSlideNumber) {
            this.scheduleFadeOut(this.slideStates[this.currentSlideNumber]);
        }
        if (!this.slideStates[slideNumber]) {
            this.createSlideState(slideNumber);
        }
        if (!this.currentSlideNumber) {
            this.displayImmediately(this.slideStates[slideNumber]);
        } else {
            this.scheduleFadeIn(this.slideStates[slideNumber]);
        }
        this.currentSlideNumber = slideNumber;
    };

    proto.scheduleFadeOut = function (slideState) {
        if (slideState.definition.isFocused) {
            slideState.definition.defocus();
        }
        slideState.target = 0;
        slideState.direction = -1;
        this.isAnimating = true;
    };

    proto.scheduleFadeIn = function (slideState) {
        if (!slideState.definition.isBound) {
            slideState.definition.bind(slideState.element);
        }
        slideState.target = 1;
        slideState.direction = 1;
        this.isAnimating = true;
    };

    proto.displayImmediately = function (slideState) {
        if (!slideState.definition.isBound) {
            slideState.definition.bind(slideState.element);
        }
        slideState.target = 1;
        slideState.direction = 1;
        slideState.current = 1;
        this.isAnimating = true;
    };

    // Advance the transition animation by a frame if active.
    proto.tick = function () {
        var slideNumber, slideState
        var anyAnimating, isComplete;

        if (!this.isAnimating) {
            return;
        }

        anyAnimating = false;
        for (slideNumber in this.slideStates) {
            if (!this.slideStates.hasOwnProperty(slideNumber)) {
                continue;
            }
            slideState = this.slideStates[slideNumber];
            isComplete = this.advanceSlideState(slideState);
            this.updateSlideDisplay(slideState);
            if (isComplete) {
                if (slideState.target === 0) {
                    this.cleanUp(slideState);
                    delete this.slideStates[slideNumber];
                } else {
                    slideState.definition.focus();
                }
            }
            if (!isComplete) {
                anyAnimating = true;
            }
        }

        if (!anyAnimating) {
            delete this.isAnimating;
        }
    };

    proto.advanceSlideState = function (slideState) {
        var isComplete, direction;

        slideState.current += slideState.direction * 0.016666;
        if (slideState.direction > 0 &&
            slideState.current >= slideState.target) {
            isComplete = true;
            slideState.current = slideState.target;
        } else if (slideState.direction < 0 &&
            slideState.current <= slideState.target) {
            isComplete = true;
            slideState.current = slideState.target;
        }

        return isComplete;
    };

    proto.createSlideState = function (slideNumber) {
        var slideState;

        slideState = {
            slideNumber: slideNumber,
            definition: this.definitions[slideNumber],
            element: document.createElement('div'),
            target: 0,
            current: 0
        };
        this.slideStates[slideNumber] = slideState;
        this.slideElements.main.appendChild(slideState.element);
    }

    proto.cleanUp = function (slideState) {
        slideState.definition.release();
        this.slideElements.main.removeChild(slideState.element);
    };

    proto.updateSlideDisplay = function (slideState) {
        slideState.definition.setTransition(slideState.current);
    };
}(Slides.prototype));

