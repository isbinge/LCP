import React, { useEffect, useState } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { Select, message } from 'antd';
import { getSelectedCtrl } from '@/domain/form/template/common';
import { useSelector, useDispatch } from 'dva';

import { SelectState } from '@/domain/select.d';
import { FormItemDataType } from '@/constants/form/common';
import FormTemplate from '@/domain/form/template/data';

const { Option } = Select;

interface AssocFormFieldsProps {
  dataType: number;
  displayName: string;
  isChildFiled: number;
  name: string;
}

/**
 *  自定义 custom-select-asField  关联表单字段的选择
 * 用于下拉框 生成选项使用
 */

const CustomSelectAsField: React.FC<ISchemaFieldComponentProps> = (props) => {
  const { value, onChange } = props;
  const formItemSpecs = useSelector(({ formTemplate }: SelectState) => formTemplate.formItemSpecs);
  const currentId = useSelector(({ formTemplate }: SelectState) => formTemplate.currentId);
  const dispatch: Dva.Dispatch = useDispatch();
  const currentComp = getSelectedCtrl(currentId as string, formItemSpecs);
  const { schemaCode, isChildSchema } = currentComp?.data.associateForm;
  const [associationFormFields, setAssociationFormFields] = useState<AssocFormFieldsProps[]>([]);
  const handleChange = (selectValue: string) => {
    onChange(selectValue);
  };
  useEffect(() => {
    if (schemaCode) {
      dispatch<FormTemplate.GetDbFieldsPayload>({
        type: 'formTemplate/getDbFields',
        payload: {
          formCode: schemaCode,
          isChildSchema,
        },
      })
        .then((items) => {
          if (items) {
            setAssociationFormFields(items);
          }
        })
        .catch((error) => {
          message.error({ content: error, key: 'error' });
        });
    }
  }, [schemaCode]);

  const asFormFieldsOption = associationFormFields
    .filter((item) => item.dataType === FormItemDataType.INDICATOR && item.name !== 'Id')
    .map((item) => (
      <Option key={item.name} value={item.name}>
        {item.displayName}
      </Option>
    ));

  return (
    <Select value={value} onChange={handleChange}>
      {asFormFieldsOption}
    </Select>
  );
};

export default CustomSelectAsField;
