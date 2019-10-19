const { src, dest, watch } = require('gulp');
const sass = require("gulp-sass");
const sassMaps = require('gulp-sourcemaps');


const ENV_PROD = process.env.ELEVENTY_ENV === 'prod';
const sassPath = 'site/sass/*.scss';


function css () {
  const destPath = 'site/css';
  const options = {
    outputStyle: ENV_PROD ? 'compressed' : 'expanded',
  };

  if (ENV_PROD) {
    return src(sassPath)
      .pipe(sass(options).on('error', sass.logError))
      .pipe(dest(destPath));
  }
  return src(sassPath)
    .pipe(sassMaps.init())
    .pipe(sass(options).on('error', sass.logError))
    .pipe(sassMaps.write())
    .pipe(dest(destPath));
};

exports.build = css;
exports.watch = function () { watch(sassPath, { ignoreInitial: false }, css) }
