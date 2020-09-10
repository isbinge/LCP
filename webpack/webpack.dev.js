/**
 * Webpack 开发环境配置
 */

const path = require('path');
const merge = require('webpack-merge');
const chalk = require('chalk');
const WebpackBar = require('webpackbar');
const HtmlPlugin = require('html-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

const { name } = require('../package.json');
const base = require('./webpack.base');

const resolveToSrc = (...params) => path.resolve(process.cwd(), 'src', ...params);
const { GENERATE_SOURCEMAP, PORT = 9000 } = process.env;
const shouldUseSourceMap = GENERATE_SOURCEMAP !== 'false';
const openUrl = `http://localhost:${PORT || 9000}`;

const devPlugins = [
  new ErrorOverlayPlugin(),
  new WebpackBar({
    fancy: true,
    name: name.toUpperCase(),
  }),
  new FriendlyErrorsPlugin({
    compilationSuccessInfo: {
      messages: [chalk.blue('Project is running at ' + openUrl)],
    },
  }),
  new HtmlPlugin({
    title: 'LCP [Dev]',
    template: './document.ejs',
    filename: './index.html',
  }),
];

module.exports = merge.smart(base, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/, /\.(test|spec).tsx?$/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers: () => ({
                before: [
                  tsImportPluginFactory({
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: 'css',
                  }),
                  tsImportPluginFactory({
                    libraryName: 'lodash',
                    libraryDirectory: null,
                    style: false,
                    camel2DashComponentName: false,
                  }),
                ],
              }),
            },
          },
        ],
      },
      {
        test: /^((?!(\.global|global\.)).)*(sa|sc)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: shouldUseSourceMap,
              modules: {
                // "[name]__[local]__[hash:base64:5]"
                localIdentName: '[folder]_[local]_[hash:base64:3]',
              },
              importLoaders: 2,
            },
          },
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              sourceMap: shouldUseSourceMap,
              resources: [resolveToSrc('./resource.scss'), resolveToSrc('./theme.default.scss')],
            },
          },
        ],
      },
      {
        test: /[.\\/]global\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: shouldUseSourceMap,
              importLoaders: 2,
            },
          },
          'sass-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              sourceMap: shouldUseSourceMap,
              resources: [resolveToSrc('./resource.scss'), resolveToSrc('./theme.default.scss')],
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: shouldUseSourceMap,
              modules: {
                localIdentName: '[folder]_[local]_[hash:base64:3]',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: shouldUseSourceMap,
            },
          },
        ],
      },
    ],
  },
  plugins: devPlugins,
  optimization: {
    chunkIds: 'named',
  },
  // cache: {
  //   type: 'memory',
  // },
});
