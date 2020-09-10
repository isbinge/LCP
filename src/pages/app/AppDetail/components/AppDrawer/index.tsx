import React, { useState, useEffect } from 'react';
import { Drawer } from 'antd';
import { v1 as uuidv1 } from 'uuid';
import { LinkR, useHistoryR } from '@lib/react-router-dom';
import { FormattedMessage as FM } from 'react-intl';
import { useDispatch, useSelector } from 'dva';

import PlusSquareDashed from '@comp/icons/PlusSquareDashed';
import AppCreateCommon from '@comp/AppShelf/AppCreateCommon';
import { AppShelfButton } from '@comp/AppShelf';
import AppTemplateSelect from '@comp/AppShelf/AppTemplateSelect';
import LoadingWave from '@comp/LoadingWave';

import styles from './index.scss';

interface AppDrawerProps {
  onClose: () => void;
  visible: boolean;
}
/**
 * 应用详情 - 左侧抽屉
 */
const AppDrawer: React.FC<AppDrawerProps> = ({ onClose: handleClose, visible }) => {
  const dispatch = useDispatch();
  const history = useHistoryR();
  const [showCommonAppCreate, setShowCommonAppCreate] = useState(false);
  const [showAppCreate, setShowAppCreate] = useState(false);
  const [apps, loadingApps, { defaultOrgId, userId }] = useSelector(({ app, loading, account }) => [
    app.apps,
    loading.effects['app/getAppList'],
    account,
  ]);

  useEffect(() => {
    dispatch({ type: 'app/getAppList' });
  }, []);

  return (
    <Drawer
      placement="left"
      closable={false}
      onClose={handleClose}
      visible={visible}
      getContainer={false}
      bodyStyle={{ padding: 16 }}
      width={275}
      maskStyle={{ background: '#ffffff00' }}
      style={{ position: 'absolute' }}
      className={styles.drawer}
      footer={
        <div
          className={styles.bottomBar}
          onClick={() => {
            handleClose();
            setShowAppCreate(true);
          }}
        >
          <PlusSquareDashed />
          <span style={{ marginLeft: 8 }}>
            <FM id="app.common.create" />
          </span>
        </div>
      }
    >
      <LoadingWave loading={loadingApps} size="small" message="Loading apps" msgAnimated>
        {apps
          .slice()
          .reverse()
          .map((app) => (
            <div key={app.id} style={{ marginTop: 5 }}>
              <LinkR to="/app/:appId" values={{ appId: app.id }}>
                <AppShelfButton name={app.name} nameStyle={{ maxWidth: 200 }} />
              </LinkR>
            </div>
          ))}
        <AppTemplateSelect
          visible={showAppCreate}
          onOk={(_, i) => {
            if (i === 0) {
              setShowCommonAppCreate(true);
            }
            setShowAppCreate(false);
          }}
          onCancel={() => setShowAppCreate(false)}
        />
        <AppCreateCommon
          visible={showCommonAppCreate}
          onCancel={() => setShowCommonAppCreate(false)}
          onOk={async (appName) => {
            const id = uuidv1();
            await dispatch({
              type: 'app/createApp',
              payload: {
                id,
                name: appName,
                iconCss: '',
                companyId: defaultOrgId,
                currentUserId: userId,
              },
            });
            setShowCommonAppCreate(false);
            history.push('/app/:appId', { appId: id });
          }}
        />
      </LoadingWave>
    </Drawer>
  );
};

export default AppDrawer;
