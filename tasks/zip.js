'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

module.exports = function(options) {

    return function() {
        return gulp.src(options.src)
            .pipe($.zip('archive.zip'))
            .pipe(gulp.dest(options.dest));
    }

}
