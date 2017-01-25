import merge from 'lodash/merge';

const SOCIAL_POPUP_DEFAULTS = {
  width: 580,
  height: 470,
  data: {
    network: 'data-social',
    width: 'data-popup-width',
    height: 'data-popup-height'
  }
};

class SocialPopup {

  constructor(el, options) {
    this.options = merge({}, SOCIAL_POPUP_DEFAULTS, options || {});

    this.el = el;
    this.url = this.el.getAttribute('href');
    this.network = this.el.getAttribute(this.options.data.network);

    if (this.url.indexOf('mailto') !== -1) {
      return;
    }

    this.options.width = this.el.getAttribute(this.options.data.width) || this.options.width;
    this.options.height = this.el.getAttribute(this.options.data.height) || this.options.height;

    this.el.addEventListener('click', this.popup.bind(this));
  }

  popup(e) {
    e.preventDefault();

    let dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screen.left,
      dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screen.top,

      width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : window.screen.width,
      height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : window.screen.height,

      left = ((width / 2) - (this.options.width / 2)) + dualScreenLeft,
      top = ((height / 3) - (this.options.height / 3)) + dualScreenTop;

    let newWindow = window.open(this.url, 'Share', 'scrollbars=yes, width=' + this.options.width + ', height=' + this.options.height + ', top=' + top + ', left=' + left);

    if (window.focus) {
      newWindow.focus();
    }

  }
}

export default SocialPopup;
