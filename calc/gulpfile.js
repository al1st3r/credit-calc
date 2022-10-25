var gulp = require('gulp');

var crashOnError = true;

function catchCompileError(message) {
  return function (error) {
    console.log(message + ' Error:');
    console.log(error);

    if (!crashOnError) {
      this.emit('end');
    }
  }
}

gulp.task('libraries-js', function () {
  return gulp
    .src(
      [
        'node_modules/object-fit-images/dist/ofi.min.js',
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/jquery-ui-dist/jquery-ui.min.js',
        'node_modules/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js',
      ],
      {base: 'node_modules'}
    )
    .pipe(gulp.dest('./bundles/assets/libs'));
});

gulp.task('libraries-css', function () {
  return gulp
    .src(
      [
      ],
      {base: 'node_modules'}
    )
    .pipe(gulp.dest('./bundles/assets/libs'));
});

gulp.task('libraries-build', ['libraries-js', 'libraries-css']);


gulp.task('css', function () {
  const sass = require('gulp-sass');
  const postcss = require('gulp-postcss');

  return gulp
    .src('./html/style.scss')
    .pipe(sass().on('error', sass.logError))
    .on('error', catchCompileError('SCSS compile error.'))
    .pipe(postcss([
      require('autoprefixer')({grid: true}),
      require('postcss-object-fit-images')
    ]))
    .pipe(gulp.dest('./bundles/assets'));
});

gulp.task('js', ['libraries-build'], function () {
  const concat = require('gulp-concat');
  const babel = require('gulp-babel');

  return gulp.src([
    'script.js',
  ])
    .pipe(concat('components.js', {newLine: '\r\n'}))
    .pipe(babel({
      babelrc: false,
      presets: ['es2015', 'stage-2']
    }))
    .pipe(gulp.dest('./bundles/assets'))
});

gulp.task('watch', function () {
  "use strict";

  // Do not stop watch when error.
  crashOnError = false;

  gulp.watch('./html/**/**.js', ['js']);
  gulp.watch('./html/**/**.scss', ['css']);
});

gulp.task('build', ['libraries-build', 'css', 'js']);
gulp.task('start', ['build', 'watch']);
