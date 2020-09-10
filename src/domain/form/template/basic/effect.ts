/* eslint-disable no-param-reassign */
import { IFormEffect, IFieldState } from '@formily/antd';

/** 关于默认值field的effect */
const defaultValueEffect: IFormEffect = ($, { setFieldState }) => {
  $('onFieldChange', 'defaultValue[calcFormula]').subscribe((fieldState: IFieldState) => {
    if (fieldState.value === undefined) {
      return;
    }
    let theValue = 'calcFormula';
    setFieldState('defaultValue[calcFormula]', (state: IFieldState) => {
      theValue = state.value;
    });
    if (theValue === 'calcFormula') {
      setFieldState('defaultValue[calcSelect]', (state: IFieldState) => {
        state.display = true;
      });
      setFieldState('defaultValue[dataLink]', (state: IFieldState) => {
        state.display = false;
        state.value = {
          dataLinkSchemaCode: '',
          isChildSchema: false,
          dataLinkCondition: [],
          dataLinkResult: '',
        };
      });
    } else {
      setFieldState('defaultValue[calcSelect]', (state: IFieldState) => {
        state.display = false;
        state.value = {
          label: true,
          value: '',
        };
      });
      setFieldState('defaultValue[dataLink]', (state: IFieldState) => {
        state.display = true;
      });
    }
  });
};

/** 下拉框effects函数 */
export const selectEffect: IFormEffect = ($, { setFieldState }) => {
  $('onFieldChange', 'sourceFrom').subscribe((fieldState: IFieldState) => {
    if (fieldState.value === undefined) {
      return;
    }
    let theValue = 'custom';
    setFieldState('sourceFrom', (state: IFieldState) => {
      theValue = state.value;
    });

    if (theValue === 'custom') {
      setFieldState('associateForm', (state: IFieldState) => {
        state.display = false;
        state.value = {
          schemaCode: '',
          schemaId: '',
        };
      });
      setFieldState('dataLimit', (state: IFieldState) => {
        state.display = false;
        state.value = '';
      });
      setFieldState('options', (state: IFieldState) => {
        state.display = true;
      });
    } else {
      setFieldState('associateForm', (state: IFieldState) => {
        state.display = true;
      });
      setFieldState('dataLimit', (state: IFieldState) => {
        state.display = true;
      });
      setFieldState('options', (state: IFieldState) => {
        state.display = false;
      });
    }
  });
  $('onFieldChange', 'associateForm').subscribe((fieldState: IFieldState) => {
    if (fieldState.value === undefined) {
      return;
    }
    if (fieldState.value.schemaCode !== '' && fieldState.display === true) {
      setFieldState('mappingField', (state: IFieldState) => {
        state.display = true;
      });
    } else {
      setFieldState('mappingField', (state: IFieldState) => {
        state.display = false;
      });
    }
  });
};

/** 数字 effect函数 */
export const numberEffect: IFormEffect = ($, { setFieldState }) => {
  defaultValueEffect($, { setFieldState });
  $('onFieldChange', 'format[showDecimal]').subscribe((fieldState: IFieldState) => {
    if (fieldState.value === undefined) {
      return;
    }
    const showDecimal = fieldState.value.length === 0 ? [false] : fieldState.value;
    setFieldState('format[showDecimal]', (state: IFieldState) => {
      state.value = showDecimal;
    });
    if (showDecimal[0]) {
      setFieldState('format[placesNumber]', (state: IFieldState) => {
        state.display = true;
      });
    } else {
      setFieldState('format[placesNumber]', (state: IFieldState) => {
        state.display = false;
        state.value = 0;
      });
    }
  });
  $('onFieldChange', 'format[placesNumber]').subscribe((fieldState: IFieldState) => {
    if (fieldState.value === undefined) {
      return;
    }
    if (fieldState.value === null) {
      setFieldState('format[placesNumber]', (state: IFieldState) => {
        state.value = 0;
      });
    }
  });
  $('onFieldChange', 'format[showThousandSep]').subscribe((fieldState: IFieldState) => {
    if (fieldState.value === undefined) {
      return;
    }
    const showThousandSep = fieldState.value.length === 0 ? [false] : fieldState.value;
    setFieldState('format[showThousandSep]', (state: IFieldState) => {
      state.value = showThousandSep;
    });
  });
};

/** 单行文本 effect函数 */
export const inputEffect: IFormEffect = ($, { setFieldState }) => {
  defaultValueEffect($, { setFieldState });
};

/** 多行文本 */
export const textAreaEffect: IFormEffect = ($, { setFieldState }) => {
  defaultValueEffect($, { setFieldState });
  $('onFieldChange', 'visibleRows').subscribe((fieldState: IFieldState) => {
    if (fieldState.value === undefined) {
      return;
    }
    if (fieldState.value <= 0 || fieldState.value === null) {
      setFieldState('visibleRows', (state: IFieldState) => {
        state.value = 3;
      });
    }
  });
};

/** 日期 */
export const dateEffect: IFormEffect = ($, { setFieldState }) => {
  defaultValueEffect($, { setFieldState });
};
