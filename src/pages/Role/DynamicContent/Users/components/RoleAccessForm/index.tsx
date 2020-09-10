import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { Modal } from 'antd';
import { first } from 'lodash';
import { CheckOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { msgIntl } from '@comp/i18n/MessageIntl';
import LoadingWave from '@comp/LoadingWave';
import type { AppAccessDto, RoleDto, FormTemplateAccessState } from '@/domain/role/data.d';

import styles from './index.scss';
import AccessControlList from '../AccessControlList';

interface RoleAccessFormProps {
  role: RoleDto;
  onSave: () => void;
}

interface AppItemProps {
  selectedAppId: Nullable<string>;
  app: AppAccessDto;
  accessControlList: Nullable<FormTemplateAccessState>;
  handleSelectApp: (appId: string) => void;
  onSave: () => void;
}

const AppItem: React.FC<AppItemProps> = (props) => {
  const intl = useIntl();
  const { app, handleSelectApp, selectedAppId, accessControlList, onSave } = props;

  const isSelectedSelf = accessControlList && accessControlList.appId === app.appId;
  const hasConfigured =
    accessControlList &&
    ((isSelectedSelf && accessControlList.aclChildren.some((aclItem) => aclItem.hasAcl)) ||
      (!isSelectedSelf && app.hasAcl));
  return (
    <div
      onClick={() => {
        if (selectedAppId === app.appId) return;

        if (accessControlList?.edited) {
          Modal.confirm({
            title: intl.formatMessage({ id: 'role.users.save.confirm' }),
            icon: <ExclamationCircleOutlined />,
            onOk() {
              onSave();
            },
            onCancel() {
              handleSelectApp(app.appId);
            },
          });
        } else {
          handleSelectApp(app.appId);
        }
      }}
      className={styles.appItem}
      data-selected={selectedAppId === app.appId}
      data-configured={hasConfigured}
    >
      {hasConfigured && <CheckOutlined />}

      <span>{app.name}</span>
    </div>
  );
};

const RoleAccessForm: React.FC<RoleAccessFormProps> = ({ role, onSave }) => {
  const dispatch = useDispatch();

  const [
    { selectedAppId, appAccessList, accessControlList },
    getAppAccessControlListLoading,
  ] = useSelector(({ role: storeRole, loading }) => [
    storeRole,
    loading.effects['role/getAppAccessControlList'],
  ]);

  const handleSelectApp = (appId: string) => {
    dispatch({
      type: 'role/getFormAccessControlList',
      payload: { appId, roleId: role.roleId },
    }).catch((e) => {
      msgIntl.error({ content: e });
    });
    dispatch({
      type: 'role/updateSelectedAppId',
      payload: {
        selectedAppId: appId,
      },
    });
  };

  useEffect(() => {
    dispatch<AppAccessDto[]>({
      type: 'role/getAppAccessControlList',
      payload: { roleId: role.roleId },
    })
      .then((appDto) => {
        const defaultAppId = first(appDto)?.appId;
        if (defaultAppId) {
          handleSelectApp(defaultAppId);
        } else {
          dispatch({
            type: 'role/updateAccessControlList',
            payload: { accessControlList: null },
          });
        }
      })
      .catch((e) => {
        msgIntl.error({ content: e });
      });
  }, [role.roleId]);

  const renderAppList = () =>
    appAccessList.map((appItem) => (
      <AppItem
        key={appItem.appId}
        app={appItem}
        accessControlList={accessControlList}
        selectedAppId={selectedAppId}
        handleSelectApp={handleSelectApp}
        onSave={onSave}
      />
    ));
  return (
    <div className={styles.container}>
      <div className={styles.appAccessList}>
        <div>
          <span>
            <FM id="role.users.app-access" />
          </span>
        </div>
        <LoadingWave size="small" loading={getAppAccessControlListLoading}>
          <div className={styles.appList}>{renderAppList()}</div>
        </LoadingWave>
      </div>
      <div className={styles.accessContainer}>
        <AccessControlList />
      </div>
    </div>
  );
};

export default RoleAccessForm;
