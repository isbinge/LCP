import React, { useMemo } from 'react';
import { InputNumber as AntdNumber } from 'antd';
import { useIntl } from 'react-intl';
import { DataLkgMappings } from '@/domain/form/instance/schema-type';
import { datalink } from '@/domain/form/instance/util';

type InputNumberValueType = string | number | null | undefined;
interface CustomInputNumber {
  value: InputNumberValueType;
  onChange: (value: InputNumberValueType) => void;
  placeholder?: string;
  decimalPlaces: number;
  showThousandthSeparator: boolean;
  dataLinkageMappings?: DataLkgMappings;
  code: string;
  subFormCode?: string;
  index?: number;
}

const CustomInputNumber: React.FC<CustomInputNumber> = (props) => {
  const {
    value,
    onChange: handleChange,
    placeholder,
    decimalPlaces,
    showThousandthSeparator,
    subFormCode,
    code,
    dataLinkageMappings,
    index,
  } = props;
  const intl = useIntl();
  const showNumber = useMemo(() => {
    if (Number.isNaN(Number(value))) {
      handleChange(null);
      return undefined;
    }
    return value === null ? undefined : Number(value);
  }, [value]);

  return (
    <AntdNumber
      style={{ width: '100%' }}
      value={showNumber}
      placeholder={placeholder || intl.formatMessage({ id: 'formtpl.canvas.common.input.ph' })}
      precision={decimalPlaces || 0}
      onChange={(number) => {
        handleChange(number);
        datalink(code, dataLinkageMappings, subFormCode, index);
      }}
      formatter={
        showThousandthSeparator ? (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : undefined
      }
      parser={showThousandthSeparator ? (v) => String(v).replace(/\$\s?|(,*)/g, '') : undefined}
    />
  );
};

export default CustomInputNumber;
