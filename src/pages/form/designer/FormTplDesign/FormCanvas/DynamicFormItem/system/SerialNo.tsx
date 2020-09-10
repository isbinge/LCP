import React from 'react';
import { Input as AntdInput } from 'antd';
import { InputProps as AntdInputProps } from 'antd/lib/input/Input';

interface InputProps {
  options?: AntdInputProps;
}

const SerialNo: React.FC<InputProps> = props => (
  <AntdInput readOnly placeholder="201900000001" {...props.options} />
);

export default SerialNo;
