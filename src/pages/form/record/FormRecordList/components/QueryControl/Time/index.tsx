import React, { useMemo } from 'react';
import { DatePicker, Dropdown, Menu } from 'antd';
import dayjs from 'dayjs';
import { FormattedMessage as FM } from 'react-intl';
import { DownOutlined } from '@ant-design/icons';
import { ClickParam } from 'antd/lib/menu';

import { dateTransfer } from '@/domain/form/instance/util';
import { dateFormatCompatMap, DateFormatTemplate } from '@/domain/form/template/common';
import { dataRangeCompactMap } from '@/constants/record/common';
import { QueryControlProps } from '..';

// import styles from './index.scss';

const { RangePicker } = DatePicker;

const rangeType = Object.keys(dataRangeCompactMap);

/**
 * QueryItems 时间控件
 */
const Time: React.FC<QueryControlProps> = (props) => {
  const { onChange: handleChange, item: control, value: dateValue } = props;
  // console.log(control.displayName, dateValue);

  const handleMenuClick = (e: ClickParam) => {
    const time = dateTransfer(dataRangeCompactMap[e.key].split(','));
    handleChange(time);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {rangeType.map((item) => (
        <Menu.Item key={item}>
          <FM id={`forminst.query.date.${item}`} />
        </Menu.Item>
      ))}
    </Menu>
  );

  const dateDayjs = useMemo(
    () => dateValue.map((item) => dayjs.fromUtc(item as dayjs.ConfigType)),
    [dateValue],
  );

  const format = useMemo(
    () =>
      control.config &&
      control.config.dateTimeFormat &&
      dateFormatCompatMap[control.config.dateTimeFormat],
    [control.config?.dateTimeFormat],
  );

  return (
    <>
      <Dropdown.Button
        style={{ width: '100%' }}
        icon={<DownOutlined />}
        overlay={menu}
        trigger={['click']}
        buttonsRender={([, rightButton]) => [
          <RangePicker
            // defaultValue={
            //   control.defaultValue &&
            //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
            //   (dateTransfer(DataRangeCompact[control.defaultValue].split(',')) as any)
            // }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={dateDayjs as any}
            style={{ width: 'calc(100% - 28px)' }}
            showTime={format ? format.indexOf(DateFormatTemplate.HM) > -1 : false}
            onChange={(dateRange) => {
              const value = dateRange?.map((item) => item?.utc().format()) || [];
              handleChange(value);
            }}
            format={format}
          />,
          rightButton,
        ]}
      />
    </>
  );
};

export default Time;
