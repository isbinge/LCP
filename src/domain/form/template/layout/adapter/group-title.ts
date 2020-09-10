import { componentDefinition, DndItemType } from '@/constants';
import { FormItemSpec } from '../../model';
import { injectFixedFields } from '../../common';
import { GroupTitleControl } from './adapter-type.d';

export class GroupTitle {
  adapt = (localData: FormItemSpec[]): GroupTitleControl[] =>
    localData.map((inputItem) => ({
      id: inputItem.id,

      alignment: inputItem.data.alignment,

      sequenceNumber: inputItem.data.sequenceNumber,
      formTemplateId: inputItem.data.formId,
      subFormTemplateId: inputItem.data.subFormId || null,
      name: inputItem.data.name,
      code: inputItem.code as string,
      controlType: componentDefinition[inputItem.compType].controlType,
      controlGroupType: componentDefinition[inputItem.compType].controlGroupType,

      ...injectFixedFields(inputItem.data),
    }));

  parse = (serverData: GroupTitleControl[]) =>
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
            hideTitle: true,
          },
          compType: 'groupTitle',
          data: {
            name: item.name,
            alignment: item.alignment,

            ...injectFixedFields(item),
          },
        } as FormItemSpec),
    );
}
