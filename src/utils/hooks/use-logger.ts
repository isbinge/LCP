/* eslint-disable no-console */
import { useCallback } from 'react';
import dayjs from 'dayjs';

interface UseLogOptions {
  /**
   * Pass `true` to disable formatted datetime
   */
  disableDatetime?: boolean;
  /**
   * Wrapped with console.group
   */
  preferGroup?: 'collapsed' | 'expanded' | false;
  /**
   * Field text style
   *
   * You can pass CSS color to change the font color
   *  a object to change both font and bgColor
   *  or `false` to disable default style
   *
   * @default undefined
   */
  fieldStyle?: string | false | FieldStyle;
}

interface FieldStyle {
  background?: string;
  color?: string;
}

export const colorPresets: { [name: string]: FieldStyle } = {
  FYELLOW: { color: '#e6b450' },
  DEFAULT: { color: '#e6b450' },
};

export function useLogger(field: string, options: UseLogOptions = {}) {
  return useCallback(
    // `console.log` 本身类型定义即为 any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...params: any[]) => {
      if (!__DEV__) {
        return;
      }
      const { disableDatetime, fieldStyle, preferGroup = 'collapsed' } = options;
      const now = dayjs().format('HH:mm:ss.SSS');
      let style = colorPresets.DEFAULT;
      const noColor = fieldStyle === false;
      if (typeof fieldStyle === 'string') {
        style = { color: fieldStyle };
      } else if (typeof fieldStyle === 'object') {
        style = fieldStyle;
      }
      const styleParsed = `background:${style.background};color:${style.color};`;
      const template = [
        disableDatetime ? undefined : `[${now}]`,
        `${noColor ? '' : '%c'}[${field.toLowerCase() || 'undet'}]`,
      ];
      if (preferGroup && params.length > 1) {
        console[preferGroup === 'collapsed' ? 'groupCollapsed' : 'group'](
          template.join(' '),
          noColor ? undefined : styleParsed,
          params[0],
        );
        params.forEach((param, idx) => {
          if (idx === 0) return;
          console.log(param);
        });
        console.groupEnd();
      } else {
        console.log(template.join(' '), noColor ? undefined : styleParsed, ...params);
      }
    },
    [field, options],
  );
}
