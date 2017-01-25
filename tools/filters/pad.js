const padStart = require('lodash/padStart');

module.exports = (str, length, chars) => {
  const l = typeof length === 'undefined' ? 2 : length;
  const c = typeof chars === 'undefined' ? '0' : chars;
  return padStart(str, l, c);
};
