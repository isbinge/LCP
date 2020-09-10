import React from 'react';
import { dateFormatCompatMap } from '@/domain/form/template/common';
import dayjs from 'dayjs';

interface AssocAttrProps {
  mappingField: string;
  onChange: (value: string) => void;

  // 接口正在改动中，不明确类型
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  schemaCode: string;
}

const AssocAttr: React.FC<AssocAttrProps> = (props) => {
  const { value } = props;

  if (value && typeof value !== 'string') {
    const { dateTimeMode, value: attrValue } = value;
    if (dateTimeMode) {
      return attrValue ? dayjs.fromUtc(attrValue).format(dateFormatCompatMap[dateTimeMode]) : null;
    }
    return attrValue;
  }

  return value;
};
export default AssocAttr;
