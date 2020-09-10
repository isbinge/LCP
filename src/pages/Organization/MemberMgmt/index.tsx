import React, { useEffect, useState, Key, useMemo } from 'react';
import { useDispatch, useSelector, useParams } from 'dva';
import { Divider, Button, Input, Table, Modal, Space, Tag } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { FormattedMessage as FM, useIntl } from 'react-intl';

import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Member } from '@/domain/organization/data.d';
import { flattenData } from '@/domain/organization/utils';
import TreeSelectModal from '@/pages/Organization/components/TreeSelectModal';
import { msgIntl } from '@comp/i18n/MessageIntl';

import CustomTag from '../components/CustomTag';
import UpdateMemberModal from '../components/UpdateMemberModal';

import styles from './index.scss';

const { confirm } = Modal;

let inviteMemberId = '';

const MemberMgmt: React.FC = () => {
  const dispatch: Dva.Dispatch = useDispatch();
  const intl = useIntl();
  const { deptId: currentDeptId } = useParams();
  const [
    { depts, members },
    { defaultOrgId: currentOrgId },
    requestMembersLoading,
    adjustDeptLoading,
    inviteMembersAgainLoading,
  ] = useSelector(({ organization, account, loading }) => [
    organization,
    account,
    loading.effects['organization/requestMembers'],
    loading.effects['organization/adjustDept'],
    loading.effects['organization/inviteMemberAgain'],
  ]);
  const [searchName, setSearchName] = useState('');
  const [currentMember, setCurrentMember] = useState<Nullable<Member>>(null);
  const [selectedMemberKeys, setSelectedMemberKeys] = useState<string[]>([]);
  const [updateMemberMdlVisible, setUpdateMemberMdlVisible] = useState(false);
  const [adjustDeptMdlVisible, setAdjustDeptMdlVisible] = useState(false);

  const currentDept = useMemo(() => flattenData(depts).find((dept) => dept.id === currentDeptId), [
    depts,
    currentDeptId,
  ]);

  useEffect(() => {
    setSelectedMemberKeys([]);
    dispatch({
      type: 'organization/requestMembers',
      payload: { deptId: currentDeptId },
    }).catch((e) => {
      msgIntl.error({ content: e });
    });
  }, [currentDeptId]);

  const openMemberEditor = (value: Member) => {
    setCurrentMember(value);
    setUpdateMemberMdlVisible(true);
  };

  const fetchMembers = (page: number = 1, length: number = 0) => {
    const start = (page - 1) * length;
    dispatch({
      type: 'organization/requestMembers',
      payload: { deptId: currentDeptId || currentOrgId, length, start },
    }).catch((e) => {
      msgIntl.error({ content: e });
    });
  };
  const handleSearchMembers = (name: string) => {
    setSearchName(name);
  };
  const handleDeleteMembers = (deleteMemberKeys: string[]) => {
    dispatch({
      type: 'organization/deleteMembers',
      payload: {
        ids: deleteMemberKeys,
        id: currentDeptId,
      },
    })
      .then(() => {
        setSelectedMemberKeys(
          selectedMemberKeys.filter((memberKey) => !deleteMemberKeys.includes(memberKey)),
        );
      })
      .catch((e) => {
        msgIntl.error({ content: e });
      });
  };

  const handleAdjustDept = (deptIds: string[]) => {
    dispatch({
      type: 'organization/adjustDept',
      payload: { memberIds: selectedMemberKeys, deptIds },
    })
      .then(() => {
        setAdjustDeptMdlVisible(false);
        dispatch({
          type: 'organization/requestMembers',
          payload: { deptId: currentDeptId },
        });
      })
      .catch((e) => {
        msgIntl.error({ content: e });
      });
  };

  const handleInviteMembersAgain = (memberIds: string[]) => {
    dispatch({
      type: 'organization/inviteMemberAgain',
      payload: { memberIds },
    })
      .then(() => {
        dispatch({
          type: 'organization/requestMembers',
          payload: { deptId: currentDeptId },
        });
      })
      .catch((e) => {
        msgIntl.error({ content: e });
      });
  };
  const deleteWarning = () => {
    confirm({
      title: intl.formatMessage({ id: 'org.member.delete-confirm' }),
      icon: <ExclamationCircleOutlined />,
      okText: intl.formatMessage({ id: 'dict.yes-button' }),
      okButtonProps: { danger: true },
      cancelText: intl.formatMessage({ id: 'dict.cancel' }),
      onOk() {
        handleDeleteMembers(selectedMemberKeys);
      },
    });
  };

  const rowSelection = {
    selectedRowKeys: selectedMemberKeys,
    onChange: (selectedKeys: Key[]) => {
      setSelectedMemberKeys(selectedKeys as string[]);
    },
  };
  const hasSelected = selectedMemberKeys.length > 0;

  const filteredMembers = members.filter((member) => member.name?.includes(searchName));

  const unJoinedMembers = filteredMembers.filter((member) => !member.isAcceptInvited);
  const pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    total: filteredMembers.length,
    showTotal: (total: number) =>
      intl.formatMessage({ id: 'org.member.pagination.total' }, { count: total }),
    onChange: (page: number, pageSize?: number) => fetchMembers(page, pageSize),
    onShowSizeChange: (current: number, size: number) => fetchMembers(current, size),
  };
  const columns: ColumnProps<Member>[] = [
    {
      key: 'name',
      title: <FM id="org.common.name" />,
      dataIndex: 'name',
      align: 'center',
      render: (text, record) => (
        <div>
          <span>{text}</span>
          {record.isManager && (
            <Tag color="gold" className={styles.identityTag}>
              <FM id="org.dept.manager" />
            </Tag>
          )}
        </div>
      ),
    },
    // {
    //   key: 'mobile',
    //   title: <FM id="org.common.mobile" />,
    //   align: 'center',
    //   dataIndex: 'mobile',
    //   render: (mobile) => {
    //     return <span>{mobile || '--'}</span>;
    //   },
    // },
    {
      key: 'email',
      title: <FM id="dict.email" />,
      align: 'center',
      dataIndex: 'email',
    },
    {
      key: 'role',
      title: <FM id="role.name" />,
      align: 'center',
      dataIndex: 'roleNames',
      render: (roles) => {
        if (!roles) {
          return <span>--</span>;
        }
        return roles
          ?.split(';')
          .map((role: string) => (
            <CustomTag
              key={role}
              icon="user"
              visible={role !== null}
              title={role}
              color="#107fff"
            />
          ));
      },
    },
    {
      key: 'operation',
      title: <FM id="org.common.operation" />,
      align: 'center',
      dataIndex: 'operation',
      render: (_, member) => {
        return (
          <span>
            <a onClick={() => openMemberEditor(member)}>
              <FM id="dict.edit" />
            </a>
            <Divider type="vertical" style={{ display: 'none' }} />

            <a style={{ display: 'none' }}>Hand-off</a>
          </span>
        );
      },
    },
    {
      key: 'invite',
      title: null,
      align: 'center',
      dataIndex: 'isAcceptInvited',
      render: (isAcceptInvited, _member) => {
        return (
          <Button
            disabled={isAcceptInvited}
            loading={inviteMemberId === _member.id && inviteMembersAgainLoading}
            onClick={() => {
              inviteMemberId = _member.id;
              handleInviteMembersAgain([_member.id]);
            }}
            type="primary"
            size="small"
          >
            {isAcceptInvited ? <FM id="org.member.joined" /> : <FM id="org.member.invite-again" />}
          </Button>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{currentDept?.name || <FM id="org.member.all" />}</h3>
      <Divider />
      <div style={{ height: '30px', marginBottom: '10px' }}>
        <Button disabled={!hasSelected} onMouseUp={() => setAdjustDeptMdlVisible(true)}>
          <FM id="org.member.adjust-dept" />
        </Button>
        <Button disabled={!hasSelected} onMouseUp={deleteWarning} style={{ marginLeft: '10px' }}>
          <FM id="org.member.delete" />
        </Button>
        <Input
          prefix={<SearchOutlined />}
          placeholder={intl.formatMessage({ id: 'dict.search' })}
          onChange={(e) => {
            handleSearchMembers(e.target.value);
          }}
          className={styles.searchInput}
        />
      </div>
      {unJoinedMembers.length > 0 ? (
        <div className={styles.inviteAgain}>
          <Space>
            <span>
              <FM id="org.member.unJoined-members" values={{ count: unJoinedMembers.length }} />
            </span>
            <Button
              type="link"
              loading={inviteMemberId === 'all' && inviteMembersAgainLoading}
              onClick={() => {
                inviteMemberId = 'all';
                handleInviteMembersAgain(unJoinedMembers.map((member) => member.id));
              }}
            >
              <FM id="org.member.invite-all-again" />
            </Button>
          </Space>
        </div>
      ) : null}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredMembers}
        rowKey="id"
        loading={requestMembersLoading}
        pagination={pagination}
      />
      <UpdateMemberModal
        visible={updateMemberMdlVisible}
        onCancel={() => setUpdateMemberMdlVisible(false)}
        memberId={currentMember?.id || null}
        onDelete={handleDeleteMembers}
      />

      <TreeSelectModal
        multiple={false}
        tabName={<FM id="org.name" />}
        visible={adjustDeptMdlVisible}
        title={<FM id="org.dept.name" />}
        treeDataSource={depts}
        confirmLoading={adjustDeptLoading}
        onConfirm={(keys) => handleAdjustDept(keys)}
        onCancel={() => setAdjustDeptMdlVisible(false)}
      />
    </div>
  );
};

export default MemberMgmt;
