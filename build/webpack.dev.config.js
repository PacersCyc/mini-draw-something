const path = require('path')
const webpackMerge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.base.config')

module.exports = webpackMerge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: '你画我猜',
      template: 'index.html'
    })
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    // contentBase: false,
    port: 9090,
    publicPath: '/',
    proxy: {}
  }
})