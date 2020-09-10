import { FormItemSpec } from '../../model';
import { checkControlType } from '../../common';

import { Description } from './description';
import { GroupTitle } from './group-title';
import { SubForm } from './subform';
import { LayoutCtrlType } from '../../adapter-type.d';

export function adaptLayoutControlData(layoutControlData: FormItemSpec[]) {
  const adaptedDescriptionData = new Description().adapt(
    layoutControlData.filter(checkControlType('description')),
  );
  const adaptedGroupTitleData = new GroupTitle().adapt(
    layoutControlData.filter(checkControlType('groupTitle')),
  );
  const adaptedSubFormData = new SubForm().adapt(
    layoutControlData.filter(checkControlType('subform')),
  );

  return {
    descriptionControlDtos: adaptedDescriptionData.length > 0 ? adaptedDescriptionData : null,
    groupTitleControlDtos: adaptedGroupTitleData.length > 0 ? adaptedGroupTitleData : null,
    subFormTemplateDtos: adaptedSubFormData.length > 0 ? adaptedSubFormData : null,
  };
}

export function parseLayoutControlData(serverData: LayoutCtrlType) {
  return [
    ...new Description().parse(serverData.descriptionControls),
    ...new GroupTitle().parse(serverData.groupTitleControls),
    ...new SubForm().parse(serverData.subFormTemplates),
  ];
}
