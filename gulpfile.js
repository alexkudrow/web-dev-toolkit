'use strict';

const gulp = require('gulp');

const buildDir   = 'build'; // Changing this option requires updating .gitignore
const sourcedDir = 'src';

const options = {
    dirs: {
        tmp: 'tmp',         // Changing this option requires updating .gitignore
        build: {
            html:    buildDir,
            scripts: buildDir + '/assets/js',
            styles:  buildDir + '/assets/css',
            images:  buildDir + '/assets/img',
            assets:  buildDir,
        },
        src: {
            html:    sourcedDir + '/html/pages/**/*.pug',
            scripts: sourcedDir + '/js/scripts.js',
            styles:  sourcedDir + '/scss/styles.scss',
            images:  sourcedDir + '/img/**/*.*',
            assets:  sourcedDir + '/assets/**/*.*',
        },
        watch: {
            html:    sourcedDir + '/html/**/*.pug',
            scripts: sourcedDir + '/js/**/*.js',
            styles:  sourcedDir + '/scss/**/*.scss',
            images:  sourcedDir + '/img/**/*.*',
            assets:  sourcedDir + '/assets/**/*.*',
        },
    },
    revisonFileSuffix: '_rev.json',
    ftpConfigFileName: 'ftp_config.json', // Changing this option requires updating .gitignore
};



function lazyRequireTask(taskName, options) {
    options = options || {};
    options.taskName = taskName;

    gulp.task(taskName, function(callback) {
        const task = require('./tasks/' + taskName).call(this, options);
        return task(callback);
    })
}



/* General tasks declaration
 ******************************************************************************/

lazyRequireTask('clean', {
    src: [
        buildDir,
        options.dirs.tmp,
    ],
});

lazyRequireTask('html', {
    src: options.dirs.src.html,
    dest: options.dirs.build.html,
    tmp: options.dirs.tmp,
    revisonFilesPath: options.dirs.tmp + '/*' + options.dirs.revisonFileSuffix,
});

lazyRequireTask('scripts', {
    src: options.dirs.src.scripts,
    dest: options.dirs.build.scripts,
    tmp: options.dirs.tmp,
    revisonFileName: 'scripts' + options.dirs.revisonFileSuffix,
});

lazyRequireTask('styles', {
    src: options.dirs.src.styles,
    dest: options.dirs.build.styles,
    tmp: options.dirs.tmp,
    revisonFileName: 'styles' + options.dirs.revisonFileSuffix,
    revisonImagesFileName: 'images' + options.dirs.revisonFileSuffix,
});

lazyRequireTask('images', {
    src: options.dirs.src.images,
    dest: options.dirs.build.images,
    tmp: options.dirs.tmp,
    revisonFileName: 'images' + options.dirs.revisonFileSuffix,
});

lazyRequireTask('assets', {
    src: options.dirs.src.assets,
    dest: options.dirs.build.assets,
});

lazyRequireTask('zip', {
    src: options.dirs.build.html,
    dest: options.dirs.build.html,
});

lazyRequireTask('deploy', {
    src: options.dirs.build.html,
    configFileName: options.ftpConfigFileName,
});


lazyRequireTask('serve', {
    src: options.dirs.build.html,
});



/* Сomposed tasks declaration
 ******************************************************************************/

gulp.task('build', gulp.series(
    'clean',
    'images',
    gulp.parallel(
        'scripts',
        'styles',
        'assets'
    ),
    'html'
));

gulp.task('build-zip', gulp.series(
    'build',
    'zip'
));

gulp.task('dev', gulp.series(
    'build',
    gulp.parallel(
        'serve',
        function() {
            gulp.watch(options.dirs.watch.html, gulp.series('html'));
            gulp.watch(options.dirs.watch.scripts, gulp.series('scripts'));
            gulp.watch(options.dirs.watch.styles, gulp.series('styles'));
            gulp.watch(options.dirs.watch.images, gulp.series('images'));
            gulp.watch(options.dirs.watch.assets, gulp.series('assets'));
        }
    )
));

gulp.task('default', gulp.series(
    'build'
));
