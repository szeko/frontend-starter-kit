const assign = require('lodash/assign');

module.exports = (file, env, nunjucksEnv) => assign(file.data || {}, {
  production: env.production,
  env
});
