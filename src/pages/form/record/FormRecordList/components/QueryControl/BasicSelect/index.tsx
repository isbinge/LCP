import React, { useState } from 'react';
import { Select, Spin } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { QueryControlProps } from '..';

const { Option } = Select;

/**
 * query-items 下拉框-（单选，多选，下拉）
 * @param props
 */
const BasicSelect: React.FC<QueryControlProps> = (props) => {
  const { item, onChange: handleChange } = props;
  const dispatch = useDispatch();
  const [options, setOptions] = useState<string[]>([]);
  const isLoadingGetSelectSource = useSelector(
    ({ loading }) => loading.effects['formInstance/getSelectSource'],
  );
  const dataSource = item.config?.source;
  const formCode = item.config?.schemaCode;

  const handleFocus = () => {
    if (formCode) {
      const fieldName = item.config?.mappingField;
      dispatch<{ propertyValueList: string[] }>({
        type: 'formInstance/getSelectSource',
        payload: {
          formCode,
          fieldName,
          currentPage: 1,
          pageSize: 1000,
        },
      }).then((res) => {
        if (res && res.propertyValueList) {
          setOptions(res.propertyValueList);
        }
      });
    }
  };

  const showOptions = formCode ? options : dataSource;

  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      placeholder="Select a option"
      optionFilterProp="children"
      mode="multiple"
      onChange={handleChange as (value: string[]) => void}
      onFocus={handleFocus}
      notFoundContent={isLoadingGetSelectSource ? <Spin size="small" /> : null}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {showOptions &&
        showOptions.map(
          (op) =>
            typeof op === 'string' && (
              <Option key={op} value={op}>
                {op}
              </Option>
            ),
        )}
    </Select>
  );
};

export default BasicSelect;
