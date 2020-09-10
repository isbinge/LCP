import React, { useState, ReactNode } from 'react';
import { Button, Space, Card, Tabs } from 'antd';
import queryString from 'query-string';
import { FormattedMessage as FM } from 'react-intl';
import { useLocation, useDispatch, useHistory, useSelector } from 'dva';

import LcpLogo from '@/assets/lcp_logo.svg';
import LcpConst from '@/constants';
import styles from './index.scss';

function Acception() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [tabKey, setTabKey] = useState('invitation');
  const acceptLoading = useSelector(
    ({ loading }) => loading.effects['organization/acceptInvitation'],
  );

  const { token, user, org, email } = queryString.parse(search);

  const handleAccept = (isAccepted: boolean) => {
    dispatch({
      type: 'organization/acceptInvitation',
      payload: {
        email,
        token,
        accept: Number(!!isAccepted),
      },
    })
      .then(() => {
        setTabKey('accepted');
      })
      .catch(() => {
        setTabKey('broken');
      });
  };

  const Result: React.FC<{ title: ReactNode }> = ({ title }) => (
    <>
      <h2>{title}</h2>
      <div className={styles.btnGroup}>
        <Button
          onClick={() => {
            history.replace('/home');
          }}
          type="default"
          size="large"
        >
          <FM id="invitation.back" />
        </Button>
      </div>
    </>
  );

  return (
    <div className={styles.container}>
      <Space size="middle">
        <Card style={{ width: 500 }}>
          <img src={LcpLogo} alt="lcp-logo" style={{ width: 60, height: 60 }} />
          <Tabs defaultActiveKey="invitation" activeKey={tabKey} renderTabBar={() => <div />}>
            <Tabs.TabPane key="invitation">
              <h2>
                <FM id="invitation.desc" values={{ inviter: user, org: <strong>{org}</strong> }} />
              </h2>
              <div className={styles.btnGroup}>
                <Button
                  disabled={accepted === false}
                  loading={accepted === true && acceptLoading}
                  onClick={() => {
                    setAccepted(true);
                    handleAccept(true);
                  }}
                  type="primary"
                  size="large"
                >
                  <FM id="invitation.accept" />
                </Button>
                <Button
                  disabled={accepted === true}
                  loading={accepted === false && acceptLoading}
                  onClick={() => {
                    setAccepted(false);
                    handleAccept(false);
                  }}
                  type="default"
                  size="large"
                >
                  <FM id="invitation.refuse" />
                </Button>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane key="accepted">
              <Result title={<FM id="invitation.accepted" values={{ org }} />} />
            </Tabs.TabPane>
            <Tabs.TabPane key="broken">
              <Result title={<FM id="invitation.expired" />} />
            </Tabs.TabPane>
          </Tabs>
          <div className={styles.footer}>
            <span>If you need any help, please contact us </span>
            <a href={`mailto:${LcpConst.SUPPORT_EMAIL}`}>{LcpConst.SUPPORT_EMAIL}</a>
          </div>
        </Card>
      </Space>
    </div>
  );
}

export default Acception;
