const eleventyLoad = require('eleventy-load');
const loaderRules = require('./loaderRules');
const siteData = require('./site/_data/site');

module.exports = function (eleventyConfig) {
  const isProduction = process.env.NODE_ENV === `production`;

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
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    passthroughFileCopy: true,
    pathPrefix: '/',
    dir: {
      input: 'site',
      data: '_data', // relative to input
      output: 'dist',
    },
  };
};
