import React from 'react';
import { Input } from 'antd';
import { useIntl } from 'react-intl';

const AssociationFormMultiSelect: React.FC = () => {
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

export default AssociationFormMultiSelect;
