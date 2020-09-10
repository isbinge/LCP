/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable func-names */
/* eslint-disable no-param-reassign */

import dayjs, { PluginFunc } from 'dayjs';
import {
  DateFormatTemplate,
  dateFormatCompatMap,
  dateFormatCompat,
} from '@/domain/form/template/common';

function getAdaptedFormat(template: string | undefined, fallback?: DateFormatTemplate) {
  return template ? dateFormatCompatMap[String(template)] ?? fallback ?? template : fallback;
}

const plugin: PluginFunc = (_, Dayjs, DayjsFactory) => {
  DayjsFactory.fromUtc = (config) => {
    return dayjs.utc(config).local();
  };
  Dayjs.prototype.formatCompat = function (template) {
    return dayjs(this.toDate()).format(getAdaptedFormat(template));
  };
  Dayjs.prototype.formatToYMD = function (template) {
    return dayjs(this.toDate()).format(getAdaptedFormat(template, DateFormatTemplate.YMD));
  };
  Dayjs.prototype.formatToYM = function (template) {
    return dayjs(this.toDate()).format(getAdaptedFormat(template, DateFormatTemplate.YM));
  };
  Dayjs.prototype.formatToYMDHM = function (template) {
    return dayjs(this.toDate()).format(getAdaptedFormat(template, DateFormatTemplate.YMDHM));
  };
  Dayjs.prototype.formatToHM = function (template) {
    return dayjs(this.toDate()).format(getAdaptedFormat(template, DateFormatTemplate.HM));
  };
  Dayjs.prototype.toISOStringInUTC = function (options) {
    const date = dayjs(this.toDate());
    if (options?.fillZeros) {
      if (
        options.fillZeros.toLowerCase() === dateFormatCompat.ymd ||
        options.fillZeros.toLowerCase() === dateFormatCompat.ym
      ) {
        return date.hour(0).minute(0).second(0).utc().format();
      }
    }
    return date.utc().format();
  };
};

export default plugin;

interface LocalToUtcOptions {
  /**
   * Format `DateFormatCompat.ymd` and `DateFormatCompat.ym`
   *
   * @see DateFormatCompat
   */
  fillZeros?: string | DateFormatTemplate;
}

declare module 'dayjs' {
  interface Dayjs {
    /**
     * 兼容模式，根据`DateFormatCompatMap`将服务端格式转为标准格式, 如:
     *
     * `yyyy-mm-dd hh:mm` -> `YYYY-MM-DD HH:mm`
     *
     * 其它格式保持不变
     *
     * 注:  **应传入枚举, 且值应只用于 UI 显示**
     */
    formatCompat(template: string): string;
    /**
     * 将当前实例格式化为 `YYYY-MM-DD`
     *
     * 若指定一个支持的模版格式, 则优先使用模版格式化 (支持兼容模式)
     *
     * 注:  **应传入枚举, 且值应只用于 UI 显示**
     */
    formatToYMD(template?: string): string;
    /**
     * 将当前实例格式化为 `YYYY-MM`
     *
     * 若指定一个支持的模版格式, 则优先使用模版格式化 (支持兼容模式)
     *
     * 注:  **应传入枚举, 且值应只用于 UI 显示**
     */
    formatToYM(template?: string): string;
    /**
     * 将当前实例格式化为 `YYYY-MM-DD HH:mm`
     *
     * 若指定一个支持的模版格式, 则优先使用模版格式化 (支持兼容模式)
     *
     * 注:  **应传入枚举, 且值应只用于 UI 显示**
     */
    formatToYMDHM(template?: string): string;
    /**
     * 将当前实例格式化为 `HH:mm`
     *
     * 若指定一个支持的模版格式, 则优先使用模版格式化 (支持兼容模式)
     *
     * 注:  **应传入枚举, 且值应只用于 UI 显示**
     */
    formatToHM(template?: string): string;
    /**
     * 将当前实例格式化为 ISO8801 格式 (UTC 时区)
     *
     * `YYYY-MM-DDTHH:mm:ssZ`
     *
     * 注： **此为标准化格式, 应只用于数据的提交**
     */
    toISOStringInUTC(options?: LocalToUtcOptions): string;
  }

  /**
   * 将输入配置视为 UTC, 并设置为本地格式, 等价于:
   *
   * ```ts
   * dayjs.utc(config).local()
   * ```
   */
  export function fromUtc(config?: ConfigType): Dayjs;
}
