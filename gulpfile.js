'use strict';

var gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    merge = require('merge-stream'),

    tsc  = require('gulp-typescript'),
    jsMin = require('gulp-uglify'),

    imageMin = require('gulp-imagemin'),
    
    paths = {
      vendor: [
        'node_modules/phaser/dist/pixi.js',
        'node_modules/phaser/dist/p2.js',
        'node_modules/phaser/dist/phaser-creature.js',
        'node_modules/systemjs/dist/system-polyfills.js',
        'node_modules/systemjs/dist/system.js'
      ],
      images: 'src/assets/images/**/*.*',
      baseAssets: 'src/assets/*.*',
      ts: 'src/**/*.ts',
      html: 'src/**/*.html'
    };

// Delete dist
gulp.task('clean', () => del('dist/'));

// Copy index.html to dist
gulp.task('html', () => {
  return gulp.src(paths.html).pipe(gulp.dest('dist/'))
});

// Compile typescript to js and move to dist
gulp.task('tsc', () => {
  var tsProject = tsc.createProject('tsconfig.json');

  var tsResult = tsProject.src().pipe(tsc(tsProject));

  return tsResult.js.pipe(gulp.dest('dist/game/'));
});

// Create vendor js files
gulp.task('vendor', () => {
  return gulp.src(paths.vendor)
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest('dist/js/'));
});

gulp.task('images', () => {
  return gulp.src(paths.images)
      .pipe(imageMin())
      .pipe(gulp.dest('dist/assets/images/'));
});

gulp.task('base-assets', () => {
  return gulp.src(paths.baseAssets)
    .pipe(gulp.dest('dist/assets/'));
});

gulp.task('minify', () => {
  var js = gulp.src('dist/**/*.js')
      .pipe(jsMin())
      .pipe(gulp.dest('dist/'));

  return js;
});
    
gulp.task('watch', () => {
  var watchHtml = gulp.watch(paths.html, ['html']),
      watchTs   = gulp.watch(paths.ts, ['tsc']),

      onChanged = (event) => console.log('File ' + event.path + ' was ' +
          event.type + '. Running tasks...');

  watchHtml.on('change', onChanged);
  watchTs.on('change', onChanged);
});

gulp.task('default', ['html', 'tsc', 'vendor', 'images', 'base-assets']);
