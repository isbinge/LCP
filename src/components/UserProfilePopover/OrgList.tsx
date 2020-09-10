import React, { useEffect } from 'react';
import { List } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { FormattedMessage as FM } from 'react-intl';

import styles from './index.scss';

const OrgList: React.FC<{
  setVisible: (visible: boolean) => void;
  handleCreate: () => void;
}> = ({ setVisible, handleCreate }) => {
  const dispatch = useDispatch();
  const [getOrgsLoading, currentOrgId, orgs] = useSelector(({ loading, account, organization }) => [
    loading.effects['organization/getOrgs'],
    account.defaultOrgId,
    organization.orgs,
  ]);

  useEffect(() => {
    dispatch({ type: 'organization/getOrgs' });
  }, []);

  return (
    <div className={styles.orgList}>
      <List loading={getOrgsLoading}>
        <List.Item onClick={handleCreate} className={styles.listItem}>
          <div>
            <PlusOutlined style={{ marginRight: 8 }} />
            <span>
              <FM id="org.create" />
            </span>
          </div>
        </List.Item>
        {orgs.map((org) => (
          <List.Item
            className={styles.listItem}
            data-hide-click={org.companyId === currentOrgId}
            key={org.companyId}
            actions={
              org.companyId !== currentOrgId
                ? [
                    <div className={styles.content}>
                      <FM id="org.click-in" />
                      <ArrowRightOutlined />
                    </div>,
                  ]
                : []
            }
            onClick={async () => {
              if (org.companyId !== currentOrgId) {
                dispatch({
                  type: 'organization/switchOrg',
                  payload: {
                    nextOrgId: org.companyId,
                    nextOrgName: org.companyName,
                  },
                });
                setVisible(false);
              }
            }}
          >
            <List.Item.Meta title={<b style={{ fontSize: '16px' }}>{org.companyName}</b>} />
            {org.companyId === currentOrgId && (
              <div className={styles.current}>
                <FM id="org.current" />
              </div>
            )}
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default OrgList;
