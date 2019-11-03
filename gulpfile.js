const {
  src,
  dest,
  series,
  parallel,
  watch
} = require('gulp');
const clean = require('gulp-clean');
const gulpIf = require('gulp-if');
const sass = require("gulp-sass");
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const svgo = require('gulp-svgo');
const file = require('gulp-file');


const lazysizes = require.resolve('lazysizes');

const ENV_PROD = process.env.ELEVENTY_ENV === 'prod';
const sassPath = 'src/sass/*.scss';
const svgPath = 'src/svg/*.svg';
const jsPath = [
  lazysizes,
  'src/js/**/*.js'
];
const cleanPath = [
  'dist/',
  'site/css/',
  'site/js/'
];


function cleanDevEnv () {
  const options = {
    read: false,
    allowEmpty: true
  };

  return src(cleanPath, options)
    .pipe(gulpIf(!ENV_PROD, clean()));
}

function css () {
  const options = {
    outputStyle: ENV_PROD ? 'compressed' : 'expanded',
  };

  return src(sassPath)
    .pipe(gulpIf(!ENV_PROD, sourcemaps.init()))
      .pipe(sass(options).on('error', sass.logError))
    .pipe(gulpIf(!ENV_PROD, sourcemaps.write()))
    .pipe(dest('site/css'));
};

function js () {
  return src(jsPath)
    .pipe(gulpIf(!ENV_PROD, sourcemaps.init()))
      .pipe(concat('main.js'))
      .pipe(uglify())
    .pipe(gulpIf(!ENV_PROD, sourcemaps.write()))
    .pipe(dest('site/js'));
}

function svg () {
  const options = {
    plugins: [
      { removeTitle: false }
    ]
  };

  return src(svgPath)
    .pipe(svgo(options))
    .pipe(dest('site/svg/'));
}

// touch triggers an 11ty watch in the _includes dir
// waiting for https://github.com/11ty/eleventy/pull/641
function touch () {
  const content = `<html>${Number(new Date())}</html>`;
  return file('touch.html', content, { src: true })
  .pipe(dest('site/_includes'));
};

exports.build = series(cleanDevEnv, parallel(js, css, svg));

exports.clean = cleanDevEnv;

exports.watch = function () {
  const options = { ignoreInitial: false };
  watch(svgPath, options, series(svg, touch));
  watch(sassPath, options, series(css, touch));
  watch(jsPath, options, series(js, touch));
};
