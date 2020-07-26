import './tipster.css';
import './polyfill';
import Utils from './utils';

class Tipster {
  constructor(selector = null, options) {
    if (!selector || typeof selector !== 'string') return false;

    this.selector = selector;
    this.options = {
      placement: 'top',
      arrowSize: 16,
      ...options
    };

    this.tip = null;
    this.timer = null;
    this.target = null;
    this.currentElement = null;

    this.mouseoverHandler = this.mouseoverHandler.bind(this);
    this.mouseoutHandler = this.mouseoutHandler.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
    document.body.addEventListener('mouseover', this.mouseoverHandler);
    document.body.addEventListener('mouseout', this.mouseoutHandler);
    window.addEventListener('resize', this.resizeHandler);
  }

  mouseoverHandler(event) {
    if(this.currentElement) return;

    this.target = event.target.closest(this.selector);
    if(!this.target) return;
    event.preventDefault();

    this.currentElement = this.target;
    this.target = event.target.closest(this.selector);
    this.show();
  }

  mouseoutHandler(event) {
    if (!this.currentElement || !this.tip) return;
    let relatedTarget = event.relatedTarget;
    if(relatedTarget) {
      while(relatedTarget) {
        if(relatedTarget === this.currentElement) return;
        relatedTarget = relatedTarget.parentNode;
      }
    }
    this.currentElement = null;
    this.hide();
  }

  resizeHandler() {
    if (!this.tip) return;
    // when zooming, there is a time when the hint will be reset
    // but the position method will have time to start
    try {
      this.position();
    } catch(err) {}
  }

  create() {
    this.tip = document.createElement('div');
    this.tip.classList.add('tipster');
    this.tipText = document.createElement('div');
    this.tipText.classList.add('tipster__text');
    this.tipArrow = document.createElement('div');
    this.tipArrow.classList.add('tipster__arrow');

    this.tip.appendChild(this.tipText);
    this.tip.appendChild(this.tipArrow);
    document.body.appendChild(this.tip);
  }

  position() {
    const {
      left: targetLeft,
      top: targetTop,
      width: targetWidth,
      height: targetHeight
    } = Utils.getBoundingBox(this.target);

    const root = document.documentElement;
    const tipWidth = this.tip.offsetWidth;
    const tipHeight = this.tip.offsetHeight;
    const hasTopOverflow = (targetTop - targetHeight - tipHeight) < window.pageYOffset;
    const hasBottomOverflow = (targetTop + targetHeight + tipHeight) > (root.clientHeight + window.pageYOffset);
    const hasRightOverflow = targetLeft + (targetWidth / 2) + (tipWidth / 2) > root.clientWidth + window.pageXOffset;

    // Coordinates for hint
    let tipY = 0;
    let tipX = 0;
    // Coordinates for arrow, horizontal only
    let arrowX = 0;

    // Horizontal position
    if(hasRightOverflow) {
      tipX = (targetLeft + targetWidth) - tipWidth;
      // if there is not enough width to fit the screen
      // the hint goes to the left off the screen
      // fix the tooltip to the available width
      if (tipX < 0) {
        tipX = 0;
        arrowX = (targetLeft + (targetWidth / 2)) - this.options.arrowSize / 2;
      } else {
        const _arrowX = (tipWidth - ((targetWidth / 2) + this.options.arrowSize / 2));
        arrowX = (_arrowX + this.options.arrowSize >= tipWidth) ? tipWidth - this.options.arrowSize : _arrowX;
      }
    }
    else if(targetLeft > (tipWidth / 2)) {
      tipX = targetLeft - (tipWidth / 2) + (targetWidth / 2);
      arrowX = (tipWidth / 2) - (this.options.arrowSize / 2);
    }
    else {
      // if there is not enough width to fit the screen
      // the hint goes to the right off the screen
      // fix the tooltip to the available width
      if (targetLeft + tipWidth > root.clientWidth) {
        tipX = 0;
        arrowX = targetLeft + (targetWidth / 2) - (this.options.arrowSize / 2);
      } else {
        tipX = targetLeft;
        arrowX = (targetWidth / 2) - (this.options.arrowSize / 2);
      }
    }

    // Vertical position
    if((this.options.placement === 'bottom' && !hasBottomOverflow) || hasTopOverflow) {
      tipY = targetTop + targetHeight + this.options.arrowSize / 2;
      this.tip.setAttribute('data-placement', 'bottom');
    } else {
      tipY  = targetTop - tipHeight - this.options.arrowSize / 2;
      this.tip.setAttribute('data-placement', 'top');
    }

    this.tip.style.cssText = `
      transform: translate(${tipX}px, ${tipY}px);
      left: 0;
      top: 0;
      right: auto;
      bottom: auto;
    `;
    this.tipArrow.style.transform = `translateX(${arrowX}px)`;
  }

  show() {
    if(this.timer) clearTimeout(this.timer);

    if(!this.tip) {
      this.create();
    } else {
      this.tip.className = 'tipster';
    }

    this.delay = Utils.getTransitionDurationFromElement(this.tip);
    this.tipText.innerHTML = this.target.getAttribute('data-tooltip');
    this.position();

    setTimeout(() => {
      this.tip.classList.add('is-show');
    }, 0);
  }

  hide() {
    if(!this.tip) return;

    if(this.timer) clearTimeout(this.timer);

    this.tip.classList.remove('is-show');

    this.timer = setTimeout(() => {
      document.body.removeChild(this.tip);
      this.tip = null;
    }, this.delay);
  }

  destroy() {
    document.body.removeEventListener('mouseover', this.mouseoverHandler);
    document.body.removeEventListener('mouseout', this.mouseoutHandler);
    window.removeEventListener('resize', this.resizeHandler);

    if (this.tip) {
      document.body.removeChild(this.tip);
    }
    if(this.timer) clearTimeout(this.timer);


    Object.keys(this).forEach(key => {
      delete this[key];
    });
  }
}

export default Tipster;
