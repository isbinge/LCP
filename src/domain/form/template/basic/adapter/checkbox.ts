import { getDragTypeFromFormSpec } from '@/domain/form/template/adapter';
import { hideTitleComps } from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { formItemControlTypeMap } from '@/constants/form/common';
import { FormItemSpec } from '../../model';
import { injectFixedFields, adaptCtrlPartialProps } from '../../common';
import { CheckboxControl } from './adapter-type.d';

const showModeMap = {
  sideSlip: 1,
  tile: 2,
  1: 'sideSlip',
  2: 'tile',
};

export class Checkbox {
  adapt = (localData: FormItemSpec[]): CheckboxControl[] =>
    localData.map((inputItem) => ({
      id: inputItem.id,
      mobileSelectShowMode: showModeMap[inputItem.data.mobileSelectShowMode],
      defaultItems:
        inputItem.data.options.optionsValue.length > 0
          ? inputItem.data.options.optionsValue.join(';')
          : '',
      defaultValue:
        inputItem.data.options.selectValue.length > 0
          ? inputItem.data.options.selectValue.join(';')
          : '',

      displayRule: inputItem.data.hideRule.value,

      description: inputItem.data.description,

      ...adaptCtrlPartialProps(inputItem),

      ...injectFixedFields(inputItem.data),
    }));

  parse = (serverData: CheckboxControl[]) =>
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
            inputType: 'checkbox',
            hideRule: { label: false, value: item.displayRule },
            options: {
              optionsValue: item.defaultItems ? item.defaultItems.split(';') : [],
              selectValue: item.defaultValue ? item.defaultValue.split(';') : [],
            },
            description: item.description,
            //
            mobileSelectShowMode: 'sideSlip',
            dataType: item.dataType,

            ...injectFixedFields(item),
          },
        } as FormItemSpec),
    );
}
