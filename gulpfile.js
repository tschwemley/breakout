'use strict';

var gulp = require('gulp'),
    del = require('del'),

    tsc  = require('gulp-typescript'),
    jsMin = require('gulp-uglify'),
    
    paths = {
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
    
