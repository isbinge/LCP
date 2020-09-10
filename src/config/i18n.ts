export const i18nConf: Lcp.I18nConfig = {
  defaultLanguage: 'en-US',
  spec: {
    'en-US': {
      icon: '🇺🇸',
      title: 'English',
      alias: {
        iso639: 'en',
        rfc5646ls: 'en-US',
        rfc5646lru: 'en_US',
      },
      dayjs: [() => import('dayjs/locale/en'), 'en'],
      antd: () => import('antd/es/locale/en_US'),
      intlMsg: () => import('@/locales/en_US'),
    },
    'zh-CN': {
      icon: '🇨🇳',
      title: '简体中文',
      titleEn: 'Chinese (Simplified)',
      alias: {
        iso639: 'zh',
        rfc5646ls: 'zh-Hans',
        rfc5646lru: 'zh_CN',
      },
      dayjs: [() => import('dayjs/locale/zh-cn'), 'zh-cn'],
      antd: () => import('antd/es/locale/zh_CN'),
      intlMsg: () => import('@/locales/zh_CN'),
    },
  },
};

export const locales = Object.keys(i18nConf.spec);
