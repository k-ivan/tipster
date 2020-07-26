export default {
  // From Bootstrap
  getTransitionDurationFromElement(element) {
    if (!element) {
      return 0;
    }

    // Get transition-duration of the element
    let transitionDuration = window.getComputedStyle(element)[
      'transition-duration'
    ];
    let transitionDelay = window.getComputedStyle(element)['transition-delay'];

    const floatTransitionDuration = parseFloat(transitionDuration);
    const floatTransitionDelay = parseFloat(transitionDelay);

    // Return 0 if element or transition duration is not found
    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    }

    // If multiple durations are defined, take the first
    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];

    return (
      (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * 1000
    );
  },
  getBoundingBox(element) {
    const { top, left, right, bottom } = element.getBoundingClientRect();
    return {
      top: top + window.pageYOffset,
      left: left + window.pageXOffset,
      width: right - left,
      height: bottom - top
    };
  }
};