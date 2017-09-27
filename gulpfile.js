// include gulp
var gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('watch', function() {
    // Watch .spec.js files
    gulp.watch('lib/**/*.js', ['mocha-debug']);
});

gulp.task('mocha-debug', () => {
    gulp.src('lib/**/*.spec.js')
        .pipe(mocha({debugBrk: true}))
        .once('error', () => {
            process.exit(1);
        })
        .once('end', () => {
            process.exit();
        });
});

// Default Task
gulp.task('default', ['watch']);