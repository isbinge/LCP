import React, { ReactText, ReactNode } from 'react';
import { Select as AntdSelect } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { FormattedMessage as FM } from 'react-intl';

import styles from './index.scss';

interface OptionProps {
  value: ReactText;
  children: ReactNode;
}

interface CompProps {
  data?: OptionProps[];
  options?: SelectProps<ReactText>;
}

const Select: React.FC<CompProps> = ({ data, options }) => {
  const selectData: OptionProps[] = data || [
    { value: '1', children: <FM id="forminst.common.selectable.placeholder" /> },
  ];
  return (
    <AntdSelect className={styles.displaySelect} value={selectData[0].value} {...options} disabled>
      {selectData.map((i) => (
        <AntdSelect.Option {...i} key={i.value} />
      ))}
    </AntdSelect>
  );
};

export default Select;
