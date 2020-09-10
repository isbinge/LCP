/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
// Stylesheets
declare module '*.css';
declare module '*.sass';
declare module '*.scss';
declare module '*.less';

// Images
declare module '*.png';
declare module '*.jpg';
declare module '*.svg';

declare const __DEV__: boolean;
declare const $$BUILD_INFO: {
  version: string;
  timestamp: number;
};

declare interface Window {
  appLocale: {
    intlConfig: {
      messages: import('react-intl').IntlShape['messages'];
      locale: Lcp.SupportedLocale;
    };
  };
  /**
   * __WARNING__
   *
   *  DO NOT USE THIS PROPERTY IN YOUR CODE
   *
   *  It's for DEBUG ONLY, and will be dropped in production mode
   */
  dvaApp: Dva.FullDvaInstance;
}
/**
 * @deprecated `Nullable<T>` is deprecated,  use `T | null` instead
 */
declare type Nullable<T> = T | null;
declare type PrimitiveType = string | number | boolean | null | undefined | Date;
declare type OrArray<T> = T | T[];
