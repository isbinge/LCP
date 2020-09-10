import { groupBy } from 'lodash';

import { FormItemDataType, FormItemGroupType, FormItemControlType } from './common';

type ComponentDefinition = {
  [type in Lcp.FormItem.All]: {
    controlType: FormItemControlType;
    controlGroupType: FormItemGroupType;
    dataType?: FormItemDataType;
  };
};

export const componentDefinition: ComponentDefinition = {
  input: {
    controlType: FormItemControlType.INPUT,
    controlGroupType: FormItemGroupType.BASIC_COMPS,
    dataType: FormItemDataType.INDICATOR,
  },
  textarea: {
    controlType: FormItemControlType.TEXTAREA,
    controlGroupType: FormItemGroupType.BASIC_COMPS,
    dataType: FormItemDataType.TEXTAREA,
  },
  date: {
    controlType: FormItemControlType.DATE,
    controlGroupType: FormItemGroupType.BASIC_COMPS,
    dataType: FormItemDataType.DATETIME,
  },
  number: {
    controlType: FormItemControlType.NUMBER,
    controlGroupType: FormItemGroupType.BASIC_COMPS,
    dataType: FormItemDataType.NUMBER,
  },
  radio: {
    controlType: FormItemControlType.RADIO,
    controlGroupType: FormItemGroupType.BASIC_COMPS,
    dataType: FormItemDataType.INDICATOR,
  },
  checkbox: {
    controlType: FormItemControlType.CHECKBOX,
    controlGroupType: FormItemGroupType.BASIC_COMPS,
    dataType: FormItemDataType.INDICATOR,
  },
  select: {
    controlType: FormItemControlType.SELECT,
    controlGroupType: FormItemGroupType.BASIC_COMPS,
    dataType: FormItemDataType.INDICATOR,
  },
  staffSingleSelect: {
    controlType: FormItemControlType.STAFF_SINGLE_SELECT,
    controlGroupType: FormItemGroupType.BASIC_COMPS,
    dataType: FormItemDataType.OWNER_DEPARTMENT,
  },
  staffMultiSelect: {
    controlType: FormItemControlType.STAFF_MULTI_SELECT,
    controlGroupType: FormItemGroupType.BASIC_COMPS,
    dataType: FormItemDataType.CREW_DEPARTMENT_MULTI_SELECT,
  },
  deptSingleSelect: {
    controlType: FormItemControlType.DEPT_SINGLE_SELECT,
    controlGroupType: FormItemGroupType.BASIC_COMPS,
    dataType: FormItemDataType.OWNER_DEPARTMENT,
  },
  deptMultiSelect: {
    controlType: FormItemControlType.DEPT_MULTI_SELECT,
    controlGroupType: FormItemGroupType.BASIC_COMPS,
    dataType: FormItemDataType.CREW_DEPARTMENT_MULTI_SELECT,
  },
  switch: {
    controlType: FormItemControlType.SWITCH,
    controlGroupType: FormItemGroupType.BASIC_COMPS,
    dataType: FormItemDataType.SWITCH,
  },
  groupTitle: {
    controlType: FormItemControlType.GROUP_TITLE,
    controlGroupType: FormItemGroupType.LAYOUT_COMPS,
  },
  inlineSplit: {
    controlType: FormItemControlType.INLINE_SPLIT,
    controlGroupType: FormItemGroupType.LAYOUT_COMPS,
  },
  description: {
    controlType: FormItemControlType.DESCRIPTION,
    controlGroupType: FormItemGroupType.LAYOUT_COMPS,
  },
  subform: {
    controlType: FormItemControlType.SUBFORM,
    controlGroupType: FormItemGroupType.LAYOUT_COMPS,
  },
  creator: {
    controlType: FormItemControlType.CREATOR,
    controlGroupType: FormItemGroupType.SYSTEM_COMPS,
    dataType: FormItemDataType.OWNER_DEPARTMENT,
  },
  owner: {
    controlType: FormItemControlType.OWNER,
    controlGroupType: FormItemGroupType.SYSTEM_COMPS,
    dataType: FormItemDataType.OWNER_DEPARTMENT,
  },
  ownerDept: {
    controlType: FormItemControlType.OWNER_DEPARTMENT,
    controlGroupType: FormItemGroupType.SYSTEM_COMPS,
    dataType: FormItemDataType.OWNER_DEPARTMENT,
  },
  createTime: {
    controlType: FormItemControlType.CREATE_TIME,
    controlGroupType: FormItemGroupType.SYSTEM_COMPS,
    dataType: FormItemDataType.DATETIME,
  },
  modifyTime: {
    controlType: FormItemControlType.MODIFY_TIME,
    controlGroupType: FormItemGroupType.SYSTEM_COMPS,
    dataType: FormItemDataType.DATETIME,
  },
  serialNo: {
    controlType: FormItemControlType.SERIAL_NO,
    controlGroupType: FormItemGroupType.SYSTEM_COMPS,
    dataType: FormItemDataType.INDICATOR,
  },
  associationForm: {
    controlType: FormItemControlType.ASSOC_FORM,
    controlGroupType: FormItemGroupType.ADVANCED_COMPS,
    dataType: FormItemDataType.ASSOC_FORM,
  },
  associationAttribute: {
    controlType: FormItemControlType.ASSOC_ATTR,
    controlGroupType: FormItemGroupType.ADVANCED_COMPS,
  },
  associationFormMultiSelect: {
    controlType: FormItemControlType.ASSOC_FORM_MULTI_SELECT,
    controlGroupType: FormItemGroupType.ADVANCED_COMPS,
    dataType: FormItemDataType.ASSOC_FORM_MULTI_SELECT,
  },
};

export const controlGroupTypes = groupBy(
  componentDefinition,
  (value) => FormItemGroupType[value.controlGroupType],
);
