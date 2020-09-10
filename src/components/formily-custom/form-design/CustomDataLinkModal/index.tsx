import React, { useState, useEffect, ReactText } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { FormattedMessage as FM } from 'react-intl';
import { Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'dva';

import { msgIntl } from '@comp/i18n/MessageIntl';
import { getSelectedCtrl } from '@/domain/form/template/common';
import FormTemplate from '@/domain/form/template/data';
import Top from './components/Top';
import Middle from './components/Middle';
import Bottom from './components/Bottom';

export interface ConditionProps {
  currentForm: string;
  dataLinkForm: string;
}

/** 自定义弹窗custom-datalink-modal, 用于数据联动设置 */
const CustomDataLinkModal: React.FC<ISchemaFieldComponentProps> = (props) => {
  const { onChange: handleChange, value } = props;

  const [stateValue, setStateValue] = useState(
    (value && {
      ...value,
      dataLinkCondition:
        value.dataLinkCondition.length > 0
          ? value.dataLinkCondition
          : [{ currentForm: '', dataLinkForm: '' }],
    }) || {
      dataLinkSchemaCode: '',
      isChildSchema: false,
      dataLinkCondition: [{ currentForm: '', dataLinkForm: '' }],
      dataLinkResult: '',
    },
  );
  const [visible, setVisible] = useState(false);
  const [assocFormFields, setAssocFormFields] = useState<FormTemplate.DbFieldsDto>([]);
  const dispatch: Dva.Dispatch = useDispatch();
  const formItemSpecs = useSelector(({ formTemplate }) => formTemplate.formItemSpecs);
  const currentId = useSelector(({ formTemplate }) => formTemplate.currentId);
  const currentField = getSelectedCtrl(currentId || '', formItemSpecs);

  const currentFieldControl = currentField?.data.name;
  const currentFieldType = currentField?.data.dataType;

  const fetchFields = (code: string) => {
    if (code !== '') {
      dispatch<FormTemplate.GetDbFieldsPayload, FormTemplate.DbFieldsDto>({
        type: 'formTemplate/getDbFields',
        payload: {
          formCode: code,
          isChildSchema: false,
        },
      })
        .then((items) => {
          if (items) {
            setAssocFormFields(items.filter((item) => item.isChildFiled === 0));
          }
        })
        .catch((error) => {
          message.error({ content: error, key: 'error' });
        });
    }
  };
  const setDataLinkSchemaCode = (code: ReactText) => {
    setStateValue({
      dataLinkSchemaCode: code,
      isChildSchema: false,
      dataLinkCondition: [{ currentForm: '', dataLinkForm: '' }],
      dataLinkResult: '',
    });
    // fetchFields(code);
  };
  const setDataLinkCondition = (condition: ConditionProps[]) => {
    setStateValue({
      ...stateValue,
      dataLinkCondition: condition,
    });
  };
  const setDataLinkResult = (result: string) => {
    setStateValue({
      ...stateValue,
      dataLinkResult: result,
    });
  };

  const handleOk = () => {
    const { dataLinkSchemaCode, dataLinkCondition, dataLinkResult } = stateValue;
    if (dataLinkSchemaCode === '') {
      msgIntl.error({ id: 'formtpl.schema.datalinkage.selectformfirst', key: 'error' });
      return;
    }
    if (
      dataLinkCondition.some(
        (item: ConditionProps) => item.currentForm === '' || item.dataLinkForm === '',
      )
    ) {
      msgIntl.error({ id: 'formtpl.schema.datalinkage.emptycond', key: 'error' });
      return;
    }
    if (dataLinkResult === '') {
      msgIntl.error({ id: 'formtpl.schema.datalinkage.contrlselect', key: 'error' });
      return;
    }
    setVisible(false);
    handleChange(stateValue);
  };
  const handleCancel = () => {
    setVisible(false);
    setStateValue({
      ...value,
      dataLinkCondition:
        value.dataLinkCondition.length > 0
          ? value.dataLinkCondition
          : [{ currentForm: '', dataLinkForm: '' }],
    });
  };

  useEffect(() => {
    if (stateValue.dataLinkSchemaCode !== '' && visible) {
      fetchFields(stateValue.dataLinkSchemaCode);
    }
  }, [stateValue.dataLinkSchemaCode, visible]);

  return (
    <>
      <Button block onClick={() => setVisible(true)}>
        {value.dataLinkSchemaCode ? (
          <FM id="formtpl.schema.datalinkage.hasset" />
        ) : (
          <div style={{ float: 'right' }}>
            <PlusOutlined />
          </div>
        )}
      </Button>
      <Modal
        title={<FM id="formtpl.schema.datalinkage.setting" />}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={640}
        maskClosable={false}
        className="data-link"
        destroyOnClose
      >
        <Top
          dataLinkSchemaCode={stateValue.dataLinkSchemaCode}
          setDataLinkSchemaCode={setDataLinkSchemaCode}
        />
        <Middle
          dataLinkSchemaCode={stateValue.dataLinkSchemaCode}
          dataLinkCondition={
            stateValue.dataLinkCondition.length > 0
              ? stateValue.dataLinkCondition
              : [{ currentForm: '', dataLinkForm: '' }]
          }
          setDataLinkCondition={setDataLinkCondition}
          formItemSpecs={formItemSpecs}
          currentId={currentId}
          assocFormFields={assocFormFields}
        />
        <Bottom
          dataLinkResult={stateValue.dataLinkResult}
          currentFieldControl={currentFieldControl}
          currentFieldType={currentFieldType}
          setDataLinkResult={setDataLinkResult}
          assocFormFields={assocFormFields}
        />
      </Modal>
    </>
  );
};
export default CustomDataLinkModal;
