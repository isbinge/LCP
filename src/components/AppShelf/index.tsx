import React, { useState, ReactNode } from 'react';
import { Link, useHistoryR } from '@lib/react-router-dom';
import { SmileFilled } from '@ant-design/icons';
import { useDispatch, useSelector } from 'dva';
import { v1 as uuidv1 } from 'uuid';
import { FormattedMessage as FM } from 'react-intl';

import { AppList } from '@/domain/app/data.d';
import { msgIntl } from '@comp/i18n/MessageIntl';
import PlusSquareDashed from '../icons/PlusSquareDashed';

import AppButtonSkeleton from './AppButtonSkeleton';
import AppTemplateSelect from './AppTemplateSelect';
import AppCreateCommon from './AppCreateCommon';

import styles from './index.scss';

interface AppButtonProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  name?: ReactNode;
  icon?: ReactNode;
  iconStyle?: React.CSSProperties;
  nameStyle?: React.CSSProperties;
}

export const AppShelfButton: React.FC<AppButtonProps> = ({
  name,
  icon,
  iconStyle,
  nameStyle,
  ...props
}) => (
  <div className={styles.appButtonContainer} {...props}>
    {icon || (
      <div className={styles.icon} style={{ background: '#107fff', ...iconStyle }}>
        <SmileFilled style={{ color: 'white' }} />
      </div>
    )}
    <span className={styles.appName} style={nameStyle} title={name?.toString()}>
      {name}
    </span>
  </div>
);

interface AppShelfProps {
  loading?: boolean;
  data?: AppList;
}

const AppShelf: React.FC<AppShelfProps> = ({ data = [], loading }) => {
  const [showAppCreate, setShowAppCreate] = useState(false);
  const [showCommonAppCreate, setShowCommonAppCreate] = useState(false);
  const dispatch: Dva.Dispatch = useDispatch();
  const history = useHistoryR();

  const { defaultOrgId, userId } = useSelector(({ account }) => account);

  const createLoading = useSelector(
    ({ loading: loadingState }) => loadingState.effects['app/createApp'],
  );

  const handleAppCreate = (appName: string) => {
    dispatch({
      type: 'app/createApp',
      payload: {
        id: uuidv1(),
        name: appName,
        iconCss: '',
        companyId: defaultOrgId,
        currentUserId: userId,
      },
    })
      .then((appId) => {
        setShowCommonAppCreate(false);
        if (appId) {
          history.push('/app/:appId', { appId });
        }
      })
      .catch(() => {
        msgIntl.error({
          id: 'message.app.create.failed',
        });
      });
  };

  return (
    <div className={styles.wrapper}>
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
        confirmLoading={createLoading}
        onCancel={() => setShowCommonAppCreate(false)}
        onOk={handleAppCreate}
      />
      <ul className={styles.list}>
        <AppButtonSkeleton loading={loading}>
          <AppShelfButton
            name={<FM id="home.appshelf.create" defaultMessage="New app" />}
            onClick={() => setShowAppCreate(true)}
            icon={<PlusSquareDashed />}
          />
          {data
            .slice()
            .reverse()
            .slice(0, 10)
            .map((app) => (
              <li key={app.id}>
                <Link to={`/app/${app.id}`}>
                  <AppShelfButton name={app.name} />
                </Link>
              </li>
            ))}
        </AppButtonSkeleton>
      </ul>
    </div>
  );
};

export default AppShelf;
