import React, { useState, Suspense, useEffect } from 'react';
import { Layout } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { first } from 'lodash';
import classNames from 'classnames';
import { FormattedMessage as FM } from 'react-intl';

import LoadingWave from '@comp/LoadingWave';
import NavigationBar from '@comp/NavigationBar';
import { msgIntl } from '@comp/i18n/MessageIntl';
import { RoleDto, RoleGroupDto } from '@/domain/role/data.d';

import RoleTree from './RoleTree';
import CreateRole from './CreateRole';
import DynamicContent from './DynamicContent';

import styles from './index.scss';
import './index.global.scss';

const { Sider, Content } = Layout;

const RolePage: React.FC = () => {
  const dispatch = useDispatch();

  const [
    { roleGroups },
    { defaultOrgId },
    getRolesLoading,
  ] = useSelector(({ role, account, loading }) => [
    role,
    account,
    loading.effects['role/getRoles'],
  ]);
  const [createRoleVisible, setCreateRoleVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Nullable<RoleDto>>(null);

  useEffect(() => {
    if (defaultOrgId) {
      dispatch<RoleGroupDto[]>({
        type: 'role/getRoles',
      })
        .then((roleGroupDto) => {
          const defaultRole: Nullable<RoleDto> = first(first(roleGroupDto)?.children) ?? null;
          setSelectedRole(defaultRole);
        })
        .catch((e) => {
          msgIntl.error({ content: e });
        });
    }
  }, [defaultOrgId]);

  const handleSelectRole = (role: RoleDto) => {
    setSelectedRole(role);
  };

  return (
    <Layout className={styles.container}>
      <NavigationBar
        hideLogo
        showGoBack
        left={
          <span style={{ padding: '5px 10px' }}>
            <FM id="role.auth.mgmt" />
          </span>
        }
      />

      <Layout className={styles.content}>
        <Sider
          theme="light"
          width={240}
          collapsedWidth={0}
          className={classNames(styles.leftSider, 'role-sider')}
        >
          {/* <div className={styles.buttonBar}>
            <Button type="primary" onClick={() => setCreateRoleVisible(true)}>
              <FM id="role.left.new" />
            </Button>
            <Button type="primary" disabled>
              <FM id="role.left.newgroup" />
            </Button>
          </div>
          {false && (
            <div className={styles.searchBar}>
              <Search placeholder={intl.formatMessage({ id: 'role.left.search' })} />
            </div>
          )} */}
          <LoadingWave size="medium" loading={getRolesLoading}>
            <RoleTree onSelect={handleSelectRole} selectedRole={selectedRole} data={roleGroups} />
          </LoadingWave>

          <CreateRole
            data={roleGroups}
            companyId={defaultOrgId || ''}
            visible={createRoleVisible}
            onCancel={() => setCreateRoleVisible(false)}
          />
        </Sider>
        <Content>
          <Suspense fallback={<LoadingWave message="Loading" msgAnimated filled />}>
            {selectedRole ? <DynamicContent role={selectedRole} /> : null}
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};

export default RolePage;
