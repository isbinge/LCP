import React, { ReactNode } from 'react';
import { FormattedMessage as FM } from 'react-intl';
import { ISchema } from '@formily/antd';
import LcpIntl from '@/utils/locale';

import { getSelectOptions } from '../common';
import { FormItemSpec } from '../model';

/** 公共field */
const inputType: ISchema = {
  type: 'string',
  title: <FM id="formtpl.schema.common.convert" />,
  'x-component-props': {
    getPopupContainer: () => document.getElementById('form-design-comp-properties-area'),
  },
  enum: [
    { label: <FM id="formtpl.comp.input" />, value: 'input' },
    { label: <FM id="formtpl.comp.select" />, value: 'select' },
    { label: <FM id="formtpl.comp.radio" />, value: 'radio' },
    { label: <FM id="formtpl.comp.checkbox" />, value: 'checkbox' },
  ],
};

export const hideRule = {
  type: 'custom-calcformula-modal',
  title: <FM id="formtpl.schema.common.hidecond" />,
  description: <FM id="formtpl.schema.common.hidecond.desc" />,
};

const defaultValue: ISchema = {
  type: 'object',
  title: <FM id="dict.defaultvalue" />,
  properties: {
    calcFormula: {
      type: 'string',
      'x-component-props': {
        getPopupContainer: () => document.getElementById('form-design-comp-properties-area'),
      },
      enum: [
        { label: <FM id="formtpl.schema.common.defval.formula" />, value: 'calcFormula' },
        { label: <FM id="formtpl.schema.common.defval.datalinkage" />, value: 'dataAssoc' },
      ],
    },
    calcSelect: {
      type: 'custom-calcformula-modal',
    },
    dataLink: {
      type: 'custom-datalink-modal',
    },
  },
};
const tip: ISchema = {
  type: 'string',
  title: <FM id="formtpl.schema.common.tips" />,
};
export const description: ISchema = {
  type: 'string',
  title: <FM id="dict.description" />,
  'x-component': 'textarea',
  'x-component-props': {
    'min-rows': 2,
    style: {
      resize: 'none',
    },
  },
};
const options: ISchema = {
  type: 'custom-options-radio',
  title: <FM id="dict.option" />,
};

export const nameWrapper = (type: ReactNode): ISchema => {
  const { intl } = LcpIntl;
  return {
    type: 'custom-wrapper',
    title: <FM id="formtpl.schema.common.comptitle" />,
    'x-component-props': {
      fieldType: type,
    },
    properties: {
      name: {
        type: 'string',
        'x-component-props': {
          placeholder: intl.formatMessage({ id: 'formtpl.schema.common.comptitle' }),
          maxLength: 32,
        },
      },
    },
  };
};

/** 单行文本 */
export const inputProperties = (): ISchema => ({
  type: 'object',
  properties: {
    wrapper: nameWrapper(<FM id="formtpl.comp.input" />),
    inputType: {
      ...inputType,
    },
    // hideRule,
    defaultValue,
    format: {
      type: 'string',
      title: <FM id="dict.format" />,
      'x-component-props': {
        getPopupContainer: () => document.getElementById('form-design-comp-properties-area'),
      },
      enum: [
        {
          label: <FM id="formtpl.schema.input.format.text" />,
          value: 'text',
        },
        {
          label: <FM id="dict.email" />,
          value: 'email',
        },
        {
          label: <FM id="dict.idcard" />,
          value: 'idcard',
        },
        {
          label: <FM id="formtpl.schema.input.format.phone" />,
          value: 'phone',
        },
      ],
    },
    // verify: {
    //   type: 'checkbox',
    //   title: <FM id="formtpl.schema.input.valid" />,
    //   enum: [{ label: <FM id="formtpl.schema.input.valid.norepeat" />, value: 1 }],
    // },
    tip,
    description,
  },
});

