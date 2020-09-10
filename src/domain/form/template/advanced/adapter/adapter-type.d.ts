import { CommonCtrlProperties } from '../../adapter-type.d';

export interface AssocAttrControl extends CommonCtrlProperties {
  displayRule: string;
  mappingField: string;
  schemaCode: string;
  asFilter: boolean;
  description: string;
}

export interface AssocFormControl extends CommonCtrlProperties {
  schemaId: string;
  displayRule: string;
  schemaCode: string;
  // schemaId?: string;
  isChildSchema: boolean;
  associationFilter: string;
  inputByScan: boolean;
  scanUpdateEnable: boolean;
  mappingControls: string;
  mappingProperties: string;
  description: string;
}
export interface AssocMultFormControl extends CommonCtrlProperties {
  schemaId: string;
  displayRule: string;
  schemaCode: string;
  isChildSchema: boolean;
  associationFilter: string;
  description: string;
}
