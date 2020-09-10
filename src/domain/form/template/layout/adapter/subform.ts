// import {  } from 'immutability-helper';

import { componentDefinition, DndItemType } from '@/constants';
import { injectFormDataFor, sortFormItemSpecs } from '@/domain/form/template/adapter';

import { hideTitleComps } from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { adaptBasicControlData } from '@/domain/form/template/basic/adapter';
import { adaptAdvanceControlData } from '@/domain/form/template/advanced/adapter';
import { FormItemSpec } from '../../model';
import { injectFixedFields } from '../../common';
import { SubFormControl } from './adapter-type.d';

export class SubForm {
  adapt = (localData: FormItemSpec[]): SubFormControl[] =>
    localData.map((subFormItem) => {
      const injectedSpecItems = injectFormDataFor(
        subFormItem.extraData as FormItemSpec[],
        subFormItem.data.formId,
      );
      return {
        id: subFormItem.id,
        sequenceNumber: subFormItem.data.sequenceNumber,
        formTemplateId: subFormItem.data.formId,
        name: subFormItem.data.name,
        code: subFormItem.code as string,

        dataTitle: subFormItem.data.dataTitle.join(';'),
        displayRule: subFormItem.data.hideRule.value,

        controlType: componentDefinition[subFormItem.compType].controlType,

        ...adaptBasicControlData(
          injectedSpecItems.filter(
            (basicItem) => basicItem.parentType === DndItemType.form.BASIC_COMPS,
          ),
        ),
        ...adaptAdvanceControlData(
          injectedSpecItems.filter(
            (advancedItem) => advancedItem.parentType === DndItemType.form.ADVANCED_COMPS,
          ),
        ),

        ...injectFixedFields(subFormItem.data),
      };
    });

  parse = (serverData: SubFormControl[]) =>
    serverData.map((item) => {
      const subFormItemSpecs = sortFormItemSpecs(item, {
        rawBasicCtrlNames: [
          'singleLineInputControls',
          'checkboxGroupControls',
          'dateTimeControls',
          'numberInputControls',
          'checkboxControls',
          'selectControls',
          'switchControls',
          'textAreaInputControls',
        ],
        rawAdvanceCtrlNames: [
          'associatedWithAttributeControls',
          'associatedWithFormControls',
          'associatedWithFormMultiSelectControls',
        ],
      });
      return {
        id: item.id,
        code: item.code,
        displayable: item.sequenceNumber >= 0,
        parentType: DndItemType.form.LAYOUT_COMPS,
        title: item.name,
        fromRaw: false,
        subFormId: null,
        renderOptions: {
          hideTitle: hideTitleComps.includes('subform'),
        },
        compType: 'subform',
        data: {
          name: item.name,
          dataTitle: (item.dataTitle && item.dataTitle.split(';')) || [],
          hideRule: { label: false, value: item.displayRule ? item.displayRule : '' },
          ...injectFixedFields(item),
        },
        extraData: subFormItemSpecs,
      } as FormItemSpec;
    });
}
