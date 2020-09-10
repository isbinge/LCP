import React, { useState, useMemo } from 'react';
import { Divider, Select, Switch, Button, Popover, List, Table } from 'antd';
import update from 'immutability-helper';
import { FormattedMessage } from 'react-intl';
import { flatMap, pick, sortBy, slice, isNumber } from 'lodash';
import { v1 as uuidv1 } from 'uuid';
import dayjs from 'dayjs';

import type { ColumnsType, ColumnType } from 'antd/lib/table';
import type { TableRowSelection } from 'antd/lib/table/interface';

import {
  PlusOutlined,
  DeleteOutlined,
  DashOutlined,
  DownOutlined,
  UpOutlined,
  ColumnWidthOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';

import type {
  SubFormServeDataType,
  SubFormRecord,
  SubFormState,
  SubFormFieldValueType,
  FormSchemaData,
  AssocFormState,
  SelectReturnType,
} from '@/pages/form/record/collect/shared/form-schema.d';
import type {
  DateControl,
  SelectControl,
  RadioControl,
  CheckboxControl,
  NumberInputControl,
  SingleLineInputControl,
  TextareaControl,
} from '@/domain/form/template/basic/adapter/adapter-type.d';
import type {
  AssocFormControl,
  AssocAttrControl,
} from '@/domain/form/template/advanced/adapter/adapter-type.d';
import { dateFormatCompatMap, DateFormatTemplate } from '@/domain/form/template/common';
import { getSubFormInitRecord, subFormControls } from '@/pages/form/record/collect/shared/common';
import { actions } from '@comp/formily-custom/form-record';
import { FormItemControlType } from '@/constants/form/common';
import { TitleWithDesc } from '@/domain/form/instance/schema.common';
import { DataLkgMappings } from '@/domain/form/instance/schema-type';
import { datalink } from '@/domain/form/instance/util';

import AssocSelect from '../AssocSelect';
import AssocAttr from '../AssocAttr';
import CustomDate from '../CustomDate';
import CustomInput from '../CustomInput';
import CustomTextArea from '../CustomTextArea';
import CustomSelect from '../CustomSelect';
import CustomInputNumber from '../CustomInputNumber';

import styles from './index.scss';
import './index.global.scss';
// import { isBasicControlType, isAdvanceControlType } from '@/domain/form/template/adapter';

interface SubFormInstProps {
  fieldName: string;
  subFormControl: SubFormServeDataType;
  onChange: (subFormState: SubFormState) => void;
  value: SubFormState;
  readonly?: boolean;
  dataLinkageMappings: DataLkgMappings;
}

interface CheckProps {
  showReadonly?: React.ReactNode;
  readonly: boolean;
  text: React.ReactNode;
}

type SubFormSchemaData = Exclude<FormSchemaData, SubFormServeDataType>;

const CheckReadonly: React.FC<CheckProps> = (props) => {
  const { readonly, showReadonly, text } = props;
  return <div>{(readonly && (showReadonly || <span>{text}</span>)) || props.children}</div>;
};

const getCompByType = (
  fieldValue: SubFormFieldValueType,
  ctrlData: FormSchemaData,
  handleChange: (value: SubFormFieldValueType, code: string, index: number) => void,
  index: number,
  readonly: boolean = true,
  subFormControl: SubFormServeDataType,
  dataLinkageMappings: DataLkgMappings,
) => {
  switch (ctrlData.controlType) {
    case FormItemControlType.INPUT:
      return (
        <CheckReadonly text={fieldValue as string} readonly={readonly}>
          <CustomInput
            // maxLength={200}
            subFormCode={subFormControl.code}
            index={index}
            dataLinkageMappings={dataLinkageMappings}
            code={(ctrlData as SingleLineInputControl).code}
            placeholder={(ctrlData as SingleLineInputControl).placeHolder}
            value={fieldValue as string}
            onChange={(value: string) => {
              handleChange(value, ctrlData.code as string, index);
            }}
          />
        </CheckReadonly>
      );
    case FormItemControlType.TEXTAREA:
      return (
        <CheckReadonly text={fieldValue as string} readonly={readonly}>
          <CustomTextArea
            subFormCode={subFormControl.code}
            index={index}
            dataLinkageMappings={dataLinkageMappings}
            code={(ctrlData as TextareaControl).code}
            rows={(ctrlData as TextareaControl).rows}
            placeholder={(ctrlData as TextareaControl).placeHolder}
            value={fieldValue as string}
            onChange={(value: string) => {
              handleChange(value, ctrlData.code as string, index);
            }}
          />
        </CheckReadonly>
      );
    case FormItemControlType.DATE: {
      const format: DateFormatTemplate =
        dateFormatCompatMap[(ctrlData as DateControl).dateTimeMode];
      // antd 不支持 dayjs类型
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dateProps = {
        value: fieldValue as string,
        dateTimeMode: (ctrlData as DateControl).dateTimeMode,
        onChange: (value: string) => {
          handleChange(value, ctrlData.code, index);
        },
      };
      return (
        <CheckReadonly
          text={fieldValue as string}
          readonly={readonly}
          showReadonly={
            <span>{fieldValue && dayjs.fromUtc(fieldValue as string).format(format)}</span>
          }
        >
          <CustomDate
            subFormCode={subFormControl.code}
            index={index}
            dataLinkageMappings={dataLinkageMappings}
            code={(ctrlData as DateControl).code}
            {...dateProps}
          />
        </CheckReadonly>
      );
    }
    case FormItemControlType.SELECT: {
      return (
        <CheckReadonly text={fieldValue as string} readonly={readonly}>
          <CustomSelect
            subFormCode={subFormControl.code}
            index={index}
            dataLinkageMappings={dataLinkageMappings}
            code={(ctrlData as SelectControl).code}
            schemaCode={(ctrlData as SelectControl).schemaCode}
            mappingField={(ctrlData as SelectControl).mappingField}
            defaultItems={(ctrlData as SelectControl).defaultItems}
            value={fieldValue as string}
            onChange={(value: SubFormFieldValueType) => {
              handleChange(value, ctrlData.code as string, index);
            }}
          />
        </CheckReadonly>
      );
    }
    case FormItemControlType.SWITCH:
      return (
        <Switch
          checked={fieldValue as boolean}
          disabled={readonly}
          onChange={(value) => {
            handleChange(value, ctrlData.code as string, index);
          }}
        />
      );
    case FormItemControlType.RADIO:
      return (
        <CheckReadonly text={fieldValue as string} readonly={readonly}>
          <Select
            value={fieldValue as string}
            onChange={(value) => {
              handleChange(value, ctrlData.code as string, index);
              datalink(ctrlData.code, dataLinkageMappings, subFormControl.code, index);
            }}
          >
            {(ctrlData as RadioControl).defaultItems?.split(';').map((item: string) => (
              <Select.Option value={item} key={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </CheckReadonly>
      );
    case FormItemControlType.CHECKBOX:
      return (
        <CheckReadonly text={fieldValue as string[]} readonly={readonly}>
          <Select
            value={fieldValue as string[]}
            mode="multiple"
            onChange={(value) => {
              handleChange(value, ctrlData.code as string, index);
            }}
          >
            {(ctrlData as CheckboxControl).defaultItems?.split(';').map((item: string) => (
              <Select.Option value={item} key={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </CheckReadonly>
      );
    case FormItemControlType.NUMBER:
      return (
        <CheckReadonly text={fieldValue as string} readonly={readonly}>
          <CustomInputNumber
            subFormCode={subFormControl.code}
            index={index}
            dataLinkageMappings={dataLinkageMappings}
            code={(ctrlData as NumberInputControl).code}
            decimalPlaces={(ctrlData as NumberInputControl).decimalPlaces}
            showThousandthSeparator={(ctrlData as NumberInputControl).showThousandthSeparator}
            value={fieldValue !== null && fieldValue !== undefined ? Number(fieldValue) : undefined}
            onChange={(value) => {
              handleChange(isNumber(value) ? value : undefined, ctrlData.code as string, index);
            }}
          />
        </CheckReadonly>
      );
    case FormItemControlType.ASSOC_ATTR: {
      const assocAttrProps = {
        ...(ctrlData as AssocAttrControl),
        onChange: (value: string) => {
          handleChange(value, ctrlData.code, index);
        },
        value: fieldValue as string,
      };
      return (
        <CheckReadonly text={fieldValue as string} readonly={readonly}>
          <AssocAttr {...assocAttrProps} />
        </CheckReadonly>
      );
    }
    case FormItemControlType.ASSOC_FORM: {
      const assocFormProps = {
        ...(ctrlData as AssocFormControl),
        value: fieldValue as AssocFormState,
        mode: '',
        dataLinkageMappings,
        subFormCode: subFormControl.code,
        index,
        onChange: (value: AssocFormState) => {
          handleChange(value, ctrlData.code, index);
        },
      };
      return (
        <CheckReadonly
          text={fieldValue && (fieldValue as SelectReturnType).value}
          readonly={readonly}
        >
          <AssocSelect {...assocFormProps} />
        </CheckReadonly>
      );
    }
    case FormItemControlType.ASSOC_FORM_MULTI_SELECT: {
      const assocFormProps = {
        ...(ctrlData as AssocFormControl),
        value: fieldValue as AssocFormState,
        mode: 'multiple',
        onChange: (value: AssocFormState) => {
          handleChange(value, ctrlData.code, index);
        },
      };
      return (
        <CheckReadonly
          text={
            fieldValue && (fieldValue as SelectReturnType[]).map((item) => item.value).join(';')
          }
          readonly={readonly}
        >
          <AssocSelect {...assocFormProps} />
        </CheckReadonly>
      );
    }
    default:
      return readonly && <span>{fieldValue}</span>;
  }
};

export const getDefaultRecord = (
  subFormControl: SubFormServeDataType,
  copyData?: SubFormRecord,
) => {
  if (copyData) {
    return { ...copyData, key: uuidv1() };
  }

  if (subFormControl) {
    return getSubFormInitRecord(subFormControl, 'defaultValue');
  }
  return null;
};

const columnWidth = 200;
const pageSize = 10;

const SubForm: React.FC<SubFormInstProps> = (props) => {
  const {
    fieldName,
    value: subFormState,
    onChange: setSubFormState,
    readonly,
    subFormControl,
    dataLinkageMappings,
  } = props;

  const subFormData = useMemo(
    () =>
      sortBy(flatMap(pick(props.subFormControl, subFormControls)), [
        'sequenceNumber',
      ]) as SubFormSchemaData[],
    [props.subFormControl],
  );
  const dataSource: SubFormRecord[] =
    subFormState.dataSource || [getDefaultRecord(props.subFormControl)] || [];
  const [visible, setVisible] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const [currentPage, setPage] = useState<number>(1);

  const handleChange = (value: SubFormFieldValueType, code: string, index: number) => {
    const rowIndex = (currentPage - 1) * pageSize + index;
    const curRecord = dataSource[rowIndex];
    const updatedRecord = {
      ...curRecord,
    };
    updatedRecord[code] = value;
    const updatedDataSource = update(dataSource, { $splice: [[rowIndex, 1, updatedRecord]] });
    setSubFormState({ ...subFormState, dataSource: updatedDataSource });
  };

  const addRecord = (insertPosition: number, copyData?: SubFormRecord) => {
    const newRecord = getDefaultRecord(props.subFormControl, copyData);
    if (newRecord) {
      const updatedDataSource = update(dataSource, {
        $splice: [[insertPosition, 0, newRecord]],
      });
      setSubFormState({ ...subFormState, dataSource: updatedDataSource });
    }
  };
  const deleteRecord = () => {
    const updatedDataSource = dataSource.filter(
      (record) => !subFormState.selectedRowKeys.includes(record.key),
    );
    setSubFormState({ selectedRowKeys: [], dataSource: updatedDataSource });
  };

  const resetRecord = (rowIndex: number) => {
    const curRecord = dataSource[rowIndex];
    const updatedRecord = {
      ...getDefaultRecord(props.subFormControl),
      key: curRecord.key,
    };
    setSubFormState({
      ...subFormState,
      dataSource: update(dataSource, { $splice: [[rowIndex, 1, updatedRecord]] }),
    });
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };
  const renderContent = (record: SubFormRecord, rowIndex: number) => {
    const data = [
      {
        text: 'forminst.schema.subform.opts.copy',
        handleClick: () => {
          addRecord(dataSource.length, record);
        },
      },
      {
        text: 'forminst.schema.subform.opts.reset',
        handleClick: () => {
          resetRecord(rowIndex);
        },
      },
      {
        text: 'forminst.schema.subform.opts.insert-before',
        handleClick: () => {
          addRecord(rowIndex);
        },
      },
      {
        text: 'forminst.schema.subform.opts.insert-after',
        handleClick: () => {
          addRecord(rowIndex + 1);
        },
      },
    ];
    return (
      <List
        split={false}
        dataSource={data}
        renderItem={(item) => (
          <List.Item onClick={item.handleClick}>
            <FormattedMessage id={item.text} />
          </List.Item>
        )}
      />
    );
  };

  const fixedColumns: ColumnsType<SubFormRecord> =
    slice(subFormData, 0, subFormData.length - 1).map((item) => ({
      title: (
        <TitleWithDesc
          name={item.name}
          description={('description' in item && item.description) || ''}
        />
      ),
      dataIndex: item.code,
      key: item.code,
      width: columnWidth,
      render: (value, _, index) =>
        getCompByType(
          value,
          item,
          handleChange,
          index,
          readonly,
          subFormControl,
          dataLinkageMappings,
        ),
    })) || [];

  const flexibleColumnIndex = subFormData.length - 1;
  const columns: ColumnsType<SubFormRecord> = [...fixedColumns];
  if (flexibleColumnIndex >= 0) {
    const flexibleColumnData = subFormData[flexibleColumnIndex];
    const flexibleColumn: ColumnType<SubFormRecord> = {
      title: (
        <TitleWithDesc
          name={subFormData[flexibleColumnIndex].name}
          description={
            ('description' in flexibleColumnData && flexibleColumnData.description) || ''
          }
        />
      ),
      dataIndex: subFormData[flexibleColumnIndex].code,
      key: subFormData[flexibleColumnIndex].code,
      render: (value, _, index) =>
        getCompByType(
          value,
          subFormData[flexibleColumnIndex],
          handleChange,
          index,
          readonly,
          subFormControl,
          dataLinkageMappings,
        ),
    };
    columns.push(flexibleColumn);
  }
  if (!readonly) {
    const rightFixedColumn: ColumnType<SubFormRecord> = {
      title: <FormattedMessage id="forminst.schema.subform.opts" />,
      key: 'opt',
      align: 'center',
      width: 60,
      fixed: 'right',
      className: 'greyCol',
      render: (_, record, index) => (
        <Popover overlayClassName="subFormPopover" content={renderContent(record, index)}>
          <DashOutlined />
        </Popover>
      ),
    };
    columns.push(rightFixedColumn);
  }
  const leftFixedColumn: ColumnType<SubFormRecord> = {
    title: <FormattedMessage id="forminst.schema.subform.number" />,
    key: 'order',
    align: 'center',
    width: 60,
    fixed: 'left',
    className: 'greyCol',
    render: (_, record, index) => <span>{index + 1}</span>,
  };
  columns.unshift(leftFixedColumn);

  const rowSelection: TableRowSelection<SubFormRecord> = {
    onChange: (selectedKeys) => {
      setSubFormState({ ...subFormState, selectedRowKeys: selectedKeys });
    },
    selectedRowKeys: (subFormState && subFormState.selectedRowKeys) || [],
  };

  return (
    <div>
      <div className={styles.header}>
        <span className={styles.title}>{subFormControl.name}</span>
        <span
          onClick={() => {
            setVisible(!visible);
          }}
        >
          {visible ? <UpOutlined /> : <DownOutlined />}
        </span>
      </div>
      <Divider />
      <div style={{ display: visible ? 'block' : 'none' }}>
        <div className={styles.toolbars}>
          {(!readonly && (
            <div className={styles.content}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  addRecord(dataSource.length);
                }}
              >
                <span>
                  <FormattedMessage id="dict.newrecord" />
                </span>
              </Button>
              <Button
                disabled={subFormState && subFormState.selectedRowKeys.length === 0}
                icon={<DeleteOutlined />}
                onClick={() => {
                  deleteRecord();
                }}
              >
                <span>
                  <FormattedMessage id="dict.delete" />
                </span>
              </Button>
            </div>
          )) || <span />}
          <div>
            <div className={styles.toolbarsMore}>
              <span
                onClick={() => {
                  setFullScreen(!fullScreen);
                  const { dispatch: uformDispatch } = actions;
                  if (uformDispatch) {
                    uformDispatch('toggleTable', {
                      payload: { fieldName, isFullScreen: !fullScreen },
                    });
                  }
                }}
              >
                {(fullScreen && <FullscreenExitOutlined />) || <FullscreenOutlined />}
              </span>

              <ColumnWidthOutlined />
            </div>
          </div>
        </div>

        {(!readonly && (
          <Table
            className="subTable"
            bordered
            rowSelection={{
              type: 'checkbox',
              columnWidth: 60,
              fixed: true,
              ...rowSelection,
            }}
            dataSource={dataSource}
            columns={columns}
            pagination={{
              defaultPageSize: pageSize,
              current: currentPage,
              onChange: handlePageChange,
            }}
            scroll={{ x: columnWidth * subFormData.length + 120, y: 600 }}
          />
        )) || (
          <Table
            className="subTable"
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={{
              defaultPageSize: pageSize,
            }}
            scroll={{ x: columnWidth * subFormData.length + 60 }}
          />
        )}
      </div>
    </div>
  );
};
export default SubForm;
