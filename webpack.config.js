var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: ['./src/Main.js'],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'build.js',
        library: ['VueSocketio'],
        libraryTarget: 'umd'
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
				query: {
				  presets: ['es2015']
				}
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ]
    },
    devtool: 'eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = 'source-map'

    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ])
}

