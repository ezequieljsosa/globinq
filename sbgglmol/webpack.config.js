var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var path = require('path');
var env = require('yargs').argv.mode;

var libraryName = 'sbgglmol';

var plugins = [], outputFile;

if (env === 'build') {
    //plugins.push(new UglifyJsPlugin({ minimize: true }));
    //outputFile = libraryName + '.min.js';
    outputFile = libraryName + '.js';
} else {
    outputFile = libraryName + '.js';
}

var config = {


    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /(\.jsx|\.js)$/,
                loader: "eslint-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        modules: [__dirname, 'node_modules'],
        extensions: ['*', 'js', 'jsx']
    },
    plugins: plugins
};

module.exports = config;
