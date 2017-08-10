const gulp = require("gulp");
const sass = require("gulp-sass");


gulp.task('styles', function() {
    gulp.src('scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/styles/'));
});

gulp.task('default',function() {
    gulp.watch('scss/**/*.scss',['styles']);
});
