import React from 'react';
import { Tooltip } from 'antd';
import FormRecordData from '@/domain/form/instance/data.d';
import { FormItemControlType } from '@/constants/form/common';
import NumberInput from './NumberInput';
import Time from './Time';
import BasicSelect from './BasicSelect';
import Switch from './Switch';
// import DeptTree from './DeptTree';
import TextInput from './TextInput';
import AssocForm from './AssocForm';

import styles from './index.scss';

export interface QueryControlProps {
  item: FormRecordData.QueryItemBase;
  value: FormRecordData.QueryValueType;
  onChange: (value: FormRecordData.QueryValueType) => void;
}

const DynamicQueryItem: React.FC<QueryControlProps> = (props) => {
  let Comp = null;
  switch (props.item.controlType) {
    case FormItemControlType.NUMBER: {
      Comp = NumberInput;
      break;
    }
    case FormItemControlType.DATE:
    case FormItemControlType.CREATE_TIME:
    case FormItemControlType.MODIFY_TIME: {
      Comp = Time;
      break;
    }
    case FormItemControlType.RADIO:
    case FormItemControlType.CHECKBOX:
    case FormItemControlType.SELECT: {
      Comp = BasicSelect;
      break;
    }
    case FormItemControlType.SWITCH: {
      Comp = Switch;
      break;
    }
    // case FormItemControlType.CREATOR: {
    //   Comp = DeptTree;
    //   break;
    // }
    case FormItemControlType.ASSOC_FORM:
    case FormItemControlType.ASSOC_FORM_MULTI_SELECT: {
      Comp = AssocForm;
      break;
    }
    case FormItemControlType.INPUT:
    case FormItemControlType.TEXTAREA:
    case FormItemControlType.SERIAL_NO: {
      Comp = TextInput;
      break;
    }
    default: {
      break;
    }
  }
  return Comp ? <Comp {...props} /> : null;
};

const QueryControl: React.FC<QueryControlProps> = (props) => {
  const title = props.item.parentDisplayName
    ? `${props.item.parentDisplayName}.${props.item.displayName}`
    : props.item.displayName;
  return (
    <div className={styles.compWrapper}>
      <Tooltip title={title}>
        <span className={styles.text}>{title}</span>
      </Tooltip>
      <div className={styles.compStyle}>
        <DynamicQueryItem {...props} />
      </div>
    </div>
  );
};
export default QueryControl;
