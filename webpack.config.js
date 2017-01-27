const path = require('path');
module.exports = {
  entry: path.resolve(__dirname, 'webclient', 'views', 'App.jsx'),
  output: {
    path: path.resolve(__dirname, 'webclient', 'assets'),
    filename: 'bundle.js',
    publicPath: '/webclient/assets/'
      // publicPath: path.resolve(__dirname, 'webclient', 'assets')
    },
    module: {
      loaders: [
      { test: /\.json$/, loader: 'json'},
    //  { test: /\.js$/,loader: 'babel',query: {compact: false}},
    //{ test: /\.css$/, loader: 'style!css'},
    {
      loader: 'babel',
      test: /\.jsx$/,
      query: {
        presets: ['es2015', 'react', 'stage-1']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '/index.js', '/index', '/index.jsx']
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls:'empty'
  }
};
