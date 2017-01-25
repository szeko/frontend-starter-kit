import forEach from 'lodash/forEach';

function getEvents (events) {
  return typeof events === 'string' ? events.split(' ') : events;
}

export function addEventListeners (el, events, fn) {
  getEvents(events).forEach(e => el.addEventListener(e, fn));
}

export function removeEventListeners (el, events, fn) {
  getEvents(events).forEach(e => el.removeEventListener(e, fn));
}

export function once (el, event, fn) {
  const callback = (e) => {
    e.target.removeEventListener(e.type, callback);
    return fn(e);
  };

  el.addEventListener(event, callback);
}

export function getParameterByName (name, url) {
  const regex = new RegExp(`[?&]${name.replace(/[[]]/g, '\\$&')}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url || window.location.href);

  if (!results) {
    return null;
  }

  if (!results[2]) {
    return '';
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function readPseudo (el, pseudo = 'after') {
  if (['after', 'before'].indexOf(pseudo) === -1) {
    return '';
  }

  const pseudoStyle = window.getComputedStyle ? window.getComputedStyle(el, `:${pseudo}`) : false;

  if (!pseudoStyle) {
    return '';
  }

  return pseudoStyle.getPropertyValue('content').replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g, '');
}

export function readPseudoJSON (el, pseudo = 'after') {
  let json = readPseudo(el, pseudo);

  if (!json) {
    return {};
  }

  try {
    json = JSON.parse(json);
  } catch (err) {
    json = {};
  }

  return json;
}

export function getBreakpoint () {
  return readPseudo(document.body, 'after');
}

export function isMobile () {
  return getBreakpoint() === 'small';
}

export function isTouchDevice () {
  return !!('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch)); // eslint-disable-line no-undef
}

export function isWindowLoaded () {
  return /loaded|complete/.test(document.readyState);
}

export function triggerEvent (element, eventName) {
  const event = document.createEvent('Event');
  event.initEvent(eventName, true, true);
  element.dispatchEvent(event);
}

export function slug (text) {
  return text.replace(/\d+/g, '').trim().toLowerCase().replace(/\s+/g, '-');
}

function getWindowDimension (dimension) {
  return window[`inner${dimension}`] || document.documentElement[`client${dimension}`] || document.body[`client${dimension}`];
}

export const getWindowHeight = () => getWindowDimension('Height');
export const getWindowWidth = () => getWindowDimension('Width');

function getDocumentDimension (dimension) {
  if (!dimension) {
    return null;
  }

  const body = document.body;
  const html = document.documentElement;

  return Math.max(
    body[`scroll${dimension}`],
    body[`offset${dimension}`],
    html[`client${dimension}`],
    html[`scroll${dimension}`],
    html[`offset${dimension}`]
  );
}

export const getDocumentHeight = () => getDocumentDimension('Height');
export const getDocumentWidth = () => getDocumentDimension('Width');

export function getParent (element, selector) {
  let p = element.parentNode;

  while (p !== document) {
    if (p.matches(selector)) {
      return p;
    }
    p = p.parentNode;
  }

  return null;
}

export function getOffset (element) {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + document.body.scrollTop,
    left: rect.left + document.body.scrollLeft
  };
}

export function getInView (el) {
  const windowHeight = getWindowHeight();
  const { top, bottom } = el.getBoundingClientRect();
  const vBottom = bottom < windowHeight ? bottom : windowHeight;
  return Math.max(0, top > 0 ? Math.min(el.offsetHeight, windowHeight - top) : vBottom);
}

export function getScrollTop (step) {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
}

export function setTransform (elements, transform) {
  if (!elements) {
    return;
  }

  const transformString = [].concat(transform).join(' ');

  forEach(elements.length ? elements : [elements], (el) => {
    if (!el || !el.style) {
      return;
    }

    el.style.webkitTransform = transformString;
    el.style.transform = transformString;
  });
}
