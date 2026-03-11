const webpack = require('webpack');
const webpackPaths = require('./webpack.paths.cjs');
const { dependencies: externals } = require('../../release/app/package.json');

module.exports = {
  externals: [...Object.keys(externals || {})],
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  output: {
    path: webpackPaths.srcPath,
    library: {
      type: 'commonjs2',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};
