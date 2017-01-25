var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var flatten = require('gulp-flatten');
var imagemin = require('gulp-imagemin');
var svgSprite = require('gulp-svg-sprite');

module.exports = function (gulp, env) {

	gulp.task('images.all', function() {
		return  gulp.src([env.paths.src.images, '!' + env.paths.src.sprites])
			.pipe(imagemin([
				imagemin.gifsicle({
					interlaced: true
				}),
				imagemin.jpegtran({
					optimizationLevel: 3,
					progressive: true
				}),
				imagemin.optipng(),
				imagemin.svgo({
					plugins: [
						{ cleanupIDs: false }
					]
				})
			]).on('error', env.errorHandler))
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
