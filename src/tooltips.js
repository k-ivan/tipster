import './polyfill';
import Utils from './utils';
class Tipster {
  constructor(selector = null, position) {
    if (!selector) return false;
    if (typeof selector !== 'string') return false;

    this.selector = selector;
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
      'className': 'tipster'
    });
    document.body.appendChild(tip);
    return tip;
  }

  _position() {
    const {
      left: targetLeft,
      top: targetTop,
      width: targetWidth,
      height: targetHeight
    } = Utils.getBoundingBox(this.target);

    const tipWidth = this.tip.offsetWidth;
    const tipHeight = this.tip.offsetHeight;

    if(targetLeft + (targetWidth / 2) + (tipWidth / 2) > document.body.clientWidth) {
      this.tip.style.left = `${(targetLeft + targetWidth) - tipWidth}px`;
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
      this.tip.style.top  = `${targetTop - tipHeight - 10}px`;
    }
  }

  show() {
    if(this.timer) clearTimeout(this.timer);

    if(!this.tip) {
      this.tip = this._create();
    } else {
      this.tip.className = 'tipster';
      this.tip.style.left = ''
      this.tip.style.right = ''
    }

    this.delay = Utils.getTransitionDurationFromElement(this.tip);
    this.tip.innerHTML = this.target.getAttribute('data-tooltip');
    this._position();

    setTimeout(() => {
      this.tip.classList.add('is-show');
    }, 20);
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

    if (this.tip) {
      document.body.removeChild(this.tip);
    }
    if(this.timer) clearTimeout(this.timer);


    Object.keys(this).forEach(key => {
      delete this[key]
    })

  }

}

export default Tipster
