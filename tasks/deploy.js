'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    pattern: '*',
    overridePattern: false,
    rename: {
        'vinyl-ftp': 'ftp',
    },
});

module.exports = function(options) {

    return function() {
        var conn = $.ftp.create({
            host:     options.ftp.host,
            user:     options.ftp.user,
            password: options.ftp.password,
            parallel: 10,
        });

        conn.clean(options.ftp.path + '/**', options.src, {base:  options.ftp.path});

        return gulp.src([
                options.src + '/**',
                options.src + '/.htaccess'
            ], {base: options.src, buffer: false})
            .pipe(conn.newerOrDifferentSize(options.ftp.path))
            .pipe(conn.dest(options.ftp.path));
    }

}
