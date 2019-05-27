class Tipster {

  constructor(selector = null, position) {

    this.tip = null;
    this.timer = null;

    if(typeof selector === 'string') {
      this.selector = selector;
      this.position = position || 'top';
      this.target = null;
      this.currentElement = null;

      this.onHandler = this.on.bind(this);
      this.offHandler = this.off.bind(this);

      document.body.addEventListener('mouseover', this.onHandler);
      document.body.addEventListener('mouseout', this.offHandler);
    }

  }

  offset(el) {
    const { top, left, width, height } = el.getBoundingClientRect();
    return {
      top: top + window.pageYOffset,
      left: left + window.pageXOffset,
      width,
      height
    }
  }

  on(event) {
    // if(this.currentElement || this.tip) return;
    if(this.currentElement) return;

    this.target = event.target.closest(this.selector);
    if(!this.target) return;
    event.preventDefault();

    this.currentElement = this.target;
    this.target = event.target.closest(this.selector);
    this.show(this.target, this.position);
  }

  off(event) {
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
    // let coords = this.offset(target);
    // const targetWidth = target.offsetWidth;
    const {left, top, width, height} = this.offset(this.target);
    const tipWidth = this.tip.offsetWidth;
    const tipHeight = this.tip.offsetHeight;

    if(left > document.body.clientWidth - width - 30) {
      this.tip.style.right = '15px';
      this.tip.classList.add('tipster--arrow-right');
    }
    else if(left > (tipWidth / 2) ) {
      this.tip.style.left = `${left - (tipWidth / 2) + (width / 2)}px`;
      this.tip.classList.add('tipster--arrow-center');
    }
    else {
      this.tip.style.left = `${left}px`;
      this.tip.classList.add('tipster--arrow-left');
    }

    if(this.position === 'bottom') {
      this.tip.style.top  = `${top + height + 10}px`;
    } else {
      this.tip.classList.add('tipster--arrow-top');
      this.tip.style.top  = `${top - tipHeight - 10}px`;
    }
  }

  show(target, position = 'bottom') {
    if(this.timer) clearTimeout(this.timer);

    if(!this.tip) {
      this.tip = this._create(target);
    } else {
      this.tip.className = 'tipster';
      this.tip.style.cssText = `right: auto; left: auto;`
      this.tip.innerHTML = target.getAttribute('data-tooltip');
    }

    this.delay = parseInt(getComputedStyle(this.tip).transitionDuration, 10);
    this._position(target, position);

    setTimeout(() => {
      // this.tip.style.opacity = 1;
      // this.tip.style.pointerEvents = 'none';
      this.tip.classList.add('is-show');
    }, 0);
  }

  hide() {
    if(!this.tip) return;

    if(this.timer) clearTimeout(this.timer);

    // this.tip.style.opacity = 0;
    this.tip.classList.remove('is-show');

    this.timer = setTimeout(() => {
      document.body.removeChild(this.tip);
      this.tip = null;
    }, this.delay);

  }

  destroy() {
    this.tip = null;
    this.timer = null;
    if(this.selector) {
      this.selector = null;
      this.position = null;
      this.target = null;
      this.currentElement = null;

      document.body.removeEventListener('mouseover', this.onHandler);
      document.body.removeEventListener('mouseout', this.offHandler);
    }
  }

}

export default Tipster