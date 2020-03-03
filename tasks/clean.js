'use strict';

const del = require('del');

module.exports = function(options) {
    console.log(process.argv);

    return function() {
        return del(options.src);
    }

}
