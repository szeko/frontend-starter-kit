const path = require('path');
const glob = require('glob'); // eslint-disable-line import/no-extraneous-dependencies
const sizeOf = require('image-size'); // eslint-disable-line import/no-extraneous-dependencies
const isFunction = require('lodash/isFunction');

module.exports = (file, env, nunjucksEnv) => {
  const imagesPath = path.dirname(path.dirname(env.paths.src.images));
  const images = {};

  glob.sync(env.paths.src.images).forEach((image) => {
    const key = path.relative(imagesPath, image);
    let src = path.relative(env.src, image);
    src = isFunction(env.rename) ? env.rename(src) : src;

    images[key] = {
      path: image,
      src: src.replace(/\\/g, '/'),  // fix windows paths
      width: 0,
      height: 0
    };
  });

  nunjucksEnv.addGlobal('getImage', (filename) => {

    const image = images[filename];

    if (!image) {
      return {
        path: '',
        src: '',
        width: 0,
        height: 0
      };
    }

    if (!image.width) {
      const dimensions = sizeOf(image.path);
      image.width = dimensions.width;
      image.height = dimensions.height;
    }

    image.src = `/assets/${ image.src }`;

    return image;
  });

  return file.data || {};
};
