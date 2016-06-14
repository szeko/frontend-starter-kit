var del = require('del');
var path = require('path');

module.exports = function (gulp, env) {
	return gulp.task('clean', function () {
		del.sync(env.dist, {
			force: true
		});
	});
};
