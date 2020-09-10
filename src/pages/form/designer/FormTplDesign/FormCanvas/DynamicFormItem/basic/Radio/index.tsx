import React, { useMemo } from 'react';
import { Radio as AntdRadio } from 'antd';
import { RadioGroupProps } from 'antd/lib/radio';
import { v1 as uuidv1 } from 'uuid';

interface CompProps {
  options?: RadioGroupProps;
  value: {
    data: {
      options: {
        optionsValue: string[];
        selectValue: string;
      };
    };
  };
}

const RadioGroup = AntdRadio.Group;

const Radio: React.FC<CompProps> = (props) => {
  const options = props.value.data.options.optionsValue;
  const radioOptions = useMemo(() => {
    return options.map((item) => (
      <AntdRadio value={item} key={uuidv1()}>
        {item}
      </AntdRadio>
    ));
  }, [options]);

  return (
    <RadioGroup {...props.options} value={props.value.data.options.selectValue || ''}>
      {radioOptions}
    </RadioGroup>
  );
};

export default Radio;
