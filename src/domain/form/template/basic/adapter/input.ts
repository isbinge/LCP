import { formItemControlTypeMap } from '@/constants/form/common';

import { getDragTypeFromFormSpec } from '@/domain/form/template/adapter';
import { hideTitleComps } from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { FormItemSpec } from '../../model';
import {
  injectFixedFields,
  convertCalcToServeMap,
  showCalcToLocalMap,
  textFormatTypeMap,
  convertMapToString,
  convertStringToMap,
  adaptCtrlPartialProps,
} from '../../common';
import { SingleLineInputControl } from './adapter-type.d';

export class Input {
  adapt = (localData: FormItemSpec[]): SingleLineInputControl[] =>
    localData.map((inputItem) => ({
      id: inputItem.id,

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
      // required field
      mode: textFormatTypeMap[inputItem.data.format],
      // required field
      inputByScan: inputItem.data.inputByScan,
      // required field
      scanUpdateEnable: inputItem.data.scanUpdateEnable,
      // required field
      noRepeat: !!inputItem.data.verify[0],
      placeHolder: inputItem.data.tip,
      description: inputItem.data.description,

      ...adaptCtrlPartialProps(inputItem),

      ...injectFixedFields(inputItem.data),
    }));

  parse = (serverData: SingleLineInputControl[]) =>
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
            inputType: 'input',
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
            format: item.mode ? textFormatTypeMap[item.mode] : '',
            verify: [item.noRepeat ? 1 : 0],
            tip: item.placeHolder,
            description: item.description,
            //
            inputByScan: item.inputByScan,
            scanUpdateEnable: item.inputByScan,

            dataType: item.dataType,

            ...injectFixedFields(item),
          },
        } as FormItemSpec),
    );
}
