var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');

function errorHandler(error) {
	gutil.beep();

	try {
		gutil.log(
			gutil.colors.bgGreen(error.plugin),
			gutil.colors.bgRed(error.message.replace(/\r?\n|\r/g, ''))
		);
	} catch (e) {
		console.error(error)
	}

	this.emit('end');
}

module.exports = function (gulp, env) {

	env.errorHandler = env.errorHandler || errorHandler;
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
