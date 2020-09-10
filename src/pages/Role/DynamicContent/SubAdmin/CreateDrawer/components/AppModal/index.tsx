import React, { useEffect, useState } from 'react';
import { Checkbox, Modal } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { FormattedMessage as FM } from 'react-intl';
import { SmileFilled } from '@ant-design/icons';

import { AppListItem, AppList } from '@/domain/app/data.d';

import styles from './index.scss';

interface AppModalProps {
  selectedApps: AppList;
  visible: boolean;
  onCancel: () => void;
  onOk: (apps: AppList) => void;
}

interface AppCardProps {
  selectedApp: AppList;
  app: AppListItem;
  setSelectedApp: React.Dispatch<React.SetStateAction<AppList>>;
}

const AppCard: React.FC<AppCardProps> = ({ app, selectedApp, setSelectedApp }) => (
  <div className={styles.card}>
    <Checkbox
      checked={selectedApp.some((item) => item.id === app.id)}
      onChange={(e) => {
        if (e.target.checked) {
          setSelectedApp([...selectedApp, app]);
        } else {
          setSelectedApp(selectedApp.filter((item) => item.id !== app.id));
        }
      }}
    />
    <div className={styles.content}>
      {app.iconCss || (
        <div className={styles.icon} style={{ background: '#107fff' }}>
          <SmileFilled style={{ color: 'white' }} />
        </div>
      )}
      <span className={styles.text}>{app.name}</span>
    </div>
  </div>
);

const AppModal: React.FC<AppModalProps> = (props) => {
  const dispatch = useDispatch();
  const { visible, onCancel, onOk: handleOk, selectedApps: selectedAppsOrgi } = props;
  const apps = useSelector((state) => state.app.apps);
  const [selectedApp, setSelectedApp] = useState<AppList>([]);

  useEffect(() => {
    if (visible) {
      setSelectedApp(selectedAppsOrgi);
      dispatch({ type: 'app/getAppList' });
    } else {
      setSelectedApp([]);
    }
  }, [visible]);

  return (
    <Modal
      title={
        <span>
          <FM id="role.sub.drawer.app.add" /> {`${selectedApp.length}/${apps.length}`}
        </span>
      }
      maskClosable={false}
      width={640}
      visible={visible}
      onCancel={onCancel}
      onOk={() => handleOk(selectedApp)}
      destroyOnClose
    >
      <div className={styles.cardContainer}>
        {apps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            selectedApp={selectedApp}
            setSelectedApp={setSelectedApp}
          />
        ))}
      </div>
    </Modal>
  );
};

export default AppModal;
