const eleventyLoadHtml = require('eleventy-load-html');
const eleventyLoadSass = require('eleventy-load-sass');
const eleventyLoadCss = require('eleventy-load-css');
const eleventyLoadFile = require('eleventy-load-file');
const eleventyLoadJs = require('eleventy-load-js');
const eleventyObfuscate = require('./eleventy-load-obsfuscate');

module.exports = function ({ isProduction, obsfuscateValues }) {
  return [
    {
      test: /\.(html|md|njk)$/,
      loaders: [
        {
          loader: eleventyLoadHtml,
          options: {
            minimize: isProduction ? {} : false,
          },
        },
        {
          loader: eleventyObfuscate,
          options: {
            values: obsfuscateValues,
            enabled: true,
          },
        },
      ],
    },
    {
      test: /\.scss$/,
      loaders: [
        {
          loader: eleventyLoadSass,
          options: {
            sass: {
              outputStyle: isProduction ? 'compressed' : 'expanded',
            },
          },
        },
        {
          loader: eleventyLoadCss,
        },
        {
          loader: eleventyLoadFile,
          options: {
            name: '[hash].css',
          },
        },
      ],
    },
    {
      test: /\.js$/,
      loaders: [
        {
          loader: eleventyLoadJs,
          options: {
            mode: isProduction ? 'production' : 'development',
          },
        },
        {
          loader: eleventyLoadFile,
        },
      ],
    },
  ];
};
