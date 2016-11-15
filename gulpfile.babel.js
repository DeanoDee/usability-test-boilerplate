const gulp = require("gulp");
const babel = require("gulp-babel");
const concat = require('gulp-concat-util');
const chokidar = require('chokidar');
const fs = require('fs');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const runSequence = require('run-sequence');

const scripts = './src/js/**/*.js';
const templates = './src/templates/**/*.js';
const lessFiles = './src/less/**/*.less';
import {header} from './src/header/header.js';

const zepto = './node_modules/zepto/src/zepto.js';
const zeptoEvent = './node_modules/zepto/src/event.js';
const dependencies = [zepto, zeptoEvent];

const gutil = require('gulp-util');

let wrappedCSS = null;

const wrapper = {
    header: '(function(){\r',
    footer: '\r})();'
}
const watchFiles = [
    templates,
    scripts,
    lessFiles
];

gulp.task('processCSS', () => {
    return gulp.src(lessFiles)
        .pipe(less())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest("temp"));
});

gulp.task('convertCSSToJSVar', ()=>{
    const cssString = fs.readFileSync('./temp/styles.css', 'utf8').replace(/[\n\r\t]/g, ' ').replace(/\s\s/g, ' ');
    wrappedCSS = `GM_addStyle('${cssString}')
`;
    gutil.log(wrappedCSS);
});

gulp.task("processJS", function () {
    return gulp.src([...dependencies, templates, scripts])
        .pipe(concat.header(wrappedCSS))
        .pipe(concat('script.js'))
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat.header(header() + wrapper.header))
        .pipe(concat.footer(wrapper.footer))
        .pipe(gulp.dest("dist"));
});

gulp.task('build', function () {
  runSequence('processCSS', 'convertCSSToJSVar', 'processJS');
});

gulp.task('default', function () {
  chokidar.watch(watchFiles, { ignored: /[\/\\]\./ }).on('all', function (event, path) {
      console.log(event, path);
      gulp.start('build');
  });
});
