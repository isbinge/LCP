import {
  inputProperties,
  textAreaProperties,
  dateProperties,
  numberProperties,
  radioProperties,
  checkboxProperties,
  switchProperties,
  selectProperties,
  staffSingleSelectProperties,
  staffMultiSelectProperties,
  deptSingleSelectProperties,
} from '@/domain/form/template/basic/schema';
import {
  groupTitleProperties,
  descriptionProperties,
  subformProperties,
} from '@/domain/form/template/layout/schema';
import {
  serialNoProperties,
  creatorProperties,
  ownerProperties,
  ownerDepartmentProperties,
  createTimeProperties,
  modifyTimeProperties,
} from '@/domain/form/template/system/schema';
import {
  associationFormProperties,
  associationFormMultiSelectProperties,
  associationAttributeProperties,
} from '@/domain/form/template/advanced/schema';

import {
  selectEffect,
  numberEffect,
  inputEffect,
  textAreaEffect,
  dateEffect,
} from '@/domain/form/template/basic/effect';

import { associationFormEffect } from '@/domain/form/template/advanced/effect';

import {
  inputDefault,
  textAreaDefault,
  dateDefault,
  numberDefalut,
  radioDefault,
  checkBoxDefault,
  selectDefault,
  switchDefault,
  staffSingleSelectDefault,
  serialNoDefault,
  creatorDefault,
  ownerDefault,
  ownerDepartmentDefault,
  createTimeDefault,
  modifyTimeDefault,
  associationFormDefault,
  associationFormMultiSelectDefault,
  associationAttributeDefault,
  groupTitleDefault,
  descriptionDefault,
  subformDefault,
  staffMultiSelectDefault,
  deptSingleSelectDefault,
  deptMultiSelectDefault,
} from './schema-default';

export const schema = {
  /** basic控件的schema */
  input: inputProperties,
  textarea: textAreaProperties,
  date: dateProperties,
  number: numberProperties,
  switch: switchProperties,
  checkbox: checkboxProperties,
  radio: radioProperties,
  select: selectProperties,
  staffSingleSelect: staffSingleSelectProperties,
  staffMultiSelect: staffMultiSelectProperties,
  deptSingleSelect: deptSingleSelectProperties(true),
  deptMultiSelect: deptSingleSelectProperties(true),
  /** Layout控件的schema */
  // inlineSplit: 'layout/InlineSplit',
  subform: subformProperties,
  groupTitle: groupTitleProperties,
  description: descriptionProperties,

  /** system控件的schema */
  serialNo: serialNoProperties,
  creator: creatorProperties,
  owner: ownerProperties,
  ownerDept: ownerDepartmentProperties,
  createTime: createTimeProperties,
  modifyTime: modifyTimeProperties,

  /** super */
  associationForm: associationFormProperties,
  associationFormMultiSelect: associationFormMultiSelectProperties,
  associationAttribute: associationAttributeProperties,
};

export const effects = {
  /** basic控件的effects */
  input: inputEffect,
  textarea: textAreaEffect,
  date: dateEffect,
  number: numberEffect,
  switch: () => {},
  checkbox: () => {},
  radio: () => {},
  select: selectEffect,

  /** layout控件的effects */
  groupTitle: () => {},
  description: () => {},

  /** system控件的effects */
  creator: () => {},
  owner: () => {},
  department: () => {},
  createTime: () => {},
  modifyTime: () => {},

  /** super */
  associationForm: associationFormEffect,
  associationFormMultiSelect: () => {},
};

export const defaultValue = {
  input: inputDefault,
  textarea: textAreaDefault,
  date: dateDefault,
  number: numberDefalut,
  switch: switchDefault,
  checkbox: checkBoxDefault,
  radio: radioDefault,
  select: selectDefault,
  staffSingleSelect: staffSingleSelectDefault,
  staffMultiSelect: staffMultiSelectDefault,
  deptSingleSelect: deptSingleSelectDefault,
  deptMultiSelect: deptMultiSelectDefault,

  groupTitle: groupTitleDefault,
  description: descriptionDefault,
  subform: subformDefault,

  serialNo: serialNoDefault,
  creator: creatorDefault,
  owner: ownerDefault,
  ownerDept: ownerDepartmentDefault,
  createTime: createTimeDefault,
  modifyTime: modifyTimeDefault,

  associationForm: associationFormDefault,
  associationFormMultiSelect: associationFormMultiSelectDefault,
  associationAttribute: associationAttributeDefault,
};
