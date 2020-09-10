import React, { Suspense, ReactText, useEffect, useMemo } from 'react';
import { Collapse, List } from 'antd';
import debounce from 'lodash/debounce';

import { FormattedMessage as FM } from 'react-intl';
import FormRecordData from '@/domain/form/instance/data.d';
import { LoadingOutlined } from '@ant-design/icons';
import { sortBy } from 'lodash';
import { useLogger } from '@/utils/hooks/use-logger';
import { queryGenerate, initDefaultValue } from '@/domain/form/instance/util';
import QueryControl from '../QueryControl';

import styles from './index.scss';

const { Panel } = Collapse;

interface CollapseQueryProps {
  templateId: string | undefined;
  subFormActiveKey?: ReactText;
  fetchData: (
    queryItems: FormRecordData.QueryItemProps[],
    subTable: FormRecordData.RecordTableQueryProps[],
  ) => void;
  query: FormRecordData.QueryItemBase[] | undefined;
  mainQueryItems: FormRecordData.QueryItemProps[];
  setMainQueryItems: (items: FormRecordData.QueryItemProps[]) => void;
  subTableQueryItems: FormRecordData.RecordTableQueryProps[];
  setSubTableQueryItems: (items: FormRecordData.RecordTableQueryProps[]) => void;
}

const CollapseQuery: React.FC<CollapseQueryProps> = ({
  fetchData,
  subFormActiveKey,
  query,
  mainQueryItems,
  setMainQueryItems,
  subTableQueryItems: subTable,
  setSubTableQueryItems: setSubTable,
  templateId,
}) => {
  const log = useLogger('CollapseQuery');
  const handleChange = (
    values: FormRecordData.QueryValueType,
    code: string,
    subFormTemplateId?: string,
  ) => {
    if (!subFormTemplateId) {
      const querys = queryGenerate(mainQueryItems, values, code);
      setMainQueryItems(querys);
      fetchData(querys, subTable);
    } else {
      const tableIndex = subTable.findIndex((item) => item.schemaId === subFormTemplateId);
      const table = subTable.find((item) => item.schemaId === subFormTemplateId);
      const subTableCopy = [...subTable];
      const querys = queryGenerate(table?.queryItems, values, code);
      if (table) {
        table.queryItems = querys;
        subTableCopy[tableIndex] = table;
      } else {
        subTableCopy.push({
          schemaId: subFormTemplateId,
          queryItems: querys,
        });
      }
      setSubTable(subTableCopy);
      fetchData(mainQueryItems, subTableCopy);
    }
  };

  const fetchDataDebounced = debounce(
    (values: FormRecordData.QueryValueType, code: string, subFormTemplateId?: string) =>
      handleChange(values, code, subFormTemplateId),
    500,
  );

  const getValue = (queryItem: FormRecordData.QueryItemBase) => {
    if (queryItem.subFormTemplateId) {
      const items = subTable.find((table) => table.schemaId === queryItem.subFormTemplateId)
        ?.queryItems;
      return items?.find((item) => item.fieldName === queryItem.propertyName)?.values || [];
    }
    return mainQueryItems.find((d) => d.fieldName === queryItem.propertyName)?.values || [];
  };

  const queryAfterFilter = useMemo(() => {
    if (subFormActiveKey) {
      return sortBy(
        query?.filter(
          (item) =>
            !item.subFormTemplateId ||
            (item.subFormTemplateId && item.subFormTemplateId === subFormActiveKey),
        ),
        ['sequenceNumber'],
      );
    }
    return sortBy(query, ['sequenceNumber']);
  }, [query, subFormActiveKey]);
  const grid = useMemo(() => {
    if (subFormActiveKey) {
      return {
        column: 3,
        gutter: 32,
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1,
        xl: 2,
        xxl: 3,
      };
    }
    return {
      column: 3,
      gutter: 32,
      xs: 2,
      sm: 2,
      md: 2,
      lg: 2,
      xl: 2,
      xxl: 2,
    };
  }, [!!subFormActiveKey]);

  useEffect(() => {
    // 初始化默认值
    if (queryAfterFilter.length > 0 && subFormActiveKey) {
      log('set defaultValue and fetchData', templateId);
      const { initMainQuery, initSubTable } = initDefaultValue(queryAfterFilter);
      setMainQueryItems(initMainQuery);
      setSubTable(initSubTable);
      fetchData(initMainQuery, initSubTable);
    }
  }, [subFormActiveKey]);

  return (
    <>
      {query && (
        <Collapse defaultActiveKey="" bordered={false} accordion>
          <Panel header={<FM id="forminst.query.queryitems" />} key="1">
            <Suspense fallback={<LoadingOutlined className={styles.loading} />}>
              {queryAfterFilter && (
                <List
                  bordered={false}
                  grid={grid}
                  style={{ padding: 16 }}
                  dataSource={queryAfterFilter}
                  renderItem={(item) => (
                    <List.Item>
                      <QueryControl
                        value={getValue(item)}
                        key={item.subFormTemplateId + item.propertyName}
                        item={item}
                        onChange={(value) =>
                          fetchDataDebounced(value, item.propertyName, item.subFormTemplateId)
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </Suspense>
          </Panel>
        </Collapse>
      )}
    </>
  );
};

export default CollapseQuery;
