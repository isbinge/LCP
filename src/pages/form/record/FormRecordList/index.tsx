import React, { useEffect, useState, ReactText, ReactNode, useMemo } from 'react';
import { useParams, useDispatch, useSelector } from 'dva';
import { LinkR } from '@lib/react-router-dom';
import { Table, Button, Pagination, message, Modal, Tooltip, Select } from 'antd';
import {
  PlusOutlined,
  LayoutOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { FormattedMessage as FM, useIntl } from 'react-intl';

import FormRecordData from '@/domain/form/instance/data.d';
import { msgIntl } from '@comp/i18n/MessageIntl';
import { TableRowSelection, ColumnType } from 'antd/lib/table/interface';

import { useLogger } from '@/utils/hooks/use-logger';
import { CELL_PLACEHOLDER } from '@/constants/record/common';
import Cell from '@comp/formily-custom/form-record/AssocFormModal/components/Cell';
import CollapseQuery from './components/CollapseQuery';
import ColFilterSetting from './components/ColFilterSetting';

import styles from './index.scss';
import './index.global.scss';

const MAIN_CODE = 'main';

const FormRecords: React.FC = () => {
  const { appId, templateId, instanceId } = useParams();
  const intl = useIntl();
  const dispatch: Dva.Dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [colHeaders, setColHeaders] = useState<FormRecordData.FormRecordTableColDto[]>([]);
  const [tableSetting, setTableSetting] = useState<FormRecordData.FormRecordTableSetting>();
  const [dataList, setDataList] = useState<FormRecordData.FormRecordDto[]>([]);
  const [selectedRowKeys, setSelectedRowkeys] = useState<ReactText[]>([]);
  // filter
  const [subFormActiveKey, setSubFormActiveKey] = useState<ReactText>(MAIN_CODE);
  const [colFilterVisible, setColFilterVisible] = useState(false);
  const [colFilterKeys, setColFilterKeys] = useState<ReactText[]>([]);
  // query-items
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

  const log = useLogger('FormRecordList');

  // 主表子表
  const tableElements = useMemo(() => {
    return [{ title: <FM id="appdetail.formlist.maintable" />, id: MAIN_CODE }].concat(
      colHeaders
        .filter((col) => col.subHeaders)
        .map((col) => ({
          title: <span>{col.displayName}</span>,
          id: col.code,
        })),
    );
  }, [colHeaders]);

  // 子表筛选
  const { colAfterFilterForm: colAfterFilterSubForm, colElement } = useMemo(() => {
    const colAfterFilterForm = colHeaders.filter(
      (col) => (col.subHeaders && col.code === subFormActiveKey) || !col.subHeaders,
    );
    const result: {
      id: ReactText;
      title: ReactNode;
    }[] = [];
    colAfterFilterForm.forEach((col) => {
      if (col.subHeaders) {
        col.subHeaders.forEach((subCol) => {
          if (subCol.visible) {
            result.push({
              id: `${col.code},${subCol.code}`,
              title: `${col.displayName}_${subCol.displayName}`,
            });
          }
        });
        return;
      }
      result.push({
        id: col.code,
        title: col.displayName || <FM id="formtpl.schema.form.datatitle" />,
      });
    });
    return {
      colAfterFilterForm,
      colElement: result,
    };
  }, [colHeaders, subFormActiveKey]);

  const columnsExcludeFilterCol: ColumnType<FormRecordData.FormRecordDto>[] = useMemo(() => {
    const result: ColumnType<FormRecordData.FormRecordDto>[] = colAfterFilterSubForm
      .filter(
        (col) =>
          (!col.subHeaders && colFilterKeys.some((key) => key === col.code)) || col.subHeaders,
      )
      .map((col) => {
        if (col.subHeaders) {
          return {
            title: col.displayName,
            align: 'center',
            children: col.subHeaders
              .filter(
                (subCol) =>
                  subCol.visible &&
                  colFilterKeys.some((key) => key === `${col.code},${subCol.code}`),
              )
              .map((subCol) => ({
                title: subCol.displayName,
                dataIndex: `${col.code},${subCol.code}`,
                align: 'center',
                width: 250,
                ellipsis: true,
                render: (
                  item: FormRecordData.FormRecordTableCell[],
                  record: FormRecordData.FormRecordDto,
                ) => {
                  return item?.map((i, index) => (
                    <div key={index}>
                      <Cell col={subCol} appId={appId} item={i} record={record} isRecordList />
                    </div>
                  ));
                },
              })),
          };
        }
        if (col.code === 'Name') {
          return {
            title: <FM id="formtpl.schema.form.datatitle" />,
            dataIndex: col.code,
            width: 100,
            align: 'center',
            render: (text, { AuditStat: auditStat, Id: id }) => {
              const isDraft = auditStat.value === 2;
              const pathname = isDraft
                ? '/app/:appId/form/:templateId/inst/:instanceId/edit/:objectId'
                : '/app/:appId/form/:templateId/inst/:instanceId/examine/:objectId';
              return (
                <span>
                  <LinkR
                    to={pathname}
                    values={{
                      appId,
                      templateId,
                      instanceId,
                      objectId: id.value as string,
                    }}
                  >
                    {text.value || CELL_PLACEHOLDER}
                  </LinkR>
                </span>
              );
            },
          };
        }
        return {
          title: col.displayName,
          dataIndex: col.code,
          align: 'center',
          width: 250,
          ellipsis: true,
          render: (item, record) => (
            <Cell col={col} appId={appId} item={item} record={record} isRecordList />
          ),
        };
      });
    result.unshift({
      title: 'No.',
      dataIndex: 'index',
      width: 100,
      fixed: 'left',
      align: 'center',
    });
    return result;
  }, [colFilterKeys]);

  // 增加筛选col选择
  const columns = useMemo(() => {
    return columnsExcludeFilterCol.concat({
      title: (
        <ColFilterSetting
          onVisibleChange={setColFilterVisible}
          visible={colFilterVisible}
          elements={colElement}
          selectedKeys={colFilterKeys}
          onClick={setColFilterKeys}
        />
      ),
      dataIndex: 'filter',
      width: 45,
      align: 'center',
      render: (_, record) => {
        const isTemporaryData = record.AuditStat.value === 2;
        return (
          <Tooltip
            title={<FM id="appdetail.formlist.draft" />}
            overlayClassName="tool-tips-container"
          >
            <div className={isTemporaryData ? styles.draftCircle : null} />
          </Tooltip>
        );
      },
    });
  }, [colFilterKeys, colFilterVisible]);

  const data = useMemo(() => {
    return dataList.map((rowData, index) => ({
      ...rowData,
      index: pageSize * (currentPage - 1) + index + 1,
    }));
  }, [dataList]);

  useEffect(() => {
    setColFilterKeys(colElement.map((el) => el.id));
  }, [subFormActiveKey, colHeaders]);

  const rowSelection: TableRowSelection<FormRecordData.FormRecordDto> = {
    selectedRowKeys,
    onChange: (keys) => {
      setSelectedRowkeys(keys);
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
              schemaId: templateId,
              queryItems,
              excludeColumns: [],
            },
            subTableQueries: subTable,
          },
        },
      }).then((res) => {
        setDataList(res.dataList);
        setTotal(res.totalCount);
      });
    }
  };

  const onShowSizeChange = (_: number, size: number) => {
    setPageSize(size);
    setSelectedRowkeys([]);
    fetchDataList(mainQueryItems, subTableQueryItems, size);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRowkeys([]);
    fetchDataList(mainQueryItems, subTableQueryItems, pageSize, page);
  };

  const handleDelete = () => {
    if (!tableSetting?.allowBatchOperation) {
      msgIntl.warning({ id: 'appdetail.formlist.mass.operation' });
      return;
    }
    if (selectedRowKeys.length === 0) {
      msgIntl.warning({ id: 'appdetail.formlist.noselect' });
      return;
    }

    Modal.confirm({
      title: intl.formatMessage({ id: 'appdetail.formlist.mass.delete.title' }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage(
        { id: 'appdetail.formlist.mass.delete.desc' },
        { count: selectedRowKeys.length },
      ),
      onOk() {
        dispatch({
          type: 'formInstance/massDeleteFormRecord',
          payload: { ids: selectedRowKeys },
        })
          .then(() => {
            setSelectedRowkeys([]);
            fetchDataList(mainQueryItems, subTableQueryItems);
          })
          .catch(() => {
            message.error({ content: 'delete failed' });
          });
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    setQuery(undefined);
    setSelectedRowkeys([]);
    setDataList([]);
    setSubTableQueryItems([]);
    setCurrentPage(1);
    setSubFormActiveKey(MAIN_CODE);
    dispatch<
      {
        formTemplateId?: string;
      },
      FormRecordData.TableConfig
    >({
      type: 'formInstance/getTableConfig',
      payload: { formTemplateId: templateId },
    })
      .then((res) => {
        log('table setting completed and fetchData', templateId);
        setColHeaders(res.colHeaders);
        setTableSetting(res.tableSetting);
        setQuery(res.query);
        setMainQueryItems(res.initMainQuery);
        fetchDataList(res.initMainQuery, [], pageSize, currentPage, res.tableSetting);
      })
      .catch(() => {
        message.error('Fetching Table failed');
      });
  }, [templateId]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topButtonBar}>
        <ul>
          <li>
            <LinkR
              to="/app/:appId/form/:templateId/inst/:instanceId/fillin"
              values={{ appId, templateId, instanceId }}
            >
              <Button type="primary" icon={<PlusOutlined />}>
                <span>
                  <FM id="dict.newrecord" />
                </span>
              </Button>
            </LinkR>
          </li>
          <li>
            <LinkR
              to="/app/:appId/form-designer/:templateId/form-design"
              values={{ appId, templateId }}
            >
              <Button icon={<LayoutOutlined />}>
                <span>
                  <FM id="appdetail.formlist.design" />
                </span>
              </Button>
            </LinkR>
          </li>
          <li>
            <div onClick={handleDelete} className={styles.deleteButton}>
              <DeleteOutlined className={styles.deleteIcon} /> <FM id="dict.delete" />
            </div>
          </li>
        </ul>
        <Select
          defaultValue={MAIN_CODE}
          value={subFormActiveKey}
          onChange={setSubFormActiveKey}
          style={{ maxWidth: 120 }}
          bordered={false}
        >
          {tableElements.map((el) => (
            <Select.Option key={el.id} value={el.id}>
              {el.title}
            </Select.Option>
          ))}
        </Select>
      </div>
      {/* <LoadingWave loading={isLoading} message={<FM id="loading.appdetail.formlist.records" />}> */}
      <CollapseQuery
        subFormActiveKey={subFormActiveKey}
        templateId={templateId}
        fetchData={fetchDataList}
        query={query}
        mainQueryItems={mainQueryItems}
        setMainQueryItems={setMainQueryItems}
        subTableQueryItems={subTableQueryItems}
        setSubTableQueryItems={setSubTableQueryItems}
      />
      <Table
        style={{ marginTop: 20 }}
        key={templateId}
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={false}
        scroll={{ x: '100%' }}
        className="data-list-wrapper"
        rowSelection={tableSetting?.allowBatchOperation ? rowSelection : undefined}
        bordered
      />
      <Pagination
        className={styles.pagination}
        showSizeChanger
        showQuickJumper
        current={currentPage}
        onShowSizeChange={onShowSizeChange}
        onChange={onPageChange}
        pageSize={pageSize}
        total={total}
        showTotal={(totalCount) => (
          <FM
            id="appdetail.formlist.pagination.total"
            defaultMessage="{count, plural, =0 {No} other {Total}} {count, plural, =0 {records} one {1 record} other {# records}}"
            values={{
              count: totalCount,
            }}
          />
        )}
      />
    </div>
  );
};

export default FormRecords;
