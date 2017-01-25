var gutil = require('gulp-util');

module.exports = function(error) {
	gutil.beep();

	try {
		gutil.log(
			gutil.colors.bgGreen(error.plugin),
			gutil.colors.bgRed(error.message)
		);
	} catch (e) {
		console.error(error)
	}

	this.emit('end');
};
