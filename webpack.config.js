const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        filename: '[name].bundle.js',
        path: path.join(__dirname, './dist'),
        clean: true,
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.vue'],
        // alias: {
        //     vue: 'vue/dist/vue.js',
        // },
    },

    module: {
        rules: [
            {
                test: /.vue$/,
                use: ['vue-loader']
            },
            {
                test: /.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpe?g|gif|webp)$/,
                type: "asset",
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './public/index.html'),
        }),
        new VueLoaderPlugin()
    ]
}