import './polyfill';
import Utils from './utils';
class Tipster {

  constructor(selector = null, position) {
    if (!selector) return false;

    if (typeof selector === 'string') {
      this.selector = document.querySelector(selector);
    } else {
      this.selector = selector;
    }

    if (!(this.selector instanceof Element)) {
      return false;
    }

    this.position = position || 'top';
    this.tip = null;
    this.timer = null;
    this.target = null;
    this.currentElement = null;

    this.mouseoverHandler = this.mouseoverHandler.bind(this);
    this.mouseoutHandler = this.mouseoutHandler.bind(this);
    document.body.addEventListener('mouseover', this.mouseoverHandler);
    document.body.addEventListener('mouseout', this.mouseoutHandler);
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

  _create() {
    const tip = Object.assign(document.createElement('div'), {
      'className': 'tipster',
      'innerHTML': this.target.getAttribute('data-tooltip')
    });
    document.body.appendChild(tip);
    return tip;
  }

  _position() {
    const {
      targetLeft: left,
      targetTop: top,
      targetWidth: width,
      targetHeight: height
    } = Utils.getBoundingBox(this.target);

    const tipWidth = this.tip.offsetWidth;
    const tipHeight = this.tip.offsetHeight;

    if(targetLeft > document.body.clientWidth - targetWidth - 30) {
      this.tip.style.right = '15px';
      this.tip.classList.add('tipster--arrow-right');
    }
    else if(targetLeft > (tipWidth / 2) ) {
      this.tip.style.left = `${targetLeft - (tipWidth / 2) + (targetWidth / 2)}px`;
      this.tip.classList.add('tipster--arrow-center');
    }
    else {
      this.tip.style.left = `${targetLeft}px`;
      this.tip.classList.add('tipster--arrow-left');
    }

    if(this.position === 'bottom') {
      this.tip.style.top  = `${targetTop + targetHeight + 10}px`;
    } else {
      this.tip.classList.add('tipster--arrow-top');
      this.tip.style.top  = `${targetTop - targetTipHeight - 10}px`;
    }
  }

  show() {
    if(this.timer) clearTimeout(this.timer);

    if(!this.tip) {
      this.tip = this._create();
    } else {
      this.tip.className = 'tipster';
      this.tip.style.cssText = `right: auto; left: auto;`
    }

    this.delay = Utils.getTransitionDurationFromElement(this.tip);
    this._position();

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
    Object.keys(this).forEach(key => {
      delete this[key]
    })
    document.body.removeEventListener('mouseover', this.onHandler);
    document.body.removeEventListener('mouseout', this.offHandler);
  }

}

export default Tipster
