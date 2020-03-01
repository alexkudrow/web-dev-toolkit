'use strict';

var gulp = require('gulp');

var dirs = {
    build: {
        html:    'build',
        scripts: 'build/assets/js',
        styles:  'build/assets/css',
        images:  'build/assets/img',
        assets:  'build'
    },
    src: {
        html:    'src/*.pug',
        scripts: 'src/js/common.js',
        styles:  'src/scss/common.scss',
        images:  'src/img/**/*.*',
        assets:  'src/assets/**/*.*'
    },
    watch: {
        html:    'src/**/*.pug',
        scripts: 'src/js/**/*.js',
        styles:  'src/scss/**/*.scss',
        images:  'src/img/**/*.*',
        assets:  'src/assets/**/*.*'
    },
    clean: './build/',
    tmp: './tmp/',
    revFile: 'rev.json',
};


/*
 * Lazy loading tasks function
 */
function loadTask(taskName, path, options) {
    options = options || {};
    options.taskName = taskName;

    gulp.task(taskName, function(callback) {
        var task = require(path).call(this, options);
        return task(callback);
    })
}

loadTask('clean', './tasks/clean', {
    dest: [dirs.clean, dirs.tmp],
});

loadTask('html', './tasks/html', {
    src: dirs.src.html,
    dest: dirs.build.html,
    tmp: dirs.tmp,
    revFile: dirs.revFile,
});

loadTask('scripts', './tasks/scripts', {
    src: dirs.src.scripts,
    dest: dirs.build.scripts,
    tmp: dirs.tmp,
    revFile: 'scripts-' + dirs.revFile,
});

loadTask('styles', './tasks/styles', {
    src: dirs.src.styles,
    dest: dirs.build.styles,
    tmp: dirs.tmp,
    revFile: 'styles-' + dirs.revFile,
    revImages: 'images-' + dirs.revFile,
});

loadTask('images', './tasks/images', {
    src: dirs.src.images,
    dest: dirs.build.images,
    tmp: dirs.tmp,
    revFile: 'images-' + dirs.revFile,
});

loadTask('assets', './tasks/assets', {
    src: dirs.src.assets,
    dest: dirs.build.assets,
});





loadTask('zip', './tasks/zip', {
    src: dirs.build.html + '/**/*.*',
    dest: dirs.build.html,
});


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


gulp.task('build_zip', gulp.series(
    'build',
    'zip'
));


loadTask('deploy', './tasks/deploy', {
    src: dirs.build.html,
    ftp: require('./ftp_config.json'),
});


loadTask('serve', './tasks/serve', {
    src: dirs.build.html,
});


gulp.task('dev',
    gulp.series(
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
        ))
);


gulp.task('default',
    gulp.series(
        'build'
    )
);
