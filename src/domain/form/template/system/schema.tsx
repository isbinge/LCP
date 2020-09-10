import React from 'react';
import { FormattedMessage as FM } from 'react-intl';
import { ISchema } from '@formily/antd';
import {
  // hideRule,
  nameWrapper,
} from '../basic/schema';
import { FormItemSpec } from '../model';
import { getSelectOptions } from '../common';

/** 流水号 */
export const serialNoProperties = (): ISchema => ({
  type: 'object',
  properties: {
    wrapper: nameWrapper(<FM id="formtpl.comp.sn" />),
    seqNoStructure: {
      type: 'custom-serial-rule',
    },
  },
});

/** 创建人 */
export const creatorProperties = (): ISchema => ({
  type: 'object',
  properties: {
    wrapper: nameWrapper(<FM id="formtpl.comp.creator" />),
    // hideRule,
  },
});

/** 拥有者 */
export const ownerProperties = (_: FormItemSpec, formItemSpecs: FormItemSpec[]): ISchema => {
  // 单行文本
  const inputEnum: ISchema['enum'] = [
    { label: <FM id="formtpl.schema.common.options.placeholder" />, value: '0' },
    ...getSelectOptions(formItemSpecs, ['input']),
  ];

  // 部门多选
  const deptMultiEnum: ISchema['enum'] = [
    { label: <FM id="formtpl.schema.common.options.placeholder" />, value: '0' },
    ...getSelectOptions(formItemSpecs, ['deptSingleSelect']),
  ];

  return {
    type: 'object',
    properties: {
      wrapper: nameWrapper(<FM id="formtpl.comp.owner" />),
      // hideRule,
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
            enum: deptMultiEnum,
          },
          genderMappingField: {
            type: 'string',
            title: <FM id="formtpl.schema.owner.staffinfo.sex" />,
            enum: inputEnum,
          },
          emailMappingField: {
            type: 'string',
            title: <FM id="formtpl.schema.owner.staffinfo.email" />,
            enum: inputEnum,
          },
          mobileMappingField: {
            type: 'string',
            title: <FM id="formtpl.schema.owner.staffinfo.phone" />,
            enum: inputEnum,
          },
        },
      },
    },
  };
};

/** 所属部门 */
export const ownerDepartmentProperties = (): ISchema => ({
  type: 'object',
  properties: {
    wrapper: nameWrapper(<FM id="formtpl.comp.ownerdept" />),
    // hideRule,
    unitSelectionRange: {
      type: 'custom-selection-range',
      title: <FM id="formtpl.schema.department.deptscope" />,
      'x-component-props': {
        isDept: true,
        title: <FM id="formtpl.schema.department.modal.title" />,
      },
    },
  },
});

/** 创建时间 */
export const createTimeProperties = (): ISchema => ({
  type: 'object',
  properties: {
    wrapper: nameWrapper(<FM id="formtpl.comp.createtime" />),
    // hideRule,
  },
});

/** 修改时间 */
export const modifyTimeProperties = (): ISchema => ({
  type: 'object',
  properties: {
    wrapper: nameWrapper(<FM id="formtpl.comp.modtime" />),
    // hideRule,
  },
});
