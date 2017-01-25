import forEach from 'lodash/forEach';
import createScrollTo from './components/ScrollTo';

const init = (selector, callback) => forEach(document.querySelectorAll(selector), callback);


/**
 * Components
 */

init('a[href^="#"]', a => a.addEventListener('click', e => e.preventDefault()));

init('[data-scroll-to], a[href^="#"]', createScrollTo);
