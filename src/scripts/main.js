import forEach from 'lodash/forEach';
import onReady from './components/utils/Ready';
import { isTouchDevice, isMobile, triggerEvent, getParent } from './components/utils/utils';
import SocialPopup from './components/SocialPopup';
import ScrollTo from './components/ScrollTo';
import MyComponent from './components/MyComponent';

document.documentElement.classList.toggle('touch', isTouchDevice());
document.documentElement.classList.toggle('no-touch', !isTouchDevice());

onReady(() => {

	/**
	 * MyComponent
	 */
	forEach(document.querySelectorAll('[data-my-component]'), (el) => MyComponent.init(el));


	/**
	 * Socials
	 */
	forEach(document.querySelectorAll('[data-social]'), (el) => new SocialPopup(el));


	/**
	 * ScrollTo
	 */
	forEach(document.querySelectorAll('[data-scroll-to]'), (el) => ScrollTo.init(el));

});

window.addEventListener('load', () => {

});
