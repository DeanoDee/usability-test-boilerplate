const gulp = require("gulp");
const babel = require("gulp-babel");
const concat = require('gulp-concat-util');
const chokidar = require('chokidar');

const scripts = './src/js/**/*.js';
const templates = './src/templates/**/*.js';
import {header} from './src/header/header.js';

const zepto = './node_modules/zepto/src/zepto.js';
const zeptoEvent = './node_modules/zepto/src/event.js';
const dependencies = [zepto, zeptoEvent];

const wrapper= {
    header: '(function(){\r',
    footer: '\r})();'
}
const watchFiles = [
    templates,
    scripts
];

gulp.task("build", function () {
    return gulp.src([...dependencies, templates, scripts])
        .pipe(concat('script.js'))
        .pipe(babel())
        .pipe(concat.header(header() + wrapper.header))
        .pipe(concat.footer(wrapper.footer))
        .pipe(gulp.dest("dist"));
});

gulp.task('dev', function () {
  chokidar.watch(watchFiles, { ignored: /[\/\\]\./ }).on('all', function (event, path) {
    console.log(event, path);
    gulp.start('build');
  });
});

gulp.task('default', ['dev']);
