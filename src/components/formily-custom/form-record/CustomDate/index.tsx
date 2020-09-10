import React, { useMemo } from 'react';
import { DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { PickerProps } from 'antd/lib/date-picker/generatePicker';

import {
  dateFormatCompatMap,
  DateFormatTemplate,
  dateFormatCompat,
} from '@/domain/form/template/common';

import { useIntl } from 'react-intl';
import { DataLkgMappings } from '@/domain/form/instance/schema-type';
import { datalink } from '@/domain/form/instance/util';

const placeHolderMap = {
  [dateFormatCompat.ymd]: 'formtpl.schema.date.format.ymd',
  [dateFormatCompat.ym]: 'formtpl.schema.date.format.ym',
  [dateFormatCompat.ymdhm]: 'formtpl.schema.date.format.ymdhm',
  [dateFormatCompat.hm]: 'formtpl.schema.date.format.hm',
};
type DtpType = 'date' | 'month' | 'time';

interface DateProps {
  value: string;
  onChange: (date: string) => void;
  placeHolder?: string;
  dateTimeMode: string;
  dataLinkageMappings?: DataLkgMappings;
  code: string;
  subFormCode?: string;
  index?: number;
}

const CustomDate: React.FC<DateProps> = (props) => {
  const {
    value,
    onChange: handleChange,
    placeHolder,
    dateTimeMode,
    subFormCode,
    code,
    dataLinkageMappings,
    index,
  } = props;
  const intl = useIntl();

  const [dtpType, showTime, pickProps] = useMemo(() => {
    const format: string = dateFormatCompatMap[dateTimeMode];
    let dateType: DtpType = 'time';
    if (format.includes('YYYY')) {
      dateType = 'date';
    }
    if (format === DateFormatTemplate.YM) {
      dateType = 'month';
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const picks: PickerProps<any> = {
      format,
      placeholder: placeHolder || intl.formatMessage({ id: placeHolderMap[dateTimeMode] }),
      onChange: (e: Dayjs) => {
        handleChange(e?.toISOStringInUTC({ fillZeros: format }));
        datalink(code, dataLinkageMappings, subFormCode, index);
      },
    };

    return [dateType, format.indexOf(DateFormatTemplate.HM) > -1, picks];
  }, [dateTimeMode, handleChange]);
  return (
    <DatePicker
      value={value ? dayjs.utc(value).local() : null}
      picker={dtpType}
      showTime={showTime}
      {...pickProps}
    />
  );
};

export default CustomDate;
