'use strict';

var gulp = require('gulp');

gulp.task('set-dev', function() {
    return process.env.NODE_ENV = 'dev';
});

gulp.task('set-prod', function() {
    return process.env.NODE_ENV = 'prod';
});