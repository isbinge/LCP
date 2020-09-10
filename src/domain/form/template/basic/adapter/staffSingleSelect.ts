import { formItemControlTypeMap } from '@/constants/form/common';
import { FormItemSpec } from '../../model';
import {
  injectFixedFields,
  adaptCtrlPartialProps,
  adaptUnitSelectionRange,
  parseUnitSelectionRange,
} from '../../common';
import { StaffSingleSelectControl } from './adapter-type.d';
import { getDragTypeFromFormSpec } from '../../adapter';

export class StaffSingleSelect {
  adapt = (staffSingleSelectData: FormItemSpec[]): StaffSingleSelectControl[] =>
    staffSingleSelectData.map((controlItem) => ({
      id: controlItem.id,

      displayRule: controlItem.data.hideRule.value,

      isRelatedMember: controlItem.data.isRelatedMember,
      unitSelectionRange: adaptUnitSelectionRange(controlItem.data.unitSelectionRange),

      deptMappingField: controlItem.data.personFilled.deptMappingField,
      genderMappingField: controlItem.data.personFilled.genderMappingField,
      emailMappingField: controlItem.data.personFilled.emailMappingField,
      mobileMappingField: controlItem.data.personFilled.mobileMappingField,

      allowSelectedUserViewData: controlItem.data.allowSelectedUserViewData,

      description: controlItem.data.description,

      ...adaptCtrlPartialProps(controlItem),

      ...injectFixedFields(controlItem.data),
    }));

  parse = (serverData: StaffSingleSelectControl[]) =>
    serverData.map(
      (item) =>
        ({
          id: item.id,
          displayable: item.sequenceNumber >= 0,
          parentType: getDragTypeFromFormSpec(
            formItemControlTypeMap[item.controlType] as Lcp.FormItem.All,
          ),
          title: item.name,
          fromRaw: false,
          subFormId: null,
          renderOptions: {
            hideTitle: false,
          },
          code: item.code,
          compType: formItemControlTypeMap[item.controlType],
          data: {
            name: item.name,
            hideRule: {
              label: false,
              value: item.displayRule ? item.displayRule : '',
            },
            isRelatedMember: item.isRelatedMember,
            unitSelectionRange: parseUnitSelectionRange(item.unitSelectionRange),
            personFilled: {
              deptMappingField: item.deptMappingField,
              genderMappingField: item.genderMappingField,
              emailMappingField: item.emailMappingField,
              mobileMappingField: item.mobileMappingField,
            },
            allowSelectedUserViewData: item.allowSelectedUserViewData,
            description: item.description,
            dataType: item.dataType,

            ...injectFixedFields(item),
          },
        } as FormItemSpec),
    );
}
