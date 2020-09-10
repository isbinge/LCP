import React from 'react';
import { Switch as AntdSwitch } from 'antd';
import { SwitchProps } from 'antd/lib/switch';

interface CompProps {
  options?: SwitchProps;
  value: {
    data: {
      switch: boolean;
      content: string;
      [x: string]: unknown;
    };
  };
}

const Swtich: React.FC<CompProps> = props => (
  <>
    <AntdSwitch checked={props.value.data.switch || false} {...props.options} />
  </>
);

export default Swtich;
