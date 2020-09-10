import React from 'react';
import { useIntl } from 'react-intl';
import { Input } from 'antd';

const AssociationForm: React.FC = () => {
  const intl = useIntl();
  return (
    <Input.TextArea
      readOnly
      autoSize={{ minRows: 1 }}
      placeholder={intl.formatMessage({ id: 'formtpl.canvas.common.select.ph' })}
      style={{ resize: 'none', background: '#fffdf8' }}
    />
  );
};

export default AssociationForm;
