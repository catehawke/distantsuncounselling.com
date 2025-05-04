const obfuscate = require('./site/_shortcodes/obfuscate');
const eleventySass = require('@11tyrocks/eleventy-plugin-sass-lightningcss');

const dir = {
  input: 'site',
  includes: '_includes',
  data: '_data',
  output: 'dist',
};

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {
  const isProduction = process.env.ELEVENTY_ENV === `prod`;

  eleventyConfig.addWatchTarget('./site/sass/');

  eleventyConfig.setTemplateFormats(['md', 'njk']);

  // Static files
  eleventyConfig.addPassthroughCopy('site/icons/');
  eleventyConfig.addPassthroughCopy('site/manifest.json');
  eleventyConfig.addPassthroughCopy('site/svg/');

  eleventyConfig.addPlugin(eleventySass);

  // Add Nunjucks shortcodes
  eleventyConfig.addNunjucksShortcode('obfuscate', obfuscate);

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
  };
};

module.exports.dir = dir;
