'use strict';

const modes = require('../package.json').modes;

const gulp              = require('gulp');
const plumber           = require('gulp-plumber');
const notify            = require('gulp-notify');
const newer             = require('gulp-newer');
const gulpIf            = require('gulp-if');
const mode              = require('gulp-mode')({ modes: modes });
const imagemin          = require('gulp-imagemin');
const imageminMozjpeg   = require('imagemin-mozjpeg');
const imageminPngquant  = require('imagemin-pngquant');
const rev               = require('gulp-rev');
const combine           = require('stream-combiner2').obj;

module.exports = function(options) {

    return function() {
        return gulp.src(options.src)
            .pipe(plumber({
                errorHandler: notify.onError((error) => ({
                    title:   options.taskName,
                    message: error.message,
                })),
            }))
            .pipe(newer(options.dest))
            .pipe(gulpIf(!mode.development(), imagemin([
                    imagemin.gifsicle({ interlaced: true }),
                    imageminMozjpeg({ quality: 90, progressive: true }),
                    imageminPngquant({ quality: 90 }),
                    imagemin.svgo()
                ])
            ))
            .pipe(gulpIf(!mode.development(), rev()))
            .pipe(gulp.dest(options.dest))
            .pipe(gulpIf(!mode.development(), combine(
                rev.manifest(options.revFile),
                gulp.dest(options.tmp)
            )));
    }

}
