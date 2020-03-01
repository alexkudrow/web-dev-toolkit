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

module.exports = function(options) {
    var current_mode = $.mode.production() ? 'production' : 'development';

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
            .pipe($.pug({
                'pretty': true,
                'basedir': './src',
                'data': {
                    'environment': current_mode,
                },
            }))
            .pipe($.prettyHtml())
            .pipe($.mode.production($.revReplace({
                manifest: gulp.src(options.tmp + '*' + options.revFile, {allowEmpty: true})
            })))
            .pipe(gulp.dest(options.dest));
    }

}
