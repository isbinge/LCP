import React, { useEffect, useState } from 'react';
import { Select as AntSelect, Spin } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { useIntl } from 'react-intl';
import { debounce } from 'lodash';
import { DataLkgMappings } from '@/domain/form/instance/schema-type';
import { datalink } from '@/domain/form/instance/util';

const { Option } = AntSelect;

// type LabeledValue = { key: string; value: string };

type SelectValueType = string | undefined;
interface CustomSelectProps {
  schemaCode: string;
  mappingField: string;
  defaultItems: string;
  placeholder?: string;
  onChange: (value: SelectValueType) => void;
  value: SelectValueType;

  dataLinkageMappings?: DataLkgMappings;
  code: string;
  subFormCode?: string;
  index?: number;
}

const CustomSelect: React.FC<CustomSelectProps> = (props) => {
  const {
    schemaCode,
    mappingField,
    defaultItems,
    placeholder,
    onChange,
    value,
    subFormCode,
    code,
    dataLinkageMappings,
    index,
  } = props;
  const intl = useIntl();
  const dispatch: Dva.Dispatch = useDispatch();
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [options, setOptions] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const isFetching = useSelector(({ loading }) => loading.effects['formInstance/getSelectSource']);

  const fetchOptions = (
    callBack: (response: { propertyValueList: string[]; totalPage: number }) => void,
  ) => {
    dispatch({
      type: 'formInstance/getSelectSource',
      payload: {
        formCode: schemaCode,
        fieldName: mappingField,
        currentPage,
        pageSize: 20,
      },
    }).then((res) => {
      if (res?.propertyValueList) {
        callBack(res);
      }
    });
  };
  useEffect(() => {
    if (schemaCode) {
      fetchOptions((res) => {
        setTotal(res.totalPage);
        setOptions([...options, ...res.propertyValueList]);
      });
    } else {
      setOptions(defaultItems.split(';'));
    }
  }, [currentPage]);

  const fetchDataDebounced = debounce((searchValue: string) => {
    dispatch({
      type: 'formInstance/getSelectSource',
      payload: {
        formCode: schemaCode,
        fieldName: mappingField,
        filterValue: searchValue,
        currentPage: 1,
        pageSize: 20,
      },
    }).then((res) => {
      if (res && res.propertyValueList) {
        setFilterOptions(res.propertyValueList);
      }
    });
  }, 500);

  const handleSearch = (searchValue: string) => {
    if (schemaCode) {
      setIsSearching(true);
      setCurrentPage(1);
      fetchDataDebounced(searchValue);
    }
  };

  const handleChange = (selectValue: string) => {
    onChange(selectValue);
    datalink(code, dataLinkageMappings, subFormCode, index);
    setIsSearching(false);
  };
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    e.persist();
    const target = e.target as HTMLDivElement;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight && currentPage < total) {
      const nextScrollPage = currentPage + 1;
      setCurrentPage(nextScrollPage);
    }
  };

  return (
    <AntSelect
      value={value || undefined}
      showSearch
      placeholder={
        placeholder || intl.formatMessage({ id: 'forminst.common.selectable.placeholder' })
      }
      onChange={handleChange}
      onSearch={handleSearch}
      onPopupScroll={handleScroll}
      notFoundContent={isFetching && <Spin size="small" />}
      autoClearSearchValue
    >
      {isSearching
        ? filterOptions.map((item) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))
        : options.map((item) => (
            <Option key={item} value={item}>
              {item}
            </Option>
          ))}
    </AntSelect>
  );
};
export default CustomSelect;
