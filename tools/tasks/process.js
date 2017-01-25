const gutil = require('gulp-util');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const data = require('gulp-data');
const decache = require('decache');
const nunjucks = require('gulp-render-nunjucks');
const nunjucksLib = require('nunjucks');
const assign = require('lodash/assign');
const isFunction = require('lodash/isFunction');
const refresher = require('../utils/refresh');

module.exports = function (gulp, env) {
  const lint = require('../utils/lint')(env.errorHandler);
  const nunjucksEnv = nunjucksLib.configure(
    [path.resolve(env.paths.src.templates)]
      .concat((env.paths.src.templateAssets || []).map(p => path.resolve(p))),
    {
      noCache: true,
      watch: false,
      autoescape: false
    }
  );

  [].concat(env.paths.src.filters).forEach(function (pattern) {
    glob.sync(pattern).forEach(function (filename) {
      const pathData = path.parse(filename);
      nunjucksEnv.addFilter( pathData.name, require(filename) );
    });
  });

  gulp.task('process.lint', function () {
    const paths = [].concat(env.paths.src.data, env.paths.src.filters);
    return lint(paths, env.errorHandler);
  });

  gulp.task('process', ['process.lint'], function () {

    return refresher(gulp.src(
        ['**/*.{nunj,html}'].concat(
          (env.paths.src.templatesExclude || []).map(p => `!${p}/**/*`)
        ),
        { cwd: env.paths.src.templates }
      )
      .pipe(plumber({ errorHandler: env.errorHandler }))
      .pipe(data(function(file) {
        file.data = file.data || {};

        [].concat(env.paths.src.data).forEach(function(pattern) {
          glob.sync(pattern).forEach(function(filename) {
          const pathData = path.parse(filename);

          decache(filename);

          switch(pathData.ext.toLowerCase()) {
            case '.json':
              file.data = assign(file.data, {
                [pathData.name]: require(filename)
              });
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
      .pipe(gulp.dest(env.paths.dist.templates)), env.browserSync);
    });

};