/** 多行文本 */
export const textAreaProperties = (): ISchema => ({
  type: 'object',
  properties: {
    wrapper: nameWrapper(<FM id="formtpl.comp.textarea" />),
    visibleRows: {
      type: 'number',
      title: <FM id="formtpl.schema.textarea.rows" />,
      'x-component-props': {
        style: { width: '100%' },
        max: 10,
        precision: 0,
      },
    },
    // hideRule,
    defaultValue,
    tip,
    description,
  },
});

/** 日期 */
export const dateProperties = (): ISchema => ({
  type: 'object',
  properties: {
    wrapper: nameWrapper(<FM id="formtpl.comp.date" />),
    // hideRule,
    defaultValue,
    format: {
      type: 'string',
      title: <FM id="formtpl.schema.date.format" />,
      'x-component-props': {
        getPopupContainer: () => document.getElementById('form-design-comp-properties-area'),
      },
      enum: [
        {
          label: <FM id="formtpl.schema.date.format.ymd" />,
          value: 'YMD',
        },
        {
          label: <FM id="formtpl.schema.date.format.ym" />,
          value: 'YM',
        },
        {
          label: <FM id="formtpl.schema.date.format.ymdhm" />,
          value: 'YMDHM',
        },
        {
          label: <FM id="formtpl.schema.date.format.hm" />,
          value: 'HM',
        },
      ],
    },
    description,
  },
});

/** 数字 */
export const numberProperties = (): ISchema => ({
  type: 'object',
  properties: {
    wrapper: nameWrapper(<FM id="formtpl.comp.num" />),
    // hideRule,
    defaultValue,
    format: {
      type: 'object',
      title: <FM id="dict.format" />,
      properties: {
        showDecimal: {
          type: 'checkbox',
          enum: [{ label: <FM id="formtpl.schema.num.format.decimal" />, value: true }],
        },
        placesNumber: {
          type: 'number',
          'x-component-props': {
            max: 16,
            min: 0,
            precision: 0,
            style: { width: '100%' },
          },
        },
        showThousandSep: {
          type: 'checkbox',
          enum: [{ label: <FM id="formtpl.schema.num.format.groupsep" />, value: true }],
        },
      },
    },
    description,
  },
});

/** 单选框 */
export const radioProperties = (): ISchema => ({
  type: 'object',
  properties: {
    wrapper: nameWrapper(<FM id="formtpl.comp.radio" />),
    inputType: {
      ...inputType,
    },
    // hideRule,
    options,
    description,
  },
});

/** 复选框 */
export const checkboxProperties = (): ISchema => ({
  type: 'object',
  properties: {
    wrapper: nameWrapper(<FM id="formtpl.comp.checkbox" />),
    inputType: {
      ...inputType,
    },
    // hideRule,
    options: {
      type: 'custom-options-checkbox',
      title: <FM id="dict.option" />,
    },
    description,
  },
});

/** 下拉框 */
export const selectProperties = (): ISchema => ({
  type: 'object',
  properties: {
    wrapper: nameWrapper(<FM id="formtpl.comp.select" />),
    inputType: {
      ...inputType,
    },
    // hideRule,
    sourceFrom: {
      type: 'radio',
      title: <FM id="formtpl.schema.select.datasource" />,
      enum: [
        { label: <FM id="dict.custom" />, value: 'custom' },
        { label: <FM id="formtpl.schema.select.datasource.assocform" />, value: 'assocForm' },
      ],
    },
    options,
    associateForm: {
      type: 'custom-select-form',
      title: <FM id="formtpl.schema.select.datasource.fromfields" />,
    },
    mappingField: {
      type: 'custom-select-asField',
    },
    dataLimit: {
      type: 'string',
      title: <FM id="formtpl.schema.common.datarange" />,
    },
    description,
  },
});

