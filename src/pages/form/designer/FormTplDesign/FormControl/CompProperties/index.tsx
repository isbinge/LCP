import React from 'react';
import { useSelector, useDispatch } from 'dva';
import { debounce, isFunction } from 'lodash';
import { FormattedMessage as FM } from 'react-intl';
import { SchemaForm } from '@formily/antd';

import { formCompSpecActions } from '@comp/formily-custom/form-design';
import { useLogger } from '@/utils/hooks/use-logger';
import { FormItemSpec } from '@/domain/form/template/model';
import { schema, effects } from '@/domain/form/template';
import { getSelectedCtrl } from '@/domain/form/template/common';

import ControlPlaceholder from '@/assets/form/control-placeholder.svg';
import styles from './index.scss';
import 'antd/dist/antd.css';

// 没有shema的控件类型
const typeNoSchema = ['inlineSplit'];

const CompProperties = () => {
  const log = useLogger('comp-properties');
  const dispatch = useDispatch();
  const { currentId, formItemSpecs } = useSelector(({ formTemplate }) => formTemplate);
  const selectedCtrl = getSelectedCtrl(currentId as string, formItemSpecs);
  const compType = selectedCtrl?.compType || null;
  const debouncedDispatch = debounce((currentCtrl: FormItemSpec, value: unknown) => {
    dispatch({ type: 'formTemplate/adapterSelectedCtrl', payload: { currentCtrl, value } });
  }, 300);
  const handleChange = (currentCtrl: FormItemSpec, value: unknown) => {
    if (!formCompSpecActions.getFormState().modified) {
      return;
    }
    log(value);
    debouncedDispatch(currentCtrl, value);
  };

  return (
    <div className={styles.container} id="form-design-comp-properties-area">
      {compType !== null && !typeNoSchema.includes(compType) && selectedCtrl ? (
        <SchemaForm
          key={selectedCtrl.id + compType}
          useDirty
          layout="vertical"
          onChange={(value: unknown) => handleChange(selectedCtrl, value)}
          schema={
            isFunction(schema[compType])
              ? schema[compType](selectedCtrl, formItemSpecs)
              : schema[compType]
          }
          effects={effects[compType]}
          actions={formCompSpecActions}
          value={selectedCtrl.data}
        />
      ) : (
        <div className={styles.placeholder}>
          <img src={ControlPlaceholder} alt="control-placeholder" />
          <FM id="formtpl.control.tab.placeholder" />
        </div>
      )}
    </div>
  );
};

export default CompProperties;
