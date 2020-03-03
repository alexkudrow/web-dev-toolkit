'use strict';

const gulp      = require('gulp');
const plumber   = require('gulp-plumber');
const notify    = require('gulp-notify');
const newer     = require('gulp-newer');

module.exports = function(options) {

    return function() {
        return gulp.src(options.src, {
                dot: true
            })
            .pipe(plumber({
                errorHandler: notify.onError((error) => ({
                    title:   options.taskName,
                    message: error.message,
                })),
            }))
            .pipe(newer(options.dest))
            .pipe(gulp.dest(options.dest));
    }

}
