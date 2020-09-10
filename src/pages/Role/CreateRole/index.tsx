import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, message } from 'antd';
import { v1 as uuidv1 } from 'uuid';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'dva';

import { msgIntl } from '@comp/i18n/MessageIntl';
import { RoleGroupDto } from '@/domain/role/data.d';

import styles from './index.scss';

interface CreateRoleProps {
  visible: boolean;
  companyId: string;
  data: RoleGroupDto[];
  onCancel: () => void;

  // update 时传入
  groupId?: string;
  displayName?: string;
  roleId?: string;
  // fetchRoleGroup: (id: string) => void;
}

const { Option } = Select;

const CreateRole: React.FC<CreateRoleProps> = (props) => {
  const intl = useIntl();
  const { data, visible, onCancel, companyId, groupId, displayName, roleId } = props;
  const dispatch = useDispatch();
  const [roleName, setRoleName] = useState('');
  const [selectedGroup, setSelectGroup] = useState('');
  const userId = useSelector(({ account: login }) => login.userId);
  const isUpdateLoading = useSelector(({ loading }) => loading.effects['role/updateRole']);
  const isCreateLoading = useSelector(({ loading }) => loading.effects['role/createRole']);

  const handleOk = () => {
    if (selectedGroup === '') {
      msgIntl.warning({ id: 'role.left.groupnull' });
      return;
    }
    if (roleName.length > 15) {
      msgIntl.warning({ id: 'role.left.namelength' });
      return;
    }
    if (
      data
        .find((d) => d.groupId === selectedGroup)
        ?.children.some((role) => role.roleName === roleName)
    ) {
      msgIntl.warning({ id: 'role.left.nameexit' });

      return;
    }
    if (displayName) {
      dispatch({
        type: 'role/updateRole',
        payload: {
          name: roleName,
          // groupId: setSelectGroup,
          companyId,
          currentUserId: userId,
          id: roleId,
        },
      })
        .then(() => {
          onCancel();
          message.success({ content: 'update completed' });
        })
        .catch(() => {
          message.error({ content: 'update failed' });
        });
      return;
    }
    dispatch({
      type: 'role/createRole',
      payload: {
        name: roleName,
        // groupId: setSelectGroup,
        companyId,
        currentUserId: userId,
        id: uuidv1(),
      },
    })
      .then(() => {
        onCancel();
        message.success({ content: 'Create completed' });
      })
      .catch(() => {
        message.error({ content: 'Create failed' });
      });
  };

  useEffect(() => {
    if (!visible) {
      setRoleName('');
      setSelectGroup('');
    } else {
      setRoleName(displayName || '');
      setSelectGroup(groupId || '');
    }
  }, [visible]);

  return (
    <Modal
      maskClosable={false}
      title={<FM id="role.left.new" />}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={400}
      okButtonProps={{ disabled: roleName === '', loading: isUpdateLoading || isCreateLoading }}
    >
      <div className={styles.row}>
        <span className={styles.title}>
          <span className={styles.require}>*</span>
          <FM id="role.left.rolename" />
        </span>
        <span className={styles.content}>
          <Input
            placeholder={intl.formatMessage({ id: 'role.left.rolename.ph' })}
            value={roleName}
            onChange={(e) => {
              setRoleName(e.target.value);
            }}
          />
        </span>
      </div>
      <div className={styles.row} style={{ marginTop: 10 }}>
        <span className={styles.title}>
          <FM id="role.left.rolegroup" />
        </span>
        <span className={styles.content}>
          <Select
            value={selectedGroup}
            style={{ width: '100%' }}
            onChange={(value) => setSelectGroup(value)}
          >
            {data.map((group) => (
              <Option key={group.groupId} value={group.groupId}>
                {group.groupName}
              </Option>
            ))}
          </Select>
        </span>
      </div>
    </Modal>
  );
};

export default CreateRole;
