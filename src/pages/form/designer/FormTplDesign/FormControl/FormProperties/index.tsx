/* eslint-disable no-param-reassign */
import React, { useMemo } from 'react';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'dva';
import SchemaForm, { createFormActions } from '@formily/antd';

import LcpConst from '@/constants';
import createSchema from '@/domain/form/template/schema';

import styles from './index.scss';
import 'antd/dist/antd.css';

const layoutTypes = LcpConst.FORM_DESIGN_TPL_COMPTYPE_LAYOUT;

export const formSpecActions = createFormActions();

const FormProperties: React.FC = () => {
  const dispatch = useDispatch();
  const [
    { formSpec, formItemSpecs: fisRaw },
    isLoadingTpl,
  ] = useSelector(({ formTemplate, loading }) => [
    formTemplate,
    loading.effects['formTemplate/getFormTpl'],
  ]);
  const formItemSpecs = useMemo(
    () => fisRaw.filter((item) => item.displayable && !layoutTypes.includes(item.compType)),
    [fisRaw],
  );
  const formProperties = createSchema(formItemSpecs);

  const handleChange = (value: unknown) => {
    dispatch({
      type: 'formTemplate/updateFormSpec',
      payload: {
        formSpec: value,
      },
    });
  };

  return (
    <div className={classnames([styles.container, 'form-design-properties'])}>
      {!isLoadingTpl && (
        <SchemaForm
          layout="vertical"
          className="form-tpl-schema"
          schema={formProperties}
          value={formSpec}
          onChange={handleChange}
          effects={($, { setFieldState }) => {
            $('onFieldChange', 'dataTitle').subscribe((fieldState) => {
              if (fieldState.value === undefined) {
                return;
              }
              const dataSource: string[] = fieldState.props.enum.map(
                (item: { value: string }) => item.value,
              );
              setFieldState('dataTitle', (state) => {
                if (dataSource.length > 0) {
                  if (dataSource.length === 1) {
                    state.value = dataSource;
                    return;
                  }
                  if (fieldState.value.length === 0) {
                    state.value = [dataSource[0]];
                    return;
                  }
                  state.value = fieldState.value?.filter((code: string) =>
                    dataSource.includes(code),
                  );
                  return;
                }
                if (fieldState.value.length === 1 && dataSource.length === 0) {
                  state.value = [];
                }
              });
            });
          }}
          actions={formSpecActions}
        />
      )}
    </div>
  );
};

export default FormProperties;
