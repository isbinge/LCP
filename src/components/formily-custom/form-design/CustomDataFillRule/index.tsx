import React, { useState, useMemo } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { Button, Modal, Select, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'dva';

import { SelectState } from '@/domain/select.d';
import { FormattedMessage as FM, useIntl } from 'react-intl';

import LcpConst from '@/constants';
import { msgIntl } from '@comp/i18n/MessageIntl';

import { getSelectedCtrl } from '@/domain/form/template/common';
import FormTemplate from '@/domain/form/template/data';
import styles from './index.scss';

const { Option } = Select;
const layoutTypes = LcpConst.FORM_DESIGN_TPL_COMPTYPE_LAYOUT;

interface RuleProps {
  assocFormField: string;
  currentFormField: string;
}

interface AssocFormFieldsProps {
  dataType: number;
  displayName: string;
  isChildFiled: number;
  name: string;
}

/** 自定义数据填充规则 custom-datafill-rule
 *  用于关联表但设置填充规则使用
 */
const CustomDataFillRule: React.FC<ISchemaFieldComponentProps> = (props) => {
  const { dataSource, value, onChange } = props;
  const intl = useIntl();
  const [stateValue, setStateValue] = useState(
    value.length < 1 ? [{ assocFormField: '', currentFormField: '' }] : value,
  );
  const [visible, setVisible] = useState(false);
  const [associationFormFields, setAssociationFormFields] = useState<AssocFormFieldsProps[]>([]);
  const dispatch: Dva.Dispatch = useDispatch();
  const currentId = useSelector(({ formTemplate }: SelectState) => formTemplate.currentId);
  const formItemSpecs = useSelector(({ formTemplate }: SelectState) => formTemplate.formItemSpecs);

  const currentComp = currentId && getSelectedCtrl(currentId, formItemSpecs);

  const currentFormComp = useMemo(() => {
    const currentFormCompWithoutSubform = formItemSpecs
      .filter(
        (item) =>
          !layoutTypes.includes(item.compType as Lcp.FormItem.Layout) &&
          item.compType !== 'associationAttribute' &&
          currentId !== item.id &&
          item.displayable,
      )
      .map((item) => ({
        // 是否控件无name属性，具有content属性
        title: item.data.content || item.data.name,
        code: item.code,
      }));
    const currentSubForm = formItemSpecs.find(
      (formItem) =>
        formItem.compType === 'subform' &&
        formItem.extraData?.some((item) => item.id === currentId),
    );
    // 关联表单在子表
    const currentSubFormComp: {
      title: string;
      code: string;
    }[] =
      currentSubForm?.extraData
        ?.filter(
          (item) =>
            !layoutTypes.includes(item.compType as Lcp.FormItem.Layout) &&
            item.compType !== 'associationAttribute' &&
            currentId !== item.id &&
            item.displayable,
        )
        .map((item) => ({
          title: `${currentSubForm.data.name}.${item.data.name}`,
          code: `${currentSubForm.code}.${item.code}`,
        })) || [];
    if (!currentSubForm) {
      // 关联表单在主表
      formItemSpecs
        .filter((formItem) => formItem.compType === 'subform')
        .forEach((formItem) =>
          formItem.extraData
            ?.filter(
              (item) =>
                !layoutTypes.includes(item.compType as Lcp.FormItem.Layout) &&
                item.compType !== 'associationAttribute' &&
                currentId !== item.id &&
                item.displayable,
            )
            .forEach((item) =>
              currentSubFormComp.push({
                title: `${formItem.data.name}.${item.data.name}`,
                code: `${formItem.code}.${item.code}`,
              }),
            ),
        );
    }

    return currentFormCompWithoutSubform.concat(currentSubFormComp);
  }, [formItemSpecs, currentId]);

  const deleteRepeat = (data: RuleProps[]) => {
    const rlts: RuleProps[] = [];
    data.forEach((item) => {
      if (
        rlts.every(
          (rlt: RuleProps) =>
            rlt.assocFormField !== item.assocFormField ||
            rlt.currentFormField !== item.currentFormField,
        )
      ) {
        rlts.push(item);
      }
    });
    return rlts;
  };

  const deleteUnComplete = (data: RuleProps[]) => {
    const rlts: RuleProps[] = [];
    data.forEach((item) => {
      if (
        item.assocFormField !== '' &&
        item.currentFormField !== '' &&
        item.currentFormField &&
        item.assocFormField
      ) {
        rlts.push(item);
      }
    });

    return rlts;
  };

  const handleOk = () => {
    onChange(deleteUnComplete(deleteRepeat(stateValue)));
    setVisible(false);
    setStateValue(deleteUnComplete(deleteRepeat(stateValue)));
  };
  const handleCancel = () => {
    setVisible(false);
    setStateValue(value);
  };
  const handleAdd = () => {
    setStateValue([...stateValue, { assocFormField: '', currentFormField: '' }]);
  };

  const handleDelete = (index: number) => {
    const newStateValue = [...stateValue];
    if (newStateValue.length > 1) {
      newStateValue.splice(index, 1);
      setStateValue(newStateValue);
    } else {
      setStateValue([{ assocFormField: '', currentFormField: '' }]);
    }
  };

  const handleAssociationChange = (selectValue: string, index: number) => {
    const newStateValue = [...stateValue];
    newStateValue[index] = {
      ...newStateValue[index],
      assocFormField: selectValue,
    };
    setStateValue(newStateValue);
  };

  const handleCurrentChange = (selectValue: string, index: number) => {
    const newStateValue = [...stateValue];
    newStateValue[index] = {
      ...newStateValue[index],
      currentFormField: selectValue,
    };
    setStateValue(newStateValue);
  };

  const renderValue =
    stateValue.length > 0 ? stateValue : [{ assocFormField: '', currentFormField: '' }];

  const handleClick = () => {
    if (!currentComp) {
      return;
    }
    dispatch<FormTemplate.GetDbFieldsPayload>({
      type: 'formTemplate/getDbFields',
      payload: {
        formCode: currentComp.data.associateForm.schemaCode,
        isChildSchema: currentComp.data.associateForm.isChildSchema,
      },
    })
      .then((items) => {
        if (items) {
          setAssociationFormFields(items);
          setVisible(true);
        }
      })
      .catch((error) => {
        message.error({ content: error, key: 'error' });
      });
  };

  return (
    <>
      <Button
        block
        onClick={() => {
          if (dataSource.length > 0) {
            handleClick();
          } else {
            msgIntl.warning({ id: 'formtpl.schema.assocform.configform', key: 'warning' });
          }
        }}
      >
        <div className={styles.buttonText}>
          <div />
          <div>
            {value.length === 0 ? null : (
              <FM id="formtpl.schema.assocform.fillcount" values={{ count: value.length }} />
            )}
          </div>
          <PlusOutlined />
        </div>
      </Button>
      <Modal
        title={<FM id="formtpl.schema.assocform.datafillrule" />}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <div className={styles.modalTop}>
          <p style={{ color: '#8893a7' }}>
            <FM id="formtpl.schema.assocform.datafilldesc" />
          </p>
          <div>
            <a onClick={handleAdd}>
              +<FM id="formtpl.schema.common.addrule" />
            </a>
          </div>
          <div className={styles.line} />
        </div>

        <div className={styles.modalContent}>
          {renderValue.map((rule: RuleProps, index: number) => (
            <div
              className={styles.item}
              key={`${rule.assocFormField}_${rule.currentFormField}_${index + 1}`}
            >
              <Select
                placeholder={intl.formatMessage({ id: 'formtpl.schema.assocattr.config' })}
                style={{ width: 200, marginRight: 10 }}
                value={rule.assocFormField === '' ? undefined : rule.assocFormField}
                onChange={(selectValue: string) => handleAssociationChange(selectValue, index)}
              >
                {dataSource.length > 0
                  ? associationFormFields.map((item: AssocFormFieldsProps) => (
                      <Option
                        key={item.name}
                        value={
                          item.name === 'CreateUserId' || item.name === 'UpdateUserId'
                            ? `${item.name}_Name`
                            : item.name
                        }
                      >
                        {item.displayName}
                      </Option>
                    ))
                  : null}
              </Select>
              <FM id="formtpl.schema.assocform.valuepopu" />
              <Select
                placeholder={intl.formatMessage({ id: 'formtpl.schema.assocform.currentfield' })}
                style={{ width: 200, marginLeft: 10, marginRight: 5 }}
                value={rule.currentFormField === '' ? undefined : rule.currentFormField}
                onChange={(selectValue: string) => handleCurrentChange(selectValue, index)}
              >
                {dataSource.length > 0
                  ? currentFormComp.map((item) => (
                      <Option key={item.code} value={item.code || ''}>
                        {item.title}
                      </Option>
                    ))
                  : null}
              </Select>
              <Button
                shape="circle"
                icon={<DeleteOutlined />}
                size="small"
                onClick={() => handleDelete(index)}
              />
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};
export default CustomDataFillRule;
