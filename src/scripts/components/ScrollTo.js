import merge from 'lodash/merge';
import Jump from 'jump.js';
import { isMobile } from './utils/utils';

const Jumper = new Jump();

function init(el, options) {
	const scrollTarget = el.getAttribute('data-scroll-to');
	const href = el.getAttribute('href');
	const selector = (scrollTarget || href || '').replace('#', '');

	if (!selector) {
		return;
	}

	const target = document.getElementById(selector);

	if (!target) {
		return;
	}

	el.addEventListener('click', (e) => {
		e.preventDefault();
		Jumper.jump(target, merge({
			duration: 600
		}, options));
	});
}

export default {
	init
};
