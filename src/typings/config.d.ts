declare namespace Lcp {
  /** Current supported languages */
  type SupportedLocale = 'en-US' | 'zh-CN';
  interface LocaleSpec {
    /** Icon, usually the emoji of flag */
    icon: string;
    /** Title in native language */
    title: string;
    /** Title in English e.g.: `Chinese (Simpilified) ` */
    titleEn?: string;
    alias: {
      iso639: string;
      rfc5646ls: string;
      rfc5646lru: string;
    };
    dayjs: [() => Promise<{ default: ILocale }>, string];
    intlMsg: () => Promise<{ default: import('react-intl').IntlShape['messages'] }>;
    antd: () => Promise<{ default: import('antd/lib/locale-provider').Locale }>;
  }
  interface I18nConfig {
    defaultLanguage: SupportedLocale;
    spec: {
      [key in SupportedLocale]: LocaleSpec;
    };
  }
}
