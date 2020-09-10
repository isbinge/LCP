import React from 'react';
import { FormattedMessage as FM } from 'react-intl';

import {
  nameWrapper,
  // hideRule
} from '@/domain/form/template/basic/schema';
import { DndItemType } from '@/constants';
import { ISchema } from '@formily/antd';
import { FormItemSpec } from '../model';

/** 分组标题 */
export const groupTitleProperties = (): ISchema => ({
  type: 'object',
  properties: {
    wrapper: nameWrapper(<FM id="formtpl.comp.grouptitle" />),
    alignment: {
      type: 'radio',
      title: <FM id="formtpl.schema.grouptitle.align" />,
      enum: [
        { label: <FM id="dict.left" />, value: 'left' },
        { label: <FM id="dict.middle" />, value: 'middle' },
        { label: <FM id="dict.right" />, value: 'right' },
      ],
    },
  },
});

/** 描述说明 */
export const descriptionProperties: ISchema = {
  type: 'object',
  properties: {
    description: {
      type: 'textarea',
      title: <FM id="dict.description" />,
      'x-component-props': {
        style: {
          height: 300,
        },
      },
    },
  },
};
/** 子表 */
export const subformProperties = (subFormData: FormItemSpec, formItemSpec: FormItemSpec[]) => {
  const dataSource = (subFormData.extraData as FormItemSpec[])
    .map((item) => ({
      label: `${subFormData.title}.${item.data.name || item.data.content}`,
      value: item.code,
    }))
    .concat(
      formItemSpec
        .filter(
          (item) =>
            item.parentType === DndItemType.form.BASIC_COMPS ||
            item.parentType === DndItemType.form.ADVANCED_COMPS,
        )
        .map((_item) => ({ label: _item.data.name || _item.data.content, value: _item.code })),
    );
  return {
    type: 'object',
    properties: {
      wrapper: nameWrapper(<FM id="formtpl.comp.subform" />),
      dataTitleWrapper: {
        type: 'custom-wrapper',
        title: <FM id="formtpl.schema.form.datatitle" />,
        description: <FM id="formtpl.schema.form.datatitle.desc" />,
        properties: {
          dataTitle: {
            type: 'string',
            enum: dataSource,
            'x-component-props': {
              mode: 'multiple',
            },
          },
        },
      },
      // hideRule,
      subFormFields: {
        type: 'string',
        title: <FM id="formtpl.schema.subform.fields" />,
        'x-component': 'custom-fields',
        'x-component-props': { subFormData },
      },
    },
  };
};
