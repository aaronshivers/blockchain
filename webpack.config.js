const path = require('path')
const webpack = require('webpack')


module.exports = {
  entry: './client/src/index.js',
  output: {
    path: path.join(__dirname, 'client', 'public', 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'client', 'public'),
    historyApiFallback: true,
    publicPath: '/dist/'
  }
}