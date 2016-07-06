var gulp = require('gulp');
var mocha = require('gulp-mocha');
var fs = require('fs');

gulp.task('schemas', function() {
    var err = false;
    gulp.
    src('./test-schemas.js').
    pipe(mocha({reporter: 'nyan'})).
    on('error', function() {
        console.log('Tests failed!', error);
        err = true;
        this.emit('end');
    }).
    on('end', function() {
        if (!err) {
            console.log('Tests succeeded!');
            process.exit(0);
        }
    });
});

gulp.task('watch', function() {
    gulp.watch(['./*.js'], ['schemas']);
});
