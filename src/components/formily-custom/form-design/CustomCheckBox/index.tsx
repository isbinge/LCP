import React, { useState, ReactText } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { Checkbox, Input, Button } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { DeleteOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import { v1 as uuidv1 } from 'uuid';

import BulkAdding from '@comp/formily-custom/form-design/common/BulkAdding';
import OptionDraggable from '@comp/formily-custom/form-design/common/OptionDraggable';

import { msgIntl } from '@comp/i18n/MessageIntl';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import styles from './index.scss';
import { CustomOptionProps } from '../CustomOptions';

/** 自定义custom-optioms-checkbox,用于控件属性中多选field */
const CustomCheckBox: React.FC<ISchemaFieldComponentProps> = (props) => {
  const { value, onChange } = props;
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
  const selectedValues: string[] = value?.selectValue;

  const handleCheckBoxChange = (checkedValues: Array<CheckboxValueType>) => {
    onChange({
      selectValue: checkedValues,
      optionsValue: options.map((item: CustomOptionProps) => item.value),
    });
  };

  const handleInutChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newOptions = [...options];
    newOptions[index] = {
      ...newOptions[index],
      value: e.target.value,
    };
    setOptions(newOptions);
    onChange({
      selectValue: selectedValues,
      optionsValue: newOptions.map((item: CustomOptionProps) => item.value),
    });
  };

  const handleDelete = (index: number, optionValue: string) => {
    const newOptions = [...options];
    if (newOptions.length > 1) {
      newOptions.splice(index, 1);
      const newSelectedValues = selectedValues.filter((item) => item !== optionValue);
      setOptions(newOptions);
      onChange({
        selectValue: newSelectedValues,
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
      selectValue: selectedValues,
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
    const newSelectedValues: string[] = [];
    valueArray.forEach((item) => {
      if (selectedValues.find((sv) => sv === item)) {
        newSelectedValues.push(item);
      }
    });
    setOptions(newOptions);
    onChange({
      selectValue: newSelectedValues,
      optionsValue: newOptions.map((item: CustomOptionProps) => item.value),
    });
    setVisible(false);
  };
  const handleModalCancel = () => {
    setVisible(false);
  };

  const moveOption = (id: ReactText, atIndex: number) => {
    const option = options.filter((v) => v.id === id)[0];
    const index = options.findIndex((v) => v.id === id);

    const newOptions = update(options, {
      $splice: [
        [index, 1],
        [atIndex, 0, option],
      ],
    });
    setOptions(newOptions);
    onChange({
      selectValue: selectedValues,
      optionsValue: newOptions.map((item: CustomOptionProps) => item.value),
    });
  };

  return (
    <>
      <Checkbox.Group onChange={handleCheckBoxChange} value={selectedValues}>
        {options.map((item: CustomOptionProps, index: number) => (
          <OptionDraggable
            className={styles.option}
            key={item.id}
            id={item.id}
            onMove={moveOption}
            stateValue={options}
          >
            <Checkbox value={item.value} style={{ marginRight: 10 }} />
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
      </Checkbox.Group>
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

export default CustomCheckBox;
