import React, { useState, useEffect, useMemo } from 'react';
import { Select, Button } from 'antd';

import { FormItemSpec } from '@/domain/form/template/model';
import { FormItemDataType, systemCode, systemNameI18n } from '@/constants/form/common';
import { DeleteOutlined } from '@ant-design/icons';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import FormTemplate from '@/domain/form/template/data';
import { ConditionProps } from '..';

import styles from '../index.scss';

const { Option } = Select;

interface IProps {
  dataLinkCondition: ConditionProps[];
  setDataLinkCondition: React.Dispatch<ConditionProps[]>;
  formItemSpecs: FormItemSpec[];
  currentId: Nullable<string>;
  assocFormFields: FormTemplate.DbFieldsDto;
  dataLinkSchemaCode: string;
}

// 当前表单可作为联动条件的控件类型,
const canBeType = ['input', 'date', 'number', 'radio', 'select', 'associationForm'];

const Middle: React.FC<IProps> = (props) => {
  const {
    dataLinkCondition: value,
    setDataLinkCondition: setValue,
    dataLinkSchemaCode: schemaCode,
    formItemSpecs,
    currentId,
    assocFormFields: asFormFields,
  } = props;
  const intl = useIntl();
  const [Id, setId] = useState(0);
  const [condition, setCondition] = useState(() => {
    let theId = Id;
    return value.map((item) => {
      theId += 1;
      setId(theId);
      return {
        ...item,
        id: theId,
      };
    });
  });
  useEffect(() => {
    let theId = Id;
    const tValue = value.map((item) => {
      theId += 1;
      setId(theId);
      return {
        ...item,
        id: theId,
      };
    });
    setCondition(tValue);
  }, [schemaCode]);

  const [list, currentFormOption] = useMemo(() => {
    const currentMainFormCtrls = formItemSpecs.filter(
      (formItem) =>
        formItem.id !== currentId && canBeType.includes(formItem.compType) && formItem.displayable,
    );
    const currentSubForm = formItemSpecs.find(
      (formItem) =>
        formItem.compType === 'subform' &&
        formItem.extraData?.some((item) => item.id === currentId),
    );
    const currentSubFormCtrls = currentSubForm?.extraData
      ?.filter(
        (item) => item.id !== currentId && canBeType.includes(item.compType) && item.displayable,
      )
      .map((item) => ({
        ...item,
        code: `${currentSubForm.code}.${item.code}`,
        data: { ...item.data, name: `${currentSubForm.data.name}.${item.data.name}` },
      }));

    const currentFormOptionLsit = ['creator', 'owner', 'ownerDept'].map((item) => {
      const itemSpec = formItemSpecs.find((data) => data.compType === item);
      return (
        <Option key={systemCode[item]} value={systemCode[item]}>
          {itemSpec ? itemSpec.data.name : <FM id={`formtpl.comp.${systemNameI18n[item]}`} />}
        </Option>
      );
    });
    const currentFormCtrls = currentMainFormCtrls.concat(currentSubFormCtrls || []);
    currentFormCtrls.forEach((item) => {
      currentFormOptionLsit.push(
        <Option key={item.code} value={item.code || ''}>
          {item.data.name}
        </Option>,
      );
    });
    return [currentFormCtrls, currentFormOptionLsit];
  }, [formItemSpecs]);

  const assocFormFieldsOption = (filterType: number) => {
    let filterFields: FormTemplate.DbFieldsDto = [];
    if (filterType === FormItemDataType.INDICATOR) {
      filterFields = asFormFields.filter(
        (item) => item.dataType === filterType || item.dataType === FormItemDataType.ASSOC_FORM,
      );
    } else if (filterType === FormItemDataType.ASSOC_FORM) {
      filterFields = asFormFields.filter(
        (item) => item.dataType === filterType || item.name === 'Id',
      );
    } else if (filterType === FormItemDataType.DATETIME) {
      filterFields = asFormFields.filter(
        (item) =>
          item.dataType === filterType &&
          item.name !== 'CreateDateTime' &&
          item.name !== 'UpdateDateTime',
      );
    } else {
      filterFields = asFormFields.filter((item) => item.dataType === filterType);
    }
    return filterFields.map((item) => (
      <Option key={item.name} value={item.name}>
        {item.displayName}
      </Option>
    ));
  };

  const handleAdd = () => {
    setValue([...value, { currentForm: '', dataLinkForm: '' }]);
    setCondition([...condition, { id: Id + 1, currentForm: '', dataLinkForm: '' }]);
    setId(Id + 1);
  };

  const handleDelete = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    setValue(newValue);
    const newCondition = [...condition];
    newCondition.splice(index, 1);
    setCondition(newCondition);
  };

  const handleCurrentFormChange = (index: number, selectValue: string) => {
    const newValue = [...value];
    const newCondition = [...condition];
    newValue[index] = {
      ...newValue[index],
      currentForm: selectValue,
      dataLinkForm: '',
    };
    newCondition[index] = {
      ...newCondition[index],
      currentForm: selectValue,
      dataLinkForm: '',
    };
    setValue(newValue);
    setCondition(newCondition);
  };

  const handleAssociationChange = (index: number, selectValue: string) => {
    const newValue = [...value];
    const newCondition = [...condition];
    newValue[index] = {
      ...newValue[index],
      dataLinkForm: selectValue,
    };
    newCondition[index] = {
      ...newCondition[index],
      dataLinkForm: selectValue,
    };
    setValue(newValue);
    setCondition(newCondition);
  };

  const renderSelect = () =>
    condition.map((item, index: number) => (
      <div key={item.id} style={{ marginBottom: 10 }}>
        <Select
          style={{ maxWidth: 254, minWidth: 244, marginRight: 5 }}
          value={item.currentForm || undefined}
          placeholder={intl.formatMessage({ id: 'formtpl.schema.datalinkage.currentcontrl' })}
          onChange={(selectValue: string) => handleCurrentFormChange(index, selectValue)}
        >
          {currentFormOption}
        </Select>
        <FM id="formtpl.schema.datalinkage.equal" />
        <Select
          style={{ maxWidth: 254, minWidth: 244, marginLeft: 5, marginRight: 3 }}
          value={item.dataLinkForm || undefined}
          placeholder={intl.formatMessage({ id: 'formtpl.schema.datalinkage.linkedcontrl' })}
          disabled={condition[index].currentForm === ''}
          onChange={(selectValue: string) => handleAssociationChange(index, selectValue)}
        >
          {assocFormFieldsOption(
            list.find((l) => l.code === item.currentForm)?.data.dataType ||
              FormItemDataType.OWNER_DEPARTMENT,
          )}
        </Select>
        {condition.length > 1 ? (
          <Button
            shape="circle"
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(index)}
          />
        ) : null}
      </div>
    ));

  return (
    <div style={{ marginTop: 10 }}>
      <div className={styles.text}>
        <FM id="formtpl.schema.datalinkage.linkcond" />
        <span>
          <FM id="formtpl.schema.datalinkage.linkdesc" />
        </span>
      </div>
      {renderSelect()}
      <a onClick={handleAdd}>
        + <FM id="formtpl.schema.common.addrule" />
      </a>
    </div>
  );
};

export default Middle;
