import { FormItemGroupType, FormItemDataType, FormItemControlType } from '@/constants/form/common';
import {
  SingleLineInputControl,
  CheckboxControl,
  DateControl,
  NumberInputControl,
  RadioControl,
  SelectControl,
  SwitchControl,
  TextareaControl,
  StaffMultiSelectControl,
  StaffSingleSelectControl,
  DeptSelectControl,
} from './basic/adapter/adapter-type.d';
import {
  AssocAttrControl,
  AssocFormControl,
  AssocMultFormControl,
} from './advanced/adapter/adapter-type.d';
import {
  DescriptionControl,
  GroupTitleControl,
  SubFormControl,
} from './layout/adapter/adapter-type.d';
import { SystemControl, OwnerControl, OwnerDeptControl } from './system/adapter/adapter-type.d';

export interface FormProperties extends BasicCtrlType, AdvancedCtrlType, SystemCtrlType {
  id: string;
  name: string;
  code: string;
  groupId?: string;
  iconCss: string;
  dataTitle: string;
  openFormDynamic: boolean;
  openTaskNotification: boolean;
  displayToMobile: boolean;
  displayToPc: boolean;
  createUserId?: string;
  updateUserId?: string;
  createDateTime?: string;
  updateDateTime?: string;
  auditStat?: number;
}

export interface CommonCtrlProperties {
  id: string;
  sequenceNumber: number;
  formTemplateId: string;
  subFormTemplateId?: string | null;
  name: string;
  code: string;
  controlType: FormItemControlType;
  controlGroupType?: FormItemGroupType;
  dataType?: FormItemDataType;
  description?: string;

  visible: boolean;
  createUserId: string;
  updateUserId: string;
  createDateTime: string;
  updateDateTime: string;
  auditStat: Nullable<string>;
}

export interface BasicCtrlType {
  singleLineInputControls: SingleLineInputControl[];
  checkboxGroupControls: RadioControl[];
  dateTimeControls: DateControl[];
  numberInputControls: NumberInputControl[];
  checkboxControls: CheckboxControl[];
  selectControls: SelectControl[];
  switchControls: SwitchControl[];
  textAreaInputControls: TextareaControl[];
  staffSingleSelectControls: StaffSingleSelectControl[];
  staffMultiSelectControls: StaffMultiSelectControl[];
  deptSingleSelectControls: DeptSelectControl[];
  deptMultiSelectControls: DeptSelectControl[];
}
export interface AdvancedCtrlType {
  associatedWithAttributeControls: AssocAttrControl[];
  associatedWithFormControls: AssocFormControl[];
  associatedWithFormMultiSelectControls: AssocMultFormControl[];
}

export interface LayoutCtrlType {
  descriptionControls: DescriptionControl[];
  groupTitleControls: GroupTitleControl[];
  subFormTemplates: SubFormControl[];
}

export interface SystemCtrlType {
  createDateTimeControl: SystemControl | null;
  creatorControl: SystemControl | null;
  updateDateTimeControl: SystemControl | null;
  serialNumberControl: SystemControl | null;
  ownerControl: OwnerControl | null;
  ownerDeptControl: OwnerDeptControl | null;
}
