'use strict';

const modes = require('../package.json').modes;

const gulp          = require('gulp');
const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');
const pug           = require('gulp-pug');
const prettyHtml    = require('gulp-pretty-html');
const gulpIf        = require('gulp-if');
const mode          = require('gulp-mode')({ modes: modes });
const revReplace    = require('gulp-rev-replace');

module.exports = function(options) {
    let currentMode;

    // Get current mode name
    for (let i = 0, length = modes.length; i < length; i++) {
        if (mode[modes[i]]()) {
            currentMode = modes[i];
            break;
        }
    }

    return function() {
        return gulp.src(options.src)
            .pipe(plumber({
                errorHandler: notify.onError((error) => ({
                    title:   options.taskName,
                    message: error.message,
                })),
            }))
            .pipe(pug({
                basedir: options.baseDir,
                data: {
                    'environment': currentMode,
                },
            }))
            .pipe(prettyHtml())
            .pipe(gulpIf(!mode.development(), revReplace({
                manifest: gulp.src(options.revFile, { allowEmpty: true })
            })))
            .pipe(gulp.dest(options.dest));
    }

}
