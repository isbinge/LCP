import { hideTitleComps } from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { formItemControlTypeMap } from '@/constants/form/common';
import { FormItemSpec } from '../../model';
import { injectFixedFields, adaptCtrlPartialProps } from '../../common';
import { SystemControl } from './adapter-type.d';

export class Creator {
  adapt = (controlItem: FormItemSpec): SystemControl => ({
    id: controlItem.id,

    displayRule: controlItem.data.hideRule.value,

    ...adaptCtrlPartialProps(controlItem),

    ...injectFixedFields(controlItem.data),
  });

  parse = (serverData: SystemControl) =>
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

        dataType: serverData.dataType,

        ...injectFixedFields(serverData),
      },
    } as FormItemSpec);
}
