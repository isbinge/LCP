import React, { useMemo } from 'react';
import { Checkbox as AntdCheckbox } from 'antd';
import { CheckboxGroupProps } from 'antd/lib/checkbox/Group';
import { v1 as uuidv1 } from 'uuid';

interface CompProps {
  options?: CheckboxGroupProps;
  value: {
    data: {
      options: {
        optionsValue: string[];
        selectValue: string[];
      };
      [x: string]: unknown;
    };
  };
}

const CheckboxGroup = AntdCheckbox.Group;

const Checkbox: React.FC<CompProps> = (props) => {
  const { value: ctrlData } = props;
  const options = ctrlData.data.options.optionsValue;
  const checkboxOptions = useMemo(() => {
    return options.map((item) => (
      <AntdCheckbox value={item} key={uuidv1()}>
        {item}
      </AntdCheckbox>
    ));
  }, [options]);

  return (
    <CheckboxGroup {...props.options} value={ctrlData.data.options.selectValue || []}>
      {checkboxOptions}
    </CheckboxGroup>
  );
};

export default Checkbox;
