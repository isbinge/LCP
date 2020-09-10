import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'dva';
import { FormattedMessage as FM } from 'react-intl';
import { message } from 'antd';

import { RoleMember } from '@/domain/role/data';
import LoadingWave from '@comp/LoadingWave';
import TitleBarWithBlueLine from '@comp/TitleBarWithBlueLine';
import { msgIntl } from '@comp/i18n/MessageIntl';
import { Member } from '@/domain/organization/data';

import { RoleComponentType } from '..';
import MemberModal from '../components/MemberModal';
import Card from '../components/Card';

import styles from './index.scss';

const SystemAdmin: React.FC<RoleComponentType> = ({ role }) => {
  const { roleId } = role;
  const [members, setMembers] = useState<RoleMember[]>([]);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector(({ account: login }) => login.userId);
  const getRoleMembersLoading = useSelector(
    ({ loading }) => loading.effects['role/getRoleMembers'],
  );

  const handleDelete = (deleteMemberId: string) => {
    dispatch<{ members: RoleMember[] }>({
      type: 'role/deleteRoleMember',
      payload: { id: roleId, currentUserId: userId, memberId: deleteMemberId },
    })
      .then(({ members: membersDto }) => {
        if (membersDto) {
          setMembers(membersDto);
        }
      })
      .catch((e) => msgIntl.error({ content: e }));
  };

  useEffect(() => {
    if (roleId) {
      dispatch<{ members: RoleMember[] }>({
        type: 'role/getRoleMembers',
        payload: { id: roleId, start: 0, length: 0 },
      })
        .then((res) => {
          if (res) {
            setMembers(res.members);
          }
        })
        .catch((e) => {
          msgIntl.error({ content: e });
        });
    }
  }, [roleId]);

  const handleOk = (selectedMembers: Member[]) => {
    const memberIds = selectedMembers.map((member) => member.id);
    dispatch<{ members: RoleMember[] }>({
      type: 'role/updateRoleMembers',
      payload: {
        id: roleId,
        currentUserId: userId,
        memberIds,
      },
    })
      .then((res) => {
        if (res) {
          setMembers(res.members);
        }
        setVisible(false);
      })
      .catch((e) => message.error({ content: e }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FM id="role.auth.setting" />
      </div>
      <div className={styles.des}>
        <FM id="role.system.des" />
      </div>
      <LoadingWave msgAnimated loading={getRoleMembersLoading}>
        <div className={styles.body}>
          <TitleBarWithBlueLine
            title={<FM id="role.system.member.mgmt" />}
            style={{ marginBottom: 24 }}
          />
          <div className={styles.membersContainer}>
            {members?.map((item) => (
              // <UserCard key={item.id} {...item} onDelete={handleDelete} />
              <Card
                key={item.id}
                user={{
                  id: item.id,
                  profilePhotoUrl: item.profilePhotoUrl,
                  name: item.name,
                  deptName: item.parentNames,
                }}
                onDelete={handleDelete}
              />
            ))}
            <Card
              onClick={() => setVisible(true)}
              text={
                <span>
                  + <FM id="role.system.member.add" />
                </span>
              }
            />
          </div>
        </div>
      </LoadingWave>
      <MemberModal
        visible={visible}
        onCancel={() => setVisible(false)}
        selectedMembers={members}
        onOk={handleOk}
      />
    </div>
  );
};
export default SystemAdmin;
