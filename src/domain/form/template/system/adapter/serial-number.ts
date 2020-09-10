import { hideTitleComps } from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { formItemControlTypeMap } from '@/constants/form/common';
import { FormItemSpec } from '../../model';
import { injectFixedFields, adaptCtrlPartialProps } from '../../common';
import { SystemControl } from './adapter-type.d';

export class SerialNo {
  adapt = (controlItem: FormItemSpec): SystemControl => ({
    id: controlItem.id,

    // displayRule: controlItem.data.hideRule.value,

    seqNoStructure: controlItem.data.seqNoStructure,

    ...adaptCtrlPartialProps(controlItem),

    ...injectFixedFields(controlItem.data),
  });

  parse = (serverData: SystemControl) =>
    ({
      id: serverData.id,
      code: serverData.code,
      displayable: serverData.sequenceNumber >= 0,
      parentType: 'SYSTEM_COMPS',
      title: serverData.name,
      fromRaw: false,
      subFormId: null,
      renderOptions: {
        hideTitle: hideTitleComps.includes(formItemControlTypeMap[serverData.controlType]),
      },
      compType: 'serialNo',
      data: {
        name: serverData.name,
        seqNoStructure: serverData.seqNoStructure,

        dataType: serverData.dataType,

        ...injectFixedFields(serverData),
      },
    } as FormItemSpec);
}
