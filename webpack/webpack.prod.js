/**
 * Webpack 生产环境配置
 */

const path = require('path');
const merge = require('webpack-merge');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const HtmlPlugin = require('html-webpack-plugin');

const base = require('./webpack.base');

const APP_DIST_PATH = path.resolve(process.cwd(), 'dist');
const resolveToSrc = (...params) => path.resolve(process.cwd(), 'src', ...params);
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const { ANAL, CI } = process.env;

const prodPlugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: 'static/css/[name].[contenthash:8].css',
    chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
  }),
  new CopyPlugin({
    patterns: [
      {
        from: path.join(process.cwd(), 'public'),
        to: APP_DIST_PATH,
      },
    ],
  }),
  new HtmlPlugin({
    title: 'Low-code ERP',
    template: './document.ejs',
    filename: './index.html',
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    },
  }),
];

const postCssOptions = {
  ident: 'postcss',
  sourceMap: shouldUseSourceMap,
  config: {
    ctx: {
      cssnano: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
    },
  },
  plugins: () => [require('autoprefixer')(), require('cssnano')()],
};

if (ANAL === 'true') {
  prodPlugins.push(new BundleAnalyzerPlugin({ defaultSizes: 'gzip' }));
}

module.exports = merge.smart(base, {
  mode: 'production',
  bail: true,
  stats: CI ? 'errors-only' : 'normal',
  devtool: shouldUseSourceMap ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
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
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: shouldUseSourceMap,
              modules: {
                // "[name]__[local]__[hash:base64:5]"
                localIdentName: '[hash:base64]',
              },
              importLoaders: 3,
            },
          },
          {
            loader: 'postcss-loader',
            options: postCssOptions,
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: shouldUseSourceMap,
            },
          },
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
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: shouldUseSourceMap,
              importLoaders: 3,
            },
          },
          {
            loader: 'postcss-loader',
            options: postCssOptions,
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: shouldUseSourceMap,
            },
          },
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
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: shouldUseSourceMap,
              modules: {
                localIdentName: '[hash:base64]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: postCssOptions,
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: shouldUseSourceMap,
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
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: shouldUseSourceMap,
            },
          },
          {
            loader: 'postcss-loader',
            options: postCssOptions,
          },
        ],
      },
    ],
  },
  plugins: prodPlugins,
  optimization: {
    splitChunks: {
      maxSize: 200000,
      chunks: 'all',
      name: false,
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: shouldUseSourceMap,
        terserOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            ecma: 2015,
          },
          mangle: {
            toplevel: true,
          },
          output: {
            ecma: 2015,
            comments: false,
            beautify: false,
          },
        },
        extractComments: false,
      }),
    ],
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  },
});
