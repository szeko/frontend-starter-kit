var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
var assign = require('lodash/assign');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

module.exports = function (gulp, env) {

	var lint = require('../utils/lint')(env.errorHandler);

	gulp.task('scripts.main', [], function() {

		var browserifyOptions = assign({}, watchify.args, {
			debug: !env.production,
			fullPaths: false
		});

		var entries = [];
		var bundles = [];

		fs.readdirSync(env.paths.src.scripts).forEach(function(file) {
			if(path.extname(file) === '.js') {
				entries.push(file);
			}
		});

		entries.forEach(function(entry) {
			var options = Object.assign({}, browserifyOptions, {
				entries: [path.join(env.paths.src.scripts, entry)],
			});
			var filename = path.basename(entry);
			var bundler = env.production ? browserify(options) : watchify(browserify(options));
			var bundle = bundleFactory(bundler, filename);

			if(!env.production) {
				bundler.on('update', bundle);
				bundler.on('log', gutil.log);
			}

			bundles.push(bundle);
		});

		function bundleFactory(bundler, filename) {
			return function(changedFiles) {
				var bundleStream = bundler.bundle()
					.on('error', env.errorHandler)
					.pipe(source(filename))
					.pipe(buffer())
					.pipe(sourcemaps.init({ loadMaps: true }))
					.pipe(env.production ? uglify({
						compress: {
							drop_console: env.production,
							drop_debugger: env.production
						}
					}) : gutil.noop())
					.pipe(env.production ? gutil.noop() : sourcemaps.write())
					.pipe(gulp.dest(env.paths.dist.scripts))
					.pipe(env.browserSync.active ? env.browserSync.stream() : gutil.noop());

				if (changedFiles) {
					var lintStream = lint(changedFiles);
					return merge(lintStream, bundleStream);
				}

				return bundleStream;
			}
		}

		return function() {
			bundles.forEach(function(bundle) {
				bundle();
			});
		}();

	});

	gulp.task('scripts.vendor', function() {
		if (!env.paths.src.scriptsVendor) {
			return;
		}

		return gulp.src(env.paths.src.scriptsVendor).on('error', env.errorHandler)
			.pipe(concat(env.paths.dist.scriptsVendor || 'vendor.js'))
			.pipe(uglify({
				preserveComments: 'all'
			}))
			.pipe(gulp.dest(env.paths.dist.scripts));
	});

	gulp.task('scripts.external', function() {
		if (!env.paths.src.scriptsExternal) {
			return;
		}

		return gulp.src(env.paths.src.scriptsExternal).on('error', env.errorHandler)
			.pipe(gulp.dest(env.paths.dist.scriptsExternal || path.join(env.paths.dist.scripts, 'vendor')));
	});

	gulp.task('lint', function() {
		return lint(path.join(env.paths.src.scripts, '**/*.js'));
	});

	gulp.task('scripts', ['scripts.main', 'scripts.vendor', 'scripts.external']);

};
