const path = require("path");
const { merge } = require("webpack-merge");

const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    optimization: {
        minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin()],
    },
    output: {
        filename: "static/[name].[chunkhash:8].js",
        path: path.resolve("./dist"),
        publicPath: "./",
    },
});
