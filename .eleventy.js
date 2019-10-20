module.exports = function(eleventyConfig) {
  const ENV_PROD = process.env.ELEVENTY_ENV === 'prod';


  // Static files
  eleventyConfig.addPassthroughCopy("site/css/");

  // Transform Markdown content
  const markdownIt = require("markdown-it");
  const options = {
    html: true, // allow html tags in source
    breaks: true, // convert line-break to <br>
    linkify: true, // auto-convert urls to links (uses linkify-it)
  };
  eleventyConfig.setLibrary("md", markdownIt(options));

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
