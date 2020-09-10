export { API, API_PATH } from './api';
export { i18nConf, locales } from './i18n';

const config = {
  antd: {
    messageDurationProd: 3,
    notifiDurationDev: 5,
  },
  register: {
    resentEmailTminus: 60,
  },
};

export const getDefaultTitle = () => (__DEV__ ? 'LCP [Dev]' : 'Low-code ERP');

export default config;
