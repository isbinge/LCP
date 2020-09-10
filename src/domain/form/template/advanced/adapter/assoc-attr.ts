import { hideTitleComps } from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { formItemControlTypeMap } from '@/constants/form/common';
import { FormItemSpec } from '../../model';
import { injectFixedFields, adaptCtrlPartialProps } from '../../common';
import { AssocAttrControl } from './adapter-type.d';

export class AssocAttr {
  adapt = (localData: FormItemSpec[]): AssocAttrControl[] =>
    localData.map((inputItem) => ({
      id: inputItem.id,

      displayRule: inputItem.data.hideRule.value,
      mappingField: inputItem.data.assocAttrConfig.associateField,
      schemaCode: inputItem.data.assocAttrConfig.associateForm,
      asFilter: inputItem.data.assocAttrConfig.setting,
      description: inputItem.data.description,
      ...adaptCtrlPartialProps(inputItem),

      ...injectFixedFields(inputItem.data),
    }));

  parse = (serverData: AssocAttrControl[]) =>
    serverData.map(
      (item) =>
        ({
          id: item.id,
          code: item.code,
          displayable: item.sequenceNumber >= 0,
          parentType: 'ADVANCED_COMPS',
          title: item.name,
          fromRaw: false,
          renderOptions: {
            hideTitle: hideTitleComps.includes(formItemControlTypeMap[item.controlType]),
          },
          subFormId: item.subFormTemplateId,
          compType: 'associationAttribute',
          data: {
            name: item.name,
            hideRule: { label: false, value: item.displayRule ? item.displayRule : '' },
            assocAttrConfig: {
              associateForm: item.schemaCode,
              associateField: item.mappingField,
              setting: item.asFilter,
              dataType: item.dataType,
            },
            //
            ...injectFixedFields(item),
          },
        } as FormItemSpec),
    );
}
