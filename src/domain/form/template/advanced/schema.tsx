import React from 'react';
import { FormattedMessage as FM } from 'react-intl';
import { ISchema } from '@formily/antd';
import LcpIntl from '@/utils/locale';
import {
  // hideRule,
  description,
  nameWrapper,
} from '../basic/schema';

/** 关联表单 */
export const associationFormProperties = (): ISchema => ({
  type: 'object',
  properties: {
    wrapper: nameWrapper(<FM id="formtpl.comp.assocform" />),
    // hideRule,
    associateForm: {
      type: 'custom-select-form',
      title: <FM id="formtpl.comp.assocform" />,
    },
    // dataLimitWrapper: {
    //   type: 'custom-wrapper',
    //   title: <FM id="formtpl.schema.common.datarange" />,
    //   description: <FM id="formtpl.schema.common.datarange.desc" />,
    //   properties: {
    //     dataLimit: {
    //       type: 'string',
    //     },
    //   },
    // },
    dataFillRuleWrapper: {
      type: 'custom-wrapper',
      title: <FM id="formtpl.schema.assocform.datafillrule" />,
      description: <FM id="formtpl.schema.assocform.datafillrule.desc" />,
      properties: {
        dataFillRule: {
          type: 'custom-datafill-rule',
          enum: [],
        },
      },
    },
    description,
  },
});

/** 关联表单多选 */
export const associationFormMultiSelectProperties = (): ISchema => ({
  type: 'object',
  properties: {
    wrapper: nameWrapper(<FM id="formtpl.comp.assocform.multiselect.abbr" />),
    // hideRule,
    associateForm: {
      type: 'custom-select-form',
      title: <FM id="formtpl.comp.assocform" />,
    },
    // dataLimitWrapper: {
    //   type: 'custom-wrapper',
    //   title: <FM id="formtpl.schema.common.datarange" />,
    //   description: <FM id="formtpl.schema.common.datarange.desc" />,
    //   properties: {
    //     dataLimit: {
    //       type: 'string',
    //     },
    //   },
    // },
    description,
  },
});

/** 关联属性 */
export const associationAttributeProperties = (): ISchema => {
  const { intl } = LcpIntl;
  return {
    type: 'object',
    properties: {
      wrapper: {
        type: 'custom-wrapper',
        title: <FM id="formtpl.schema.common.comptitle" />,
        'x-component-props': {
          fieldType: <FM id="formtpl.comp.assocfield" />,
        },
        properties: {
          name: {
            type: 'string',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'formtpl.schema.common.comptitle' }),
            },
            description: <FM id="formtpl.schema.assocattr.desc" />,
          },
        },
      },

      // hideRule,
      assocAttrConfig: {
        type: 'custom-association-field',
        title: <FM id="formtpl.schema.assocattr.config" />,
      },
    },
  };
};
