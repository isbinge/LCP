import { hideTitleComps } from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { formItemControlTypeMap } from '@/constants/form/common';

import { FormItemSpec } from '../../model';
import { injectFixedFields, adaptCtrlPartialProps } from '../../common';
import { adaptUnitSelectionRange, parseUnitSelectionRange } from './common';
import { OwnerDeptControl } from './adapter-type.d';

export class OwnerDept {
  adapt = (controlItem: FormItemSpec): OwnerDeptControl => ({
    id: controlItem.id,

    displayRule: controlItem.data.hideRule.value,

    unitSelectionRange: adaptUnitSelectionRange(controlItem.data.unitSelectionRange),

    ...adaptCtrlPartialProps(controlItem),

    ...injectFixedFields(controlItem.data),
  });

  parse = (serverData: OwnerDeptControl) =>
    ({
      id: serverData.id,
      displayable: serverData.sequenceNumber >= 0,
      parentType: 'SYSTEM_COMPS',
      title: serverData.name,
      fromRaw: false,
      subFormId: null,
      renderOptions: {
        hideTitle: hideTitleComps.includes(formItemControlTypeMap[serverData.controlType]),
      },
      code: serverData.code,
      compType: 'ownerDept',
      data: {
        name: serverData.name,
        hideRule: {
          label: false,
          value: serverData.displayRule ? serverData.displayRule : '',
        },
        unitSelectionRange: parseUnitSelectionRange(serverData.unitSelectionRange),

        dataType: serverData.dataType,

        ...injectFixedFields(serverData),
      },
    } as FormItemSpec);
}
