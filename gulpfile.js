const gulp = require('gulp');
const path = require('path');
const runSequence = require('run-sequence');
const join = path.join.bind(path);

const env = {
  src: join(__dirname, 'src'),
  dist: join(__dirname, 'public'),
  assets: join(__dirname, 'public', 'assets'),
  production: process.argv.indexOf('--production') >= 0,
  browserSync: require('browser-sync').create(),
  browserSyncConfig: {
    middleware: [require('./tools/utils/cors')]
  },
  tools: join(__dirname, 'tools')
};

env.paths = {
  src: {
    styles: join(env.src, 'styles'),
    scripts: join(env.src, 'scripts'),
    fonts: join(env.src, 'fonts', '**/*.{eot,ttf,woff,woff2,css}'),
    images: join(env.src, 'images', '**/*.{svg,png,gif,jpg,ico}'),
    sprites: join(env.src, 'images', 'sprites', '*.svg'),
    templates: path.join(env.src, 'templates'),
    templatesExclude: ['blocks', 'components', 'layouts', 'utils'],
    templateAssets: [
      path.join(env.src, 'images')
    ],
    filters: join(env.tools, 'filters', '*.js'),
    data: [
      join(env.tools, 'data', '*.{js,json}'),
      join(env.src, 'data', '*.{js,json}'),
    ],
    stylesVendor: [
      path.normalize('./node_modules')
    ],
    scriptsVendor: [
      // concat and uglify
    ],
    scriptsExternal: [
      // copy only
    ]
  },
  dist: {
    styles: join(env.assets, 'styles'),
    scripts: join(env.assets, 'scripts'),
    fonts: join(env.assets, 'styles', 'fonts'),
    images: join(env.assets, 'images'),
    templates: env.dist
  }
};

require(join(env.tools, 'tasks'))(gulp, env);

gulp.task('default', (done) => {
  return runSequence(
    'clean',
    ['styles', 'scripts', 'images', 'fonts', 'process'],
    done
  );
});

gulp.task('watch', ['default', 'server'], () => {
  gulp.watch(join(env.paths.src.styles, '**/*.scss'), ['styles']);
  gulp.watch(env.paths.src.images, ['images']);
  gulp.watch([
    path.join(env.paths.src.templates, '**/*.nunj'),
    env.paths.src.data
  ], ['process']);
});

gulp.task('build', (done) => {
  env.production = true;
  return runSequence(
    'default',
    done
  );
});
