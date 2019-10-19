const { src, dest, watch } = require('gulp');
const clean = require('gulp-clean');
const gulpIf = require('gulp-if');
const sass = require("gulp-sass");
const sassMaps = require('gulp-sourcemaps');


const ENV_PROD = process.env.ELEVENTY_ENV === 'prod';
const sassPath = 'site/sass/*.scss';
const cleanPath = ['dist/', 'site/css/'];


function css () {
  const options = {
    outputStyle: ENV_PROD ? 'compressed' : 'expanded',
  };

  return src(sassPath)
    .pipe(gulpIf(ENV_PROD, sassMaps.init()))
    .pipe(sass(options).on('error', sass.logError))
    .pipe(gulpIf(ENV_PROD, sassMaps.write()))
    .pipe(dest('site/css'));
};

exports.build = css;
exports.watch = function () {
  watch(sassPath, { ignoreInitial: false }, css);
};
exports.clean = function () {
  return src(cleanPath, { read: false, allowEmpty: true })
    .pipe(clean());
}
