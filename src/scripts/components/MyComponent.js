import forEach from 'lodash/forEach';
import merge from 'lodash/merge';
import { isMobile } from './utils/utils';

// const $ = window.jQuery;

function init(el, _options) {

	if (!el) {
		return;
	}

	const options = merge({
		classes: {
			active: 'is-active'
		}
	}, _options);

	el.addEventListener('click', (e) => {
		e.preventDefault();
		handleClick();
	});

	function handleClick() {

	}

}

export default {
	init
};
