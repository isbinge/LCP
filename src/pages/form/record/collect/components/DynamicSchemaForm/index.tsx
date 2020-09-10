/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { SchemaForm, ISchema } from '@formily/antd';
import { useDispatch } from 'dva';
import { actions } from '@comp/formily-custom/form-record';
import { getFormEffects } from '@/domain/form/instance/effect.common';
import {
  GroupTitleMappings,
  DataLkgMappings,
  AssocFormMappings,
} from '@/domain/form/instance/schema-type';

import './index.global.scss';

interface DynamicSchemaFormProps {
  initialValues: { [id: string]: any };
  schema: ISchema;
  groupTitleMappings: GroupTitleMappings;
  handleFullScreen?: (mode: string) => void;
  dataLinkageMappings?: DataLkgMappings;
  assocFormMappings?: AssocFormMappings;
  isCreate?: boolean;
}

const DynamicSchemaForm: React.FC<DynamicSchemaFormProps> = (props) => {
  const {
    initialValues,
    schema,
    groupTitleMappings,
    dataLinkageMappings,
    handleFullScreen,
    assocFormMappings,
    isCreate,
  } = props;
  const dispatch = useDispatch();

  return (
    <SchemaForm
      layout="vertical"
      className="form-schema"
      initialValues={initialValues}
      colon={false}
      schema={schema}
      effects={getFormEffects(
        { groupTitleMappings, dataLinkageMappings, assocFormMappings },
        handleFullScreen,
        dispatch,
        isCreate,
      )}
      actions={actions}
    />
  );
};

export default DynamicSchemaForm;
