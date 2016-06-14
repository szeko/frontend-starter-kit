var fs = require('fs');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var path = require('path');
var isFunction = require('lodash/isFunction');

module.exports = function (gulp, env) {

	gulp.task('fonts', function() {
		gulp.src(env.paths.src.fonts)
			.pipe(gulp.dest(env.paths.dist.fonts));
	});

	gulp.task('styles', function () {

		var envFilename = path.join(env.paths.src.styles, '_env.scss');

		var envVars = [
			'$production: ' + env.production + ' !default;'
		];

		try {
			fs.writeFileSync(envFilename, envVars.join('\n'));
		} catch(e) {
			env.errorHandler({ plugin: 'styles', message: 'Cannot write ' + envFilename });
		}

		return gulp.src(path.join(env.paths.src.styles, '*.scss'))
			.on('error', env.errorHandler)
			.pipe(sourcemaps.init())
			.pipe(sass({
				outputStyle: 'nested',
				includePaths: env.paths.src.stylesVendor || []
			}))
			.on('error', env.errorHandler)
			.pipe(postcss([
				require('autoprefixer')(Object.assign({
					browsers: [
						'last 2 versions',
						'ie 9',
						'iOS >= 8'
					]
				}, env.autoprefixerOptions || {})),
				require('postcss-assets')({
					basePath: env.src,
					loadPaths: [
						path.join(env.src, 'images'),
						path.join(env.src, 'fonts')
					]
				})
			].concat(env.postcss || [])))
			.pipe(cleanCSS())
			.pipe(env.production ? gutil.noop() : sourcemaps.write())
			.pipe(isFunction(env.rename) ? rename(env.rename) : gutil.noop())
			.pipe(gulp.dest(env.paths.dist.styles))
			.pipe(env.browserSync.active ? env.browserSync.stream() : gutil.noop());
	});
};
