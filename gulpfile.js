var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var env = {
	src: path.join(__dirname, 'src'),
	dist: path.join(__dirname, 'public'),
	production: process.argv.indexOf('--production') >= 0,
	browserSync: require('browser-sync').create(),
	// browserSyncConfig: {
	// 	proxy: {
	// 		target: 'localhost:' + env.server.port
	// 	},
	// 	server: null,
	// 	open: false,
	// 	notify: true
	// },
	tools: path.join(__dirname, 'tools')
};

env.paths = {
	src: {
		styles: path.join(env.src, 'styles'),
		scripts: path.join(env.src, 'scripts'),
		fonts: path.join(env.src, 'fonts', '**/*.{eot,ttf,woff,woff2,css}'),
		images: path.join(env.src, 'images', '**/*.{svg,png,gif,jpg,ico}'),
		sprites: path.join(env.src, 'images', 'sprites', '*.svg'),
		templates: path.join(env.src, 'templates'),
		filters: path.join(env.tools, 'filters', '*.js'),
		data: path.join(env.tools, 'data', '*.{js,json}'),
		stylesVendor: [
			path.normalize('./node_modules')
		],
		scriptsVendor: [ // concat and uglify
		],
		scriptsExternal: [ // copy only
		]
	},
	dist: {
		styles: path.join(env.dist, 'styles'),
		scripts: path.join(env.dist, 'scripts'),
		fonts: path.join(env.dist, 'styles', 'fonts'),
		images: path.join(env.dist, 'images'),
		templates: env.dist
	}
};

require(path.join(env.tools, 'tasks'))(gulp, env);

gulp.task('default', function (done) {
	return runSequence(
		'clean',
		['styles', 'scripts', 'images', 'fonts', 'process'],
		done
	);
});

gulp.task('watch', ['default', 'server'], function() {
	gulp.watch(path.join(env.paths.src.styles, '**/*.scss'), ['styles']);
	gulp.watch(env.paths.src.images, ['images']);
	gulp.watch(path.join(env.paths.src.templates, '**/*.nunj'), ['process']);
});

gulp.task('build', function (done) {
	env.production = true;
	return runSequence(
		'clean',
		['styles', 'scripts', 'images', 'fonts', 'process'],
		done
	);
});
