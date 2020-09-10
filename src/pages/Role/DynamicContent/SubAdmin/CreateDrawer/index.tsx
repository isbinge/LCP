import React, { useState, useEffect } from 'react';
import { Drawer, Button, Input, Modal, message } from 'antd';
import {
  LeftOutlined,
  SmileFilled,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { v1 as uuidv1 } from 'uuid';

import { Member } from '@/domain/organization/data';
import TitleBarWithBlueLine from '@comp/TitleBarWithBlueLine';
import { AppList, AppListItem } from '@/domain/app/data.d';
import { useDispatch, useSelector } from 'dva';
import { GetSubAdminReturn } from '@/domain/role/data.d';
import Card from '../../components/Card';
import MemberModal from '../../components/MemberModal';
import AppModal from './components/AppModal';

import styles from './index.scss';

const { confirm } = Modal;

interface CreateDrawer {
  visible: boolean;
  onClose: () => void;
  roleId: string;
  subAdminRoleId?: string;
  fetchData: () => void;
  subAdmin?: GetSubAdminReturn;
  //   memberIds: string[];
  //   appIds: string[];
}

interface AppShowCardProps {
  app: AppListItem;
  onDelete: (appId: string) => void;
}

const AppShowCard: React.FC<AppShowCardProps> = ({ app, onDelete }) => {
  const intl = useIntl();
  return (
    <div className={styles.userCardContainer}>
      {app.iconCss || (
        <div className={styles.icon} style={{ background: '#107fff' }}>
          <SmileFilled style={{ color: 'white' }} />
        </div>
      )}
      <span className={styles.text}>{app.name}</span>
      <div
        className={styles.remove}
        onClick={() =>
          confirm({
            title: intl.formatMessage({ id: 'role.sub.drawer.remove.title' }),
            icon: <ExclamationCircleOutlined />,
            content: intl.formatMessage({ id: 'role.sub.drawer.remove.content' }),
            okText: intl.formatMessage({ id: 'role.common.remove.oktext' }),
            cancelText: intl.formatMessage({ id: 'role.common.remove.canceltext' }),
            onOk() {
              if (onDelete) {
                onDelete(app.id);
              }
            },
            onCancel() {},
          })
        }
      >
        <DeleteOutlined className={styles.removeIcom} style={{ color: '#fff' }} />
      </div>
    </div>
  );
};

const CreateDrawer: React.FC<CreateDrawer> = (props) => {
  const { onClose, visible, roleId, subAdminRoleId, fetchData, subAdmin } = props;
  const intl = useIntl();
  const dispatch = useDispatch();
  const [memberVisible, setMemberVisible] = useState(false);
  const [appVisible, setAppVisible] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [apps, setApps] = useState<AppList>([]);
  const [remarks, setRemarks] = useState<string>('');
  const { userId } = useSelector(({ account }) => account);
  const isSaveLoading = useSelector(({ loading }) => loading.effects['role/createSubAdmin']);
  const isUpdateLoading = useSelector(({ loading }) => loading.effects['role/updateSubAdmin']);

  const handleMembersDelete = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };
  const handleAppDelete = (id: string) => {
    setApps(apps.filter((app) => app.id !== id));
  };
  const handleSave = () => {
    if (subAdminRoleId) {
      dispatch({
        type: 'role/updateSubAdmin',
        payload: {
          subAdminRoleId,
          id: roleId,
          currentUserId: userId,
          remarks,
          userIds: members.map((m) => m.id),
          appIds: apps.map((app) => app.id),
        },
      })
        .then(() => {
          message.success({ content: 'update success' });
          fetchData();
          onClose();
        })
        .catch(() => {
          message.error({ content: 'update failed', key: 'error' });
        });
    } else {
      dispatch({
        type: 'role/createSubAdmin',
        payload: {
          id: roleId,
          subAdminRoleId: uuidv1(),
          currentUserId: userId,
          remarks,
          userIds: members.map((m) => m.id),
          appIds: apps.map((app) => app.id),
        },
      })
        .then(() => {
          message.success({ content: 'save success' });
          fetchData();
          onClose();
        })
        .catch(() => {
          message.error({ content: 'save failed', key: 'error' });
        });
    }
  };

  useEffect(() => {
    if (!visible) {
      setMembers([]);
      setApps([]);
      // setRemarks('');
    } else {
      setRemarks(subAdmin?.remarks || '');
    }
  }, [visible]);

  return (
    <Drawer
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
      getContainer={false}
      style={{ position: 'absolute' }}
      maskStyle={{ background: '#ffffff00' }}
      bodyStyle={{ padding: 0 }}
      width="100%"
    >
      <div className={styles.container}>
        <div className={styles.header} style={{ marginBottom: 24 }}>
          <span className={styles.goBack} onClick={onClose}>
            <LeftOutlined /> <FM id="dict.back" />
          </span>
          <Button
            type="primary"
            loading={isSaveLoading || isUpdateLoading}
            className={styles.button}
            disabled={members.length === 0 || apps.length === 0}
            onClick={handleSave}
          >
            <span>
              <FM id="dict.save" />
            </span>
          </Button>
        </div>
        <div className={styles.body} style={{ marginBottom: 24 }}>
          <TitleBarWithBlueLine title={<FM id="role.sub.drawer.app" />} />
          <div className={styles.membersContainer}>
            {apps.map((app) => (
              <AppShowCard key={app.id} app={app} onDelete={handleAppDelete} />
            ))}
            <Card text={<FM id="role.sub.drawer.app.add" />} onClick={() => setAppVisible(true)} />
          </div>
        </div>

        <div className={styles.body} style={{ marginBottom: 24 }}>
          <TitleBarWithBlueLine title={<FM id="role.system.member.mgmt" />} />
          <div className={styles.membersContainer}>
            {members.map((item) => (
              <Card
                key={item.id}
                user={{
                  id: item.id,
                  profilePhotoUrl: '',
                  name: item.name || '',
                  deptName: item.parentName || '',
                }}
                onDelete={handleMembersDelete}
              />
            ))}
            <Card
              text={
                <span>
                  + <FM id="role.system.member.add" />
                </span>
              }
              onClick={() => setMemberVisible(true)}
            />
          </div>
        </div>
        <div className={styles.body} style={{ marginBottom: 24 }}>
          <TitleBarWithBlueLine title={<FM id="role.sub.remark" />} />
          <Input.TextArea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder={intl.formatMessage({ id: 'role.sub.drawer.remark.ph' })}
          />
        </div>
      </div>
      <MemberModal
        visible={memberVisible}
        onCancel={() => setMemberVisible(false)}
        selectedMembers={members}
        onOk={(users) => {
          setMembers(users);
          setMemberVisible(false);
        }}
      />
      <AppModal
        onOk={(appList) => {
          setApps(appList);
          setAppVisible(false);
        }}
        selectedApps={apps}
        visible={appVisible}
        onCancel={() => setAppVisible(false)}
      />
    </Drawer>
  );
};

export default CreateDrawer;
