const { src, dest, series, watch } = require('gulp');
const clean = require('gulp-clean');
const gulpIf = require('gulp-if');
const sass = require("gulp-sass");
const sassMaps = require('gulp-sourcemaps');


const ENV_PROD = process.env.ELEVENTY_ENV === 'prod';
const sassPath = 'site/sass/*.scss';
const cleanPath = ['dist/', 'site/css/'];


function cleanTarget () {
  return src(cleanPath, {
      read: false,
      allowEmpty: true
    }).pipe(clean());
}

function css () {
  const options = {
    outputStyle: ENV_PROD ? 'compressed' : 'expanded',
  };

  return src(sassPath)
    .pipe(gulpIf(!ENV_PROD, sassMaps.init()))
    .pipe(sass(options).on('error', sass.logError))
    .pipe(gulpIf(!ENV_PROD, sassMaps.write()))
    .pipe(dest('site/css'));
};


exports.build = ENV_PROD
  ? css
  : series(cleanTarget, css);

exports.watch = function () {
  watch(sassPath, { ignoreInitial: false }, css);
};
