const path = require('path');
const settings = require('./settings');
const loaders = require('./loaders');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const DIRECTION = settings.DIRECTION;
const HASH = settings.HASH;
const RELATIVE_PATH = settings.RELATIVE_PATH;

module.exports = {
    context: path.resolve(DIRECTION, 'src'),
    entry: './index.js',
    output: {
        path: path.resolve(DIRECTION, 'dist'),
        publicPath: RELATIVE_PATH,
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