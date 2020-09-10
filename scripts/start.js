/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
process.env.NODE_ENV = 'development';
process.env.WEBPACK_ENV = 'development';

const path = require('path');
const Webpack = require('webpack');
const WDS = require('webpack-dev-server');
const openBrowser = require('react-dev-utils/openBrowser');
const open = require('open');
const webpackConfig = require('../webpack/webpack.dev');

const { PORT = 9000, API_SERVER = 'localhost' } = process.env;
const isDarwin = process.platform === 'darwin';
const openUrl = `http://localhost:${PORT || 9000}`;

const compiler = Webpack(webpackConfig);
const devServer = new WDS(compiler, {
  contentBase: path.join(__dirname, '..', 'public'),
  publicPath: webpackConfig.output.publicPath,
  // clientLogLevel: 'none',
  port: PORT,
  quiet: true,
  hot: true,
  inline: true,
  watchContentBase: true,
  historyApiFallback: true,
  proxy: {
    '/api': API_SERVER,
  },
  before() {
    console.clear();
  },
  after() {
    if (isDarwin) {
      openBrowser(openUrl);
    } else {
      open(openUrl);
    }
  },
});

devServer.listen(PORT);
// compiler.close();
