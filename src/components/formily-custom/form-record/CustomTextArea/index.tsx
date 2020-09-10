import React from 'react';
import { Input as AntInput } from 'antd';
import { useIntl } from 'react-intl';
import { DataLkgMappings } from '@/domain/form/instance/schema-type';
import { datalink } from '@/domain/form/instance/util';
// import FormRecordData from '@/domain/form/instance/data';

const { TextArea: AntdTextArea } = AntInput;
interface CustomFormilyTextAreaProps {
  value: string;
  placeholder: string;
  rows: number;
  onChange: (value: string) => void;
  dataLinkageMappings?: DataLkgMappings;
  code: string;
  subFormCode?: string;
  index?: number;
}

const CustomTextArea: React.FC<CustomFormilyTextAreaProps> = (props) => {
  const {
    value,
    onChange: handleChange,
    placeholder,
    rows,
    code,
    dataLinkageMappings,
    subFormCode,
    index,
  } = props;
  const intl = useIntl();
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e.target.value);
    datalink(code, dataLinkageMappings, subFormCode, index);
  };
  return (
    <AntdTextArea
      maxLength={2000}
      value={value}
      rows={rows || 3}
      onChange={handleInputChange}
      placeholder={placeholder || intl.formatMessage({ id: 'formtpl.canvas.common.input.ph' })}
    />
  );
};

export default CustomTextArea;
