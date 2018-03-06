const settings = require('./settings');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const NODE_ENV = settings.NODE_ENV;
const HASH = settings.HASH;

module.exports = [
    {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader'
        }
    },
    {
        test: /\.(png|gif|svg|jpe?g)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    name: `images/[path][name]${HASH}.[ext]`,
                    limit: 8192
                }
            }
        ]
    },
    {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: `fonts/[name].[ext]`
                }
            }
        ]
    },
    {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
            use: [
                {
                    loader: "css-loader",
                    options: {
                        sourceMap: NODE_ENV === 'dev',
                        minimize: NODE_ENV === 'build'
                    }
                },
                'resolve-url-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            autoprefixer({
                                browsers:['ie >= 8', 'last 4 version']
                            })
                        ],
                        sourceMap: true
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true
                    }
                }
            ]
        })
    },
    {
        test: /\.html$/,
        use: [
            {
                loader: 'html-loader',
                options: {
                    interpolate: true
                }
            }
        ]
    }
];

module.exports.ExtractTextPlugin = new ExtractTextPlugin(`css/style${NODE_ENV === 'build' ? '.[contenthash]' : ''}.css`);