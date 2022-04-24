const path = require('path');
const eleventyLoad = require('eleventy-load');
const loaderRules = require('./loaderRules');

const dir = {
  input: 'site',
  data: '_data',
  output: 'dist',
};

module.exports = function (eleventyConfig) {
  const isProduction = process.env.ELEVENTY_ENV === `prod`;
  const siteData = require(path.resolve(dir.input, dir.data, 'site'));

  eleventyConfig.addPlugin(eleventyLoad, {
    rules: loaderRules({
      isProduction,
      obsfuscateValues: [siteData.email, siteData.phone],
    }),
  });

  eleventyConfig.addWatchTarget('./site/sass/');
  eleventyConfig.addWatchTarget('./site/js/');

  eleventyConfig.setTemplateFormats(['md', 'njk']);

  // Static files
  eleventyConfig.addPassthroughCopy('site/icons/');
  eleventyConfig.addPassthroughCopy('site/manifest.json');
  eleventyConfig.addPassthroughCopy('site/svg/');

  // For non-production environments use local-images
  if (isProduction) {
    eleventyConfig.addPassthroughCopy('site/images/');
  } else {
    eleventyConfig.addPassthroughCopy({ 'local-images': 'images/' });
  }

  // CMS UI
  eleventyConfig.addPassthroughCopy('site/admin/');

  // Transform Markdown content
  const markdownIt = require('markdown-it');
  eleventyConfig.setLibrary(
    'md',
    markdownIt({
      html: true, // allow html tags in source
      breaks: true, // convert line-break to <br>
      linkify: true, // auto-convert urls to links (uses linkify-it)
    })
  );

  return {
    dir,
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    passthroughFileCopy: true,
    pathPrefix: '/',
  };
};

module.exports.dir = dir;
