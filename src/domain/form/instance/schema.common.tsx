import React from 'react';
import { FormattedMessage as FM } from 'react-intl';
import { ISchema } from '@formily/antd';
import { Tooltip } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

import { textFormatTypeMap } from '@/domain/form/template/common';
import { FormSchemaData } from '@/pages/form/record/collect/shared/form-schema';
import { componentDefinition } from '@/constants';

import { FormItemControlType } from '@/constants/form/common';
import { getDataLinkageMappings } from '@/pages/form/record/collect/shared/common';
import { GetCompSchema, DataLkgMappings } from './schema-type';
import {
  SingleLineInputControl,
  CheckboxControl,
  SwitchControl,
  NumberInputControl,
  TextareaControl,
  DateControl,
  RadioControl,
  SelectControl,
} from '../template/basic/adapter/adapter-type';
import {
  AssocAttrControl,
  AssocMultFormControl,
  AssocFormControl,
} from '../template/advanced/adapter/adapter-type';
import FormRecordData from './data';

interface TitleWithDescProps {
  name: React.ReactNode;
  description: React.ReactNode;
}

export const TitleWithDesc: React.FC<TitleWithDescProps> = ({ name, description }) => (
  <div>
    {name}{' '}
    {description && (
      <Tooltip title={description} overlayClassName="tool-tips-container">
        <InfoCircleFilled style={{ color: '#ddd', marginLeft: 5 }} />
      </Tooltip>
    )}
  </div>
);

export const getInput = (
  props: SingleLineInputControl,
  fieldName: string,
  dataLinkageMappings?: DataLkgMappings,
) => ({
  type: 'string',
  title: <TitleWithDesc name={props.name} description={props.description} />,
  'x-component': 'custom-form-record-input',
  'x-component-props': {
    ...props,
    placeholder: props.placeHolder,
    fieldName,
    dataLinkageMappings,
  },

  'x-rules':
    props.mode === textFormatTypeMap.text
      ? {
          max: 200,
          message: <FM id="forminst.schema.input.nomal.message" values={{ count: 200 }} />,
        }
      : {
          format: textFormatTypeMap[props.mode],
          message: <FM id={`forminst.schema.input.${textFormatTypeMap[props.mode]}.message`} />,
        },
});

export const getTextarea = (
  props: TextareaControl,
  fieldName: string,
  dataLinkageMappings?: DataLkgMappings,
) => ({
  type: 'string',
  title: <TitleWithDesc name={props.name} description={props.description} />,
  'x-component': 'custom-form-record-textarea',
  'x-component-props': {
    ...props,
    fieldName,
    dataLinkageMappings,
  },
  'x-rules': {
    max: 2000,
    message: <FM id="forminst.schema.input.nomal.message" values={{ count: 2000 }} />,
  },
});

export const getDate = (
  props: DateControl,
  fieldName: string,
  dataLinkageMappings?: DataLkgMappings,
) => ({
  type: 'date',
  title: <TitleWithDesc name={props.name} description={props.description} />,
  'x-component': 'custom-form-record-date',
  'x-component-props': {
    ...props,
    fieldName,
    dataLinkageMappings,
  },
});

export const getNumber = (
  props: NumberInputControl,
  fieldName: string,
  dataLinkageMappings?: DataLkgMappings,
) => ({
  type: 'number',
  title: <TitleWithDesc name={props.name} description={props.description} />,
  'x-component': 'custom-form-record-num',
  'x-component-props': {
    ...props,
    fieldName,
    dataLinkageMappings,
  },
});
export const getRadio = (
  props: RadioControl,
  fieldName: string,
  dataLinkageMappings?: DataLkgMappings,
) => ({
  type: 'radio',
  title: <TitleWithDesc name={props.name} description={props.description} />,
  'x-component': 'custom-form-record-radio',
  'x-component-props': {
    ...props,
    fieldName,
    dataLinkageMappings,
  },
});
export const getCheckbox = (props: CheckboxControl, fieldName: string) => ({
  type: 'checkbox',
  title: <TitleWithDesc name={props.name} description={props.description} />,
  enum: typeof props.defaultItems === 'string' && props.defaultItems?.split(';'),
  'x-component-props': {
    fieldName,
  },
});
export const getSelect = (
  props: SelectControl,
  fieldName: string,
  dataLinkageMappings?: DataLkgMappings,
) => ({
  type: 'string',
  'x-component': 'custom-select',
  title: <TitleWithDesc name={props.name} description={props.description} />,
  'x-component-props': {
    ...props,
    placeholder: '',
    fieldName,
    dataLinkageMappings,
  },
});
export const getSwitch = (props: FormSchemaData & { editable: boolean }, fieldName: string) => ({
  type: 'boolean',
  title: (props as SwitchControl).name,
  editable: props.editable,
  'x-component-props': {
    fieldName,
    checkedChildren: <FM id="forminst.schema.switch.yes" />,
    unCheckedChildren: <FM id="forminst.schema.switch.no" />,
  },
});

export const getGroupTitle = (props: FormSchemaData, fieldName: string) => ({
  type: 'boolean',
  'x-component': 'custom-group-title',
  'x-component-props': {
    ...props,
    fieldName,
  },
});

