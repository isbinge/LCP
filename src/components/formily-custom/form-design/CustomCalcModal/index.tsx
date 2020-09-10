import React, { useState } from 'react';
import { FormattedMessage as FM } from 'react-intl';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

/** 自定义弹窗custom-calcformula-modal， 用于计算公式，隐藏条件 */
const CustomCalcModal: React.FC<ISchemaFieldComponentProps> = (props) => {
  const { onChange, value } = props;
  const [stateValue] = useState(value);
  const [visible, setVisible] = useState(false);
  const handleOk = () => {
    setVisible(false);
    onChange(stateValue);
  };
  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <Button block onClick={() => setVisible(true)}>
        <div style={{ float: 'right' }}>
          <PlusOutlined />
        </div>
      </Button>
      <Modal
        title={
          value?.label ? (
            <FM id="formtpl.schema.common.defval.formula" />
          ) : (
            <FM id="formtpl.schema.common.hidecond" />
          )
        }
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>This feature is under development, so stay tuned!</p>
      </Modal>
    </>
  );
};
export default CustomCalcModal;
