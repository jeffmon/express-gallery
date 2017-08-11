
// gulp.task('templates', () => {
//
//   gulp.src(["/views/home.hbs"])
//     .pipe(handlebars(null))
//     .pipe(rename({
//       extname: '.html',
//     }))
//     .pipe(gulp.dest("./"))
//     .pipe(browserSync.reload({stream: true}));
// });

var gulp = require('gulp')
var scss = require('gulp-sass')
var browserSync = require('browser-sync').create()

browserSync.init({
    proxy: 'localhost:3000'
});


gulp.task('scss', function () {
  return gulp.src('./scss/style.scss')
    .pipe(scss())
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('watch', function (){
  gulp.watch('./scss/**/*', ['scss'])
  gulp.watch('./public/**/*').on('change', browserSync.reload);
})

gulp.task('default', ['watch']);
