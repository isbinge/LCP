import { getDragTypeFromFormSpec } from '@/domain/form/template/adapter';
import { hideTitleComps } from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { formItemControlTypeMap } from '@/constants/form/common';
import { FormItemSpec } from '../../model';
import { injectFixedFields, adaptCtrlPartialProps } from '../../common';
import { SelectControl } from './adapter-type.d';

const showModeMap = {
  sideSlip: 1,
  tile: 2,
  1: 'sideSlip',
  2: 'tile',
};

const selectDataSource = {
  custom: 1,
  assocForm: 2,
  1: 'custom',
  2: 'assocForm',
};

export class Select {
  adapt = (localData: FormItemSpec[]): SelectControl[] =>
    localData.map((inputItem) => ({
      id: inputItem.id,
      mobileSelectShowMode: showModeMap[inputItem.data.mobileSelectShowMode],
      dataSource: selectDataSource[inputItem.data.sourceFrom],
      defaultItems:
        inputItem.data.options.optionsValue.length > 0
          ? inputItem.data.options.optionsValue.join(';')
          : '',
      defaultValue: inputItem.data.options.selectValue,
      mappingField: inputItem.data.mappingField,
      schemaCode: inputItem.data.associateForm.schemaCode,
      IsChildSchema: !!inputItem.data.associateForm.schemaId,

      associationFilter: inputItem.data.dataLimit,
      displayRule: inputItem.data.hideRule.value,

      description: inputItem.data.description,

      ...adaptCtrlPartialProps(inputItem),

      ...injectFixedFields(inputItem.data),
    }));

  parse = (serverData: SelectControl[]) =>
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
            inputType: 'select',
            hideRule: { label: false, value: item.displayRule ? item.displayRule : '' },
            sourceFrom: selectDataSource[item.dataSource],
            options: {
              optionsValue: item.defaultItems ? item.defaultItems.split(';') : '',
              selectValue: item.defaultValue,
            },
            dataLimit: item.associationFilter,
            description: item.description,
            //
            mobileSelectShowMode: item.mobileSelectShowMode
              ? showModeMap[item.mobileSelectShowMode]
              : 'sideSlip',
            associateForm: { schemaCode: item.schemaCode, schemaId: item.IsChildSchema },
            mappingField: item.mappingField,

            dataType: item.dataType,

            ...injectFixedFields(item),
          },
        } as FormItemSpec),
    );
}
