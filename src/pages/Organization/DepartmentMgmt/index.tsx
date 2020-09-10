import React, { useEffect, useState } from 'react';
import { Menu, Dropdown, Modal, Input, Form, Tree, Checkbox } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { useSelector, useDispatch, useRouteMatch } from 'dva';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { v1 as uuidv1 } from 'uuid';
import { first } from 'lodash';
import { useHistoryR } from '@lib/react-router-dom';
import { TreeProps } from 'antd/lib/tree';

import { SelectState } from '@/domain/select';
import { Department, Member } from '@/domain/organization/data.d';

import TreeSelectModal, { DataSource } from '@/pages/Organization/components/TreeSelectModal';
import { msgIntl } from '@comp/i18n/MessageIntl';

import styles from './index.scss';

interface DeptProps {
  orgId?: string;
  userId: string;
}

const DepartmentTree: React.FC<DeptProps> = ({ userId }) => {
  const dispatch: Dva.Dispatch = useDispatch();
  const intl = useIntl();
  const [deptNameForm] = Form.useForm();
  const [appendSubDept] = Form.useForm();

  const history = useHistoryR();
  const currentDeptId = useRouteMatch<{ orgId: string; deptId: string }>('/org/:orgId/dept/:deptId')
    ?.params?.deptId;
  const [
    { depts },
    { defaultOrgId: currentOrgId },
    createDeptLoading,
    updateDeptLoading,
    deleteDeptLoading,
  ] = useSelector(({ organization, account, loading }: SelectState) => [
    organization,
    account,
    loading.effects['organization/createDept'],
    loading.effects['organization/updateDept'],
    loading.effects['organization/deleteDept'],
  ]);
  const [deptNameMdlVisible, setDeptNameMdlVisible] = useState(false);
  const [addDeptMdlVisible, setAddDeptMdlVisible] = useState(false);
  const [deleteDeptMdlVisible, setDeleteDeptMdlVisible] = useState(false);

  const [hoverDeptId, setHoverDeptId] = useState('');

  const [selectMemberMdlVisible, setSelectMemberMdlVisible] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);
  const [deleteDepartmentId, setDeleteDepartmentId] = useState<Nullable<string>>(null);
  const [hoverDeptMembers, setHoverDeptMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (currentOrgId) {
      dispatch({
        type: 'organization/requestDepts',
      });
    }
  }, [currentOrgId]);

  const fetchMembersByDeptId = (_dept: Department) => {
    setSelectMemberMdlVisible(true);
    dispatch({
      type: 'organization/requestMembers',
      payload: { deptId: _dept.id },
    })
      .then((res) => {
        const data: DataSource[] = [];
        const mgrKeys: string[] = [];
        res.members.forEach((member: Member) => {
          if (member.isManager) {
            mgrKeys.push(member.id);
          }
          data.push({ ...member, name: member.name || '', childrens: [] });
        });
        setHoverDeptMembers(data);
      })
      .catch((e) => {
        msgIntl.error({ content: e });
      });
  };

  const handleUpdateDeptName = (values: { [name: string]: unknown }) => {
    dispatch({
      type: 'organization/updateDept',
      payload: {
        userId,
        deptName: values.name,
        deptId: hoverDeptId,
      },
    })
      .then(() => {
        setDeptNameMdlVisible(false);
        deptNameForm.resetFields();
        if (hoverDeptId === first(depts)?.id) {
          dispatch({
            type: 'organization/getOrgs',
          });
        }
      })
      .catch((e) => {
        msgIntl.error({ content: e });
      });
  };

  const handleAddDept = (values: { [name: string]: unknown }) => {
    dispatch({
      type: 'organization/createDept',
      payload: {
        id: uuidv1(),
        deptName: values.name,
        parentId: hoverDeptId,
      },
    })
      .then(() => {
        setAddDeptMdlVisible(false);
        appendSubDept.resetFields();
      })
      .catch((e) => {
        msgIntl.error({ content: e });
      });
  };
  const handleDeleteDept = () => {
    const resetDeleteDepartmentState = () => {
      setDeleteDeptMdlVisible(false);
      setDeleteDepartmentId(null);
      setConfirmChecked(false);
    };
    dispatch({
      type: 'organization/deleteDept',
      payload: { deptId: deleteDepartmentId },
    })
      .then(() => {
        resetDeleteDepartmentState();
      })
      .catch((e) => {
        msgIntl.error({ content: e });
        resetDeleteDepartmentState();
      });
  };
  const handleSetDeptManager = (keys: string[]) => {
    const data = hoverDeptMembers.map((x) => ({
      MemberId: x.id,
      isManager: keys.includes(x.id),
    }));
    dispatch({
      type: 'organization/updateDeptManager',
      payload: {
        id: hoverDeptId,
        members: data,
        userId,
      },
    })
      .then(() => {
        if (currentDeptId) {
          dispatch({
            type: 'organization/requestMembers',
            payload: {
              deptId: currentDeptId,
            },
          });
        }
      })
      .catch((e) => {
        msgIntl.error({ content: e });
      });
    setSelectMemberMdlVisible(false);
  };

  const handleClickSettingMenu = ({
    key: type,
    domEvent,
    dept,
  }: {
    key: string;
    domEvent: Event;
    dept: Department;
  }) => {
    setHoverDeptId(dept.id);
    domEvent.stopPropagation();

    switch (type) {
      case 'updateDept': {
        setDeptNameMdlVisible(true);
        break;
      }
      case 'addDept': {
        setAddDeptMdlVisible(true);
        break;
      }
      case 'setDeptManager': {
        fetchMembersByDeptId(dept);
        break;
      }
      case 'deleteDept': {
        setDeleteDepartmentId(dept.id);
        setDeleteDeptMdlVisible(true);
        break;
      }
      default:
        setDeptNameMdlVisible(false);
    }
  };

  const getDeptSettingMenu = (dept: Department) => {
    return (
      <Menu onClick={({ key, domEvent }) => handleClickSettingMenu({ key, domEvent, dept })}>
        <Menu.Item key="updateDept">
          <span>
            <FM id="org.dept.editname" />
          </span>
        </Menu.Item>
        <Menu.Item key="setDeptManager">
          <span>
            <FM id="org.dept.setmgmt" />
          </span>
        </Menu.Item>
        <Menu.Item key="addDept">
          <span>
            <FM id="org.dept.addsubdept" />
          </span>
        </Menu.Item>

        {(dept.id !== dept.parentId && (
          <Menu.Item key="deleteDept">
            <span>
              <FM id="dict.delete" />
            </span>
          </Menu.Item>
        )) ||
          null}
      </Menu>
    );
  };
  const getDeptTitle = (data: Department) => (
    <div className={styles.deptWrapper}>
      <div>
        <span>{data.name}</span>
      </div>
      <Dropdown overlay={getDeptSettingMenu(data)}>
        <MoreOutlined className={styles.moreButton} />
      </Dropdown>
    </div>
  );
  const generateTreeData = (rawData = depts): TreeProps['treeData'] =>
    rawData.map((item) => ({
      key: item.id,
      title: getDeptTitle(item),
      children: item.hasChild ? generateTreeData(item.childrens) : undefined,
    })) ?? [];
  const orgKey = currentOrgId ? [currentOrgId] : undefined;
  const selectedOrgKey = currentOrgId === currentDeptId ? orgKey : undefined;

  return (
    <div className={styles.container}>
      <Menu selectedKeys={selectedOrgKey} mode="inline">
        <Menu.Item
          key={currentOrgId || undefined}
          onClick={() => {
            history.push('/org/:orgId/dept/:deptId', { orgId: currentOrgId, deptId: currentOrgId });
          }}
        >
          <span className={styles.item}>
            <FM id="org.member.all" />
          </span>
        </Menu.Item>

        <Menu.Item key="orgConst">
          <span className={styles.item}>
            <FM id="org.name" />
          </span>
        </Menu.Item>
      </Menu>

      {depts.length > 0 ? (
        <Tree
          defaultExpandAll
          selectedKeys={currentDeptId ? [currentDeptId] : undefined}
          onSelect={(selectedKeys) => {
            if (selectedKeys.length === 0) {
              return;
            }
            history.replace('/org/:orgId/dept/:deptId', {
              orgId: currentOrgId,
              deptId: first(selectedKeys),
            });
          }}
          blockNode
          treeData={generateTreeData()}
        />
      ) : null}
      <Modal
        title={<FM id="org.dept.editname" />}
        visible={deptNameMdlVisible}
        confirmLoading={updateDeptLoading}
        zIndex={1100}
        onOk={() => {
          deptNameForm.submit();
        }}
        onCancel={() => setDeptNameMdlVisible(false)}
      >
        <Form form={deptNameForm} onFinish={handleUpdateDeptName}>
          <Form.Item
            label={<FM id="org.dept.name" />}
            name="name"
            rules={[
              {
                required: true,
                max: 20,
                min: 2,
                message: intl.formatMessage({ id: 'org.dept.name.validation' }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'org.dept.add.ph' })} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={<FM id="org.dept.add" />}
        visible={addDeptMdlVisible}
        zIndex={1100}
        confirmLoading={createDeptLoading}
        onOk={() => {
          appendSubDept.submit();
        }}
        onCancel={() => setAddDeptMdlVisible(false)}
      >
        <Form form={appendSubDept} onFinish={handleAddDept}>
          <Form.Item
            label={<FM id="org.dept.name" />}
            name="name"
            rules={[
              {
                required: true,
                max: 20,
                min: 2,
                message: intl.formatMessage({ id: 'org.dept.name.validation' }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'org.dept.add.ph' })} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        className={styles.deleteModal}
        visible={deleteDeptMdlVisible}
        onOk={handleDeleteDept}
        okText={
          <span>
            <FM id="dict.confirm" />
          </span>
        }
        confirmLoading={deleteDeptLoading}
        okButtonProps={{
          danger: true,
          disabled: !confirmChecked,
        }}
        onCancel={() => {
          setDeleteDeptMdlVisible(false);
          setDeleteDepartmentId(null);
        }}
      >
        <div className={styles.deleteContent}>
          <h2>
            <FM id="org.dept.delete.head" />
          </h2>
          <p>
            <FM id="org.dept.delete.first-line" />
          </p>
          <ul>
            <li className={styles.queryItem}>
              <FM id="org.dept.delete.content1" />
            </li>
            <li className={styles.queryItem}>
              <FM id="org.dept.delete.content2" />
            </li>
          </ul>

          <div style={{ marginTop: 10 }}>
            <Checkbox
              checked={confirmChecked}
              onChange={(e) => {
                setConfirmChecked(e.target.checked);
              }}
            >
              <FM id="org.dissolve.confirm.checkbox" />
            </Checkbox>
          </div>
        </div>
      </Modal>
      <TreeSelectModal
        multiple
        visible={selectMemberMdlVisible}
        title={<FM id="org.dept.setmgmt" />}
        tabName={<FM id="org.member.name" />}
        treeDataSource={hoverDeptMembers.filter((member) => member.isAcceptInvited)}
        onConfirm={(keys) => handleSetDeptManager(keys)}
        defaultSelectedKeys={hoverDeptMembers
          .filter((member) => member.isManager)
          .map((member) => member.id)}
        onCancel={() => setSelectMemberMdlVisible(false)}
      />
    </div>
  );
};

export default DepartmentTree;
