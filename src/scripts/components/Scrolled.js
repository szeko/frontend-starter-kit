import merge from 'lodash/merge';
import { EventEmitter } from 'events';
import { getScrollTop } from './utils/utils';
import forEach from 'lodash/forEach';
import isFunction from 'lodash/isFunction';

const MODULE_NAME = 'Scrolled';

/**
 * Scrolled class default options
 * @type {Object}
 */
const SCROLLED_DEFAULTS = {
  selectors: {
  },
  classes: {
    scrolled: 'has-scrolled'
  },
  events: ['load', 'scroll', 'resize', 'touchmove'],
  threshold: 0
};

/**
 * Scrolled class errors
 * @type {Object}
 */
const SCROLLED_ERRORS = {
  NO_ELEMENT: MODULE_NAME + ': element not found'
};

/**
 * Scrolled class events
 * @type {Object}
 */
const SCROLLED_EVENTS = {
  SCROLLED: 'scrolled',
  UNSCROLLED: 'unscrolled'
};

class Scrolled extends EventEmitter {

  /**
   * Scrolled element module
   * @param  {Object} options Options
   */
  constructor(options) {
    super();

    this.options = merge({}, SCROLLED_DEFAULTS, options);

    this.scrolled = null;

    forEach(this.options.events, (e) => {
      window.addEventListener(e, this.listener.bind(this));
    });

    // init check
    this.listener();
  }

  listener() {
    if(this.handler) {
      window.cancelAnimationFrame(this.handler);
    }
    this.handler = window.requestAnimationFrame(this.check.bind(this));
  }

  /**
   * Check if the user has scrolled
   */
  check() {
    var scrollTop = this.getScrollTop(),
      scrolled = scrollTop > (isFunction(this.options.threshold) ? this.options.threshold() : this.options.threshold);

    if(scrolled !== this.scrolled) {
      document.documentElement.classList.toggle(this.options.classes.scrolled, scrolled);
      this.scrolled = scrolled;
      this.emit( scrolled ? SCROLLED_EVENTS.SCROLLED : SCROLLED_EVENTS.UNSCROLLED, document.body);
    }
  }

  /**
   * Get document scroll position
   * @return {Number} Y scroll position
   */
  getScrollTop() {
    return getScrollTop();
  }

  /**
   * Is scrolled
   * @return {Boolean} Whether the page is scrolled
   */
  isScrolled() {
    return this.scrolled;
  }

}

export default Scrolled;
