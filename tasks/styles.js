'use strict';

const modes = require('../package.json').modes;

const gulp          = require('gulp');
const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');
const sourcemaps    = require('gulp-sourcemaps');
const sass          = require('gulp-sass');
const gulpIf        = require('gulp-if');
const mode          = require('gulp-mode')({ modes: modes });
const postcss       = require('gulp-postcss');
const autoprefixer  = require('autoprefixer');
const cssnano       = require('cssnano');
const rev           = require('gulp-rev');
const revReplace    = require('gulp-rev-replace');
const combine       = require('stream-combiner2').obj;

module.exports = function(options) {

    return function() {
        return gulp.src(options.src)
            .pipe(plumber({
                errorHandler: notify.onError((error) => ({
                    title:   options.taskName,
                    message: error.message,
                })),
            }))
            .pipe(sourcemaps.init())
            .pipe(sass({
                precision: 6,
                outputStyle: 'expanded',
            }))
            .pipe(gulpIf(!mode.development(), combine(
                revReplace({
                    manifest: gulp.src(options.revImages, {allowEmpty: true})
                }),
                postcss([
                    autoprefixer(),
                    cssnano()
                ]),
                rev()
            )))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(options.dest))
            .pipe(gulpIf(!mode.development(), combine(
                rev.manifest(options.revFile),
                gulp.dest(options.tmp)
            )));
    }

}
