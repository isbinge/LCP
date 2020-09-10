import { formItemControlTypeMap } from '@/constants/form/common';
import { FormItemSpec } from '../../model';
import {
  injectFixedFields,
  adaptCtrlPartialProps,
  adaptUnitSelectionRange,
  parseUnitSelectionRange,
} from '../../common';
import { DeptSelectControl } from './adapter-type.d';
import { getDragTypeFromFormSpec } from '../../adapter';

export class DeptSelect {
  adapt = (deptSelectData: FormItemSpec[]): DeptSelectControl[] =>
    deptSelectData.map((controlItem) => ({
      id: controlItem.id,

      displayRule: controlItem.data.hideRule.value,

      unitSelectionRange: adaptUnitSelectionRange(controlItem.data.unitSelectionRange),

      description: controlItem.data.description,

      ...adaptCtrlPartialProps(controlItem),

      ...injectFixedFields(controlItem.data),
    }));

  parse = (serverData: DeptSelectControl[]) =>
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
            unitSelectionRange: parseUnitSelectionRange(item.unitSelectionRange),
            description: item.description,
            dataType: item.dataType,

            ...injectFixedFields(item),
          },
        } as FormItemSpec),
    );
}
