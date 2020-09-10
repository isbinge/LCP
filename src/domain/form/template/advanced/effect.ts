/* eslint-disable no-param-reassign */
import { IFormEffect, IFieldState } from '@formily/antd';

/** 关联表单的effect */
export const associationFormEffect: IFormEffect = ($, { setFieldState }) => {
  $('onFieldChange', 'associateForm').subscribe((fieldState: IFieldState) => {
    if (fieldState.value === undefined) {
      return;
    }
    if (fieldState.value.schemaCode !== '') {
      setFieldState('dataFillRule', (state: IFieldState) => {
        state.props.enum = [{ label: 'associationForm', value: ['A', 'B', 'C'] }];
      });
    } else {
      setFieldState('dataFillRule', (state: IFieldState) => {
        state.props.enum = [];
        state.value = [];
      });
    }
  });
};
