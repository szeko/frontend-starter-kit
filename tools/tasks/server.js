var path = require('path');
var merge = require('lodash/merge');

module.exports = function (gulp, env) {

  return gulp.task('server', function () {

    var defaultBrowserSyncConfig = {
      server: {
        baseDir: env.dist,
        directory: true
      },
      open: false,
      notify: false,
      ghostMode: {
        clicks: true,
        forms: true,
        scroll: true
      }
    };

    env.browserSync.init(merge(defaultBrowserSyncConfig, env.browserSyncConfig));

  });
};
