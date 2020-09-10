import React, { useMemo } from 'react';
import { Form, Input, Select } from 'antd';
import { FormItemControlType } from '@/constants/form/common';

const RldSearchCondPreview: React.FC<{ type: FormItemControlType; label: string }> = ({
  type,
  label,
}) => {
  const preview = useMemo(() => {
    switch (type) {
      case FormItemControlType.INPUT:
      case FormItemControlType.TEXTAREA:
      case FormItemControlType.SWITCH:
      case FormItemControlType.ASSOC_FORM_MULTI_SELECT:
      case FormItemControlType.SERIAL_NO: {
        return <Input readOnly />;
      }
      case FormItemControlType.NUMBER:
      case FormItemControlType.DATE:
      case FormItemControlType.CREATE_TIME:
      case FormItemControlType.MODIFY_TIME: {
        return (
          <Input.Group compact>
            <Input readOnly style={{ width: '50%' }} addonBefore="From" />
            <Input readOnly style={{ width: '50%' }} addonBefore="To" />
          </Input.Group>
        );
      }
      case FormItemControlType.CHECKBOX:
      case FormItemControlType.RADIO:
      case FormItemControlType.SELECT: {
        return <Select />;
      }
      case FormItemControlType.CREATOR: {
        return (
          <Input
            readOnly
            style={{
              backgroundColor: 'rgb(255, 255, 255)',
              border: '1px dashed rgb(204, 204, 204)',
              textAlign: 'center',
            }}
            placeholder={`Click to select ${label ?? 'field'}`}
          />
        );
      }
      default: {
        return <Input readOnly />;
      }
    }
  }, [type, label]);

  return (
    <Form.Item
      label={label}
      labelCol={{ sm: { span: 12 }, lg: { span: 8 }, xxl: { span: 6 } }}
      wrapperCol={{ sm: { span: 12 }, lg: { span: 16 }, xxl: { span: 18 } }}
      labelAlign="left"
    >
      <>{preview}</>
    </Form.Item>
  );
};

export default RldSearchCondPreview;
