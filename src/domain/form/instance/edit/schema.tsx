import { FormSchemaData } from '@/pages/form/record/collect/shared/form-schema';
import {
  getInput,
  getTextarea,
  getDate,
  getNumber,
  getRadio,
  getCheckbox,
  getSelect,
  getSwitch,
  getGroupTitle,
  getDescription,
  getSerialNo,
  getCreator,
  getModifyTime,
  getCreateTime,
  getAssocForm,
  getAssocAttr,
  getAssocMultForm,
  getFormSchema,
  getSubForm,
  getOwnerSelect,
  getOwnerDeptSelect,
} from '../schema.common';
import {
  DateControl,
  NumberInputControl,
  RadioControl,
  TextareaControl,
  CheckboxControl,
  SelectControl,
  SingleLineInputControl,
} from '../../template/basic/adapter/adapter-type';
import {
  AssocAttrControl,
  AssocFormControl,
  AssocMultFormControl,
} from '../../template/advanced/adapter/adapter-type';
import { GetCompSchema, DataLkgMappings } from '../schema-type';
import FormRecordData from '../data';

export const getCompSchema = (
  compName: Lcp.FormItem.All,
  item: FormSchemaData,
  fieldName: string,
  isCreate: boolean,
  dataLinkageMappings: DataLkgMappings,
  ownerDepts?: FormRecordData.OwnerDeptValue,
) => {
  switch (compName) {
    case 'input':
      return getInput(item as SingleLineInputControl, fieldName, dataLinkageMappings);
    case 'textarea':
      return getTextarea(item as TextareaControl, fieldName, dataLinkageMappings);
    case 'date':
      return getDate(item as DateControl, fieldName, dataLinkageMappings);
    case 'number':
      return getNumber(item as NumberInputControl, fieldName, dataLinkageMappings);
    case 'radio':
      return getRadio(item as RadioControl, fieldName, dataLinkageMappings);
    case 'checkbox':
      return getCheckbox(item as CheckboxControl, fieldName);
    case 'select':
      return getSelect(item as SelectControl, fieldName, dataLinkageMappings);
    case 'switch':
      return getSwitch({ ...item, editable: true }, fieldName);
    case 'groupTitle':
      return getGroupTitle(item, fieldName);
    case 'subform':
      return getSubForm(item, fieldName, false, dataLinkageMappings);
    case 'description':
      return getDescription(item, fieldName);
    case 'serialNo':
      return getSerialNo(item, fieldName);
    case 'creator':
      return getCreator(item, fieldName);
    case 'modifyTime':
      return getModifyTime(item, fieldName);
    case 'createTime':
      return getCreateTime(item, fieldName);
    case 'associationForm':
      return getAssocForm(item as AssocFormControl, fieldName, dataLinkageMappings);
    case 'associationAttribute':
      return getAssocAttr(item as AssocAttrControl, fieldName);
    case 'associationFormMultiSelect':
      return getAssocMultForm(item as AssocMultFormControl, fieldName);
    case 'owner':
      return getOwnerSelect(item, isCreate, ownerDepts);
    case 'ownerDept':
      return getOwnerDeptSelect(item, ownerDepts);
    default:
      return getInput(item as SingleLineInputControl, '');
  }
};
export const getFormCreateSchema = (
  schemaData: FormSchemaData[],
  isCreate: boolean,
  ownerDepts?: FormRecordData.OwnerDeptValue[],
) => getFormSchema(schemaData, getCompSchema as GetCompSchema, isCreate, ownerDepts);
