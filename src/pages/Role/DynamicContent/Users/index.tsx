import React from 'react';
import { Tabs, Button } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { useSelector, useDispatch } from 'dva';

import { RoleDto } from '@/domain/role/data';
import RoleAccessForm from './components/RoleAccessForm';

import styles from './index.scss';

const { TabPane } = Tabs;

const Users: React.FC<{ role: RoleDto }> = ({ role }) => {
  const dispatch = useDispatch();

  const [
    { appAccessList },
    updateFormAccessControlListLoading,
  ] = useSelector(({ role: roleState, loading }) => [
    roleState,
    loading.effects['role/updateFormAccessControlList'],
  ]);

  const handleSaveAccessConfig = () => {
    dispatch({
      type: 'role/updateFormAccessControlList',
      payload: {
        roleId: role.roleId,
      },
    });
  };

  return (
    <div className={styles.tabsContainer}>
      <Tabs
        defaultActiveKey="1"
        tabBarExtraContent={
          <Button
            disabled={appAccessList.length === 0}
            loading={updateFormAccessControlListLoading}
            className={styles.save}
            onClick={handleSaveAccessConfig}
            type="primary"
          >
            <span>
              <FM id="dict.save" />
            </span>
          </Button>
        }
      >
        <TabPane tab={<FM id="role.users.authority-setting" />} key="1">
          <RoleAccessForm role={role} onSave={handleSaveAccessConfig} />
        </TabPane>
        {/* <TabPane tab="角色成员设置管理" key="2">
          Content of Tab Pane 2
        </TabPane> */}
      </Tabs>
    </div>
  );
};
export default Users;
