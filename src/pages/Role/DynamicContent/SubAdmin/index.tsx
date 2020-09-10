import React, { useEffect, useState } from 'react';
import { Button, message, Table, Modal } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import LoadingWave from '@comp/LoadingWave';
import { ColumnProps } from 'antd/lib/table';
import { GetSubAdminReturn } from '@/domain/role/data.d';
import CreateDrawer from './CreateDrawer';
import { RoleComponentType } from '..';

import styles from './index.scss';

const { confirm } = Modal;

const SubAdmin: React.FC<RoleComponentType> = ({ role }) => {
  const { roleId: id } = role;
  const intl = useIntl();
  const dispatch = useDispatch();
  const isLoading = useSelector(({ loading }) => loading.effects['role/getSubAdminRoles']);
  const [data, setData] = useState<GetSubAdminReturn[]>([]);
  const [visible, setVisible] = useState(false);
  const [subAdminRoleId, setSubAdminRoleId] = useState('');

  const fetchData = () => {
    dispatch<GetSubAdminReturn[]>({
      type: 'role/getSubAdminRoles',
      payload: { id },
    })
      .then((res) => {
        if (res) {
          setData(res);
        }
      })
      .catch(() => {
        message.error({ content: 'get members failed', key: 'error' });
      });
  };
  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleDelete = (subId: string) => {
    confirm({
      title: intl.formatMessage({ id: 'role.common.remove.title' }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage({ id: 'role.common.remove.title' }),
      okText: intl.formatMessage({ id: 'role.common.remove.oktext' }),
      cancelText: intl.formatMessage({ id: 'role.common.remove.canceltext' }),
      onOk() {
        dispatch({
          type: 'role/deleteSubAdmin',
          payload: { id, subAdminRoleId: subId },
        })
          .then(() => {
            fetchData();
          })
          .catch(() => {
            message.error({ content: 'remove failed', key: 'error' });
          });
      },
      onCancel() {},
    });
  };

  const columns: ColumnProps<GetSubAdminReturn>[] = [
    {
      key: 'memberNames',
      title: <FM id="role.sub.member" />,
      dataIndex: 'memberNames',
      width: '25%',
      ellipsis: true,
    },
    {
      key: 'appNames',
      title: <FM id="role.sub.app" />,
      dataIndex: 'appNames',
      width: '25%',
      ellipsis: true,
    },
    {
      key: 'remarks',
      title: <FM id="role.sub.remark" />,
      dataIndex: 'remarks',
      width: '25%',
      ellipsis: true,
    },
    {
      title: <FM id="role.sub.options" />,
      key: 'action',
      width: '25%',
      ellipsis: true,
      // edit流程不完善，不显示
      render: (_, record) => (
        <span>
          {/* <a
            onClick={() => {
              setVisible(true);
              setSubAdminRoleId(record.subAdminRoleId);
            }}
            style={{ marginRight: 16 }}
          >
            <FM id="dict.edit" />
          </a> */}
          <a onClick={() => handleDelete(record.subAdminRoleId)}>
            <FM id="role.sub.remove" />
          </a>
        </span>
      ),
    },
  ];

  return (
    <div
      className={styles.container}
      style={visible ? { overflow: 'hidden' } : { overflow: 'auto' }}
    >
      <div className={styles.header}>
        <FM id="role.auth.setting" />
        <Button
          type="primary"
          onClick={() => {
            setSubAdminRoleId('');
            setVisible(true);
          }}
          className={styles.button}
        >
          <FM id="dict.newrecord" />
        </Button>
      </div>
      <div className={styles.des}>
        <FM id="role.sub.des" />
      </div>
      <LoadingWave msgAnimated loading={isLoading}>
        <div className={styles.body} style={{ marginRight: 10 }}>
          <Table<GetSubAdminReturn>
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.subAdminRoleId}
          />
        </div>
      </LoadingWave>
      <CreateDrawer
        // memberIds={memberIds}
        // appIds={appIds}
        // remarks={remarks}
        subAdmin={data.find((d) => d.subAdminRoleId === subAdminRoleId)}
        subAdminRoleId={subAdminRoleId}
        roleId={id}
        visible={visible}
        onClose={() => setVisible(false)}
        fetchData={fetchData}
      />
    </div>
  );
};
export default SubAdmin;
