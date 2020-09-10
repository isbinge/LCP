import React, { useState } from 'react';
import { Layout, Button } from 'antd';
import { useSelector } from 'dva';
import { FormattedMessage as FM } from 'react-intl';

import NavigationBar from '@comp/NavigationBar';
import DepartmentTree from './DepartmentMgmt';
import InviteMemberModal from './components/InviteMemberModal';

import styles from './index.scss';

const { Sider, Content } = Layout;

const Organization: React.FC = ({ children }) => {
  const [{ userId }] = useSelector(({ account }) => [account]);
  const [isOpenMemberModal, setOpenMemberModal] = useState(false);

  return (
    <Layout className={styles.container}>
      <NavigationBar
        hideLogo
        showGoBack
        left={
          <span style={{ padding: '5px 10px' }}>
            <FM id="org.name" />
          </span>
        }
      />
      <Layout className={styles.content}>
        <Sider width={240} collapsedWidth={0} className={styles.leftSide}>
          <div className={styles.buttonBar}>
            <Button type="primary" block onClick={() => setOpenMemberModal(true)}>
              <FM id="org.member.invite" />
            </Button>
          </div>
          <DepartmentTree userId={userId!} />
        </Sider>
        <Layout>
          <Content className={styles.rightSide}>{children}</Content>
        </Layout>
      </Layout>
      <InviteMemberModal visible={isOpenMemberModal} onCancel={() => setOpenMemberModal(false)} />
    </Layout>
  );
};

export default Organization;
