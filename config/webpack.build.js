const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const settings = require('./settings');

const DIRECTION = settings.DIRECTION;

module.exports = {
    plugins: [
        new UglifyJSPlugin(),
        new CleanWebpackPlugin('dist', {
            root: DIRECTION
        })
    ]
};