import React from 'react';
import { FormattedMessage as FM } from 'react-intl';

import { ISchema } from '@formily/antd';
import LcpIntl from '@/utils/locale';
import { FormItemSpec } from './model';

const createSchema = (formItemSpecs: FormItemSpec[]): ISchema => {
  const { intl } = LcpIntl;
  const dataSource = formItemSpecs
    .filter((item) => item.compType !== 'associationAttribute')
    .map((item) => ({
      label: item.data.content || item.data.name,
      value: item.code,
    }));
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: <FM id="formtpl.schema.form.formname" />,
        'x-component-props': {
          placeholder: intl.formatMessage({ id: 'formtpl.schema.form.formname' }),
        },
        'x-rules': {
          max: 32,
          required: true,
          message: intl.formatMessage({ id: 'appdetail.formlist.rename.rule.message' }),
        },
      },
      iconCss: {
        type: 'string',
        title: <FM id="dict.icon" />,
        required: true,
        enum: [{ label: <FM id="dict.undefined" />, value: 'undefined' }],
      },
      dataTitleWrapper: {
        type: 'custom-wrapper',
        title: <FM id="formtpl.schema.form.datatitle" />,
        required: true,
        description: <FM id="formtpl.schema.form.datatitle.desc" />,
        properties: {
          dataTitle: {
            type: 'string',
            enum: dataSource,
            'x-component-props': {
              mode: 'multiple',
            },
            'x-rules': {
              required: true,
              message: intl.formatMessage({ id: 'message.formtpl.datatitlenotset' }),
            },
          },
        },
      },
      openFormDynamic: {
        type: 'radio',
        title: <FM id="formtpl.schema.form.formactivities" />,
        enum: [
          { label: <FM id="dict.switchon" />, value: true },
          { label: <FM id="dict.switchoff" />, value: false },
        ],
      },
    },
  };
};

export default createSchema;
