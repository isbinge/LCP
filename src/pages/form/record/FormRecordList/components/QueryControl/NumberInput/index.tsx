import React, { useMemo } from 'react';
import { Input, InputNumber } from 'antd';
import { QueryControlProps } from '..';

/**
 * query-items 数字
 * @param props
 */
const NumberInput: React.FC<QueryControlProps> = (props) => {
  const { onChange, value: numbersValue, item } = props;

  const handleChange = (value: string | number | undefined, index: number) => {
    if (index === 0) {
      onChange([value, numbersValue[1]]);
    } else if (index === 1) {
      onChange([numbersValue[0], value]);
    }
  };

  const defaultValue = useMemo(
    () => (item.defaultValue ? item.defaultValue.split(';').map((i) => Number(i)) : []),
    [item.defaultValue],
  );
  return (
    <Input.Group compact>
      <InputNumber
        // value={numbersValue[0] as number}
        defaultValue={defaultValue[0]}
        onChange={(value) => handleChange(value, 0)}
        style={{ width: '40%', textAlign: 'center' }}
        placeholder="Minimum"
      />
      <Input
        style={{
          width: '20%',
          textAlign: 'center',
        }}
        placeholder="~"
        disabled
      />
      <InputNumber
        // value={numbersValue[1] as number}
        defaultValue={defaultValue[1]}
        onChange={(value) => handleChange(value, 1)}
        style={{
          width: '40%',
          textAlign: 'center',
        }}
        placeholder="Maximum"
      />
    </Input.Group>
  );
};

export default NumberInput;
