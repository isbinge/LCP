import React from 'react';
import { Radio as AntdRadio } from 'antd';
import { DataLkgMappings } from '@/domain/form/instance/schema-type';
import { datalink } from '@/domain/form/instance/util';

interface CustomFormilyRadioProps {
  value: string;
  defaultItems: string;
  onChange: (value: string) => void;
  dataLinkageMappings?: DataLkgMappings;
  code: string;
  subFormCode?: string;
  index?: number;
}

const Radio: React.FC<CustomFormilyRadioProps> = (props) => {
  const {
    value,
    onChange: handleChange,
    defaultItems,
    subFormCode,
    code,
    dataLinkageMappings,
    index: subFormIndex,
  } = props;

  return (
    <AntdRadio.Group
      value={value}
      onChange={(e) => {
        handleChange(e.target.value);
        datalink(code, dataLinkageMappings, subFormCode, subFormIndex);
      }}
    >
      {defaultItems.split(';').map((item: string, index: number) => {
        const key = String(index);
        return (
          <AntdRadio
            value={item}
            key={`${value} ${key}`}
            onClick={() => {
              if (item === value) {
                handleChange('');
                datalink(code, dataLinkageMappings, subFormCode, subFormIndex);
              }
            }}
          >
            {item}
          </AntdRadio>
        );
      })}
    </AntdRadio.Group>
  );
};

export default Radio;
