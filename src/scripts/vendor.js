import 'classlist.js';
import es6promise from 'es6-promise';
import raf from 'raf';
import svg4everybody from 'svg4everybody';
import objectFitImages from 'object-fit-images';
import picturefill from 'picturefill';

es6promise.polyfill();
raf.polyfill();
svg4everybody();

// See: https://github.com/bfred-it/object-fit-images/blob/master/detailed-support-tables.md
picturefill();
objectFitImages();

/* eslint-disable */

// Element.matches normalization/polyfill
Element.prototype.matches = Element.prototype.matches ||
  Element.prototype.matchesSelector ||
  Element.prototype.webkitMatchesSelector ||
  Element.prototype.mozMatchesSelector ||
  Element.prototype.msMatchesSelector ||
  Element.prototype.oMatchesSelector ||
  function (elm, selector) {
    const matches = (elm.document || elm.ownerDocument).querySelectorAll(selector);
    let i = matches.length;
    while (--i >= 0 && matches.item(i) !== elm) {}
    return i > -1;
  };

// CustomEvent polyfill from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
(function () {
  if ( typeof window.CustomEvent === 'function' ) {
    return false;
  }
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    let evt = document.createEvent( 'CustomEvent' );
    console.log(params);
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

/* eslint-enable */
