import React from 'react';
import { Input as AntdInput } from 'antd';
import { InputProps as AntdInputProps } from 'antd/lib/input/Input';
import { useIntl } from 'react-intl';

const { TextArea: AntdTextArea } = AntdInput;

interface InputProps {
  options?: AntdInputProps;
  value: {
    data: {
      tip: string;
    };
  };
}

const TextArea: React.FC<InputProps> = props => {
  const intl = useIntl();
  return (
    <AntdTextArea
      readOnly
      rows={4}
      placeholder={
        props.value.data.tip || intl.formatMessage({ id: 'formtpl.canvas.common.input.ph' })
      }
      style={{ resize: 'none' }}
    />
  );
};

export default TextArea;
