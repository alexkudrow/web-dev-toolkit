'use strict';

var browserSync = require('browser-sync').create();

module.exports = function(options) {

    return function() {
        browserSync.init({
            server: options.src,
            // proxy: 'https://example.loc',
            // https: true,
        });

        browserSync.watch(options.src + '/**/*.*').on('change', browserSync.reload);
    }

}
