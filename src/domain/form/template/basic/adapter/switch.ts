import { getDragTypeFromFormSpec } from '@/domain/form/template/adapter';
import { hideTitleComps } from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { formItemControlTypeMap } from '@/constants/form/common';
import { FormItemSpec } from '../../model';
import { injectFixedFields, adaptCtrlPartialProps } from '../../common';
import { SwitchControl } from './adapter-type.d';

export class Switch {
  adapt = (localData: FormItemSpec[]): SwitchControl[] =>
    localData.map((inputItem) => ({
      id: inputItem.id,
      defaultItems: inputItem.data.content,
      defaultValue: inputItem.data.switch,
      displayRule: inputItem.data.hideRule.value,

      ...adaptCtrlPartialProps(inputItem, inputItem.data.content),

      ...injectFixedFields(inputItem.data),
    }));

  parse = (serverData: SwitchControl[]) =>
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
            hideRule: { label: false, value: item.displayRule ? item.displayRule : '' },
            content: item.defaultItems,
            switch: item.defaultValue === 'true',

            dataType: item.dataType,

            ...injectFixedFields(item),
          },
        } as FormItemSpec),
    );
}
