const path = require('path')
const MiniCssExtractplugin = require('mini-css-extract-plugin')

const devMode = process.env.NODE_ENV !== 'production'

const resolveDir = function (dir) {
  return path.resolve(__dirname, dir)
}

module.exports = {
  entry: {
    app: path.join(__dirname, '../', 'src/index.js')
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'js/[name].[hash].js',
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.js(x?)$/,      
        exclude: /node_modules/,
        // 这里因为uglifyJS的坑搞了半天，socket.io-client里的依赖用了const语法没编译压缩不了，建议直接换terser-webpack-plugin省事
        // https://github.com/webpack/webpack/issues/2031
        // exclude: /node_modules\/(?!(node_modules\/socket.io-client\/node_modules\/debug\/src)\/).*/,
        // include: [
        //   path.resolve(__dirname, 'src'),
        //   path.resolve(__dirname, 'node_modules/socket.io-client/node_modules/debug/src')
        // ],
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.(sa|sc)ss$/,
        exclude: /node_modules/, // 只对自己的样式文件开启css module，防止编译冲突丢失ui样式
        use: [
          {
            loader: devMode ? 'style-loader' : MiniCssExtractplugin.loader,
            options: devMode ? {} : {
              hmr: process.env.NODE_ENV === 'development',
            }
          } ,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localsConvention: 'camelCase'
            }
          },
          {
            loader: 'postcss-loader'
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000, // url-loader 包含file-loader，这里不用file-loader, 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
          name: 'static/img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000, // 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
          name: 'static/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
      "@pages": path.resolve(__dirname, '../src/pages'),
      "@common": path.resolve(__dirname, '../src/common')
    }
  }
}