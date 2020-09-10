import React, { useState, useEffect } from 'react';
import { Modal, Input } from 'antd';

import { CustomOptionProps } from '@comp/formily-custom/form-design/CustomOptions';
import { FormattedMessage as FM } from 'react-intl';

const { TextArea } = Input;

interface IProps {
  options: CustomOptionProps[];
  visible: boolean;
  handleOk: (value: string) => void;
  handleCancel: () => void;
}

/** 批量添加modal */
const BulkAdding: React.FC<IProps> = (props: IProps) => {
  const { visible, handleCancel, handleOk, options } = props;
  const [value, setValue] = useState<string>('');
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };
  useEffect(() => {
    setValue(options.map((item: CustomOptionProps) => item.value).join('\n'));
  }, [visible]);
  return (
    <Modal
      title={<FM id="formtpl.schema.common.massedit" />}
      visible={visible}
      onOk={() => handleOk(value)}
      onCancel={handleCancel}
      okText={<FM id="formtpl.schema.common.buildoption" />}
      width={338}
      bodyStyle={{ fontSize: 14, color: '#304265' }}
    >
      <p>
        <FM id="formtpl.schema.common.linedsc" />
      </p>
      <TextArea rows={4} onChange={handleChange} value={value} />
    </Modal>
  );
};

export default BulkAdding;
