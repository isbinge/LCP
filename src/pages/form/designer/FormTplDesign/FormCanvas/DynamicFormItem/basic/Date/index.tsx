import React from 'react';
import { DatePicker as AntdDatePicker } from 'antd';
import { useIntl } from 'react-intl';
import { DatePickerProps as AntdDatePickerProps } from 'antd/lib/date-picker';

interface DateProps {
  options?: AntdDatePickerProps;
  value: {
    data: {
      format: string;
    };
  };
}

const placeHolderMap = {
  YMD: 'formtpl.schema.date.format.ymd',
  YM: 'formtpl.schema.date.format.ym',
  YMDHM: 'formtpl.schema.date.format.ymdhm',
  HM: 'formtpl.schema.date.format.hm',
};

const Date: React.FC<DateProps> = props => {
  const { value: ctrlData } = props;

  const intl = useIntl();
  return (
    <AntdDatePicker
      {...props.options}
      disabled
      style={{ width: '100%' }}
      placeholder={intl.formatMessage(
        ctrlData.data.format
          ? { id: placeHolderMap[ctrlData.data.format] }
          : { id: 'formtpl.schema.date.format.ymd' },
      )}
    />
  );
};

export default Date;
