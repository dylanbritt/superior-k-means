// include gulp
var gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('watch', function() {
    // Watch .spec.js files
    gulp.watch('lib/**/*.js', ['mocha']);
});

gulp.task('mocha', () => {
    gulp.src('lib/**/*.spec.js')
        .pipe(mocha())
        .once('error', () => {
            process.exit(1);
        })
        .once('end', () => {
            process.exit();
        });
});

// Default Task
gulp.task('default', ['watch']);