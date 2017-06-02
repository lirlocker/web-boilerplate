module.exports = {
    entry: "./source/js/main.js",
    output: {
        filename: "bundle.js",
        path: __dirname + "/public/js"
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
        }]
    },
    stats: {
        colors: true,
    },
    devtool: 'source-map',
}
