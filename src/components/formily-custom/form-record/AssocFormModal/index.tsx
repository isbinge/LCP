import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Pagination } from 'antd';
import { useDispatch, useParams, useSelector } from 'dva';
import { LinkR } from '@lib/react-router-dom';
import { FormattedMessage as FM } from 'react-intl';

import FormRecordData from '@/domain/form/instance/data.d';
import { TableRowSelection, TablePaginationConfig, ColumnType } from 'antd/lib/table/interface';
import CollapseQuery from '@/pages/form/record/FormRecordList/components/CollapseQuery';
import Cell from './components/Cell';

export interface SelectedValue {
  objectId: string;
  value: string;
}

export type SelectedValueType = SelectedValue | SelectedValue[] | null;

interface AssocFormModalProps {
  mode: string;
  schemaCode: string;
  schemaId: string;
  visible: boolean;
  selectValue: SelectedValueType;
  onOk: (selectValue: SelectedValueType) => void;
  onCancel: () => void;
  fetchData: (payload: { data: FormRecordData.GetFormDataListPayload }, onBack: Function) => void;
}

const AssocFormModal: React.FC<AssocFormModalProps> = (props) => {
  const {
    mode,
    schemaCode,
    visible,
    onCancel,
    schemaId,
    onOk,
    // fetchData,
    selectValue: initValue,
  } = props;
  const dispatch: Dva.Dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState<FormRecordData.FormRecordDto[]>([]);
  const [total, setTotal] = useState(0);
  const [colHeaders, setColHeaders] = useState<ColumnType<FormRecordData.FormRecordDto>[]>([]);
  const [tableSetting, setTableSetting] = useState<FormRecordData.FormRecordTableSetting>();
  const [selectedValue, setSelectedValue] = useState<SelectedValueType>(null);

  const [query, setQuery] = useState<FormRecordData.QueryItemBase[]>();
  const [mainQueryItems, setMainQueryItems] = useState<FormRecordData.QueryItemProps[]>([]);
  const [subTableQueryItems, setSubTableQueryItems] = useState<
    FormRecordData.RecordTableQueryProps[]
  >([]);

  const isLoading = useSelector(
    ({ loading }) =>
      loading.effects['formInstance/getTableConfig'] ||
      loading.effects['formInstance/getFormDataList'],
  );

  const { appId } = useParams();

  const rowSelection: TableRowSelection<FormRecordData.FormRecordDto> = {
    type: mode === 'multiple' ? 'checkbox' : 'radio',
    fixed: true,
    selectedRowKeys: (() => {
      if (mode === 'multiple' && Array.isArray(selectedValue)) {
        return selectedValue ? selectedValue.map((item) => item.objectId) : [];
      }
      if (!Array.isArray(selectedValue)) {
        return selectedValue ? [selectedValue.objectId] : [];
      }
      return undefined;
    })(),
    onChange: (selectedKeys, selectedRows) => {
      if (mode === 'multiple') {
        const selectRowsLength = selectedRows.length;
        if (selectedValue === null) {
          setSelectedValue(
            selectedRows.map((item) => ({
              objectId: item.key,
              value: typeof item.Name.value === 'string' ? item.Name.value : '',
            })),
          );
        } else if (Array.isArray(selectedValue) && selectedValue.length < selectRowsLength) {
          setSelectedValue([
            ...selectedValue,
            {
              objectId: selectedRows[selectRowsLength - 1].key,
              value: selectedRows[selectRowsLength - 1].Name.value as string,
            },
          ]);
        } else if (Array.isArray(selectedValue) && selectedValue.length > selectRowsLength) {
          setSelectedValue(
            selectedValue.filter((item) => selectedKeys.find((key) => key === item.objectId)),
          );
        }
      } else {
        setSelectedValue({
          objectId: selectedRows[0].key,
          value: typeof selectedRows[0].Name.value === 'string' ? selectedRows[0].Name.value : '',
        });
      }
    },
  };

  const fetchDataList = (
    queryItems: FormRecordData.QueryItemProps[],
    subTable: FormRecordData.RecordTableQueryProps[],
    pageLimit: number = pageSize,
    startPage: number = currentPage,
    tableSettings: FormRecordData.FormRecordTableSetting | undefined = tableSetting,
  ) => {
    if (tableSettings) {
      dispatch<{ data: FormRecordData.GetFormDataListPayload }>({
        type: 'formInstance/getFormDataList',
        payload: {
          data: {
            sortAt: tableSettings.orderByFieldCode,
            sortDirection: tableSettings.orderByDirection,
            pageStartAt: pageLimit * (startPage - 1),
            pageLimit,
            displayMode: tableSettings.pcDefaultDisplayModel,
            includeAllSubTables: true,
            mainTableQuery: {
              schemaId,
              queryItems,
              excludeColumns: [],
            },
            subTableQueries: subTable,
          },
        },
      }).then((res) => {
        const resData = res.dataList.map(
          (rowData: FormRecordData.FormRecordDto, index: number) => ({
            ...rowData,
            index: pageSize * (currentPage - 1) + index + 1,
          }),
        );

        setData(resData);
        setTotal(res.totalCount);
      });
    }
  };

  const pagination: TablePaginationConfig = {
    showQuickJumper: true,
    showSizeChanger: true,
    total,
    pageSize,
    current: currentPage,
    onChange: (page: number) => {
      setCurrentPage(page);
      fetchDataList(mainQueryItems, subTableQueryItems, pageSize, page);
    },
    onShowSizeChange: (page: number, size: number | undefined) => {
      setPageSize(size || 0);
      fetchDataList(mainQueryItems, subTableQueryItems, size);
    },
  };

  useEffect(() => {
    if (!visible || !schemaId) {
      return;
    }

    dispatch<
      {
        formTemplateId?: string;
      },
      FormRecordData.TableConfig
    >({
      type: 'formInstance/getTableConfig',
      payload: { formTemplateId: schemaId },
    }).then((res) => {
      setColHeaders(
        res.colHeaders.map((col: FormRecordData.FormRecordTableColDto) => {
          if (col.subHeaders) {
            return {
              title: col.displayName ?? <FM id="formtpl.schema.form.datatitle" />,
              dataIndex: col.code,
              align: 'center',
              children: col.subHeaders
                .filter((subCol) => subCol.visible)
                .map((subCol) => ({
                  title: subCol.displayName,
                  dataIndex: `${col.code},${subCol.code}`,
                  align: 'center',
                  width: 150,
                  ellipsis: true,
                  render: (
                    item: FormRecordData.FormRecordTableCell[],
                    record: FormRecordData.FormRecordDto,
                  ) => {
                    return item?.map((i, index) => (
                      <div key={index}>
                        <Cell
                          col={subCol}
                          appId={appId}
                          item={i}
                          record={record}
                          isRecordList={false}
                        />
                      </div>
                    ));
                  },
                })),
            };
          }

          return {
            title: col.displayName ?? <FM id="formtpl.schema.form.datatitle" />,
            dataIndex: col.code,
            align: 'center',
            width: 150,
            render: (item: FormRecordData.FormRecordTableCell) => (
              <Cell col={col} item={item} isRecordList={false} />
            ),
          };
        }),
      );
      setTableSetting(res.tableSetting);
      const queryItems = res.initMainQuery.concat([{ fieldName: 'AuditStat', values: ['1'] }]);
      setMainQueryItems(queryItems);
      setSubTableQueryItems(res.initSubTable);
      setQuery(res.query);

      fetchDataList(queryItems, res.initSubTable, pageSize, currentPage, res.tableSetting);
    });

    setSelectedValue(initValue);
  }, [visible]);

  return (
    <Modal
      title={<FM id="forminst.assoc-form-modal.title" />}
      width={748}
      bodyStyle={{ maxHeight: 800, overflowY: 'auto' }}
      visible={visible}
      onOk={() => onOk(selectedValue)}
      onCancel={onCancel}
      maskClosable={false}
    >
      <LinkR
        to="/app/:appId/form/:templateId/inst/:instanceId/fillin"
        values={{
          appId,
          templateId: schemaId,
          instanceId: schemaCode,
        }}
      >
        <Button type="primary">
          <FM id="forminst.common.create" />
        </Button>
      </LinkR>
      <CollapseQuery
        templateId={schemaId}
        fetchData={fetchDataList}
        query={query}
        mainQueryItems={mainQueryItems}
        setMainQueryItems={setMainQueryItems}
        subTableQueryItems={subTableQueryItems}
        setSubTableQueryItems={setSubTableQueryItems}
      />
      <Table
        rowSelection={rowSelection}
        columns={colHeaders}
        dataSource={data}
        className="data-list-wrapper"
        pagination={false}
        scroll={{ x: 700, y: 600 }}
        loading={isLoading}
        bordered
      />
      <div style={{ display: 'flex', flexDirection: 'row-reverse', marginTop: 10 }}>
        <Pagination {...pagination} />
      </div>
    </Modal>
  );
};

export default AssocFormModal;
