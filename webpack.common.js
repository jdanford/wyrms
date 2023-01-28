const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: path.resolve("./src/index.ts"),
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                    options: {
                        compilerOptions: { incremental: true, tsBuildInfoFile: ".tsbuild" },
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "Wyrms",
            showErrors: false,
        }),
        new MiniCssExtractPlugin({
            filename: "static/[name].[contenthash:8].css",
            chunkFilename: "static/[id].[contenthash:8].css",
        }),
        new FaviconsWebpackPlugin({
            prefix: "static/icons/[fullhash:8]/",
            mode: "light",
            logo: path.resolve("./favicon.png"),
        }),
    ],
    output: {
        filename: "static/[name].[chunkhash:8].js",
        path: path.resolve("./dist"),
        publicPath: "./",
    },
};
