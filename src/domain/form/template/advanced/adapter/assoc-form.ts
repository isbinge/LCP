import { hideTitleComps } from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { formItemControlTypeMap } from '@/constants/form/common';
import { FormItemSpec } from '../../model';
import { injectFixedFields, adaptCtrlPartialProps } from '../../common';
import { AssocFormControl } from './adapter-type.d';

interface AssocFormFillFields {
  currentFormField: string;
  assocFormField: string;
}
export class AssocForm {
  adapt = (localData: FormItemSpec[]): AssocFormControl[] =>
    localData.map((inputItem) => ({
      id: inputItem.id,

      displayRule: inputItem.data.hideRule.value,
      schemaCode: inputItem.data.associateForm.schemaCode,
      schemaId: inputItem.data.associateForm.schemaId,
      isChildSchema: inputItem.data.associateForm.isChildSchema,
      associationFilter: inputItem.data.dataLimit,
      inputByScan: inputItem.data.inputByScan,
      scanUpdateEnable: inputItem.data.scanUpdateEnable,
      mappingControls:
        inputItem.data.dataFillRule.length > 0
          ? inputItem.data.dataFillRule
              .filter((kv: AssocFormFillFields) => kv.currentFormField && kv.assocFormField)
              .map((kv: AssocFormFillFields) => `${kv.currentFormField}:${kv.assocFormField}`)
              .join(';')
          : '',
      mappingProperties: Array.isArray(inputItem.data.mappingProperties)
        ? inputItem.data.mappingProperties.join(';')
        : inputItem.data.mappingProperties,
      description: inputItem.data.description,

      ...adaptCtrlPartialProps(inputItem),

      ...injectFixedFields(inputItem.data),
    }));

  parse = (serverData: AssocFormControl[]) =>
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
          compType: 'associationForm',
          data: {
            name: item.name,
            hideRule: { label: false, value: item.displayRule ? item.displayRule : '' },

            dataLimit: item.associationFilter,
            dataFillRule: item.mappingControls
              ? item.mappingControls.split(';').map((kvStr: string) => ({
                  currentFormField: kvStr.split(':')[0],
                  assocFormField: kvStr.split(':')[1],
                }))
              : [],
            description: item.description,
            //
            mappingProperties: item.mappingProperties ? item.mappingProperties.split(';') : [],
            associateForm: {
              schemaCode: item.schemaCode,
              schemaId: item.schemaId,
              isChildSchema: item.isChildSchema,
            },
            // isChildSchema: item.isChildSchema,
            inputByScan: item.inputByScan,
            scanUpdateEnable: item.scanUpdateEnable,

            dataType: item.dataType,

            ...injectFixedFields(item),
          },
        } as FormItemSpec),
    );
}
