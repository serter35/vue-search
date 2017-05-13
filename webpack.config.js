const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "./dist/f-creative-search.css",
    disable: process.env.NODE_ENV === "development",
    allChunks: true
})

module.exports = {
    entry: './app.js',
    output: {
        filename: './dist/f-creative-search.js'
    },
    watch: true,
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'vue-loader',
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            { // regular css files
                test: /\.css$/,
                use: extractSass.extract({
                    use: {
                        loader: 'css-loader?importLoaders=1'
                    }
                })
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    fallback: "style-loader"
                })
            },
        ]
    },
    plugins: [
        extractSass
    ]
}