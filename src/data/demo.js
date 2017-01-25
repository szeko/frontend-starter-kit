const pjson = require('../../package.json');

module.exports = (file, env, nunjucksEnv) => Object.assign(file.data || {}, {
  version: pjson.version
});
