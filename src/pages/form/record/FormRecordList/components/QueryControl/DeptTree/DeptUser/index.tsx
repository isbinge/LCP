import React, { useState, ReactText } from 'react';
import { message, Tree, Checkbox, Row, Empty } from 'antd';
import { TreeProps } from 'antd/lib/tree';

import { Department, Member } from '@/domain/organization/data.d';
import { useDispatch } from 'dva';

import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import FormRecordData from '@/domain/form/instance/data.d';
import styles from './index.scss';

type SelectedUsersType = { id: string; name: string };

const generateTreeData = (data: Department[]): TreeProps['treeData'] =>
  data.map((item) => ({
    key: item.id,
    title: item.name,
    children: item.childrens ? generateTreeData(item.childrens) : [],
  }));

interface DeptUsersProps {
  depts: Department[];
  selectedUsers: SelectedUsersType[];
  setSelectUsers: React.Dispatch<React.SetStateAction<SelectedUsersType[]>>;
  onChange: (value: FormRecordData.QueryValueType) => void;
}
const DeptUsers: React.FC<DeptUsersProps> = ({
  onChange: handleValueChange,
  depts,
  selectedUsers,
  setSelectUsers,
}) => {
  const dispatch: Dva.Dispatch = useDispatch();

  const [userList, setUserList] = useState<SelectedUsersType[]>([]);

  const handleDeptsSelect = (selectedKeys: ReactText[]) => {
    if (selectedKeys[0]) {
      dispatch({
        type: 'organization/getDeptMembers',
        payload: { id: selectedKeys[0] },
      })
        .then((res) => {
          if (res) {
            setUserList(res.members.map((item: Member) => ({ id: item.id, name: item.name })));
          }
        })
        .catch(() => message.error({ content: 'get dept members failed' }));
    }
  };

  const handleChange = (e: CheckboxChangeEvent) => {
    let selectedUsersList: SelectedUsersType[] = [];
    if (e.target.checked) {
      const checkedUser = userList.find((user) => user.id === e.target.value);
      if (checkedUser) {
        selectedUsersList = [...selectedUsers, checkedUser];
      }
    } else {
      selectedUsersList = selectedUsers.filter((d) => d.id !== e.target.value);
    }
    setSelectUsers(selectedUsersList);
    handleValueChange(selectedUsersList.map((user) => user.id));
    // setIndeter(!!selectedUsersList.length && selectedUsersList.length < userList.length);
    // setCheckAll(selectedUsersList.length === userList.length);
  };

  return (
    <>
      {depts.length > 0 ? (
        <>
          <div className={styles.leftSider}>
            <Tree blockNode treeData={generateTreeData(depts)} onSelect={handleDeptsSelect} />
          </div>
          <div className={styles.rightSider}>
            <Checkbox.Group value={selectedUsers.map((user) => user.id)}>
              {userList.map((user) => (
                <Row key={user.id}>
                  <Checkbox onChange={handleChange} value={user.id}>
                    {user.name}
                  </Checkbox>
                </Row>
              ))}
            </Checkbox.Group>
          </div>
        </>
      ) : (
        <div className={styles.empty}>
          <Empty description="No Data" />
        </div>
      )}
    </>
  );
};

export default DeptUsers;
