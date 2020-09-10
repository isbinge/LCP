import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Card, Empty } from 'antd';

import NavigationBar from '@comp/NavigationBar';
import AppShelf from '@comp/AppShelf';
import LoadingWave from '@comp/LoadingWave';
import { useLogger } from '@/utils/hooks/use-logger';
import CreateBlankCompany from '@/assets/home/create-company.svg';
import JoinBlankCompany from '@/assets/home/join-company.svg';

const BuildInfo = lazy(() => import('@comp/BuildInfo'));
const BlankCardGroup = lazy(() => import('@comp/BlankCardGroup'));
const CreateOrgModal = lazy(() => import('@comp/CreateOrgModal'));

const homePagePlaceholder = (
  <div style={{ display: 'flex', flex: 1, width: '100%', flexDirection: 'column' }}>
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        margin: '16px auto 32px auto',
        width: '1200px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Card title="My workflows" style={{ flex: 4 }}>
          <Empty description="Coming soon..." />
        </Card>
        <Card title="Notifications" style={{ marginLeft: 16, flex: 3 }}>
          <Empty description="Coming soon..." />
        </Card>
      </div>
      <Card
        style={{
          marginTop: 16,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Empty style={{ flex: 1 }} description="Coming soon..." />
      </Card>
    </div>
  </div>
);

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const log = useLogger('home');
  const [orgVisible, setOrgVisible] = useState(false);
  const [appList, { defaultOrgId }, isAppListLoading] = useSelector(({ app, account, loading }) => [
    app.apps,
    account,
    loading.effects['app/getAppList'],
  ]);

  const companyElements = [
    {
      title: 'Create a organization',
      image: CreateBlankCompany,
      desc: 'Create a organization of your own.',
      onClick: () => {
        log('Create a organization');
        setOrgVisible(true);
      },
    },
    {
      title: 'Join a organization',
      image: JoinBlankCompany,
      desc: 'Join your organization.',
      disabled: true,
      onClick: () => {
        log('Join a organization');
      },
    },
  ];

  useEffect(() => {
    log('fetching app list');
    dispatch({ type: 'app/getAppList' });
  }, []);

  return (
    <div id="app">
      <NavigationBar showSelectLang />
      {defaultOrgId ? (
        <>
          <AppShelf data={appList} loading={isAppListLoading} />
          {homePagePlaceholder}
        </>
      ) : (
        <Suspense fallback={<LoadingWave />}>
          <BlankCardGroup elements={companyElements} />
          <CreateOrgModal visible={orgVisible} onCancel={() => setOrgVisible(false)} />
        </Suspense>
      )}
      {$$BUILD_INFO && <BuildInfo />}
    </div>
  );
};

export default Home;
