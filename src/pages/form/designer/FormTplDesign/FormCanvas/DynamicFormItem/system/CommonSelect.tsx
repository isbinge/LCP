import React from 'react';
import { Input as AntdInput } from 'antd';
import { InputProps as AntdInputProps } from 'antd/lib/input/Input';
import { useIntl } from 'react-intl';

interface InputProps {
  options?: AntdInputProps;
}

const CommonSelect: React.FC<InputProps> = (props) => {
  const intl = useIntl();
  return (
    <AntdInput
      readOnly
      placeholder={intl.formatMessage({ id: 'formtpl.canvas.common.select.ph' })}
      {...props.options}
    />
  );
};

export default CommonSelect;
