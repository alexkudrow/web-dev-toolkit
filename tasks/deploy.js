'use strict';

const gulp      = require('gulp');
const fs        = require('fs');
const ftp       = require('vinyl-ftp');

module.exports = function(options) {

    return function(callback) {
        if (!fs.existsSync(options.configFileName)) {
            console.error('Error: Ftp config file does not exist:', options.configFileName);
            return callback();
        }

        const ftpConfig = require('../' + options.configFileName);

        var conn = ftp.create({
            host:     ftpConfig.host,
            user:     ftpConfig.user,
            password: ftpConfig.password,
            parallel: 10,
        });

        conn.clean(ftpConfig.path + '/**', options.src);

        return gulp.src(options.src + '/**', {
                dot: true,
                buffer: false,
            })
            .pipe(conn.newerOrDifferentSize(ftpConfig.path))
            .pipe(conn.dest(ftpConfig.path));
    }

}
