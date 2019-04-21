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
    let box = el.getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset,
      left: box.left + window.pageXOffset,
      width: box.width,
      height: box.height
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

  show(target, position = 'bottom') {
    // if(this.tip) return;
    if(this.timer) clearTimeout(this.timer);

    if(!this.tip) {
      this.tip = Object.assign(document.createElement('div'), {
        'className': 'tipster',
        'innerHTML': target.getAttribute('data-tooltip')
      });
      document.body.appendChild(this.tip);
    } else {
      this.tip.className = 'tipster';
      this.tip.style.opacity = 0;
      this.tip.style.right = 'auto';
      this.tip.style.left = 'auto';
      this.tip.innerHTML = target.getAttribute('data-tooltip');
    }

    let coords = this.offset(target);
    let targetWidth = target.offsetWidth;
    let tipWidth = this.tip.offsetWidth;

    if(coords.left > document.body.clientWidth - targetWidth - 30) {
      this.tip.style.right = '15px';
      this.tip.classList.add('tipster--arrow-right');
    }
    else if(coords.left > (tipWidth / 2) ) {
      this.tip.style.left = coords.left - (tipWidth / 2) + (targetWidth / 2) + 'px';
      this.tip.classList.add('tipster--arrow-center');
    }
    else {
      this.tip.style.left = coords.left + 'px';
      this.tip.classList.add('tipster--arrow-left');
    }

    if(position === 'bottom') {
      this.tip.style.top  = coords.top + target.offsetHeight + 10 + 'px';
    } else {
      this.tip.classList.add('tipster--arrow-top');
      this.tip.style.top  = coords.top - this.tip.offsetHeight - 10 + 'px';
    }

    setTimeout(() => {
      this.tip.style.opacity = 1;
      this.tip.style.pointerEvents = 'none';
    }, 10);
  }

  hide() {
    if(!this.tip) return;

    if(this.timer) clearTimeout(this.timer);

    this.tip.style.opacity = 0;

    this.timer = setTimeout(() => {
      document.body.removeChild(this.tip);
      this.tip = null;
    }, 100);

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