import { locales, i18nConf } from '@/config';
import LcpConst from '@/constants';
import { createIntl, createIntlCache, IntlShape } from 'react-intl';
import { localStorageGet, localStorageSet } from './local-storage';

type Locale = Lcp.SupportedLocale;

const storageLocale = localStorageGet<{ locale: Locale }>(LcpConst.localStorage.LOCALE)?.locale;

const langFallback = (lang: Locale, supportedLang: string[]): Locale => {
  if (supportedLang.includes(lang)) {
    return lang;
  }
  return i18nConf.defaultLanguage;
};

interface SetIntl {
  locale: Locale;
  messages: NonNullable<IntlShape['messages']>;
}

class LcpIntl {
  private static cache = createIntlCache();

  private static $intl: IntlShape;

  static initialize({ locale, messages }: SetIntl) {
    LcpIntl.$intl = createIntl({ locale, messages }, LcpIntl.cache);
  }

  static get intl() {
    if (!LcpIntl.$intl) {
      throw new Error('Intl not initialized');
    }
    return LcpIntl.$intl;
  }

  static set locale(locale: Locale) {
    if (!locales.includes(locale)) {
      return;
    }
    localStorageSet(LcpConst.localStorage.LOCALE, {
      locale,
    });
    window.location.reload();
  }

  static get locale() {
    const { language } = navigator;
    return storageLocale || langFallback(language as Locale, locales);
  }
}

export default LcpIntl;
