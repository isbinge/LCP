import React from 'react';
import { Select } from 'antd';
import { CELL_PLACEHOLDER } from '@/constants/record/common';
import { QueryControlProps } from '..';

const { Option } = Select;

/**
 * query-items 关联表单（多选）
 * @param props
 */
const AssocForm: React.FC<QueryControlProps> = (props) => {
  const { item, onChange: handleChange } = props;
  const dataSource = item.config?.source;
  return (
    <Select
      showSearch
      style={{ width: '100%' }}
      placeholder="Select a association form"
      optionFilterProp="children"
      mode="tags"
      onChange={handleChange as (value: string[]) => void}
      filterOption={(input, option) =>
        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {dataSource &&
        dataSource?.map(
          (op) =>
            typeof op !== 'string' && (
              <Option key={op.id} value={op.id}>
                {op.name || CELL_PLACEHOLDER}
              </Option>
            ),
        )}
    </Select>
  );
};

export default AssocForm;
