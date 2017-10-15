const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: "./src/Radar.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'technology-radar.js',
        library: 'technology-radar',
        libraryTarget: 'commonjs2'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, "src")
                ],
                test: /\.js$/
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin()
    ],
    devtool: "#source-map"
};