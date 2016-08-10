var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('[name].css');
module.exports = {
    //插件项
    plugins: [
        extractCSS
    ],
    //页面入口文件配置
    entry: {
        article: './web/js/article.js',
        header: './web/js/header.js',
        editor: './web/js/editor.js'
    },
    //入口文件输出配置
    output: {
        path: './web/public/javascript',
        filename: '[name].js'
    },
    module: {
        //加载器配置
        loaders: [
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.js$/, loader: 'jsx-loader?harmony'},
            {test: /\.scss$/, loader: 'style!css!sass'},
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    }
};