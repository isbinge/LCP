import { zipWith } from 'lodash';

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
