const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: {
        techradar: './src/Radar.js',
        sample: './sample/app.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, "src"),
                    path.resolve(__dirname, "sample")
                ],
                test: /\.js$/
            }
        ]
    },
    plugins: [
        new UglifyJSPlugin(),
        new HtmlWebpackPlugin({
            template: 'sample/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ],
    devtool: "#source-map"
};