var gulp = require('gulp');
var eslint = require('gulp-eslint');
var filter = require('gulp-filter');
var plumber = require('gulp-plumber');

module.exports = function(errorHandler) {

  return function(files) {
    return gulp.src(files)
      .pipe(plumber({
          errorHandler
      }))
      .pipe(filter('**/*.js'))
      .pipe(eslint())
      .pipe(eslint.format('stylish'));
  }

}
