'use strict';

var gulp = require('gulp'),
    del = require('del'),
    concat = require('gulp-concat'),
    merge = require('merge-stream'),

    tsc  = require('gulp-typescript'),
    jsMin = require('gulp-uglify'),
    
    paths = {
      vendor: [
        'node_modules/phaser/dist/pixi.js',
        'node_modules/phaser/dist/p2.js',
        'node_modules/phaser/dist/phaser-creature.js',
        'node_modules/systemjs/dist/system-polyfills.js',
        'node_modules/systemjs/dist/system.js'
      ],
      ts: 'src/**/*.ts',
      html: 'src/**/*.html'
    };

gulp.task('clean', () => del('dist/'));

gulp.task('html', () => {
  return gulp.src(paths.html).pipe(gulp.dest('dist/'))
});

gulp.task('tsc', () => {
  let tsProject = tsc.createProject('tsconfig.json');

  let tsResult = tsProject.src().pipe(tsc(tsProject));

  return tsResult.js.pipe(gulp.dest('dist/game/'));
});

gulp.task('vendor', () => {
  return gulp.src(paths.vendor)
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest('dist/js/'));
});

gulp.task('minify', () => {
  let js = gulp.src('dist/**/*.js')
      .pipe(jsMin())
      .pipe(gulp.dest('dist/'));

  return js;
});
    
gulp.task('watch', () => {
  let watchHtml = gulp.watch(paths.html, ['html']),
      watchTs   = gulp.watch(paths.ts, ['tsc']),

      onChanged = (event) => console.log('File ' + event.path + ' was ' +
          event.type + '. Running tasks...');

  watchHtml.on('change', onChanged);
  watchTs.on('change', onChanged);
});

gulp.task('default', ['html', 'tsc', 'vendor']);
