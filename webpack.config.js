module.exports = {
    mode: process.env.NODE_ENV,
    entry: ["./src/index.js"],
    output: {
        library: "VueSocketIO",
        libraryTarget: "umd2",
        libraryExport: "default",
        filename: "vue-socketio.js",
        globalObject: "typeof self !== 'undefined' ? self : this"
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        plugins: ["@babel/plugin-proposal-class-properties"]
                    }
                }
            }
        ]
    }
};