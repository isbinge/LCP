import { createFormActions, registerFormFields, connect } from '@formily/antd';

import CustomGroupTitle from './CustomGroupTitle';
import AssocSelect from './AssocSelect';
import CustomText from './CustomText';
import SubForm from './SubForm';
import CustomSelect from './CustomSelect';
import AssocAttr from './AssocAttr';
import AssocLink from './AssocLink';
import CustomInput from './CustomInput';
import CustomTextArea from './CustomTextArea';
import CustomDate from './CustomDate';
import Number from './CustomInputNumber';
import Radio from './Radio';
import Owner from './Owner';
import OwnerDept from './OwnerDept';

registerFormFields({
  'custom-group-title': connect()(CustomGroupTitle),
  'custom-assoc-select': connect()(AssocSelect),
  'custom-text': connect()(CustomText),
  'custom-select': connect()(CustomSelect),
  'custom-assoc-attr': connect()(AssocAttr),
  'custom-assoc-link': connect()(AssocLink),
  'custom-subform': connect()(SubForm),
  'custom-form-record-input': connect()(CustomInput),
  'custom-form-record-textarea': connect()(CustomTextArea),
  'custom-form-record-date': connect()(CustomDate),
  'custom-form-record-num': connect()(Number),
  'custom-form-record-radio': connect()(Radio),
  'custom-owner': connect()(Owner),
  'custom-owner-dept': connect()(OwnerDept),
});

export const actions = createFormActions();
