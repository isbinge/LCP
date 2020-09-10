import React from 'react';
import { Input } from 'antd';
import { QueryControlProps } from '..';

/**
 * query-items 文本
 * @param props
 */
const TextInput: React.FC<QueryControlProps> = (props) => {
  const { onChange: handleChange, item, value } = props;
  return (
    <Input
      defaultValue={item.defaultValue}
      value={value[0] as string}
      onChange={(e) => handleChange([e.target.value])}
    />
  );
};

export default TextInput;
