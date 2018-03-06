const commonConfig = require('./config/webpack.common');
const devConfig = require('./config/webpack.dev');
const buildConfig = require('./config/webpack.build');
const webpackMerge = require('webpack-merge');

const NODE_ENV = require('./config/settings').NODE_ENV;

module.exports = webpackMerge(commonConfig, NODE_ENV === 'dev' ? devConfig : buildConfig);