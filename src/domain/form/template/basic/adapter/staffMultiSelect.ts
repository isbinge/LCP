import { formItemControlTypeMap } from '@/constants/form/common';
import { FormItemSpec } from '../../model';
import {
  injectFixedFields,
  adaptCtrlPartialProps,
  adaptUnitSelectionRange,
  parseUnitSelectionRange,
} from '../../common';
import { StaffMultiSelectControl } from './adapter-type.d';
import { getDragTypeFromFormSpec } from '../../adapter';

export class StaffMultiSelect {
  adapt = (staffMultiSelect: FormItemSpec[]): StaffMultiSelectControl[] =>
    staffMultiSelect.map((controlItem) => ({
      id: controlItem.id,

      displayRule: controlItem.data.hideRule.value,

      isRelatedMember: controlItem.data.isRelatedMember,
      unitSelectionRange: adaptUnitSelectionRange(controlItem.data.unitSelectionRange),

      allowSelectedUserViewData: controlItem.data.allowSelectedUserViewData,

      description: controlItem.data.description,

      ...adaptCtrlPartialProps(controlItem),

      ...injectFixedFields(controlItem.data),
    }));

  parse = (serverData: StaffMultiSelectControl[]) =>
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
            allowSelectedUserViewData: item.allowSelectedUserViewData,
            description: item.description,
            dataType: item.dataType,

            ...injectFixedFields(item),
          },
        } as FormItemSpec),
    );
}
