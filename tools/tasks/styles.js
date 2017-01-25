var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');

module.exports = function (gulp, env) {

	gulp.task('fonts', function() {
		gulp.src(env.paths.src.fonts)
			.pipe(gulp.dest(env.paths.dist.fonts));
	});

  var init = false;

  function writeEnv() {
    var envFilename = path.join(env.paths.src.styles, '_env.scss');

    var envVars = [
      '$production: ' + env.production + ' !default;'
    ];

    try {
      fs.writeFileSync(envFilename, envVars.join('\n'));
    } catch(e) {
      env.errorHandler({ plugin: 'styles', message: 'Cannot write ' + envFilename });
    }
  }

	gulp.task('styles', function () {

		if (!init) {
      writeEnv();
      init = true;
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
				require('autoprefixer')(env.autoprefixerOptions || {}),
				require('postcss-assets')({
					basePath: env.src,
					loadPaths: [
						path.join(env.src, 'images'),
						path.join(env.src, 'fonts')
					]
				}),
				require('postcss-csso')()
			].concat(env.postcss || [])).on('error', env.errorHandler))
			.pipe(env.production ? gutil.noop() : sourcemaps.write())
			.pipe(gulp.dest(env.paths.dist.styles))
			.pipe(env.browserSync.active ? env.browserSync.stream() : gutil.noop());
	});
};
