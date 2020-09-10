import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { ConfigProvider as AntdConfigProvider } from 'antd';
import { IntlProvider as ReactIntlProvider, IntlShape } from 'react-intl';
import antdEn from 'antd/es/locale/en_US';

// Dayjs plugins
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import utc from 'dayjs/plugin/utc';
import lcp from '@lib/dayjs-lcp-plugin';

import { i18nConf } from '@/config';
import { useLogger } from '@/utils/hooks/use-logger';
import LcpIntl from '@/utils/locale';

// extend dayjs plugins here
dayjs.extend(utc);
dayjs.extend(quarterOfYear);
dayjs.extend(localeData);
dayjs.extend(weekday);
dayjs.extend(lcp);

export const LocaleContext = React.createContext<{
  appLanguage: Lcp.SupportedLocale;
  localeConf: Lcp.LocaleSpec;
}>({
  appLanguage: 'en-US',
  localeConf: i18nConf.spec['en-US'],
});

const I18nProvider: React.FC<{ locale: Lcp.SupportedLocale }> = ({ locale, children }) => {
  const [loading, setLoading] = useState(true);
  const intlMessages = useRef<IntlShape['messages']>({});
  const antdIntl = useRef(antdEn);
  const { dayjs: dayjsConfig, intlMsg, antd: antdConfig } = i18nConf.spec[locale];
  const log = useLogger('i18n');

  useEffect(() => {
    window.appLocale = {
      intlConfig: {
        locale,
        messages: intlMessages.current,
      },
    };
  }, [loading, locale]);

  useEffect(() => {
    log('loading locale resource', locale);
    dayjsConfig[0]().then(() => {
      dayjs.locale(dayjsConfig[1]);
      intlMsg().then(({ default: messages }) => {
        intlMessages.current = messages;
        LcpIntl.initialize({ locale, messages });
        antdConfig().then(({ default: antd }) => {
          antdIntl.current = antd;
          setLoading(false);
        });
      });
    });
  }, [locale]);

  return loading ? null : (
    <ReactIntlProvider
      locale={locale}
      key={locale}
      messages={intlMessages.current}
      defaultLocale={i18nConf.defaultLanguage}
    >
      <AntdConfigProvider locale={antdIntl.current}>
        <LocaleContext.Provider
          value={{
            appLanguage: locale,
            localeConf: i18nConf.spec[locale],
          }}
        >
          {children}
        </LocaleContext.Provider>
      </AntdConfigProvider>
    </ReactIntlProvider>
  );
};
export default I18nProvider;
