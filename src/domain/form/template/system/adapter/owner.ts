import { hideTitleComps } from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { formItemControlTypeMap } from '@/constants/form/common';

import { FormItemSpec } from '../../model';
import { injectFixedFields, adaptCtrlPartialProps } from '../../common';
import { adaptUnitSelectionRange, parseUnitSelectionRange } from './common';
import { OwnerControl } from './adapter-type.d';

export class Owner {
  adapt = (controlItem: FormItemSpec): OwnerControl => ({
    id: controlItem.id,

    displayRule: controlItem.data.hideRule.value,

    unitSelectionRange: adaptUnitSelectionRange(controlItem.data.unitSelectionRange),
    deptMappingField: controlItem.data.personFilled.deptMappingField,
    genderMappingField: controlItem.data.personFilled.genderMappingField,
    emailMappingField: controlItem.data.personFilled.emailMappingField,
    mobileMappingField: controlItem.data.personFilled.mobileMappingField,

    ...adaptCtrlPartialProps(controlItem),

    ...injectFixedFields(controlItem.data),
  });

  parse = (serverData: OwnerControl) =>
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
      compType: formItemControlTypeMap[serverData.controlType],
      data: {
        name: serverData.name,
        hideRule: {
          label: false,
          value: serverData.displayRule ? serverData.displayRule : '',
        },
        unitSelectionRange: parseUnitSelectionRange(serverData.unitSelectionRange),
        personFilled: {
          deptMappingField: serverData.deptMappingField,
          genderMappingField: serverData.genderMappingField,
          emailMappingField: serverData.emailMappingField,
          mobileMappingField: serverData.mobileMappingField,
        },
        dataType: serverData.dataType,

        ...injectFixedFields(serverData),
      },
    } as FormItemSpec);
}
