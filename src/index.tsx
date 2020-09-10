import 'react-hot-loader';
import React from 'react';
import { render } from 'react-dom';

import App from './App';
import LcpIntl from './utils/locale';

import './global.scss';

const html = document.querySelector('html');
if (html) {
  html.setAttribute('lang', LcpIntl.locale);
}
const root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);

render(<App />, root);
