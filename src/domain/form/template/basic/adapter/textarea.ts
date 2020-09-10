import { getDragTypeFromFormSpec } from '@/domain/form/template/adapter';
import { hideTitleComps } from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { formItemControlTypeMap } from '@/constants/form/common';
import { FormItemSpec } from '../../model';
import {
  injectFixedFields,
  convertCalcToServeMap,
  showCalcToLocalMap,
  convertMapToString,
  convertStringToMap,
  adaptCtrlPartialProps,
} from '../../common';
import { TextareaControl } from './adapter-type.d';

export class Textarea {
  adapt = (localData: FormItemSpec[]): TextareaControl[] =>
    localData.map((inputItem) => ({
      id: inputItem.id,
      rows: inputItem.data.visibleRows,

      displayRule: inputItem.data.hideRule.value,
      defaultValueRuleType: convertCalcToServeMap[inputItem.data.defaultValue.calcFormula],
      computationRule: inputItem.data.defaultValue.calcSelect.value,

      dataLinkSchemaCode: inputItem.data.defaultValue.dataLink.dataLinkSchemaCode,
      isChildSchema: inputItem.data.defaultValue.dataLink.isChildSchema,
      dataLinkCondition:
        inputItem.data.defaultValue.dataLink.dataLinkCondition.length > 0
          ? convertMapToString(inputItem.data.defaultValue.dataLink.dataLinkCondition)
          : '',
      dataLinkResult: inputItem.data.defaultValue.dataLink.dataLinkResult,

      placeHolder: inputItem.data.tip,
      description: inputItem.data.description,

      ...adaptCtrlPartialProps(inputItem),

      ...injectFixedFields(inputItem.data),
    }));

  parse = (serverData: TextareaControl[]) =>
    serverData.map(
      (item) =>
        ({
          id: item.id,
          code: item.code,
          displayable: item.sequenceNumber >= 0,
          parentType: getDragTypeFromFormSpec(
            formItemControlTypeMap[item.controlType] as Lcp.FormItem.All,
          ),
          title: item.name,
          fromRaw: false,
          renderOptions: {
            hideTitle: hideTitleComps.includes(formItemControlTypeMap[item.controlType]),
          },
          subFormId: item.subFormTemplateId,
          compType: formItemControlTypeMap[item.controlType],
          data: {
            name: item.name,
            visibleRows: item.rows,
            hideRule: { label: false, value: item.displayRule ? item.displayRule : '' },
            defaultValue: {
              calcFormula: convertCalcToServeMap[item.defaultValueRuleType],
              calcSelect: {
                label: showCalcToLocalMap[convertCalcToServeMap[item.defaultValueRuleType]],
                value: item.computationRule ? item.computationRule : '',
              },
              dataLink: {
                dataLinkSchemaCode: item.dataLinkSchemaCode,
                isChildSchema: item.isChildSchema,
                dataLinkCondition: item.dataLinkCondition
                  ? convertStringToMap(item.dataLinkCondition, 'currentForm', 'dataLinkForm')
                  : [],
                dataLinkResult: item.dataLinkResult,
              },
            },
            tip: item.placeHolder,
            description: item.description,

            dataType: item.dataType,

            ...injectFixedFields(item),
          },
        } as FormItemSpec),
    );
}
