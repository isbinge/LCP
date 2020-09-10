import { FormItemSpec } from '../../model';
import { checkControlType } from '../../common';

import { AssocAttr } from './assoc-attr';
import { AssocForm } from './assoc-form';
import { AssocMultForm } from './assoc-mult-form';
import { AdvancedCtrlType } from '../../adapter-type.d';

export function adaptAdvanceControlData(advancedControlData: FormItemSpec[]) {
  const assocForms = advancedControlData.filter(checkControlType('associationForm'));
  const assocAttrs = advancedControlData.filter(checkControlType('associationAttribute'));
  // 将 表单属性 注入到对应的关联表单
  // const injectedAssocAttrAFs = assocForms.map(assocForm => {
  //   const injectedAssocAttrAF = { ...assocForm, data: { ...assocForm.data } };
  //   injectedAssocAttrAF.data.assocAttrConfigs = assocAttrs.filter(
  //     assocAttr =>
  //       assocAttr.data.assocAttrConfig.associateForm &&
  //       assocForm.data.code &&
  //       assocAttr.data.assocAttrConfig.associateForm === assocForm.data.code,
  //   );
  //   return injectedAssocAttrAF;
  // });

  const adaptedAssocAttrData = new AssocAttr().adapt(assocAttrs);
  const adaptedAssocFormData = new AssocForm().adapt(assocForms);
  const adaptedAssocMultFormData = new AssocMultForm().adapt(
    advancedControlData.filter(
      (controlItem) => controlItem.compType === 'associationFormMultiSelect',
    ),
  );
  return {
    associatedWithAttributeControlDtos:
      adaptedAssocAttrData.length > 0 ? adaptedAssocAttrData : null,
    associatedWithFormControlDtos: adaptedAssocFormData.length > 0 ? adaptedAssocFormData : null,
    associatedWithFormMultiSelectControlDtos:
      adaptedAssocMultFormData.length > 0 ? adaptedAssocMultFormData : null,
  };
}

export function parseAdvanceControlData(serverData: AdvancedCtrlType) {
  return [
    ...new AssocAttr().parse(serverData.associatedWithAttributeControls),
    ...new AssocForm().parse(serverData.associatedWithFormControls),
    ...new AssocMultForm().parse(serverData.associatedWithFormMultiSelectControls),
  ];
}
