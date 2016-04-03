'use strict';

var gulp = require('gulp');

var paths = gulp.paths;

var util = require('util');

var browserSync = require('browser-sync');

var middleware = require('./proxy');

var nodemon = require('gulp-nodemon');

function browserSyncInit(files, browser) {
  browser = browser === undefined ? 'default' : browser;

  browserSync.init(files, {
    proxy: "localhost:3000",
    browser: browser
  });
}

gulp.task('serve', ['set-dev', 'nodemon', 'watch'], function () {
  browserSyncInit([
    paths.tmp + '/serve/{css,components}/**/*.css',
    paths.src + '/{app,components}/**/*.js',
    paths.src + 'src/assets/images/**/*',
    paths.tmp + '/serve/*.html',
    paths.tmp + '/serve/{app,components}/**/*.html',
    paths.src + '/{app,components}/**/*.html'
  ]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit(paths.dist);
});

gulp.task('serve:e2e', ['inject'], function () {
  browserSyncInit([paths.tmp + '/serve', paths.src], null, []);
});

gulp.task('serve:e2e-dist', ['build'], function () {
  browserSyncInit(paths.dist, null, []);
});

gulp.task('nodemon', function (cb) {
  var started = false;

  return nodemon({
    script: paths.src + '/../server/app.js'
  }).on('start', function () {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});