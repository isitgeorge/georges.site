const htmlmin = require("html-minifier");
const CleanCSS = require("clean-css");
const { minify } = require("terser");
const isProd = process.env.CF_PAGES
const pluginDate = require("eleventy-plugin-date");

module.exports = function (eleventyConfig) {
    // eleventyConfig.addPassthroughCopy({
    //     "node_modules/fomantic-ui/dist/semantic.min.css": "assets/semantic.min.css",
    //     "node_modules/fomantic-ui/dist/semantic.min.js": "assets/semantic.min.js",
    //     "node_modules/fomantic-ui/dist/themes/default/assets/fonts/": "assets/themes/default/assets/fonts/",
    // });

    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("favicon");
    // eleventyConfig.addPassthroughCopy("blog/**/*.jpg");
    // eleventyConfig.addPassthroughCopy("help/**/*.jpg");
    // eleventyConfig.addPassthroughCopy("help/**/*.png");
    eleventyConfig.addPassthroughCopy("robots.txt");
    // eleventyConfig.addPassthroughCopy("BingSiteAuth.xml");


    eleventyConfig.addFilter("cssmin", function (code) {
        return new CleanCSS({}).minify(code).styles;
    });

    eleventyConfig.addFilter("jsmin", async function (code) {
        const minified = await minify(code.toString());
        return minified.code;
    });

    if (isProd) {
        eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
            if (outputPath && outputPath.endsWith(".html")) {
                let minified = htmlmin.minify(content, {
                    useShortDoctype: true,
                    removeComments: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: true
                });
                return minified;
            }
            return content;
        });
    }

    eleventyConfig.addPlugin(pluginDate);
};