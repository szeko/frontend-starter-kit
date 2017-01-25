import merge from 'lodash/merge';
import Jump from 'jump.js';

export default function createScrollTo (el, options) {
  if (!el) {
    return;
  }

  const scrollTarget = el.getAttribute('data-scroll-to');
  const selector = (scrollTarget || el.hash || '').replace('#', '');

  if (!selector) {
    return;
  }

  const target = document.getElementById(selector);

  if (!target) {
    return;
  }

  el.addEventListener('click', (e) => {
    e.preventDefault();
    Jump(target, merge({
      duration: 600
    }, options));
  });
}
