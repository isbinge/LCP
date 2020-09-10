import { getDragTypeFromFormSpec } from '@/domain/form/template/adapter';
import { hideTitleComps } from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { formItemControlTypeMap } from '@/constants/form/common';
import { FormItemSpec } from '../../model';
import { injectFixedFields, adaptCtrlPartialProps } from '../../common';
import { RadioControl } from './adapter-type.d';

const showModeMap = {
  sideSlip: 1,
  tile: 2,
  1: 'sideSlip',
  2: 'tile',
};

export class Radio {
  adapt = (localData: FormItemSpec[]): RadioControl[] =>
    localData.map((inputItem) => ({
      id: inputItem.id,
      mobileSelectShowMode: showModeMap[inputItem.data.mobileSelectShowMode],
      defaultItems:
        inputItem.data.options.optionsValue.length > 0
          ? inputItem.data.options.optionsValue.join(';')
          : '',
      defaultValue: inputItem.data.options.selectValue,

      displayRule: inputItem.data.hideRule.value,

      description: inputItem.data.description,

      ...adaptCtrlPartialProps(inputItem),

      ...injectFixedFields(inputItem.data),
    }));

  parse = (serverData: RadioControl[]) =>
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
            inputType: 'radio',
            hideRule: { label: false, value: item.displayRule ? item.displayRule : '' },
            options: {
              optionsValue: item.defaultItems ? item.defaultItems.split(';') : '',
              selectValue: item.defaultValue,
            },
            description: item.description,
            //
            mobileSelectShowMode: item.mobileSelectShowMode
              ? showModeMap[item.mobileSelectShowMode]
              : 'sideSlip',

            dataType: item.dataType,

            ...injectFixedFields(item),
          },
        } as FormItemSpec),
    );
}
