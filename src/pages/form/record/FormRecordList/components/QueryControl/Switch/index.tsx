import React from 'react';
import { Checkbox } from 'antd';

import { FormattedMessage as FM } from 'react-intl';
import { QueryControlProps } from '..';

/**
 * query-items 是否
 * @param props
 */
const Switch: React.FC<QueryControlProps> = (props) => {
  const { onChange: handleChange, item } = props;

  return (
    <Checkbox.Group
      onChange={handleChange}
      // value={checkedValues as boolean[]}
      defaultValue={[!!item.defaultValue]}
    >
      <Checkbox value>
        <FM id="forminst.schema.switch.yes" />
      </Checkbox>
      <Checkbox value={false}>
        <FM id="forminst.schema.switch.no" />
      </Checkbox>
    </Checkbox.Group>
  );
};

export default Switch;
