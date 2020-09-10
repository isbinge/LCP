import React, { lazy, Suspense } from 'react';
import { FormItemSpec } from '@/domain/form/template/model';
import { FormattedMessage as FM } from 'react-intl';

interface DynamicFormItemProps {
  id: string;
  type: Lcp.FormItem.All;
  isFromInnerCtrl?: boolean;
  ctrlData: FormItemSpec;
  className?: string;
}

type FormItemPath = {
  // any: 匹配各种组件 props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in Lcp.FormItem.All]: React.ComponentType<any>;
};

const dynamicImportMap: FormItemPath = {
  // Basic
  input: lazy(() => import('./basic/Input')),
  textarea: lazy(() => import('./basic/TextArea')),
  date: lazy(() => import('./basic/Date')),
  number: lazy(() => import('./basic/Number')),
  switch: lazy(() => import('./basic/Switch')),
  checkbox: lazy(() => import('./basic/Checkbox')),
  radio: lazy(() => import('./basic/Radio')),
  select: lazy(() => import('./basic/Select')),
  staffSingleSelect: lazy(() => import('./basic/Select')),
  staffMultiSelect: lazy(() => import('./basic/Select')),
  deptSingleSelect: lazy(() => import('./basic/Select')),
  deptMultiSelect: lazy(() => import('./basic/Select')),
  // Layout
  inlineSplit: lazy(() => import('./layout/InlineSplit')),
  subform: lazy(() => import('./layout/Subform')),
  groupTitle: lazy(() => import('./layout/GroupTitle')),
  description: lazy(() => import('./layout/Description')),
  // System
  serialNo: lazy(() => import('./system/SerialNo')),
  creator: lazy(() => import('./system/Autogen')),
  owner: lazy(() => import('./system/CommonSelect')),
  ownerDept: lazy(() => import('./system/CommonSelect')),
  createTime: lazy(() => import('./system/Autogen')),
  modifyTime: lazy(() => import('./system/Autogen')),
  // advanced
  associationForm: lazy(() => import('./advanced/AssociationForm')),
  associationAttribute: lazy(() => import('./advanced/AssociationAttribute')),
  associationFormMultiSelect: lazy(() => import('./advanced/AssociationFormMultiSelect')),
};

/**
 * 通用表单组件包装
 */
const DynamicFormItem: React.FC<DynamicFormItemProps> = (props) => {
  let { type } = { ...props };
  if (props.isFromInnerCtrl && (props.type === 'checkbox' || props.type === 'radio')) {
    type = 'select';
  }
  const Comp: React.ComponentType<{ value: FormItemSpec }> = dynamicImportMap[type];
  return (
    <Suspense
      fallback={
        <div className="flex-col-center vertical-filled" style={{ color: '#D6D7E0' }}>
          <FM id="loading.formtpl.canvas" />
        </div>
      }
    >
      <div className={props.className}>
        <Comp value={props.ctrlData} />
      </div>
    </Suspense>
  );
};

export default DynamicFormItem;
