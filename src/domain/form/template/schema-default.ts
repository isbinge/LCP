import { FormItemDataType } from '@/constants/form/common';
import LcpIntl from '@/utils/locale';
import { textFormatTypeMap, SelectionRangeTabType } from './common';

// 基础控件
export const inputDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.input' }),
    inputType: 'input',
    hideRule: { label: false, value: '' },
    defaultValue: {
      calcFormula: 'calcFormula',
      calcSelect: {
        label: true,
        value: '',
      },
      dataLink: {
        dataLinkSchemaCode: '',
        isChildSchema: false,
        dataLinkCondition: [],
        dataLinkResult: '',
      },
    },
    format: textFormatTypeMap[1],
    verify: [0],
    tip: '',
    description: '',
    dataType: FormItemDataType.INDICATOR,
    //
    inputByScan: false,
    scanUpdateEnable: false,
  };
};

export const textAreaDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.textarea' }),
    visibleRows: 3,
    hideRule: { label: false, value: '' },
    defaultValue: {
      calcFormula: 'calcFormula',
      calcSelect: {
        label: true,
        value: '',
      },
      dataLink: {
        dataLinkSchemaCode: '',
        isChildSchema: false,
        dataLinkCondition: [],
        dataLinkResult: '',
      },
    },
    tip: '',
    description: '',
    dataType: FormItemDataType.TEXTAREA,
  };
};

export const dateDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.date' }),
    hideRule: { label: false, value: '' },
    defaultValue: {
      calcFormula: 'calcFormula',
      calcSelect: {
        label: true,
        value: '',
      },
      dataLink: {
        dataLinkSchemaCode: '',
        isChildSchema: false,
        dataLinkCondition: [],
        dataLinkResult: '',
      },
    },
    format: 'YMD',
    description: '',
    dataType: FormItemDataType.DATETIME,
  };
};

export const numberDefalut = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.num' }),
    hideRule: { label: false, value: '' },
    defaultValue: {
      calcFormula: 'calcFormula',
      calcSelect: {
        label: true,
        value: '',
      },
      dataLink: {
        dataLinkSchemaCode: '',
        isChildSchema: false,
        dataLinkCondition: [],
        dataLinkResult: '',
      },
    },
    format: {
      showDecimal: [false],
      placesNumber: 0,
      showThousandSep: [false],
    },
    description: '',
    dataType: FormItemDataType.NUMBER,
  };
};

export const radioDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.radio' }),
    inputType: 'radio',
    hideRule: { label: false, value: '' },
    options: {
      optionsValue: [
        intl.formatMessage({ id: 'formtpl.schema.common.option' }, { order: 1 }),
        intl.formatMessage({ id: 'formtpl.schema.common.option' }, { order: 2 }),
        intl.formatMessage({ id: 'formtpl.schema.common.option' }, { order: 3 }),
      ],
      selectValue: '',
    },
    description: '',
    //
    mobileSelectShowMode: 'sideSlip',
    dataType: FormItemDataType.INDICATOR,
  };
};

export const checkBoxDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.checkbox' }),
    inputType: 'checkbox',
    hideRule: { label: false, value: '' },
    options: {
      optionsValue: [
        intl.formatMessage({ id: 'formtpl.schema.common.option' }, { order: 1 }),
        intl.formatMessage({ id: 'formtpl.schema.common.option' }, { order: 2 }),
        intl.formatMessage({ id: 'formtpl.schema.common.option' }, { order: 3 }),
      ],
      selectValue: [],
    },
    description: '',
    //
    mobileSelectShowMode: 'sideSlip',
    dataType: FormItemDataType.INDICATOR,
  };
};

export const selectDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.select' }),
    inputType: 'select',
    hideRule: { label: false, value: '' },
    sourceFrom: 'custom',
    options: {
      optionsValue: [
        intl.formatMessage({ id: 'formtpl.schema.common.option' }, { order: 1 }),
        intl.formatMessage({ id: 'formtpl.schema.common.option' }, { order: 2 }),
        intl.formatMessage({ id: 'formtpl.schema.common.option' }, { order: 3 }),
      ],
      selectValue: '',
    },
    associateForm: {
      schemaCode: '',
      schemaId: '',
    },
    dataLimit: '',
    description: '',
    //
    mobileSelectShowMode: 'sideSlip',
    mappingField: '',
    dataType: FormItemDataType.INDICATOR,
  };
};

export const switchDefault = () => {
  const { intl } = LcpIntl;
  return {
    hideRule: { label: false, value: '' },
    content: intl.formatMessage({ id: 'formtpl.comp.switch' }),
    switch: false,
    dataType: FormItemDataType.SWITCH,
  };
};

export const staffSingleSelectDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.member-single-select' }),
    hideRule: { label: false, value: '' },
    isRelatedMember: false,
    unitSelectionRange: {
      [SelectionRangeTabType.DEPT]: [],
      [SelectionRangeTabType.ROLE]: [],
      [SelectionRangeTabType.DEPT_CTRL]: [],
      [SelectionRangeTabType.OTHER]: [],
    },
    personFilled: {
      deptMappingField: '0',
      genderMappingField: '0',
      emailMappingField: '0',
      mobileMappingField: '0',
    },
    allowSelectedUserViewData: false,
    description: '',
    dataType: FormItemDataType.OWNER_DEPARTMENT,
  };
};

