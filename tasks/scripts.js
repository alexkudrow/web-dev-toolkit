'use strict';

const modes = require('../package.json').modes;

const gulp          = require('gulp');
const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');
const sourcemaps    = require('gulp-sourcemaps');
const rigger        = require('gulp-rigger');
const gulpIf        = require('gulp-if');
const mode          = require('gulp-mode')({ modes: modes });
const uglify        = require('gulp-uglify');
const rev           = require('gulp-rev');
const combine       = require('stream-combiner2').obj;

module.exports = function(options) {

    return function() {
        return gulp.src(options.src)
            .pipe(plumber({
                errorHandler: notify.onError(error => ({
                    title:   options.taskName,
                    message: error.message,
                })),
            }))
            .pipe(sourcemaps.init())
            .pipe(rigger())
            .pipe(gulpIf(!mode.development(), combine(
                uglify(),
                rev()
            )))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(options.dest))
            .pipe(gulpIf(!mode.development(), combine(
                rev.manifest(options.revisonFileName),
                gulp.dest(options.tmp)
            )));
    }

}
