const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const UglifyJS = require("uglify-js");


module.exports = function(eleventyConfig) {
  const ENV_PROD = process.env.ELEVENTY_ENV === 'prod';


  // Static files
  eleventyConfig.addPassthroughCopy("site/css/");
  eleventyConfig.addPassthroughCopy("site/js/");

  // Transform Markdown content
  const markdownIt = require("markdown-it");
  eleventyConfig.setLibrary("md", markdownIt({
    html: true, // allow html tags in source
    breaks: true, // convert line-break to <br>
    linkify: true, // auto-convert urls to links (uses linkify-it)
  }));

  // Lazy-load images
  eleventyConfig.addPlugin(lazyImagesPlugin, {
    //imgSelector: '.post-content img', // custom image selector
    //cacheFile: '', // don't cache results to a file
  });

  // minify the html output
  const htmlmin = require("html-minifier");
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if( outputPath.endsWith(".html") ) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: false, // comments identify the excerpt split marker?
        collapseWhitespace: ENV_PROD,
      });
    }
    return content;
  });

  return {
    templateFormats : ["njk", "md"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk",
    passthroughFileCopy: true,
    pathPrefix: "/",
    dir: {
      input: "site",
      data: "site/_data",
      output: "dist"
    }
  };
}
