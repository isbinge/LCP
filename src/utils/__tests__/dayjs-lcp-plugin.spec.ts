import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import lcp from '../lib/dayjs-lcp-plugin';
import { dateFormatCompat } from '../../domain/form/template/common';

dayjs.extend(lcp);
dayjs.extend(utc);

describe('dayjs-lcp-plugin', () => {
  it('should formatCompat work', () => {
    expect(dayjs('2020-01-01 01:23').formatCompat(dateFormatCompat.ymd)).toEqual('2020-01-01');
  });
  it('should formatToYMD work', () => {
    expect(dayjs('2020-01-01 01:23').formatToYMD()).toEqual('2020-01-01');
    expect(dayjs('2020-01-01 01:23').formatToYMD(dateFormatCompat.ym)).toEqual('2020-01');
  });
  it('should formatToYM work', () => {
    expect(dayjs('2020-01-01 01:23').formatToYM()).toEqual('2020-01');
    expect(dayjs('2020-01-01').formatToYM(dateFormatCompat.ymdhm)).toEqual('2020-01-01 00:00');
  });
  it('should formatToYMDHM work', () => {
    expect(dayjs('2020-01-01').formatToYMDHM()).toEqual('2020-01-01 00:00');
    expect(dayjs('2020-01-01').formatToYMDHM(dateFormatCompat.hm)).toEqual('00:00');
  });
  it('should formatToHM work', () => {
    expect(dayjs('2020-01-01').formatToYMDHM()).toEqual('2020-01-01 00:00');
    expect(dayjs('2020-01-01').formatToYMDHM(dateFormatCompat.ymd)).toEqual('2020-01-01');
  });
  it('should toISOStringInUTC work', () => {
    expect(dayjs('2020-01-01 08:00').toISOStringInUTC()).toEqual('2020-01-01T00:00:00Z');
    expect(dayjs('2020-01-02 08:12').toISOStringInUTC({ fillZeros: dateFormatCompat.ymd })).toEqual(
      '2020-01-01T16:00:00Z',
    );
  });
  it('should fromUtc work', () => {
    expect(dayjs.fromUtc('2020-01-01 00:00').format()).toEqual('2020-01-01T08:00:00+08:00');
    expect(dayjs.fromUtc('2020-01-01T00:00').format()).toEqual('2020-01-01T08:00:00+08:00');
    expect(dayjs.fromUtc('2020-01-01T00:00Z').format()).toEqual('2020-01-01T08:00:00+08:00');
    expect(dayjs.fromUtc('2020-01-01T00:00.000').format()).toEqual('2020-01-01T08:00:00+08:00');
    // Not a valid ISO Date String
    expect(dayjs.fromUtc('2020-01-01T00:00.000000').format()).not.toEqual(
      '2020-01-01T08:00:00+08:00',
    );
  });
});
