import dayjs, { OpUnitType } from 'dayjs';
import { FormItemControlType } from '@/constants/form/common';
import { actions } from '@comp/formily-custom/form-record';

// import { DataRangeCompact } from '@/constants/list-design/enum';
import FormRecordData from './data';
import { DataLkgMappings } from './schema-type';

export const dateTransfer = (types: OpUnitType[]) => {
  if (types.length === 1) {
    const start = dayjs().startOf(types[0]).toISOStringInUTC();
    const end = dayjs().endOf(types[0]).toISOStringInUTC();
    return [start, end];
  }
  if (types.length === 2) {
    const start = dayjs().startOf(types[0]).subtract(1, types[1]).toISOStringInUTC();
    const end = dayjs().endOf(types[0]).subtract(1, types[1]).toISOStringInUTC();
    return [start, end];
  }
  return [];
};

export const queryGenerate = (
  queryItems: FormRecordData.QueryItemProps[] = [],
  values: FormRecordData.QueryValueType,
  code: string,
) => {
  const itemIndex = queryItems.findIndex((item) => item.fieldName === code);
  const querys = [...queryItems];
  if (itemIndex > -1) {
    querys[itemIndex] = {
      fieldName: code,
      values,
    };
  } else {
    querys.push({
      fieldName: code,
      values,
    });
  }
  return querys;
};

/**
 * 查询条件默认值适配
 * @param value
 * @param type
 */
export const adpaterDefaultValue = (value: string, type: FormItemControlType) => {
  switch (type) {
    case FormItemControlType.INPUT:
    case FormItemControlType.TEXTAREA:
    case FormItemControlType.SERIAL_NO: {
      // return value ? [value] : [];
      return [];
    }
    case FormItemControlType.DATE:
    case FormItemControlType.CREATE_TIME:
    case FormItemControlType.MODIFY_TIME: {
      // return value ? dateTransfer(DataRangeCompact[value].split(',')) : [];
      return [];
    }
    case FormItemControlType.NUMBER: {
      // const adpaterValue = value.split(';');
      // return value ? adpaterValue.map((item) => Number(item)) : [];
      return [];
    }
    case FormItemControlType.RADIO:
    case FormItemControlType.CHECKBOX:
    case FormItemControlType.SELECT: {
      // const adpaterValue = value.split(';');
      // return value ? adpaterValue : [];
      return [];
    }
    case FormItemControlType.SWITCH: {
      // [true,false]
      return [];
    }
    // case FormItemControlType.CREATOR:{}
    // case FormItemControlType.ASSOC_FORM:{}
    // case FormItemControlType.ASSOC_FORM_MULTI_SELECT: {}

    default: {
      return [];
    }
  }
};

/**
 * 初始化默认值
 *
 * @param {FormRecordData.QueryItemBase[]} query
 * @returns
 */
export const initDefaultValue = (query: FormRecordData.QueryItemBase[]) => {
  let initMainQuery: FormRecordData.QueryItemProps[] = [];
  const initSubTable: FormRecordData.RecordTableQueryProps[] = [];
  if (query) {
    // 初始化主表默认值
    const mainTable = query.filter((item) => !item.subFormTemplateId);
    mainTable.forEach((item) => {
      initMainQuery = queryGenerate(
        initMainQuery,
        adpaterDefaultValue(item.defaultValue, item.controlType),
        item.propertyName,
      );
    });
    // 初始化所有子表默认值
    const subFormTable = query.filter((item) => item.subFormTemplateId);
    subFormTable.forEach((item) => {
      const tableIndex = initSubTable.findIndex((sub) => sub.schemaId === item.subFormTemplateId);
      const table = initSubTable.find((sub) => sub.schemaId === item.subFormTemplateId);
      const querys = queryGenerate(
        table?.queryItems,
        adpaterDefaultValue(item.defaultValue, item.controlType),
        item.propertyName,
      );
      if (table && tableIndex > -1) {
        table.queryItems = querys;
        initSubTable[tableIndex] = table;
      } else {
        initSubTable.push({
          schemaId: item.subFormTemplateId || '',
          queryItems: querys,
        });
      }
    });
  }

  return { initMainQuery, initSubTable };
};

export const datalink = (
  code: string,
  dataLinkageMappings?: DataLkgMappings,
  subFormCode?: string,
  index?: number,
) => {
  const { dispatch: uformDispatch } = actions;
  if (dataLinkageMappings) {
    const currentCode = subFormCode ? `${subFormCode}.${code}` : code;
    const isDataLinkage = Object.keys(dataLinkageMappings).includes(currentCode);
    if (uformDispatch && isDataLinkage) {
      uformDispatch('datalink', {
        payload: { code: currentCode, map: dataLinkageMappings[currentCode], index },
      });
    }
  }
};
