'use strict';

const gulp      = require('gulp');
const zip       = require('gulp-zip');

module.exports = function(options) {

    const packageData = require('../package.json');
    const date = new Date();

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    const fileName = `${packageData.name}_${year}-${month}-${day}.zip`;

    return function() {
        return gulp.src(options.src + '/**', {
                dot: true,
            })
            .pipe(zip(fileName))
            .pipe(gulp.dest(options.dest));
    }

}
