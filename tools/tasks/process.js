var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var data = require('gulp-data');
var nunjucks = require('gulp-render-nunjucks');
var nunjucksLib = require('nunjucks');
var runSequence = require('run-sequence');
var assign = require('lodash/assign');

module.exports = function (gulp, env) {

	var lint = require('../utils/lint')(env.errorHandler);

	var nunjucksEnv = nunjucksLib.configure(
		path.resolve(env.paths.src.templates),
		{
			noCache: true,
			watch: false
		}
	);

	[].concat(env.paths.src.filters).forEach(function(pattern) {
	  glob.sync(pattern).forEach(function(filename) {
		var pathData = path.parse(filename);
		nunjucksEnv.addFilter( pathData.name, require(filename) );
	  });
	});

	gulp.task('process.lint', function() {
	  var paths = [].concat(env.paths.src.data, env.paths.src.filters);
	  return lint(paths, env.errorHandler);
	});

	gulp.task('process', ['process.lint'], function() {

	  return gulp.src('*.nunj', { cwd: env.paths.src.templates })
		.pipe(plumber({
			errorHandler: env.errorHandler
		}))
		.pipe(data(function(file) {

			file.data = file.data || {};

			[].concat(env.paths.src.data).forEach(function(pattern) {
			  glob.sync(pattern).forEach(function(filename) {
				var pathData = path.parse(filename);

				switch(pathData.ext.toLowerCase()) {
				  case '.json':
					file.data = assign(file.data, require(filename));
					break;
				  case '.js':
					file.data = require(filename)(file, env, nunjucksEnv);
					break;
				}
			  });
			});

		}))

		.pipe(nunjucks.render())
		.pipe(rename({ extname: '.html' }))
		.pipe(gulp.dest(env.paths.dist.templates))
		.pipe(env.browserSync.active ? env.browserSync.stream() : gutil.noop());
	});

};
