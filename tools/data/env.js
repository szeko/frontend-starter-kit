var assign = require('lodash/assign');

module.exports = function (file, env, nunjucksEnv) {
	return assign(file.data || {}, {
		production: env.production,
		env: env
	});
};
