module.exports = function(eleventyConfig) {


    /* Markdown Plugins */
    let markdownIt = require("markdown-it");
    let options = {
      html: true,
      breaks: true,
      linkify: true
    };
    eleventyConfig.setLibrary("md", markdownIt(options));

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
