const { merge } = require("webpack-merge");
const path = require("path");

const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: process.env.NODE_ENV || "development",
    devtool: "inline-source-map",
    devServer: {
        host: "0.0.0.0",
        port: 3000,
        static: {
            directory: path.resolve("./dist"),
        },
    },
    output: {
        filename: "static/[name].[chunkhash:8].js",
        path: path.resolve("./dist"),
        publicPath: "/",
    },
});
