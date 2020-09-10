import React from 'react';
import { Select } from 'antd';
import { FormattedMessage as FM, useIntl } from 'react-intl';
// import { AssocFormFieldsProps } from '@comp/formily-custom/form-design/CustomAssociationField';
import FormTemplate from '@/domain/form/template/data';
import { FormItemDataType } from '@/constants/form/common';

import styles from '../index.scss';

const { Option } = Select;

interface Iprops {
  dataLinkResult: string;
  currentFieldControl: string;
  setDataLinkResult: React.Dispatch<string>;
  assocFormFields: FormTemplate.DbFieldsDto;
  currentFieldType: FormItemDataType;
}

const Bottom: React.FC<Iprops> = (props) => {
  const {
    currentFieldControl,
    assocFormFields,
    setDataLinkResult,
    dataLinkResult,
    currentFieldType,
  } = props;

  const intl = useIntl();
  const assocFormFieldsOption = assocFormFields
    .filter(
      (item) =>
        (currentFieldType === FormItemDataType.INDICATOR ||
        currentFieldType === FormItemDataType.TEXTAREA
          ? item.dataType === FormItemDataType.INDICATOR ||
            item.dataType === FormItemDataType.TEXTAREA ||
            item.dataType === FormItemDataType.ASSOC_FORM
          : item.dataType === currentFieldType) &&
        item.name !== 'CreateDateTime' &&
        item.name !== 'UpdateDateTime',
    )
    .map((item) => (
      <Option key={item.name} value={item.name}>
        {item.displayName}
      </Option>
    ));
  const handleResultChange = (selectValue: string) => {
    setDataLinkResult(selectValue);
  };
  return (
    <div style={{ marginTop: 10 }}>
      <div className={styles.text}>
        <FM id="formtpl.schema.datalinkage.linkfill" />
        <span>
          {' '}
          <FM id="formtpl.schema.datalinkage.linkfilldesc" />
        </span>
      </div>
      <Select
        style={{ maxWidth: 254, minWidth: 244, flex: 1, marginRight: 5 }}
        disabled
        value={currentFieldControl}
        placeholder={intl.formatMessage({ id: 'formtpl.schema.datalinkage.currentcontrl' })}
      >
        <Option key="currentFieldControl" value={currentFieldControl}>
          {currentFieldControl}
        </Option>
      </Select>
      <FM id="formtpl.schema.datalinkage.equal" />
      <Select
        style={{ maxWidth: 254, minWidth: 244, flex: 1, marginLeft: 5, marginRight: 3 }}
        placeholder={intl.formatMessage({ id: 'formtpl.schema.datalinkage.linkedcontrl' })}
        value={dataLinkResult || undefined}
        onChange={handleResultChange}
      >
        {assocFormFieldsOption}
      </Select>
    </div>
  );
};

export default Bottom;
