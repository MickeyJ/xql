const through = require('through2');

module.exports = function(){
    return through.obj(function(file, enc, callback) {
        return callback(null, file)
    })
};