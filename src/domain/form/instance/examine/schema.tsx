import { FormSchemaData } from '@/pages/form/record/collect/shared/form-schema';
import {
  getGroupTitle,
  getDescription,
  getSerialNo,
  getCreator,
  getModifyTime,
  getCreateTime,
  getReadOnlyText,
  getFormSchema,
  // getAssocForm,
  getAssocLink,
  getSwitch,
  getSubForm,
  getAssocAttr,
} from '../schema.common';
import {
  AssocMultFormControl,
  AssocAttrControl,
} from '../../template/advanced/adapter/adapter-type';

export const getFormInfoSchema = (dataDefinition: FormSchemaData[]) => {
  const getCompSchema = (compName: Lcp.FormItem.All, item: FormSchemaData, fieldName: string) => {
    switch (compName) {
      case 'input':
      case 'textarea':
      case 'date':
      case 'number':
      case 'radio':
      case 'checkbox':
      case 'select':
      case 'owner':
      case 'ownerDept':
        return getReadOnlyText(item, fieldName);
      case 'switch':
        return getSwitch({ ...item, editable: false }, fieldName);
      case 'description':
        return getDescription(item, fieldName);
      case 'groupTitle':
        return getGroupTitle(item, fieldName);
      case 'subform':
        return getSubForm(item, fieldName, true);
      case 'serialNo':
        return getSerialNo(item, fieldName);
      case 'creator':
        return getCreator(item, fieldName);
      case 'modifyTime':
        return getModifyTime(item, fieldName);
      case 'createTime':
        return getCreateTime(item, fieldName);
      case 'associationForm':
      case 'associationFormMultiSelect':
        return getAssocLink(item as AssocMultFormControl, fieldName);
      case 'associationAttribute':
        return getAssocAttr(item as AssocAttrControl, fieldName);
      default:
        return getDescription(item, '');
    }
  };
  return getFormSchema(dataDefinition, getCompSchema, false);
};
