import React, { useState, useEffect } from 'react';
import { Dropdown, Input, Tabs, message, Tag } from 'antd';
import { useDispatch, useSelector } from 'dva';

import { SelectState } from '@/domain/select';
import { FormItemControlType } from '@/constants/form/common';
import styles from './index.scss';
import { QueryControlProps } from '..';

import DeptSelect from './DeptSelect';
import DeptUsers from './DeptUser';

type SelectedUsersType = { id: string; name: string };

const { TabPane } = Tabs;
/**
 * query-items 部门选择， 人员选择
 * @param props
 */
const DeptTree: React.FC<QueryControlProps> = (props) => {
  const { onChange: handleValueChange, item: control } = props;
  const dispatch: Dva.Dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [selectedItems, setSelectItems] = useState<SelectedUsersType[]>([]);
  const [
    { defaultOrgId: currentOrgId },
    { depts },
  ] = useSelector(({ account, organization }: SelectState) => [account, organization]);

  const handleVisibleChange = (flag: boolean) => {
    setVisible(flag);
  };

  const handleClose = (id: string) => {
    const selectedList = selectedItems.filter((item) => id !== item.id);
    setSelectItems(selectedList);
    handleValueChange(selectedList.map((user) => user.id));
  };

  const menu = (
    <div>
      <Input.Search className={styles.search} />
      <Tabs defaultActiveKey="1" className={styles.tabs}>
        <TabPane tab="user" key="1" className={styles.tabPane}>
          {control.controlType === FormItemControlType.CREATOR ? (
            <DeptUsers
              depts={depts}
              selectedUsers={selectedItems}
              setSelectUsers={setSelectItems}
              onChange={handleValueChange}
            />
          ) : (
            <DeptSelect
              depts={depts}
              selectedDepts={selectedItems}
              setSelectDepts={setSelectItems}
              onChange={handleValueChange}
            />
          )}
        </TabPane>
        <TabPane tab="My department" key="2" className={styles.tabPane}>
          {control.controlType === FormItemControlType.CREATOR ? (
            <DeptUsers
              depts={[]}
              selectedUsers={selectedItems}
              setSelectUsers={setSelectItems}
              onChange={handleValueChange}
            />
          ) : (
            <DeptSelect
              depts={[]}
              selectedDepts={selectedItems}
              setSelectDepts={setSelectItems}
              onChange={handleValueChange}
            />
          )}
        </TabPane>
      </Tabs>
    </div>
  );

  useEffect(() => {
    if (visible) {
      dispatch({
        type: 'organization/requestDepts',
        payload: { currentOrgId },
      }).catch(() => message.error({ content: 'get depements failed' }));
    }
  }, [visible]);

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      overlayClassName={styles.overlay}
      visible={visible}
      onVisibleChange={handleVisibleChange}
    >
      <div className="ant-input">
        {selectedItems.length > 0 ? (
          selectedItems.map((user) => (
            <Tag
              key={user.id}
              style={{ fontSize: 14, marginBottom: 5 }}
              closable
              onClose={() => handleClose(user.id)}
            >
              {user.name}
            </Tag>
          ))
        ) : (
          <div className={styles.ph}>Choose people</div>
        )}
      </div>
    </Dropdown>
  );
};

export default DeptTree;
