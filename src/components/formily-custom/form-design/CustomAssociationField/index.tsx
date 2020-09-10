import React, { useState, useEffect, useMemo } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { Select, Checkbox, Tooltip, message } from 'antd';
import { QuestionCircleFilled } from '@ant-design/icons';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { SelectProps } from 'antd/lib/select';
// import update from 'immutability-helper';

import { useSelector, useDispatch } from 'dva';
import { SelectState } from '@/domain/select.d';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { FormItemSpec } from '@/domain/form/template/model';
import { getSelectedCtrl } from '@/domain/form/template/common';
import FormTemplate from '@/domain/form/template/data';

const { Option } = Select;

const hasValidAssocForm = (data: FormItemSpec) =>
  data.compType === 'associationForm' &&
  Object.keys(data.data).length > 0 &&
  data.data?.associateForm.schemaCode !== '';

/** 自定义关联表单选择 custom-association-field
 * 用于关联属性· 表单字段选择 */
const CustomAssociationField: React.FC<ISchemaFieldComponentProps> = (props) => {
  const { value, onChange } = props;
  const { associateForm, associateField, setting } = value;
  const intl = useIntl();
  const [assocFormFields, setAssocFormFields] = useState<FormTemplate.DbFieldsDto>([]);
  const [selectedAssocFormId, setSelectedAssocFormId] = useState(associateForm);
  const dispatch: Dva.Dispatch = useDispatch();
  const { formItemSpecs, currentId } = useSelector(({ formTemplate }: SelectState) => formTemplate);

  const [subFormCode, currentCode] = useMemo(() => {
    const ctrl = getSelectedCtrl(currentId || '', formItemSpecs);
    const currentFieldCode = ctrl?.code;
    const currentFieldSubFormId = ctrl?.subFormId;
    const currentSubFormCode = formItemSpecs.find((item) => item.id === currentFieldSubFormId)
      ?.code;
    return [
      currentSubFormCode,
      currentSubFormCode ? `${currentSubFormCode}.${currentFieldCode}` : currentFieldCode,
    ];
  }, [currentId, formItemSpecs]);

  const assocForms = useMemo(() => {
    const associationFormData = formItemSpecs.filter((item) => hasValidAssocForm(item));
    const subForms = formItemSpecs.filter((item) => item.compType === 'subform');
    if (subFormCode) {
      // 子表中的关联属性 (主表关联表单 + 所属子表的关联表单)
      const subFormAssocFormData: FormItemSpec[] = [];
      subForms
        .filter((subForm) => subForm.code === subFormCode)
        .forEach((subForm) => {
          subFormAssocFormData.push(
            ...(subForm.extraData as FormItemSpec[]).filter((item) => hasValidAssocForm(item)),
          );
        });
      return associationFormData.concat(subFormAssocFormData);
    }
    // 主表中的关联属性 （主表关联属性）
    return associationFormData;
  }, [formItemSpecs, subFormCode]);

  const handleAssociationFormChange: SelectProps<string>['onChange'] = (selectValue, option) => {
    if (!Array.isArray(option)) {
      const selectedCtrl = getSelectedCtrl(selectedAssocFormId, formItemSpecs);
      if (selectedCtrl) {
        const updateSelectedCtrl = {
          ...selectedCtrl,
          data: {
            ...selectedCtrl?.data,
            mappingProperties: selectedCtrl?.data.mappingProperties.filter(
              (item: string) => !item.includes(currentCode as string),
            ),
          },
        };
        dispatch({
          type: 'formTemplate/updateCtrl',
          payload: {
            selectedCtrl,
            updateSelectedCtrl,
            id: selectedAssocFormId,
          },
        });
      }
      setSelectedAssocFormId(option.key as string);
    }

    onChange({
      ...value,
      associateForm: selectValue,
      associateField: '',
    });
  };

  const handleAssociateFieldChange = (selectValue: string) => {
    const field = assocFormFields.find((item) => item.name === selectValue);
    const dataType = field ? field.dataType : null;
    const propertie = `${currentCode}:${selectValue}`;

    const selectedCtrl = getSelectedCtrl(selectedAssocFormId, formItemSpecs);
    if (selectedCtrl) {
      const updateSelectedCtrl = {
        ...selectedCtrl,
        data: {
          ...selectedCtrl?.data,
          mappingProperties: [
            ...selectedCtrl?.data.mappingProperties.filter(
              (item: string) => !item.includes(currentCode as string),
            ),
            propertie,
          ],
        },
      };

      dispatch({
        type: 'formTemplate/updateCtrl',
        payload: {
          selectedCtrl,
          updateSelectedCtrl,
          id: selectedAssocFormId,
        },
      });
    }
    onChange({
      ...value,
      associateField: selectValue,
      dataType,
    });
  };

  const handleSettingChange = (e: CheckboxChangeEvent) => {
    onChange({
      ...value,
      setting: e.target.checked,
    });
  };

  useEffect(() => {
    if (associateForm !== '') {
      const selectedAssocForm = assocForms.find((item) => item.id === associateForm);
      if (!selectedAssocForm) {
        onChange({
          ...value,
          associateForm: '',
        });
        setAssocFormFields([]);
        return;
      }
      dispatch<FormTemplate.GetDbFieldsPayload, FormTemplate.DbFieldsDto>({
        type: 'formTemplate/getDbFields',
        payload: {
          formCode: selectedAssocForm.data.associateForm.schemaCode,
          isChildSchema: selectedAssocForm.data.associateForm.isChildSchema,
        },
      })
        .then((items) => {
          setAssocFormFields(items);
        })
        .catch((error) => {
          message.error({ content: error, key: 'error' });
        });
    } else {
      setAssocFormFields([]);
    }
  }, [value.associateForm]);

  const assocFormOption = assocForms.map((item) => {
    const subForm = formItemSpecs.find((fi) => fi.id === item.subFormId);
    const name = item.subFormId ? `${subForm?.data.name}.${item.data.name}` : `${item.data.name}`;
    return (
      <Option key={item.id} value={item.id}>
        {name}
      </Option>
    );
  });

  const assocFormFieldsOption = assocFormFields.map((item) => (
    <Option key={item.name} value={item.name}>
      {item.displayName}
    </Option>
  ));

  return (
    <>
      <Select defaultValue="-1" value={associateForm} onChange={handleAssociationFormChange}>
        <Option key="-1" value="">
          <FM id="formtpl.schema.assocattr.formdefault" />
        </Option>
        {assocFormOption}
      </Select>
      <Select
        defaultValue="-1"
        style={{ marginTop: 10 }}
        value={associateField}
        onChange={handleAssociateFieldChange}
      >
        <Option key="-1" value="">
          <FM id="formtpl.schema.assocattr.fielddefault" />
        </Option>
        {assocFormFieldsOption}
      </Select>
      <Checkbox checked={setting} onChange={handleSettingChange}>
        <FM id="formtpl.schema.assocattr.setcontent" />
        <Tooltip
          title={intl.formatMessage({ id: 'formtpl.schema.assocattr.tips' })}
          overlayClassName="tool-tips-container"
        >
          <QuestionCircleFilled style={{ color: '#ddd', marginLeft: 5 }} />
        </Tooltip>
      </Checkbox>
    </>
  );
};
export default CustomAssociationField;
