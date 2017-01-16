const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const watch = require('gulp-watch');
const spawn = require('child_process').spawn;
const resolveDependencies = require('gulp-resolve-dependencies');

const CLIENT_JS_PATH = ['src/client/**/*.js', 'src/shared/**/*.js'];

gulp.task('default', () => {
    gulp.start('run');
});

gulp.task('run', callback => {
    spawn('node', ['src/server/server.js'], { stdio: 'inherit' });
});

gulp.task('build', () => {
    const babelTranslate = babel({
        presets: ['es2015'],
    });
    babelTranslate.on('error', error => {
        console.log(error.stack.split('    at')[0]);
        babelTranslate.end();
    });

    const sortByDependencies = resolveDependencies({
      pattern: /\* @requires [\s-]*(.*\.js)/g,
    });
    sortByDependencies.on('error', error => {
        console.log(error.message);
    });

    return gulp
        .src(CLIENT_JS_PATH)
        .pipe(babelTranslate)
        .pipe(sortByDependencies)
        .pipe(concat('client.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
    return watch(CLIENT_JS_PATH, () => {
        gulp.start('build');
    });
});