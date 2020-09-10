import React, { useEffect, useState } from 'react';
import { Select, Spin, message } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { AuditOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';

import LcpConst from '@/constants';
import FormRecordData from '@/domain/form/instance/data.d';
import { AssocFormState, SelectReturnType } from '@/pages/form/record/collect/shared/form-schema.d';
import { SelectProps } from 'antd/lib/select';
import {
  AssocFormControl,
  AssocMultFormControl,
} from '@/domain/form/template/advanced/adapter/adapter-type.d';
import { useIntl } from 'react-intl';
import { actions } from '@comp/formily-custom/form-record';
import { CELL_PLACEHOLDER } from '@/constants/record/common';
import { datalink } from '@/domain/form/instance/util';
import { DataLkgMappings } from '@/domain/form/instance/schema-type';
import AssocFormModal, { SelectedValueType } from '../AssocFormModal';

import styles from './index.scss';

const { Option } = Select;
const DEFAULT_PAGE_SIZE = LcpConst.FORM_RECORD_DEFAULT_PAGE_SIZE;
interface Option {
  id: string;
  name: string;
}

interface DataItem {
  Id: { value: string };
  Name: { value: string };
}

type AssocFormProps = (AssocFormControl & AssocMultFormControl) & {
  value: AssocFormState;
  onChange: (value: AssocFormState) => void;
  dataLinkageMappings?: DataLkgMappings;
  /**
   * 关联表单多选/单选
   *
   * @type {string}
   */
  mode: string;
  /**
   * 子表code
   *
   * @type {string}
   */
  subFormCode?: string;
  /**
   * 在子表中第几行
   *
   * @type {number}
   */
  index?: number;
};

const AssocSelect: React.FC<AssocFormProps> = (props) => {
  const {
    schemaCode,
    value,
    onChange,
    code,
    subFormCode,
    schemaId,
    mode,
    index,
    dataLinkageMappings,
  } = props;
  const intl = useIntl();
  const dispatch: Dva.Dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [options, setOptions] = useState<Option[]>([]);
  const [filterOptions, setFilterOptions] = useState<Option[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const [tableSetting, setTableSetting] = useState<FormRecordData.FormRecordTableSetting>();
  const isFetching = useSelector(({ loading }) => loading.effects['formInstance/getFormDataList']);
  const { dispatch: uformDispatch } = actions;
  const fetchData = (
    payload: { data: FormRecordData.GetFormDataListPayload },
    onBack: Function,
  ) => {
    dispatch({
      type: 'formInstance/getFormDataList',
      payload,
    }).then((res) => {
      onBack(res.dataList, res.totalCount);
    });
  };

  const handleBack = (dataList: DataItem[], totalCount: number) => {
    if (dataList) {
      setOptions([
        ...options,
        ...dataList.map((item) => ({
          id: item.Id.value,
          name: item.Name.value,
        })),
      ]);
      setTotal(totalCount);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    e.persist();
    const target = e.target as HTMLDivElement;
    const isScrolltoNextPage =
      target.scrollTop + target.offsetHeight === target.scrollHeight &&
      currentPage * DEFAULT_PAGE_SIZE < total;
    if (isScrolltoNextPage) {
      const nextScrollPage = currentPage + 1;
      setCurrentPage(nextScrollPage);
    }
  };

  const handleSelect: SelectProps<string[]>['onSelect'] = (selectValue, option) => {
    setIsSearching(false);
    if (mode === 'multiple') {
      const selectedOption = {
        objectId: option.props.value,
        value: option.props.children,
      };

      onChange(value ? [...(value as SelectReturnType[]), selectedOption] : [selectedOption]);
      return;
    }
    onChange({
      objectId: option.props.value,
      value: option.props.children,
    });

    datalink(code, dataLinkageMappings, subFormCode, index);
    if (uformDispatch) {
      const currentCode = subFormCode ? `${subFormCode},${code}` : code;
      uformDispatch('assocFormFilled', { payload: { code: currentCode, id: selectValue, index } });
    }
  };

  const handleDeselect = (selectValue: string) => {
    setIsSearching(false);
    if (mode === 'multiple') {
      onChange(
        (value as SelectReturnType[]).filter(
          (item: { objectId: string }) => item.objectId !== selectValue,
        ),
      );
      return;
    }

    if (uformDispatch) {
      const currentCode = subFormCode ? `${subFormCode},${code}` : code;
      uformDispatch('assocFormFilled', { payload: { code: currentCode, id: null, index } });
    }
    onChange(null);
    datalink(code, dataLinkageMappings, subFormCode, index);
  };

  useEffect(() => {
    dispatch({
      type: 'formInstance/getColHeaders',
      payload: { formTemplateId: schemaId },
    })
      .then((res) => {
        if (res) {
          setTableSetting({
            allowBatchOperation: res.allowBatchOperation,
            optionalDisplayModel: res.optionalDisplayModel,
            pcDefaultDisplayModel: res.pcDefaultDisplayModel,
            orderByFieldCode: res.orderByFieldCode,
            orderByDirection: res.orderByDirection,
          });
        }
      })
      .catch(() => {
        message.error('Fetching column setting failed');
      });
    // dispatch({ type: 'formInstance/reset' });
  }, [schemaId]);

  useEffect(() => {
    if (schemaCode && tableSetting) {
      const payload = {
        data: {
          sortAt: tableSetting.orderByFieldCode,
          sortDirection: tableSetting.orderByDirection,
          pageStartAt: DEFAULT_PAGE_SIZE * (currentPage - 1),
          pageLimit: DEFAULT_PAGE_SIZE,
          displayMode: tableSetting.pcDefaultDisplayModel,
          mainTableQuery: {
            schemaId,
            queryItems: [{ fieldName: 'AuditStat', values: ['1'] }],
            excludeColumns: [],
          },
        },
      };
      fetchData(payload, handleBack);
    }
  }, [currentPage, tableSetting]);

  const fetchDataDebounced = debounce(
    (payload) =>
      fetchData(payload, (dataList: DataItem[]) => {
        if (dataList) {
          setFilterOptions(
            dataList.map((item) => ({
              id: item.Id.value,
              name: item.Name.value,
            })),
          );
        }
      }),
    500,
  );

  const handleSearch = (searchValue: string) => {
    if (schemaCode && tableSetting) {
      setIsSearching(true);
      const payload = {
        data: {
          sortAt: tableSetting.orderByFieldCode,
          sortDirection: tableSetting.orderByDirection,
          pageStartAt: 0,
          pageLimit: DEFAULT_PAGE_SIZE,
          displayMode: tableSetting.pcDefaultDisplayModel,
          mainTableQuery: {
            schemaId,
            queryItems: [
              {
                fieldName: 'Name',
                values: [searchValue],
              },
              { fieldName: 'AuditStat', values: ['1'] },
            ],
            excludeColumns: [],
          },
        },
      };
      fetchDataDebounced(payload);
    }
  };
  const showOptions = isSearching ? filterOptions : options;

  const getShowValue = (inputMode: string) => {
    if (inputMode === 'multiple') {
      const showValue: string[] = [];
      if (value && showOptions.length > 0) {
        (value as SelectReturnType[]).forEach((item: { objectId: string; value: string }) => {
          if (showOptions.some((option) => option.id === item.objectId)) {
            showValue.push(item.objectId);
          } else {
            showValue.push(item.value);
          }
        });
      }
      return showValue;
    }
    if (value) {
      const selectedValue = value as SelectReturnType;
      if (selectedValue.objectId) {
        if (showOptions.some((item) => item.id === selectedValue.objectId)) {
          return [selectedValue.objectId];
        }
        return [selectedValue.value];
      }
    }
    return [];
  };

  const handleOk = (selectValue: SelectedValueType) => {
    onChange(selectValue);
    if (mode !== 'multiple' && !Array.isArray(selectValue)) {
      datalink(code, dataLinkageMappings, subFormCode, index);
      if (uformDispatch) {
        const currentCode = subFormCode ? `${subFormCode},${code}` : code;
        uformDispatch('assocFormFilled', {
          payload: { code: currentCode, id: selectValue?.objectId, index },
        });
      }
    }
    setVisible(false);
  };

  const onFilter: SelectProps<string[]>['filterOption'] = (input, option) =>
    option?.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  return (
    <div className={styles.wrapper}>
      <Select
        mode="multiple"
        value={getShowValue(mode)}
        onPopupScroll={handleScroll}
        onSearch={(sv) => handleSearch(sv)}
        notFoundContent={isFetching && <Spin size="small" />}
        filterOption={onFilter}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
        placeholder={intl.formatMessage({ id: 'formtpl.canvas.common.select.ph' })}
      >
        {showOptions.map((item) => (
          <Option key={item.id} value={item.id}>
            {item.name || CELL_PLACEHOLDER}
          </Option>
        ))}
      </Select>
      <AuditOutlined
        className={styles.icon}
        onClick={() => {
          setVisible(true);
        }}
      />
      <AssocFormModal
        schemaCode={schemaCode}
        mode={mode}
        schemaId={schemaId as string}
        visible={visible}
        onCancel={() => setVisible(false)}
        fetchData={fetchData}
        onOk={handleOk}
        selectValue={value}
      />
    </div>
  );
};
export default AssocSelect;
