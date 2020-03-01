'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: '*',
    overridePattern: false,
});

module.exports = function(options) {

    return function() {
        return gulp.src(options.src, {
                dot: true
            })
            .pipe($.plumber({
                errorHandler: $.notify.onError(function(error) {
                    return {
                        title:   options.taskName,
                        message: error.message,
                    }
                }),
            }))
            .pipe($.newer(options.dest))
            .pipe(gulp.dest(options.dest));
    }

}
