import React from 'react';
import { Input } from 'antd';

interface ValueProps {
  data: { description: string };
}
interface CompProps {
  value: ValueProps;
}

const Description: React.FC<CompProps> = props => (
  <Input.TextArea
    readOnly
    autoSize={{ minRows: 1 }}
    placeholder={props.value.data.description || ''}
    style={{ resize: 'none', background: '#fffdf8' }}
  />
);

export default Description;
