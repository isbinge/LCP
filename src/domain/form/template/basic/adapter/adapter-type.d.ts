import { CommonCtrlProperties } from '../../adapter-type.d';

export interface SingleLineInputControl extends CommonCtrlProperties {
  displayRule: string;
  defaultValueRuleType: number | string;
  computationRule: string;

  dataLinkSchemaCode: string;
  isChildSchema: boolean;
  dataLinkCondition: string;
  dataLinkResult: string;
  mode: number | string;
  inputByScan: boolean;

  scanUpdateEnable: boolean;

  noRepeat: boolean;
  placeHolder: string;
  description: string;
}
export interface CheckboxControl extends CommonCtrlProperties {
  displayRule: string;
  mobileSelectShowMode: number | string;
  defaultItems: string;
  defaultValue: string;
  description: string;
}
export interface DateControl extends CommonCtrlProperties {
  dateTimeMode: string;

  displayRule: string;
  defaultValueRuleType: number | string;
  computationRule: string;

  dataLinkSchemaCode: string;
  isChildSchema: boolean;
  dataLinkCondition: string;
  dataLinkResult: string;

  description: string;
}
export interface NumberInputControl extends CommonCtrlProperties {
  isDecimals: boolean;
  decimalPlaces: number;
  showThousandthSeparator: boolean;
  displayRule: string;
  defaultValueRuleType: number | string;
  computationRule: string;

  dataLinkSchemaCode: string;
  isChildSchema: boolean;
  dataLinkCondition: string;
  dataLinkResult: string;

  description: string;
}
export interface RadioControl extends CommonCtrlProperties {
  mobileSelectShowMode: number | string;
  defaultItems: string;
  defaultValue: string;

  displayRule: string;

  description: string;
}

export interface SelectControl extends CommonCtrlProperties {
  IsChildSchema: boolean;
  mobileSelectShowMode: number | string;
  dataSource: number | string;
  defaultItems: string;
  defaultValue: string;
  mappingField: string;
  schemaCode: string;

  associationFilter: string;
  displayRule: string;
  description: string;
}
export interface SwitchControl extends CommonCtrlProperties {
  defaultItems: string;
  defaultValue: string;
  displayRule: string;
}
export interface TextareaControl extends CommonCtrlProperties {
  rows: number;
  displayRule: string;
  defaultValueRuleType: number | string;
  computationRule: string;

  dataLinkSchemaCode: string;
  isChildSchema: boolean;
  dataLinkCondition: string;
  dataLinkResult: string;

  placeHolder: string;
  description: string;
}

export interface StaffSingleSelectControl extends CommonCtrlProperties {
  displayRule: string;
  isRelatedMember: boolean;
  unitSelectionRange: string;

  deptMappingField: string;
  genderMappingField: boolean;
  emailMappingField: string;
  mobileMappingField: string;

  allowSelectedUserViewData: boolean;

  description: string;
}

export type StaffMultiSelectControl = Omit<
  StaffSingleSelectControl,
  'deptMappingField' | 'genderMappingField' | 'emailMappingField' | 'mobileMappingField'
>;

export interface DeptSelectControl extends CommonCtrlProperties {
  displayRule: string;

  unitSelectionRange: string;

  description: string;
}
