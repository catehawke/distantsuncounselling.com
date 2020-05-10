const { src, dest, parallel, watch } = require('gulp');
const del = require('del');
const gulpIf = require('gulp-if');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const svgo = require('gulp-svgo');

const lazysizes = require.resolve('lazysizes');

const ENV_PROD = process.env.ELEVENTY_ENV === 'prod';
const sassPath = 'src/sass/*.scss';
const svgPath = 'src/svg/*.svg';
const jsPath = [lazysizes, 'src/js/**/*.js'];
const cleanPath = ['dist/', 'site/css/', 'site/js/'];

function css() {
  const options = {
    outputStyle: ENV_PROD ? 'compressed' : 'expanded',
  };

  return src(sassPath)
    .pipe(gulpIf(!ENV_PROD, sourcemaps.init()))
    .pipe(sass(options).on('error', sass.logError))
    .pipe(gulpIf(!ENV_PROD, sourcemaps.write()))
    .pipe(dest('site/css'));
}

function js() {
  return src(jsPath)
    .pipe(gulpIf(!ENV_PROD, sourcemaps.init()))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulpIf(!ENV_PROD, sourcemaps.write()))
    .pipe(dest('site/js'));
}

function svg() {
  const options = {
    plugins: [{ removeTitle: false }],
  };

  return src(svgPath).pipe(svgo(options)).pipe(dest('site/svg/'));
}

exports.build = parallel(js, css, svg);

exports.clean = function () {
  return del(cleanPath);
};

exports.watch = function () {
  const options = { ignoreInitial: false };
  watch(svgPath, options, svg);
  watch(sassPath, options, css);
  watch(jsPath, options, js);
};
