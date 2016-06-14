var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var flatten = require('gulp-flatten');
var imagemin = require('gulp-imagemin');
var svg2png = require('gulp-svg2png');
var filter = require('gulp-filter');
var rename = require('gulp-rename');
var svgSprite = require('gulp-svg-sprite');
var isFunction = require('lodash/isFunction');

module.exports = function (gulp, env) {

	gulp.task('images.all', function() {
		return  gulp.src([env.paths.src.images, '!' + env.paths.src.sprites])
			.pipe(imagemin({
				optimizationLevel: 3,
				progressive: true,
				interlaced: true
			}).on('error', env.errorHandler))
			.pipe(isFunction(env.rename) ? rename(env.rename) : gutil.noop())
			.pipe(gulp.dest(env.paths.dist.images))
			.pipe(env.browserSync.active ? env.browserSync.stream() : gutil.noop())
			.pipe(filter("**/*.svg"))
			.pipe(svg2png())
			.pipe(gulp.dest(env.paths.dist.images))
			.pipe(env.browserSync.active ? env.browserSync.stream() : gutil.noop());
	});

	gulp.task('images.sprites', function () {
		return gulp.src( env.paths.src.sprites )
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: path.join(env.paths.dist.images, 'sprites.svg'),
					bust: false,
					prefix: '%s'
				}
			},
	  svg: {
		transform: [
		  function(svg) {
			// remove viewbox on root svg to allow different icon dimensions
			return svg.replace(/(viewBox="[\d ]+") xmlns/ig, 'xmlns');
		  }
		]
	  }
		}))
	.pipe(flatten())
		.pipe(gulp.dest(env.paths.dist.images))
		.pipe(env.browserSync.active ? env.browserSync.stream() : gutil.noop());
	});

	gulp.task('images', ['images.all', 'images.sprites']);

}
