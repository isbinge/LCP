import React from 'react';
import { Table, Checkbox, Row, Col, Radio } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { ColumnsType } from 'antd/lib/table';
import update from 'immutability-helper';
import { FormattedMessage as FM } from 'react-intl';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

import { AppAccessControlItem, BasicAccessControlItem } from '@/domain/role/data.d';
import { AppDataAccess } from '@/domain/role/common';

import { TableRowSelection } from 'antd/lib/table/interface';
import LoadingWave from '@comp/LoadingWave';

import styles from './index.scss';

interface AccessCellProps {
  onChange: (record: AppAccessControlItem) => void;
  record: AppAccessControlItem;
  accessType: 'FORM' | 'LIST';
}

const FormAndListCell: React.FC<AccessCellProps> = ({ record, accessType, onChange }) => {
  const { aclRoleNode, hasAcl: hasTemplateConfigured } = record;
  const isFormAccessCell = accessType === 'FORM';
  const checkedAll = isFormAccessCell
    ? aclRoleNode.formActionsAllChecked
    : aclRoleNode.listActionsAllChecked;
  const accessList = isFormAccessCell ? aclRoleNode.formActions : aclRoleNode.listViewActions;

  const accessActionsField = isFormAccessCell ? 'formActions' : 'listViewActions';
  const allCheckedActionField = isFormAccessCell
    ? 'formActionsAllChecked'
    : 'listActionsAllChecked';
  const handleCheckAll = (checked: boolean) => {
    const updatedAccessControlListItem = update(record, {
      aclRoleNode: {
        $set: {
          ...record.aclRoleNode,
          [allCheckedActionField]: checked,
          [accessActionsField]: accessList.map((item) => ({
            ...item,
            hasAcl: checked,
          })),
        },
      },
    });
    onChange(updatedAccessControlListItem);
  };

  const handleCheck = (checkedList: CheckboxValueType[]) => {
    const updatedAccessControlListItem = update(record, {
      aclRoleNode: {
        $set: {
          ...record.aclRoleNode,
          [allCheckedActionField]: checkedList.length === accessList.length,
          [accessActionsField]: accessList.map((item) => ({
            ...item,
            hasAcl: checkedList.includes(item.code),
          })),
        },
      },
    });
    onChange(updatedAccessControlListItem);
  };
  return (
    <div className={styles.cell}>
      <Row className={styles.gutterRow}>
        <Checkbox
          disabled={!hasTemplateConfigured}
          checked={checkedAll}
          onChange={(e) => {
            handleCheckAll(e.target.checked);
          }}
        >
          <FM id="role.users.operation.select-all" />
        </Checkbox>
      </Row>
      <Checkbox.Group
        disabled={!hasTemplateConfigured}
        style={{ width: '100%' }}
        value={accessList.filter((aclItem) => aclItem.hasAcl).map((aclItem) => aclItem.code)}
        onChange={(checkedList) => {
          handleCheck(checkedList);
        }}
      >
        <Row className={styles.gutterRow}>
          {accessList.map((accessItem) => (
            <Col span={8} key={accessItem.code}>
              <Checkbox value={accessItem.code}>{accessItem.name}</Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    </div>
  );
};

const DataAccessCell: React.FC<Omit<AccessCellProps, 'accessType'>> = ({ record, onChange }) => {
  const { hasAcl: hasTemplateConfigured } = record;
  return (
    <Radio.Group
      disabled={!hasTemplateConfigured}
      value={record.aclRoleNode.scopeType}
      style={{ width: '100%' }}
      onChange={(e) => {
        onChange(
          update(record, {
            aclRoleNode: {
              $set: {
                ...record.aclRoleNode,
                scopeType: e.target.value,
              },
            },
          }),
        );
      }}
    >
      <Row>
        <Radio className={styles.radio} value={AppDataAccess.Self}>
          <FM id="role.users.data-access.self" />
        </Radio>
      </Row>
      <Row>
        <Radio className={styles.radio} value={AppDataAccess.ServiceDepartment}>
          <FM id="role.users.data-access.owner-dept" />
        </Radio>
      </Row>
      <Row>
        <Radio className={styles.radio} value={AppDataAccess.All}>
          <FM id="role.users.data-access.all" />
        </Radio>
      </Row>
    </Radio.Group>
  );
};
const AccessControlList: React.FC = () => {
  const dispatch = useDispatch();

  const [
    { accessControlList },
    getFormAccessControlListLoading,
  ] = useSelector(({ role, loading }) => [role, loading.effects['role/getFormAccessControlList']]);

  const handleChange = (record: AppAccessControlItem) => {
    if (accessControlList) {
      const updatedAccessControlList = update(accessControlList, {
        aclChildren: {
          $splice: [
            [
              accessControlList?.aclChildren.findIndex(
                (aclItem) => aclItem.formTemplateId === record.formTemplateId,
              ),
              1,
              record,
            ],
          ],
        },
        edited: {
          $set: true,
        },
      });
      dispatch({
        type: 'role/updateAccessControlList',
        payload: { accessControlList: updatedAccessControlList },
      });
    }
  };

  const getResetRecordByChecked = (pendingRecord: AppAccessControlItem, checked: boolean) => {
    const resetCheckAll = (initialValue: boolean) => (checked ? initialValue : checked);
    const resetAccessActions = (formConfigs: BasicAccessControlItem[]) =>
      checked ? formConfigs : formConfigs.map((config) => ({ ...config, hasAcl: checked }));
    const initScopeType = (initialValue: AppDataAccess) =>
      initialValue === AppDataAccess.NoConfiguration ? AppDataAccess.Self : initialValue;

    return update(pendingRecord, {
      hasAcl: {
        $set: checked,
      },
      aclRoleNode: {
        formActionsAllChecked: {
          $apply: resetCheckAll,
        },
        listActionsAllChecked: {
          $apply: resetCheckAll,
        },
        formActions: {
          $apply: resetAccessActions,
        },
        listViewActions: {
          $apply: resetAccessActions,
        },
        scopeType: {
          $apply: (initialValue) =>
            checked ? initScopeType(initialValue) : AppDataAccess.NoConfiguration,
        },
      },
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (accessControlList) {
      dispatch({
        type: 'role/updateAccessControlList',
        payload: {
          accessControlList: update(accessControlList, {
            aclChildren: {
              $apply: (acl: AppAccessControlItem[]) =>
                acl.map((aclItem) => getResetRecordByChecked(aclItem, checked)),
            },
            edited: {
              $set: true,
            },
          }),
        },
      });
    }
  };
  const columns: ColumnsType<AppAccessControlItem> = [
    {
      title: <FM id="role.users.form-access" />,
      key: 'form',
      dataIndex: 'formAccess',
      width: 300,
      align: 'center',
      render: (_, record) => {
        return <FormAndListCell onChange={handleChange} record={record} accessType="FORM" />;
      },
    },
    {
      title: <FM id="role.users.list-access" />,
      key: 'list',
      dataIndex: 'listAccess',
      width: 300,
      align: 'center',
      render: (_, record) => {
        return <FormAndListCell onChange={handleChange} record={record} accessType="LIST" />;
      },
    },
    {
      title: <FM id="role.users.data-access" />,
      key: 'data',
      dataIndex: 'dataAccess',
      align: 'center',
      render: (_, record) => {
        return <DataAccessCell record={record} onChange={handleChange} />;
      },
    },
  ];

  const rowSelection: TableRowSelection<AppAccessControlItem> = {
    columnTitle: () => {
      return (
        <Checkbox
          checked={
            !!accessControlList && accessControlList.aclChildren.every((aclItem) => aclItem.hasAcl)
          }
          onChange={(e) => {
            handleSelectAll(e.target.checked);
          }}
        >
          <FM id="role.users.operation.select-all" />
        </Checkbox>
      );
    },
    columnWidth: 300,
    renderCell: (_, record) => {
      return (
        <Checkbox
          checked={record.hasAcl}
          onChange={(e) => {
            handleChange(getResetRecordByChecked(record, e.target.checked));
          }}
        >
          {record.name}
        </Checkbox>
      );
    },
  };
  return (
    <Table
      loading={{
        indicator: <LoadingWave size="medium" containerStyle={{ marginTop: 110 }} />,
        spinning: !!getFormAccessControlListLoading,
      }}
      bordered
      className={styles.accessTable}
      columns={columns}
      rowSelection={rowSelection}
      dataSource={accessControlList?.aclChildren}
      pagination={false}
      scroll={{ y: 700 }}
    />
  );
};

export default AccessControlList;
