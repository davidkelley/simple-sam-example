module.exports = {
  entry: [
    'babel-polyfill',
    './handler.js',
  ],
  target: 'node',
  externals: {
    'aws-sdk': 'aws-sdk',
  },
  output: {
    filename: 'index.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: __dirname,
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(md|jst|def|ts)$/,
        loader: 'ignore-loader',
      },
    ],
  },
};
