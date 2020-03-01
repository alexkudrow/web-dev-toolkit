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
            .pipe($.newer(options.dest))
            .pipe($.mode.production(
                    $.imagemin([
                    $.imagemin.gifsicle({"interlaced": true}),
                    $.imageminMozjpeg({"quality": 90, "progressive": true}),
                    $.imageminPngquant({"quality": 90}),
                    $.imagemin.svgo()
                ])
            ))
            .pipe($.mode.production($.rev()))
            .pipe(gulp.dest(options.dest))
            .pipe($.mode.production(combine(
                $.rev.manifest(options.revFile),
                gulp.dest(options.tmp)
            )));
    }

}
