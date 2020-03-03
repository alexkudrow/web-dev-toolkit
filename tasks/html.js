'use strict';

const modes = require('../package.json').modes;

const gulp          = require('gulp');
const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');
const pug           = require('gulp-pug');
const prettyHtml    = require('gulp-pretty-html');
const replace       = require('gulp-replace');
const gulpIf        = require('gulp-if');
const mode          = require('gulp-mode')({ modes: modes });
const revReplace    = require('gulp-rev-replace');
const combine       = require('stream-combiner2').obj;

module.exports = function(options) {
    const currentMode = modes.find(item => mode[item]());

    const baseHref = (process.argv.find(arg => /^--base-href/.test(arg)) || "")
        .split('=')[1];

    const noRootUrls = process.argv.includes('--no-root-urls') || !!baseHref;

    return function() {
        return gulp.src(options.src)
            .pipe(plumber({
                errorHandler: notify.onError(error => ({
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
            .pipe(gulpIf(noRootUrls, combine(
                replace(' href="/', ' href="'),
                replace(' src="/', ' src="'),
            )))
            .pipe(gulpIf(!!baseHref, replace("</head>", `<base href="${baseHref}"></head>`)))
            .pipe(prettyHtml())
            .pipe(gulpIf(!mode.development(), revReplace({
                manifest: gulp.src(options.revFile, { allowEmpty: true })
            })))
            .pipe(gulp.dest(options.dest));
    }

}
