'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: '*',
    overridePattern: false,
    rename: {
        'gulp-mode': 'initMode',
    },
});

$.mode = $.initMode();

var combine = require('stream-combiner2').obj;

module.exports = function(options) {

    return function() {
        return gulp.src(options.src)
            .pipe($.plumber({
                errorHandler: $.notify.onError(function(error) {
                    return {
                        title:   options.taskName,
                        message: error.message,
                    }
                }),
            }))
            .pipe($.sourcemaps.init())
            .pipe($.rigger())
            .pipe($.mode.production(combine(
                $.uglify(),
                $.rev()
            )))
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(options.dest))
            .pipe($.mode.production(combine(
                $.rev.manifest(options.revFile),
                gulp.dest(options.tmp)
            )));
    }

}
