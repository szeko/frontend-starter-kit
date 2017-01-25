function get (key) {
  const nameEQ = encodeURIComponent(key) + '=';
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    const c = ca[i];

    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }

    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }

  return null;
}

function set (key, value, days) {
  let expires = '';

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toGMTString()}`;
  }

  document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}${expires}; path=/`;
}

function erase (key) {
  this.set(key, '', -1);
}

export default {
  get,
  set,
  erase
};
