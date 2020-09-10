import { Avatar, Popover, Card, Modal, Checkbox } from 'antd';
import {
  MoreOutlined,
  ClusterOutlined,
  UserOutlined,
  LockOutlined,
  SwapOutlined,
  PlusOutlined,
  ExportOutlined,
  DeleteFilled,
  LoadingOutlined,
  UsergroupDeleteOutlined,
} from '@ant-design/icons';
import React, { useState, useMemo, CSSProperties, useEffect } from 'react';
import { useSelector, useDispatch, useHistory } from 'dva';
import { FormattedMessage as FM } from 'react-intl';

import { LinkR } from '@lib/react-router-dom';
import CreateOrgModal from '@comp/CreateOrgModal';
import { getNicknameCapital } from '@/utils/text';
import OrgList from './OrgList';

import styles from './index.scss';
import './index.global.scss';

interface CreateOrgBtnProps {
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
}

const CreateOrgBtn = (props: CreateOrgBtnProps) => (
  <div {...props}>
    <PlusOutlined style={{ marginRight: 8 }} />
    <span>
      <FM id="org.create" />
    </span>
  </div>
);

const UserProfilePopover: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [
    getOrgLoading,
    deleteOrgLoading,
    orgName,
    { defaultOrgId, nickname },
  ] = useSelector(({ loading, organization, account }) => [
    loading.effects['organization/getOrg'],
    loading.effects['organization/deleteOrg'],
    organization.orgName,
    account,
  ]);
  const nameCapital = getNicknameCapital(nickname);
  const [showProfilePopover, setShowProfilePopover] = useState(false);
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const [showSwitchOrgModal, setShowSwitchOrgModal] = useState(false);
  const [showDissolveOrgModal, setShowDissolveOrgModal] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);

  useEffect(() => {
    if (!orgName) {
      dispatch({
        type: 'organization/getOrg',
      });
    }
  }, []);

  const handleCreateOrg = () => setShowCreateOrgModal(true);
  const cancelCreateOrg = () => setShowCreateOrgModal(false);

  const cates = useMemo(
    () => [
      {
        key: 'Organization',
        jump: {
          to: '/org/:orgId/dept/:deptId',
          values: {
            orgId: defaultOrgId,
            deptId: defaultOrgId,
          },
        },
        icon: <ClusterOutlined />,
        title: <FM id="org.name" />,
        visible: ['hasOrg'],
      },
      {
        key: 'Authority',
        jump: {
          to: '/role/:orgId',
          values: {
            orgId: defaultOrgId,
          },
        },
        icon: <LockOutlined />,
        title: <FM id="role.auth.mgmt" />,
        visible: ['hasOrg'],
      },
      {
        key: 'Switch among orgs',
        onClick: () => setShowSwitchOrgModal(true),
        icon: <SwapOutlined />,
        title: <FM id="org.switch" />,
        visible: ['hasOrg'],
      },
      {
        key: 'Dissolve current organization',
        onClick: () => setShowDissolveOrgModal(true),
        icon: <UsergroupDeleteOutlined />,
        title: <FM id="org.dissolve" />,
        visible: ['hasOrg'],
        isDanger: true,
      },
      {
        key: 'My profile',
        icon: <UserOutlined />,
        title: <FM id="profile.center" />,
        visible: ['always'],
      },
      {
        key: 'Delete account',
        onClick: () => dispatch({ type: 'account/delete' }),
        icon: <DeleteFilled />,
        title: <FM id="profile.delete-account" />,
        visible: ['always'],
        isDanger: true,
      },
      {
        key: 'Logout',
        onClick: () => dispatch({ type: 'account/logout' }),
        icon: <ExportOutlined />,
        title: <FM id="profile.logout" />,
        visible: ['always'],
      },
    ],
    [defaultOrgId],
  );

  const categories = useMemo(() => {
    return cates.filter((cate) => {
      if (cate.visible.includes('always') || (defaultOrgId && cate.visible.includes('hasOrg'))) {
        return true;
      }
      return false;
    });
  }, [cates, defaultOrgId]);

  const content = (
    <Card
      style={{ width: 300 }}
      id="categories"
      title={
        defaultOrgId ? (
          <div className={styles.orgName}>{getOrgLoading ? <LoadingOutlined /> : orgName}</div>
        ) : (
          <CreateOrgBtn
            style={{ marginLeft: 10 }}
            className={styles.createOrg}
            onClick={handleCreateOrg}
          />
        )
      }
    >
      <ul className={styles.entrylist}>
        {categories.map((cate) => {
          const categoryContent = (
            <div className={styles.entryBtn} data-is-danger={cate.isDanger}>
              <div className={styles.entryIcon}>{cate.icon}</div>
              <div className={styles.entryTitle}>{cate.title}</div>
            </div>
          );
          const wrapperContent = cate.jump ? (
            <LinkR to={cate.jump.to} values={cate.jump.values}>
              {categoryContent}
            </LinkR>
          ) : (
            <div onClick={cate.onClick}>{categoryContent}</div>
          );
          return <li key={cate.key}>{wrapperContent}</li>;
        })}
      </ul>
    </Card>
  );
  return (
    <div>
      <Popover
        content={content}
        visible={showProfilePopover}
        onVisibleChange={(visible) => {
          if (showDissolveOrgModal || showSwitchOrgModal || showCreateOrgModal) {
            return;
          }
          setShowProfilePopover(visible);
        }}
        trigger={['click']}
        getPopupContainer={(parentNode) => parentNode}
        arrowPointAtCenter={false}
        overlayClassName="setting"
        placement="topRight"
      >
        <div className={styles.wrapper}>
          <Avatar icon={nameCapital ? null : <UserOutlined />} className={styles.avatar}>
            {nameCapital}
          </Avatar>
          <MoreOutlined style={{ fontSize: 20, color: '#777' }} />
        </div>
      </Popover>
      <CreateOrgModal visible={showCreateOrgModal} onCancel={cancelCreateOrg} />
      <Modal
        title={<FM id="org.switch" />}
        visible={showSwitchOrgModal}
        getContainer={document.getElementById('categories')}
        onCancel={() => setShowSwitchOrgModal(false)}
        footer={null}
      >
        <OrgList setVisible={setShowSwitchOrgModal} handleCreate={handleCreateOrg} />
      </Modal>
      <Modal
        visible={showDissolveOrgModal}
        onOk={() => {
          dispatch({
            type: 'organization/deleteOrg',
          }).then(() => {
            setShowDissolveOrgModal(false);
            history.push('/questionnaire');
          });
        }}
        okText={
          <span>
            <FM id="dict.confirm" />
          </span>
        }
        confirmLoading={deleteOrgLoading}
        okButtonProps={{
          danger: true,
          disabled: !confirmChecked,
        }}
        onCancel={() => {
          setShowDissolveOrgModal(false);
        }}
      >
        <div className={styles.dissolveContent}>
          <h2>
            <FM id="org.dissolve.confirm" />
          </h2>
          <p>
            <FM
              id="org.dissolve.confirm.statement1"
              values={{
                b: (chunks: string) => <b>{chunks}</b>,
              }}
            />
          </p>
          <ul>
            <li>
              <FM id="org.dissolve.confirm.statement2" />
            </li>
            <li>
              <FM id="org.dissolve.confirm.statement3" />
            </li>
          </ul>
          <Checkbox
            style={{ marginTop: 12 }}
            checked={confirmChecked}
            onChange={(e) => setConfirmChecked(e.target.checked)}
          >
            <FM id="org.dissolve.confirm.checkbox" />
          </Checkbox>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfilePopover;