/** 开关 */
export const switchProperties: ISchema = {
  type: 'object',
  properties: {
    // hideRule,
    options: {
      type: 'object',
      'x-component': 'grid',
      'x-component-props': {
        title: <FM id="dict.option" />,
        cols: [18, 6],
        gutter: 10,
      },
      properties: {
        content: {
          type: 'string',
        },
        switch: {
          type: 'boolean',
        },
      },
    },
  },
};
/* 人员单选 */
export const staffSingleSelectProperties = (
  _: FormItemSpec,
  formItemSpecs: FormItemSpec[],
): ISchema => {
  // 单行文本
  const inputOptions: ISchema['enum'] = [
    { label: <FM id="formtpl.schema.common.options.placeholder" />, value: '0' },
    ...getSelectOptions(formItemSpecs, ['input']),
  ];

  // 部门多选
  const deptMultiOptions: ISchema['enum'] = [
    { label: <FM id="formtpl.schema.common.options.placeholder" />, value: '0' },
    ...getSelectOptions(formItemSpecs, ['ownerDept', 'deptSingleSelect']),
  ];
  return {
    type: 'object',
    properties: {
      wrapper: nameWrapper(<FM id="formtpl.comp.member-single-select" />),
      hideRule,
      isRelatedMember: {
        type: 'boolean',
        title: <FM id="form.schema.member.current" />,
      },
      unitSelectionRange: {
        type: 'custom-selection-range',
        title: <FM id="formtpl.schema.owner.personscope" />,
        'x-component-props': {
          isDept: false,
          title: <FM id="formtpl.schema.owner.modal.title" />,
        },
      },
      personFilled: {
        type: 'object',
        title: <FM id="formtpl.schema.owner.staffinfo" />,
        properties: {
          deptMappingField: {
            type: 'string',
            title: <FM id="formtpl.schema.owner.staffinfo.dept" />,
            enum: deptMultiOptions,
          },
          genderMappingField: {
            type: 'string',
            title: <FM id="formtpl.schema.owner.staffinfo.sex" />,
            enum: inputOptions,
          },
          emailMappingField: {
            type: 'string',
            title: <FM id="formtpl.schema.owner.staffinfo.email" />,
            enum: inputOptions,
          },
          mobileMappingField: {
            type: 'string',
            title: <FM id="formtpl.schema.owner.staffinfo.phone" />,
            enum: inputOptions,
          },
        },
      },
      allowSelectedUserViewData: {
        type: 'radio',
        enum: [
          { label: <FM id="form.schema.member.allow-access.allow" />, value: true },
          { label: <FM id="form.schema.member.allow-access.refuse" />, value: false },
        ],
      },
      description,
    },
  };
};

/* 人员多选 */
export const staffMultiSelectProperties = (): ISchema => {
  return {
    type: 'object',
    properties: {
      wrapper: nameWrapper(<FM id="formtpl.comp.member-multi-select" />),
      // hideRule,
      unitSelectionRange: {
        type: 'custom-selection-range',
        title: <FM id="formtpl.schema.owner.personscope" />,
        'x-component-props': {
          isDept: false,
          title: <FM id="formtpl.schema.owner.modal.title" />,
        },
      },
      allowSelectedUserViewData: {
        type: 'radio',
        enum: [
          { label: <FM id="form.schema.member.allow-access.allow" />, value: true },
          { label: <FM id="form.schema.member.allow-access.refuse" />, value: false },
        ],
      },
      description,
    },
  };
};

/* 部门多选 */
export const deptSingleSelectProperties = (multiple: boolean) => (): ISchema => {
  const controlTitle = multiple ? (
    <FM id="formtpl.comp.dept-single-select" />
  ) : (
    <FM id="formtpl.comp.dept-multi-select" />
  );
  return {
    type: 'object',
    properties: {
      wrapper: nameWrapper(controlTitle),
      // hideRule,
      unitSelectionRange: {
        type: 'custom-selection-range',
        title: <FM id="formtpl.schema.owner.personscope" />,
        'x-component-props': {
          isDept: multiple,
          title: <FM id="formtpl.schema.owner.modal.title" />,
        },
      },
      description,
    },
  };
};
