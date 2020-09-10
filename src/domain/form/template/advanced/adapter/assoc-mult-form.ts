import { hideTitleComps } from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { formItemControlTypeMap } from '@/constants/form/common';
import { FormItemSpec } from '../../model';
import { injectFixedFields, adaptCtrlPartialProps } from '../../common';
import { AssocMultFormControl } from './adapter-type.d';
// TODO: Remember to inject associateFormFields and code
export class AssocMultForm {
  adapt = (localData: FormItemSpec[]): AssocMultFormControl[] =>
    localData.map((inputItem) => ({
      id: inputItem.id,

      displayRule: inputItem.data.hideRule.value,
      schemaCode: inputItem.data.associateForm.schemaCode,
      schemaId: inputItem.data.associateForm.schemaId,
      isChildSchema: inputItem.data.associateForm.isChildSchema,
      associationFilter: inputItem.data.dataLimit,
      description: inputItem.data.description,

      ...adaptCtrlPartialProps(inputItem),

      ...injectFixedFields(inputItem.data),
    }));

  parse = (serverData: AssocMultFormControl[]) =>
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
          compType: 'associationFormMultiSelect',
          data: {
            name: item.name,
            hideRule: { label: false, value: item.displayRule ? item.displayRule : '' },
            associateForm: {
              schemaCode: item.schemaCode,
              schemaId: item.schemaId,
              isChildSchema: item.isChildSchema,
            },
            dataLimit: item.associationFilter,
            description: item.description,
            //
            dataType: item.dataType,
            // isChildSchema: item.isChildSchema,

            ...injectFixedFields(item),
          },
        } as FormItemSpec),
    );
}
