var path = require('path');
var fs = require('fs');

module.exports = function (gulp, env) {

	env.errorHandler = env.errorHandler || require('../utils/error');
	env.production = typeof env.production === 'undefined' ? process.argv.indexOf('--production') >= 0 : env.production;
	env.browserSync = env.browserSync || require('browser-sync').create();

	fs.readdirSync(__dirname)
		.filter(function (file) {
			return path.extname(file) === '.js' && file !== 'index.js';
		})
		.forEach(function (file) {
			require(path.join(__dirname, file))(gulp, env);
		});
};
