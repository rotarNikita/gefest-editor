const path = require('path');
const settings = require('./settings');
const loaders = require('./loaders');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DIRECTION = settings.DIRECTION;
const HASH = settings.HASH;
const NODE_ENV = settings.NODE_ENV;

module.exports = {
    context: path.resolve(DIRECTION, 'src'),
    entry: './index.js',
    output: {
        path: path.resolve(DIRECTION, 'dist'),
        publicPath: 'http://gef.ststs.xyz/app/',
        filename: `js/app${HASH}.js`
    },
    module: {
        rules: loaders
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        loaders.ExtractTextPlugin,
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
};