import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
import { LinkR, useHistoryR } from '@lib/react-router-dom';
import { getAuthV1FromLocal } from '@/utils/authentication';
import { useDispatch } from 'dva';

import SelectLang from '@comp/i18n/SelectLang';
import Register from './components/Register';
import Login from './components/Login';

import styles from './index.scss';

export type LoginStatus =
  | 'initial'
  | 'login'
  | 'signup'
  | 'reset-passwd-verify'
  | 'reset-passwd-set-new';

const Landing = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [status, setStatus] = useState<LoginStatus>('initial');
  const history = useHistoryR();
  const [rendered, setRendered] = useState(false);
  const [unhealthy, setUnhealthy] = useState(false);

  useEffect(() => {
    const auth = getAuthV1FromLocal();
    dispatch({ type: 'global/healthCheck' }).then((isHealthy) => {
      if (!isHealthy) {
        setUnhealthy(true);
        setRendered(true);
      } else if (auth) {
        dispatch({ type: 'account/redeemToken' })
          .then(() => {
            history.replace('/home');
          })
          .catch(() => {
            setRendered(true);
          });
      } else {
        setRendered(true);
      }
    });
  }, []);

  return rendered ? (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <LinkR to="/" className={styles.logo}>
          <span>Enterprise-level Low-Code Platform</span>
        </LinkR>
        <div style={{ flex: 1 }} />
        <SelectLang iconStyle={{ color: '#ffffffaa', fontSize: 16 }} />
      </div>
      <div className={styles.content}>
        <div className={styles.sloganContainer}>
          <div className={styles.sloganLine1}>You don&apos;t have to see the whole staircase,</div>
          <div className={styles.sloganLine2}>just take the first step.</div>
          <div className={styles.desc}>The next generation of corporation informatization</div>
        </div>
        <Register
          email={form.getFieldValue('email')}
          visible={showSignupModal}
          setVisible={setShowSignupModal}
          setStatus={setStatus}
        />
        {unhealthy ? (
          <div style={{ position: 'relative', textAlign: 'center', padding: 24, fontSize: 24 }}>
            <p>LCP Service is not available for now</p>
            <p>please try again later :/</p>
          </div>
        ) : (
          <Login
            form={form}
            setVisible={setShowSignupModal}
            status={status}
            setStatus={setStatus}
          />
        )}
      </div>
    </div>
  ) : null;
};

export default Landing;
