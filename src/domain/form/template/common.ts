import { zipWith } from 'lodash';

import { componentDefinition } from '@/constants';

import { FormItemSpec } from './model';
import { CommonCtrlProperties } from './adapter-type.d';

export const systemDefaultSequenceNumberMap = {
  ownerDept: -6,
  owner: -5,
  serialNo: -4,
  creator: -3,
  modifyTime: -2,
  createTime: -1,
  [-6]: 'ownerDept',
  [-5]: 'owner',
  [-4]: 'serialNo',
  [-3]: 'creator',
  [-2]: 'modifyTime',
  [-1]: 'createTime',
};

export const convertCalcToServeMap = {
  calcFormula: 1,
  dataAssoc: 2,
  1: 'calcFormula',
  2: 'dataAssoc',
};

export const showCalcToLocalMap = {
  calcFormula: '计算公式',
  dataAssoc: '数据联动',
};

export const textFormatTypeMap = {
  text: 1,
  email: 2,
  idcard: 3,
  phone: 4,
  1: 'text',
  2: 'email',
  3: 'idcard',
  4: 'phone',
};

/**
 * 人员、部门范围限定tab标签
 */
export const enum SelectionRangeTabType {
  DEPT = 'dept',
  ROLE = 'role',
  DEPT_CTRL = 'deptCtrl',
  OTHER = 'other',
}

/**
 * Web 端时间格式化格式
 */
export const enum DateFormatTemplate {
  YMD = 'YYYY-MM-DD',
  YM = 'YYYY-MM',
  YMDHM = 'YYYY-MM-DD HH:mm',
  HM = 'HH:mm',
}

/**
 * 服务端时间格式化格式
 */
export const dateFormatCompat = {
  ymd: 'yyyy-mm-dd',
  ym: 'yyyy-mm',
  ymdhm: 'yyyy-mm-dd hh:mm',
  hm: 'hh:mm',
  ymdhms: 'yyyy-mm-dd hh:mm:ss',
};

/**
 * 服务端格式 <-> Web 端格式
 */
export const dateFormatCompatMap = {
  // adapated
  [dateFormatCompat.ymd]: DateFormatTemplate.YMD,
  [dateFormatCompat.ym]: DateFormatTemplate.YM,
  [dateFormatCompat.ymdhm]: DateFormatTemplate.YMDHM,
  [dateFormatCompat.hm]: DateFormatTemplate.HM,
  [dateFormatCompat.ymdhms]: DateFormatTemplate.YMDHM,
};

export function injectFixedFields(controlItem: CommonCtrlProperties) {
  return {
    visible: !!controlItem.visible,
    createUserId: controlItem.createUserId || '',
    updateUserId: controlItem.updateUserId || '',
    createDateTime: controlItem.createDateTime || '',
    updateDateTime: controlItem.updateDateTime || '',
    auditStat: controlItem.auditStat || null,
  };
}

export const adaptCtrlPartialProps = (controlItem: FormItemSpec, defaultName?: string) => ({
  sequenceNumber: controlItem.data.sequenceNumber,
  formTemplateId: controlItem.data.formId,
  subFormTemplateId: controlItem.subFormId || null,
  name: controlItem.data.name || defaultName,
  code: controlItem.code as string,
  controlType: componentDefinition[controlItem.compType].controlType,
  controlGroupType: componentDefinition[controlItem.compType].controlGroupType,
  dataType: controlItem.data.dataType,
});

export const checkControlType = (type: Lcp.FormItem.All) => (controlData: FormItemSpec) =>
  controlData.compType === type;

interface KeyValuePairObj {
  currentForm: string;
  dataLinkForm: string;
}

export const convertMapToString = (kvArr: KeyValuePairObj[]) =>
  kvArr
    .filter((kv) => kv.currentForm && kv.dataLinkForm)
    .map((kv) => `${kv.currentForm}:${kv.dataLinkForm}`)
    .join(';');

export const convertStringToMap = (kvString: string, key: string, value: string) =>
  kvString.split(';').map((kvStr: string) => ({
    [key]: kvStr.split(':')[0],
    [value]: kvStr.split(':')[1],
  }));

export const getSelectedCtrl = (id: string, formItemSpecs: FormItemSpec[]) => {
  let selectedCtrl = formItemSpecs.find((item) => item.id === id);
  if (selectedCtrl) {
    return selectedCtrl;
  }
  formItemSpecs.forEach((item) => {
    const res = item.extraData && item.extraData.find((innerCtrl) => innerCtrl.id === id);
    if (res) {
      selectedCtrl = res;
    }
  });

  return selectedCtrl;
};

/**
 * 为拥有者，所属部门控件提供下拉选项
 * 选择模板中所有的该类型控件
 * @param formItemSpecs
 * @param compTypes
 */
export const getSelectOptions = (formItemSpecs: FormItemSpec[], compTypes: string[]) => {
  const options: { label: string; value: string }[] = [];
  formItemSpecs.forEach((item) => {
    options.push(...matchSameType(item));
    if (item.compType === 'subform' && item.extraData) {
      item.extraData.forEach((data) => {
        options.push(...matchSameType(data));
      });
    }
  });
  function matchSameType(item: FormItemSpec) {
    if (!compTypes.includes(item.compType) || !item.displayable) {
      return [];
    }
    const label = item.subFormId ? `${item.data.name}.${item.data.name}` : item.data.name;
    const value = item.subFormId ? `${item.code}.${item.code}` : item.data.name;
    return [{ label, value }];
  }
  return options;
};

interface Range {
  dept: string[];
  role: string[];
  deptCtrl: string[];
  other: string[];
}

const RangeLocalToServer = {
  deptCtrl: 'DeptControl',
  dept: 'Dept',
  role: 'Role',
  other: 'Other',
};

export function adaptUnitSelectionRange(range: Range) {
  let unitSelectionRangeString = '';
  Object.keys(range).forEach((localRangeKey) => {
    unitSelectionRangeString += zipToString(
      RangeLocalToServer[localRangeKey],
      range[localRangeKey],
    ).join(';');
    unitSelectionRangeString += ';';
  });
  return unitSelectionRangeString;

  function zipToString(property: string, targetArr: string[]) {
    const clonedProperties = Array(targetArr.length).fill(property);
    return zipWith(clonedProperties, targetArr, (prop, value) => `${prop}:${value}`);
  }
}

export function parseUnitSelectionRange(unitSelectionRange: Nullable<string>): Range {
  const rangeKeyValuePairs = unitSelectionRange ? unitSelectionRange.split(';') : [];
  const serverRangeKey = ['DeptControl', 'Dept', 'Role', 'Other'];

  const deptCtrl: string[] = getValuesByKey(serverRangeKey[0]);
  const dept: string[] = getValuesByKey(serverRangeKey[1]);
  const role: string[] = getValuesByKey(serverRangeKey[2]);
  const other: string[] = getValuesByKey(serverRangeKey[3]);

  function getValuesByKey(key: string) {
    return rangeKeyValuePairs
      .filter((keyValuePair) => keyValuePair.includes(`${key}:`))
      .map((keyValuePair) => keyValuePair.split(':')[1]);
  }

  return { dept, role, deptCtrl, other };
}