export const getDescription = (props: FormSchemaData, fieldName: string) => ({
  type: 'string',
  'x-component-props': {
    style: { backgroundColor: '#fffdf7', color: '#8893a7' },
    fieldName,
  },
  'x-component': 'custom-text',
});
export const getSerialNo = (props: FormSchemaData, fieldName: string) => ({
  type: 'string',
  title: props.name,
  'x-component-props': {
    textElement: <FM id="forminst.common.gen-by-sys" />,
    style: { color: '#8893a7' },
    fieldName,
  },
  'x-component': 'custom-text',
});
export const getCreator = (props: FormSchemaData, fieldName: string) => ({
  type: 'string',
  title: props.name || <FM id="forminst.schema.creator" />,
  'x-component-props': {
    textElement: <FM id="forminst.common.gen-by-sys" />,
    style: { color: '#8893a7' },
    fieldName,
  },
  'x-component': 'custom-text',
  display: props.sequenceNumber >= 0,
});
export const getModifyTime = (props: FormSchemaData, fieldName: string) => ({
  type: 'string',
  title: props.name || <FM id="forminst.schema.modify-time" />,
  'x-component-props': {
    textElement: <FM id="forminst.common.gen-by-sys" />,
    style: { color: '#8893a7' },
    fieldName,
  },
  'x-component': 'custom-text',
});
export const getCreateTime = (props: FormSchemaData, fieldName: string) => ({
  type: 'string',
  title: props.name || <FM id="forminst.schema.create-time" />,
  'x-component-props': {
    textElement: <FM id="forminst.common.gen-by-sys" />,
    style: { color: '#8893a7' },
    fieldName,
  },
  'x-component': 'custom-text',
});
export const getAssocForm = (
  props: AssocFormControl,
  fieldName: string,
  dataLinkageMappings?: DataLkgMappings,
) => ({
  type: 'string',
  title: <TitleWithDesc name={props.name} description={props.description} />,
  'x-component-props': {
    ...props,
    mode: 'null',
    fieldName,
    dataLinkageMappings,
  },
  'x-component': 'custom-assoc-select',
});
export const getAssocAttr = (props: AssocAttrControl, fieldName: string) => ({
  type: 'string',
  title: <TitleWithDesc name={props.name} description={props.description} />,
  'x-component-props': {
    ...props,
    fieldName,
    type: FormItemControlType.ASSOC_ATTR,
  },
  'x-component': 'custom-assoc-attr',
});
export const getAssocMultForm = (props: AssocMultFormControl, fieldName: string) => ({
  type: 'string',
  title: <TitleWithDesc name={props.name} description={props.description} />,
  'x-component-props': {
    ...props,
    mode: 'multiple',
    fieldName,
  },
  'x-component': 'custom-assoc-select',
});

export const getReadOnlyText = (props: FormSchemaData, fieldName: string) => ({
  type: 'string',
  title: <TitleWithDesc name={props.name} description={props?.description} />,
  'x-component-props': {
    title: props.name,
    fieldName,
  },
  'x-component': 'custom-text',
});

export const getAssocLink = (props: AssocMultFormControl, fieldName: string) => ({
  type: 'string',
  title: <TitleWithDesc name={props.name} description={props.description} />,
  'x-component-props': {
    ...props,
    fieldName,
  },
  'x-component': 'custom-assoc-link',
});

export const getSubForm = (
  props: FormSchemaData,
  fieldName: string,
  readonly = true,
  dataLinkageMappings?: DataLkgMappings,
) => ({
  type: 'string',
  'x-component-props': {
    subFormControl: props,
    fieldName,
    readonly,
    dataLinkageMappings,
  },
  'x-component': 'custom-subForm',
});

export const getOwnerSelect = (
  props: FormSchemaData,
  isCreate: boolean,
  ownerDepts?: FormRecordData.OwnerDeptValue,
) => ({
  type: 'string',
  title: <TitleWithDesc name={props.name} description={props.description} />,
  'x-component-props': {
    ownerControl: props,
    ownerDepts,
    isCreate,
  },
  'x-rules': {
    required: true,
    message: <FM id="forminst.schema.owner.message" />,
  },
  'x-component': 'custom-owner',
  display: props.sequenceNumber >= 0,
});

export const getOwnerDeptSelect = (
  props: FormSchemaData,
  ownerDepts?: FormRecordData.OwnerDeptValue,
) => ({
  type: 'string',
  title: <TitleWithDesc name={props.name} description={props.description} />,
  'x-component-props': {
    ownerDeptControl: props,
    ownerDepts,
  },
  'x-rules': {
    required: true,
    message: <FM id="forminst.schema.ownerdept.message" />,
  },
  'x-component': 'custom-owner-dept',
  display: props.sequenceNumber >= 0,
});

const getNameAndControlTypeMap = () => {
  const nameAndControlTypeMap = new Map();
  Object.entries(componentDefinition).forEach(([key, item]) => {
    nameAndControlTypeMap.set(item.controlType, key);
  });
  return nameAndControlTypeMap;
};

export const getFormSchema = (
  ctrlData: FormSchemaData[],
  getCompSchema: GetCompSchema,

  isCreate: boolean,
  ownerDepts?: FormRecordData.OwnerDeptValue[],
) => {
  const formSchema: ISchema = {
    type: 'object',
    properties: {},
  };
  const nameAndControlTypeMap = getNameAndControlTypeMap();
  const getFieldName = (item: FormSchemaData) => item.code || item.id;
  const dataLinkageMappings = getDataLinkageMappings(ctrlData);
  ctrlData.forEach((item) => {
    const fieldName = getFieldName(item);
    if (formSchema.properties) {
      formSchema.properties[fieldName] = getCompSchema(
        nameAndControlTypeMap.get(item.controlType || 16),
        item,
        fieldName,
        isCreate,
        dataLinkageMappings,
        ownerDepts,
      );
    }
  });
  return formSchema;
};
