import { componentDefinition, DndItemType } from '@/constants';
import { hideTitleComps } from '@/pages/form/designer/FormTplDesign/FormItemPanel';
import { formItemControlTypeMap } from '@/constants/form/common';
import { FormItemSpec } from '../../model';
import { injectFixedFields } from '../../common';
import { DescriptionControl } from './adapter-type.d';

export class Description {
  adapt = (localData: FormItemSpec[]): DescriptionControl[] =>
    localData.map((inputItem) => ({
      id: inputItem.id,

      content: inputItem.data.description,

      sequenceNumber: inputItem.data.sequenceNumber,
      formTemplateId: inputItem.data.formId,
      subFormTemplateId: inputItem.data.subFormId || null,
      name: inputItem.data.name,
      code: inputItem.code as string,
      controlType: componentDefinition[inputItem.compType].controlType,
      controlGroupType: componentDefinition[inputItem.compType].controlGroupType,

      ...injectFixedFields(inputItem.data),
    }));

  parse = (serverData: DescriptionControl[]) =>
    serverData.map(
      (item) =>
        ({
          id: item.id,
          code: item.code,
          displayable: item.sequenceNumber >= 0,
          parentType: DndItemType.form.LAYOUT_COMPS,
          title: item.name,
          fromRaw: false,
          subFormId: null,
          renderOptions: {
            hideTitle: hideTitleComps.includes(formItemControlTypeMap[item.controlType]),
          },
          compType: formItemControlTypeMap[item.controlType],
          data: {
            name: item.name,
            description: item.content,

            ...injectFixedFields(item),
          },
        } as FormItemSpec),
    );
}
