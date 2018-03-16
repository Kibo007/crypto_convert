const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const baseConfig = require('./base.config.js');

const BUILD_DIR = path.resolve(__dirname, '../dist');

module.exports = merge(baseConfig, {
    output: {
        path: BUILD_DIR,
        filename: '[name].bundle.[chunkhash].js'
    },

    plugins: [
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
        // Extract imported CSS into own file
        new ExtractTextPlugin('[name].bundle.[chunkhash].css'),
        // Minify JS
        new UglifyJsPlugin({
            uglifyOptions: {
                parallel: true,
                mangle: false,
                compress: {
                    warnings: false
                },
                sourceMap: false
            }
        }),
        // Minify CSS
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: '[hash].vendor.js',
            minChunks: m => /node_modules/.test(m.context)
        })
    ],
    stats: {
        warnings: false
    }
});
