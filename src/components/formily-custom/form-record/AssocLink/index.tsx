import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { LinkR } from '@lib/react-router-dom';

import { CELL_PLACEHOLDER } from '@/constants/record/common';
import { SelectedValueType } from '../AssocFormModal';

const getShowValue = (value: SelectedValueType) => {
  if (value && !Array.isArray(value) && value.objectId) {
    return [value];
  }
  if (value && Array.isArray(value)) {
    return value.filter((item) => item.objectId);
  }
  return [];
};

const AssocLink: React.FC<ISchemaFieldComponentProps> = (props) => {
  const { value, schemaCode, schemaId, schemaAppId } = props;
  const showValue = getShowValue(value);

  return (
    <div>
      {showValue.map((item, index) => {
        return (
          <LinkR
            key={item.objectId}
            to="/app/:appId/form/:templateId/inst/:instanceId/examine/:objectId"
            values={{
              appId: schemaAppId,
              templateId: schemaId,
              instanceId: schemaCode,
              objectId: item.objectId,
            }}
          >
            {showValue.length === index + 1
              ? item.value || CELL_PLACEHOLDER
              : `${item.value || CELL_PLACEHOLDER};`}
          </LinkR>
        );
      })}
    </div>
  );
};
export default AssocLink;
