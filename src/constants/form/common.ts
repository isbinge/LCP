export enum FormItemDataType {
  INDICATOR = 1,
  OWNER_DEPARTMENT,
  STATUS,
  TEXTAREA,
  DATETIME,
  NUMBER,
  SWITCH,
  ATTACHMENT,
  PICTURE,
  ASSOC_FORM,
  ASSOC_FORM_MULTI_SELECT,
  ADDRESS,
  LOCATION,
  CREW_DEPARTMENT_MULTI_SELECT,
}

export enum FormItemControlType {
  INPUT = 1,
  TEXTAREA,
  DATE,
  NUMBER,
  RADIO,
  CHECKBOX,
  SELECT,
  SWITCH,
  ATTACHMENT,
  PICTURE,
  ADDRESS,
  LOCATION,
  GROUP_TITLE,
  INLINE_SPLIT,
  DESCRIPTION,
  SUBFORM,
  SERIAL_NO,
  CREATOR,
  CREATE_TIME,
  MODIFY_TIME,
  ASSOC_FORM,
  ASSOC_ATTR,
  ASSOC_FORM_MULTI_SELECT,
  FORMULA,
  STAFF_SINGLE_SELECT,
  STAFF_MULTI_SELECT,
  DEPT_SINGLE_SELECT,
  DEPT_MULTI_SELECT,
  OWNER,
  OWNER_DEPARTMENT,
}

export const formItemControlTypeMap = {
  1: 'input',
  2: 'textarea',
  3: 'date',
  4: 'number',
  5: 'radio',
  6: 'checkbox',
  7: 'select',
  8: 'switch',
  9: 'attachment',
  10: 'picture',
  11: 'address',
  12: 'location',
  13: 'groupTitle',
  14: 'inlineSplit',
  15: 'description',
  16: 'subform',
  17: 'serialNo',
  18: 'creator',
  19: 'createTime',
  20: 'modifyTime',
  21: 'associationForm',
  22: 'associationAttribute',
  23: 'associationFormMultiSelect',
  24: 'formula',
  25: 'staffSingleSelect',
  26: 'staffMultiSelect',
  27: 'deptSingleSelect',
  28: 'deptMultiSelect',
  29: 'owner',
  30: 'ownerDept',
};

export enum FormItemGroupType {
  BASIC_COMPS = 1,
  LAYOUT_COMPS,
  SYSTEM_COMPS,
  ADVANCED_COMPS,
}

export const systemNameI18n = {
  serialNo: 'sn',
  creator: 'creator',
  modifyTime: 'modtime',
  createTime: 'createtime',
  owner: 'owner',
  ownerDept: 'ownerdept',
};

export const systemCode = {
  serialNo: 'SerialNumber',
  creator: 'CreateUserId',
  createTime: 'CreateDateTime',
  modifyTime: 'UpdateDateTime',
  owner: 'OwnerId',
  ownerDept: 'OwnerDeptId',
};
