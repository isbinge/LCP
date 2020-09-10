import React from 'react';
import { Input as AntdInput } from 'antd';
import { InputProps as AntdInputProps } from 'antd/lib/input/Input';
import { useIntl } from 'react-intl';

interface InputProps {
  options?: AntdInputProps;
  value: {
    data: {
      tip: string;
    };
  };
}

const Input: React.FC<InputProps> = props => {
  const { value: ctrlData } = props;
  const intl = useIntl();
  return (
    <AntdInput
      readOnly
      placeholder={
        ctrlData.data.tip || intl.formatMessage({ id: 'formtpl.canvas.common.input.ph' })
      }
      {...props.options}
    />
  );
};

export default Input;
