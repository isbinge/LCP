import {
  CommonCtrlProperties,
  BasicCtrlType,
  AdvancedCtrlType,
  FormProperties,
} from '@/domain/form/template/adapter-type.d';
import {
  AssocAttrControl,
  AssocFormControl,
  AssocMultFormControl,
} from '@/domain/form/template/advanced/adapter/adapter-type.d';
import {
  NumberInputControl,
  SingleLineInputControl,
  CheckboxControl,
  DateControl,
  RadioControl,
  SelectControl,
  SwitchControl,
  TextareaControl,
} from '@/domain/form/template/basic/adapter/adapter-type.d';
import {
  GroupTitleControl,
  DescriptionControl,
  SubFormControl,
} from '@/domain/form/template/layout/adapter/adapter-type.d';
import {
  SystemControl,
  OwnerControl,
  OwnerDeptControl,
} from '@/domain/form/template/system/adapter/adapter-type.d';

export type SelectReturnType = { objectId: string; value: string };

export type AssocFormState = SelectReturnType[] | SelectReturnType | null;

export type SubFormFieldValueType =
  | undefined
  | string
  | number
  | boolean
  | string[]
  | AssocFormState;
export interface SubFormRecord {
  key: string;
  [p: string]: SubFormFieldValueType;
}
export interface SubFormState {
  selectedRowKeys: React.Key[];
  dataSource: SubFormRecord[];
}

export interface SubFormDataItem {
  objectId: string;
  name: string;
  parentId: Pick<FormProperties, 'id'>;
  codeValueDic: Record<string, string>;
  sequenceNumber: number;
}
export type SubFormServeDataType = BasicCtrlType &
  AdvancedCtrlType &
  CommonCtrlProperties &
  SubFormControl & {
    subFormTemplateDataItems?: SubFormDataItem[];
  };
export type FormSchemaData =
  | AssocFormControl
  | AssocAttrControl
  | AssocMultFormControl
  | NumberInputControl
  | SingleLineInputControl
  | CheckboxControl
  | DateControl
  | RadioControl
  | SelectControl
  | SwitchControl
  | TextareaControl
  | GroupTitleControl
  | DescriptionControl
  | SubFormServeDataType
  | SystemControl
  | OwnerControl
  | OwnerDeptControl;

export type DataLinkageSchema =
  | SingleLineInputControl
  | NumberInputControl
  | DateControl
  | TextareaControl;
