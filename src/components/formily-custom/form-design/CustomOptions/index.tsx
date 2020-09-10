import React, { useState, ReactText } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { Radio, Input, Button } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import update from 'immutability-helper';
import { DeleteOutlined } from '@ant-design/icons';
import { v1 as uuidv1 } from 'uuid';

import BulkAdding from '@comp/formily-custom/form-design/common/BulkAdding';
import OptionDraggable from '@comp/formily-custom/form-design/common/OptionDraggable';

import { msgIntl } from '@comp/i18n/MessageIntl';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import styles from './index.scss';

export interface CustomOptionProps {
  id: ReactText;
  value: string;
}

/** 自定义custom-options-radio, 用于控件属性中的单选field */
const CustomOptions: React.FC<ISchemaFieldComponentProps> = (props) => {
  const { onChange, value } = props;
  const intl = useIntl();
  const [options, setOptions] = useState<CustomOptionProps[]>(() => {
    const ops = value?.optionsValue;
    return ops.map((option: string) => {
      return {
        id: uuidv1(),
        value: option,
      };
    });
  });
  const [visibel, setVisible] = useState(false);
  const selectedValue: string = value?.selectValue ? value.selectValue : '';
  const handleRadioChange = (e: RadioChangeEvent) => {
    onChange({
      selectValue: e.target.value,
      optionsValue: options.map((item: CustomOptionProps) => item.value),
    });
  };

  const handleRadioClick = (optionValue: string) => {
    if (optionValue === selectedValue) {
      onChange({
        selectValue: '',
        optionsValue: options.map((item: CustomOptionProps) => item.value),
      });
    }
  };

  const handleInutChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newOptions = [...options];
    newOptions[index] = {
      ...newOptions[index],
      value: e.target.value,
    };

    setOptions(newOptions);
    onChange({
      selectValue: selectedValue,
      optionsValue: newOptions.map((item: CustomOptionProps) => item.value),
    });
  };

  const handleDelete = (index: number, optionValue: string) => {
    const newOptions = [...options];
    if (newOptions.length > 1) {
      newOptions.splice(index, 1);
      const newSelectedValue = selectedValue === optionValue ? '' : selectedValue;
      setOptions(newOptions);
      onChange({
        selectValue: newSelectedValue,
        optionsValue: newOptions.map((item: CustomOptionProps) => item.value),
      });
    } else {
      msgIntl.error({ id: 'formtpl.schema.common.prohibitdel', key: 'error' });
    }
  };

  const handleAdd = () => {
    const newOptions = [...options];
    newOptions.push({
      id: uuidv1(),
      value: `${intl.formatMessage({ id: 'formtpl.schema.common.option' }, { order: null })}${
        newOptions.length + 1
      }`,
    });
    setOptions(newOptions);
    onChange({
      selectValue: selectedValue,
      optionsValue: newOptions.map((item: CustomOptionProps) => item.value),
    });
  };

  const handleModalOk = (inputValue: string) => {
    const valueArray = inputValue.split('\n').filter((item) => item !== '');
    if (valueArray.length === 0) {
      msgIntl.error({ id: 'formtpl.schema.common.keepone', key: 'error' });
      return;
    }
    const newOptions = valueArray.map((item) => ({
      id: uuidv1(),
      value: item,
    }));
    let newSelectedValue = '';
    if (valueArray.find((item) => item === selectedValue)) {
      newSelectedValue = selectedValue;
    }
    setOptions(newOptions);
    onChange({
      selectValue: newSelectedValue,
      optionsValue: newOptions.map((item: CustomOptionProps) => item.value),
    });
    setVisible(false);
  };
  const handleModalCancel = () => {
    setVisible(false);
  };

  const moveOption = (id: ReactText, atIndex: number) => {
    const option = options.find((v) => v.id === id);
    const index = options.findIndex((v) => v.id === id);
    if (option) {
      const newOptions = update(options, {
        $splice: [
          [index, 1],
          [atIndex, 0, option],
        ],
      });
      setOptions(newOptions);
      onChange({
        selectValue: selectedValue,
        optionsValue: newOptions.map((item: CustomOptionProps) => item.value),
      });
    }
  };

  return (
    <>
      <Radio.Group onChange={handleRadioChange} value={selectedValue}>
        {options.map((item: CustomOptionProps, index: number) => (
          <OptionDraggable
            className={styles.option}
            key={item.id}
            id={item.id}
            onMove={moveOption}
            stateValue={options}
          >
            <Radio
              value={item.value}
              onClick={() => {
                handleRadioClick(item.value);
              }}
            />
            <Input
              className={styles.optionInput}
              value={item.value}
              onChange={(e) => handleInutChange(e, index)}
            />
            <Button
              className={styles.delete}
              shape="circle"
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(index, item.value)}
            />
          </OptionDraggable>
        ))}
      </Radio.Group>
      <div className={styles.buttonWrapper}>
        <a onClick={handleAdd}>
          <FM id="formtpl.schema.common.addoption" />
        </a>{' '}
        |{' '}
        <a onClick={() => setVisible(true)}>
          <FM id="formtpl.schema.common.massedit" />
        </a>
      </div>
      <BulkAdding
        options={options}
        visible={visibel}
        handleOk={handleModalOk}
        handleCancel={handleModalCancel}
      />
    </>
  );
};
export default CustomOptions;
