const path = require('path');

const DIRECTION = require('./settings').DIRECTION;

module.exports = {
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve(DIRECTION, 'dist'),
        open: true
    }
};