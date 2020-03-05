'use strict';

const gulp = require('gulp');

const dirs = {
    build: {
        html:    'build',                       // Changing this option requires updating .gitignore
        scripts: 'build/assets/js',
        styles:  'build/assets/css',
        images:  'build/assets/img',
        assets:  'build'
    },
    src: {
        html:    'src/html/pages/**/*.pug',
        scripts: 'src/js/common.js',
        styles:  'src/scss/styles.scss',
        images:  'src/img/**/*.*',
        assets:  'src/assets/**/*.*'
    },
    watch: {
        html:    'src/html/**/*.pug',
        scripts: 'src/js/**/*.js',
        styles:  'src/scss/**/*.scss',
        images:  'src/img/**/*.*',
        assets:  'src/assets/**/*.*'
    },
    clean: 'build',
    tmp: 'tmp',                                 // Changing this option requires updating .gitignore
    revFile: 'rev.json',
    ftpConfigFileName: 'ftp_config.json',       // Changing this option requires updating .gitignore
    pugBaseDir: 'src/html',
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
    src: [dirs.clean, dirs.tmp],
});

lazyRequireTask('html', {
    src: dirs.src.html,
    dest: dirs.build.html,
    baseDir: dirs.pugBaseDir,
    tmp: dirs.tmp,
    revFile: dirs.tmp + '/*' + dirs.revFile,
});

lazyRequireTask('scripts', {
    src: dirs.src.scripts,
    dest: dirs.build.scripts,
    tmp: dirs.tmp,
    revFile: 'scripts-' + dirs.revFile,
});

lazyRequireTask('styles', {
    src: dirs.src.styles,
    dest: dirs.build.styles,
    tmp: dirs.tmp,
    revFile: 'styles-' + dirs.revFile,
    revImages: dirs.tmp + '/images-' + dirs.revFile,
});

lazyRequireTask('images', {
    src: dirs.src.images,
    dest: dirs.build.images,
    tmp: dirs.tmp,
    revFile: 'images-' + dirs.revFile,
});

lazyRequireTask('assets', {
    src: dirs.src.assets,
    dest: dirs.build.assets,
});

lazyRequireTask('zip', {
    src: dirs.build.html,
    dest: dirs.build.html,
});

lazyRequireTask('deploy', {
    src: dirs.build.html,
    configFileName: dirs.ftpConfigFileName,
});


lazyRequireTask('serve', {
    src: dirs.build.html,
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
            gulp.watch(dirs.watch.html, gulp.series('html'));
            gulp.watch(dirs.watch.scripts, gulp.series('scripts'));
            gulp.watch(dirs.watch.styles, gulp.series('styles'));
            gulp.watch(dirs.watch.images, gulp.series('images'));
            gulp.watch(dirs.watch.assets, gulp.series('assets'));
        }
    )
));

gulp.task('default', gulp.series(
    'build'
));
