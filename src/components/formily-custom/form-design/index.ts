/** 注册自定义的field */
import { createFormActions, registerFormFields, connect, registerVirtualBox } from '@formily/antd';

import CustomCalcModal from './CustomCalcModal';
import CustomDataLinkModal from './CustomDataLinkModal';
import CustomOptions from './CustomOptions';
import CustomerCheckBox from './CustomCheckBox';
import CustomerSelectForm from './CustomSelectForm';
import CustomDataFillRule from './CustomDataFillRule';
import CustomAssociationField from './CustomAssociationField';
import CustomSelectAsField from './CustomSelectAsField';
import CustomSerialRule from './CustomSerialRule';
import CustomFields from './CustomFields';
import SelectionRange from './SelectionRange';
import CustomerWrapper from './CustomWarpper';

registerFormFields({
  'custom-calcformula-modal': connect()(CustomCalcModal),
  'custom-datalink-modal': connect()(CustomDataLinkModal),
  'custom-options-radio': connect()(CustomOptions),
  'custom-options-checkbox': connect()(CustomerCheckBox),
  'custom-select-form': connect()(CustomerSelectForm),
  'custom-datafill-rule': connect()(CustomDataFillRule),
  'custom-association-field': connect()(CustomAssociationField),
  'custom-select-asField': connect()(CustomSelectAsField),
  'custom-serial-rule': connect()(CustomSerialRule),
  'custom-fields': connect()(CustomFields),
  'custom-selection-range': connect()(SelectionRange),
});
registerVirtualBox('custom-wrapper', CustomerWrapper);

export const formCompSpecActions = createFormActions();