export const staffMultiSelectDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.member-multi-select' }),
    hideRule: { label: false, value: '' },
    unitSelectionRange: {
      [SelectionRangeTabType.DEPT]: [],
      [SelectionRangeTabType.ROLE]: [],
      [SelectionRangeTabType.DEPT_CTRL]: [],
      [SelectionRangeTabType.OTHER]: [],
    },
    allowSelectedUserViewData: false,
    description: '',
    dataType: FormItemDataType.CREW_DEPARTMENT_MULTI_SELECT,
  };
};
export const deptSingleSelectDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.dept-single-select' }),
    hideRule: { label: false, value: '' },
    unitSelectionRange: {
      [SelectionRangeTabType.DEPT]: [],
      [SelectionRangeTabType.ROLE]: [],
      [SelectionRangeTabType.DEPT_CTRL]: [],
      [SelectionRangeTabType.OTHER]: [],
    },
    description: '',
    dataType: FormItemDataType.OWNER_DEPARTMENT,
  };
};
export const deptMultiSelectDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.dept-multi-select' }),
    hideRule: { label: false, value: '' },
    unitSelectionRange: {
      [SelectionRangeTabType.DEPT]: [],
      [SelectionRangeTabType.ROLE]: [],
      [SelectionRangeTabType.DEPT_CTRL]: [],
      [SelectionRangeTabType.OTHER]: [],
    },
    description: '',
    dataType: FormItemDataType.CREW_DEPARTMENT_MULTI_SELECT,
  };
};

// 布局控件
export const groupTitleDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.grouptitle' }),
    alignment: 'left',
  };
};

export const descriptionDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.description' }),
    description: intl.formatMessage({ id: 'formtpl.comp.description' }),
  };
};

export const subformDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.subform' }),
    dataTitle: [],
    hideRule: { label: false, value: '' },
  };
};

// 系统控件
export const serialNoDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.sn' }),
    seqNoStructure:
      'Type:1,Value:YYYY;Type:2,IncreNum:8,Value:1;Type:3,Value:f;Type:4,Value:F0000012,Label:课程',
    dataType: FormItemDataType.INDICATOR,
  };
};

export const creatorDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.creator' }),
    hideRule: { label: false, value: '' },
    dataType: FormItemDataType.OWNER_DEPARTMENT,
  };
};

export const ownerDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.owner' }),
    hideRule: { label: false, value: '' },
    unitSelectionRange: {
      [SelectionRangeTabType.DEPT]: [],
      [SelectionRangeTabType.ROLE]: [],
      [SelectionRangeTabType.DEPT_CTRL]: [],
      [SelectionRangeTabType.OTHER]: [],
    },
    personFilled: {
      deptMappingField: '0',
      genderMappingField: '0',
      emailMappingField: '0',
      mobileMappingField: '0',
    },
    dataType: FormItemDataType.OWNER_DEPARTMENT,
  };
};

export const ownerDepartmentDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.ownerdept' }),
    hideRule: { label: false, value: '' },
    unitSelectionRange: {
      [SelectionRangeTabType.DEPT]: [],
      [SelectionRangeTabType.ROLE]: [],
      [SelectionRangeTabType.DEPT_CTRL]: [],
      [SelectionRangeTabType.OTHER]: [],
    },
    dataType: FormItemDataType.OWNER_DEPARTMENT,
  };
};

export const createTimeDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.createtime' }),
    hideRule: { label: false, value: '' },
    dataType: FormItemDataType.DATETIME,
  };
};

export const modifyTimeDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.modtime' }),
    hideRule: { label: false, value: '' },
    dataType: FormItemDataType.DATETIME,
  };
};

// 高级控件
export const associationFormDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.assocform' }),
    hideRule: { label: false, value: '' },
    associateForm: {
      schemaCode: '',
      schemaId: '',
      isChildSchema: false,
    },
    mappingProperties: [],
    dataLimit: '',
    dataFillRule: [],
    description: '',
    //
    // isChildSchema: false,
    inputByScan: false,
    scanUpdateEnable: false,
    dataType: FormItemDataType.ASSOC_FORM,
  };
};

export const associationFormMultiSelectDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.assocform.multiselect' }),
    hideRule: { label: false, value: '' },
    associateForm: {
      schemaCode: '',
      schemaId: '',
      isChildSchema: false,
    },
    dataLimit: '',
    description: '',
    //
    // isChildSchema: false,
    dataType: FormItemDataType.ASSOC_FORM_MULTI_SELECT,
  };
};

export const associationAttributeDefault = () => {
  const { intl } = LcpIntl;
  return {
    name: intl.formatMessage({ id: 'formtpl.comp.assocfield' }),
    hideRule: { label: false, value: '' },
    assocAttrConfig: {
      associateForm: '',
      associateField: '',
      setting: false,
      dataType: null,
    },
    //
  };
};
