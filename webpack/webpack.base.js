/**
 * Webpack 基础配置
 */
const path = require('path');
const webpack = require('webpack');
const dotEnv = require('dotenv');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

const package = require('../package.json');

const APP_SOURCE_PATH = path.resolve(process.cwd(), 'src');
const APP_DIST_PATH = path.resolve(process.cwd(), 'dist');

const isDev = process.env.WEBPACK_ENV === 'development';
const isProd = process.env.WEBPACK_ENV === 'production';

dotEnv.config({
  path: path.resolve(__dirname, '..', '.env'),
});

module.exports = {
  context: APP_SOURCE_PATH,
  entry: {
    main: './index.tsx',
  },
  output: {
    path: APP_DIST_PATH,
    // filename: '[name].[fullhash:10].bundle.js',
    filename: '[name].[hash:10].bundle.js',
    chunkFilename: '[name].[chunkhash:12].chunk.js',
    publicPath: '/',
    // ecmaVersion: 2015,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.ejs'],
    alias: {
      '@': APP_SOURCE_PATH,
      '@lib': path.resolve(APP_SOURCE_PATH, 'utils/lib'),
      '@comp': path.resolve(APP_SOURCE_PATH, 'components'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'static/images/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: isDev,
      $$BUILD_INFO: process.env.SHOW_BUILD_INFO
        ? JSON.stringify({
            version: package.version,
            timestamp: Date.now(),
          })
        : null,
    }),
    new AntdDayjsWebpackPlugin(),
  ],
  optimization: {
    noEmitOnErrors: true,
  },
};
