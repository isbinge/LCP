import { flatMapDeep } from 'lodash';
import type ListDesignData from './data';

export function parseProperties(properties: ListDesignData.Property[]) {
  const parsedMap = new Map<string, ListDesignData.Property>();
  properties.forEach((property) => {
    if (property.queryItemId) {
      parsedMap.set(property.queryItemId, property);
    } else if (property.childProperties) {
      property.childProperties.forEach((cp) => {
        parsedMap.set(cp.queryItemId, { ...cp, code: `${property.code}.${cp.code}` });
      });
    }
  });
  return parsedMap;
}

export function flattenColumns(
  columns: ListDesignData.ColumnGet[],
): Map<string, ListDesignData.ColumnGet> {
  return flatMapDeep(columns, (col) => {
    if (!col.id && col.childColumns) {
      return [col.childColumns];
    }
    return [col];
  }).reduce((pv, cv) => {
    pv.set(cv.id, cv);
    return pv;
  }, new Map());
}
