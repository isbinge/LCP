import React from 'react';
import { Input as AntdInput } from 'antd';
import { InputProps as AntdInputProps } from 'antd/lib/input/Input';
import { useIntl } from 'react-intl';

interface NumberProps {
  options?: AntdInputProps;
}

const Number: React.FC<NumberProps> = props => {
  const intl = useIntl();

  return (
    <AntdInput
      readOnly
      placeholder={intl.formatMessage({ id: 'formtpl.canvas.common.input.ph' })}
      {...props.options}
    />
  );
};

export default Number;
