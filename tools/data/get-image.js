var path = require('path');
var fs = require('fs');
var glob = require('glob');
var sizeOf = require('image-size');
var isFunction = require('lodash/isFunction');

module.exports = function (file, env, nunjucksEnv) {

	var imagesPath = path.dirname(path.dirname(env.paths.src.images));
	var images = {};

	glob.sync(env.paths.src.images).forEach(function(image) {
		var pathData = path.parse(image);
		var key = path.relative(imagesPath, image);
		var src = path.relative(env.src, image);
		src = isFunction(env.rename) ? env.rename(src) : src;
		images[key] = {
			path: image,
			src: src.replace(/\\/g, '/'),  // fix windows paths
			width: 0,
			height: 0
		};
	});

	nunjucksEnv.addGlobal('getImage', function (filename) {

		var image = images[filename];

		if(!image) {
			return {
				path: '',
				src: '',
				width: 0,
				height: 0
			};
		}

		if(!image.width) {
			var dimensions = sizeOf(image.path);
			image.width = dimensions.width;
			image.height = dimensions.height;
		}

		return image;
	});

	return file.data || {};
};
