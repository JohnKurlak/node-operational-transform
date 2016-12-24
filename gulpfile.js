const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const watch = require('gulp-watch');

const CLIENT_JS_PATH = 'src/client/**/*.js';

gulp.task('default', () => {
    return gulp
        .src(CLIENT_JS_PATH)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('client.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
    return watch(CLIENT_JS_PATH, () => {
        gulp.start('default');
    });
});