import { ISchema } from '@formily/antd';
import { FormSchemaData } from '@/pages/form/record/collect/shared/form-schema';
import FormRecordData from './data';

export interface CommonCtrlProps {
  id: string;
  code: string;
  controlType: number;
  mode?: number;
  [props: string]: React.ReactNode;
}

export interface GetCompSchema {
  (
    compName: Lcp.FormItem.All,
    data: FormSchemaData,
    descriptionName: string,
    isCreate: boolean,
    dataLinkageMappings: DataLkgMappings,
    ownerDepts?: FormRecordData.OwnerDeptValue[],
  ): ISchema;
}

export interface GroupTitleMappings {
  [props: string]: string[];
}

export interface ConditionCode {
  currentFieldCode: string;
  linkageFieldCode: string;
}

export interface DataLkgMap {
  conditionCode: ConditionCode[];
  dataLinkageResult: string;
  dataLinkageSchemaCode: string;
  filledFieldCode: string;
}
export interface DataLkgMappings {
  [props: string]: DataLkgMap[];
}

export interface AssocFormMap {
  mappingControls: string[];
  mappingProperties: string[];
  subFormTemplateId: string | null;
  schemaCode: string;
  schemaId: string;
}

export interface AssocFormMappings {
  [props: string]: AssocFormMap;
}
