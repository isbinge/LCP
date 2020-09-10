import { CommonCtrlProperties } from '../../adapter-type.d';

export interface SystemControl extends CommonCtrlProperties {
  displayRule?: string;
  seqNoStructure?: string;
}

export interface OwnerControl extends CommonCtrlProperties {
  displayRule: string;
  unitSelectionRange: string;
  deptMappingField: string;
  genderMappingField: string;
  emailMappingField: string;
  mobileMappingField: string;
  value?: {
    userId: string;
    name: string;
  };
}

export interface OwnerDeptControl extends CommonCtrlProperties {
  displayRule: string;
  unitSelectionRange: string;
  value?: {
    deptId: string;
    name: string;
  }[];
}
