import isFinite from 'lodash/isFinite';
import forEach from 'lodash/forEach';
import isArray from 'lodash/isArray';

export const getBreakpoint = function () {
	return window
		.getComputedStyle(document.body, ':after')
		.getPropertyValue('content')
		.replace(/\"/g, '');
};

export const isIE = function () {
	return document.documentElement.classList.contains('lte9');
};

export const isMobile = function () {
	return getBreakpoint() === 'small';
};

export const isTouchDevice = function () {
	return true === ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch);
};

export const isWindowLoaded = function () {
	return /loaded|complete/.test(document.readyState);
};

export const triggerEvent = function (element, eventName) {
	let event = document.createEvent('Event');
	event.initEvent(eventName, true, true);
	element.dispatchEvent(event);
};

export const slug = function (text) {
	return text.replace(/\d+/g, '').trim().toLowerCase().replace(/\s+/g, '-')
};

export const getWindowHeight = function () {
	return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};

export const getDocumentHeight = function() {
	const body = document.body;
	const html = document.documentElement;

	return Math.max(
		body.scrollHeight,
		body.offsetHeight,
		html.clientHeight,
		html.scrollHeight,
		html.offsetHeight
	);
}

export const getParent = function(element, selector) {
	let p = element.parentNode;

	while (p !== document) {
		if (p.matches(selector)) {
			return p;
		}
		p = p.parentNode;
	}

	return null;
}

export const getOffset = function(element) {
	const rect = element.getBoundingClientRect();
	return {
		top: rect.top + document.body.scrollTop,
		left: rect.left + document.body.scrollLeft
	};
}

export const setTransform = function(els, transform) {
	if (!els) {
		return;
	}

	if (isArray(transform)) {
		transform = transform.join(' ');
	}

	if (!isArray(els)) {
		els = [els];
	}

	forEach(els, (el) => {
		if (!el || !el.style) {
			return;
		}

		el.style.webkitTransform = transform;
		el.style.transform = transform;
	});
}
