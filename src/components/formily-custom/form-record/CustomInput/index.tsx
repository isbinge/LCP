import React from 'react';

import { Input as AntInput } from 'antd';
import { useIntl } from 'react-intl';
import { DataLkgMappings } from '@/domain/form/instance/schema-type';
import { datalink } from '@/domain/form/instance/util';
// import FormRecordData from '@/domain/form/instance/data';

interface CustomFormilyInputProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  dataLinkageMappings?: DataLkgMappings;
  code: string;
  subFormCode?: string;
  index?: number;
}

const CustomInput: React.FC<CustomFormilyInputProps> = (props) => {
  const {
    value,
    onChange: handleChange,
    placeholder,
    subFormCode,
    code,
    dataLinkageMappings,
    index,
  } = props;
  const intl = useIntl();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e.target.value);
    datalink(code, dataLinkageMappings, subFormCode, index);
  };
  return (
    <AntInput
      maxLength={200}
      value={value}
      onChange={handleInputChange}
      placeholder={placeholder || intl.formatMessage({ id: 'formtpl.canvas.common.input.ph' })}
    />
  );
};

export default CustomInput;
