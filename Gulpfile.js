// const gulp = require("gulp");
// const sass = require("gulp-sass");
//
//
// gulp.task('styles', function() {
//     gulp.src('scss/style.scss')
//         .pipe(sass().on('error', sass.logError))
//         .pipe(gulp.dest('./public/styles/'));
// });
//
// gulp.task('default',function() {
//     gulp.watch('scss/**/*.scss',['styles']);
// });

const gulp        = require('gulp');
const sass        = require('gulp-sass');
const browserSync = require('browser-sync').create();
const handlebars  = require('gulp-compile-handlebars');
const rename      = require('gulp-rename');


gulp.task('serve', () => {
  browserSync.init({
    proxy: "localhost:3000"

  });
});

gulp.task('styles', function() {
    gulp.src('scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/styles/'));
});

gulp.task('templates', () => {

  gulp.src(["/views/home.hbs"])
    .pipe(handlebars(null))
    .pipe(rename({
      extname: '.html',
    }))
    .pipe(gulp.dest("./"))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch',function() {
    gulp.watch('scss/**/*.scss',['styles']);
});

gulp.task("default", ["serve", "styles", "templates", "watch"]);
