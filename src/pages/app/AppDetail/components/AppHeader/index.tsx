import React, { useState } from 'react';
import { Tooltip, Dropdown, Menu, Modal, Form, Input } from 'antd';
import { HomeFilled, CaretDownOutlined, SettingFilled, LoadingOutlined } from '@ant-design/icons';
import { Link } from '@lib/react-router-dom';
import { useDispatch, useSelector, useHistory } from 'dva';
import { FormattedMessage as FM } from 'react-intl';

import { msgIntl } from '@comp/i18n/MessageIntl';
import AppCreateCommon from '@comp/AppShelf/AppCreateCommon';

import NavigationBar from '@comp/NavigationBar';
import styles from './index.scss';
import './index.global.scss';

interface AppHeaderProps {
  name?: string;
  id?: string;
  onAppNameClick: () => void;
  onSettingsClick: () => void;
}

/**
 * 应用详情 - 顶部导航
 */
export const AppHeader: React.FC<AppHeaderProps> = (props) => {
  const { name, id, onAppNameClick: handleAppNameClick, onSettingsClick } = props;
  const [form] = Form.useForm();
  const confirmLoading = useSelector(
    (state) =>
      state.loading.effects['app/updateApp'] ||
      state.loading.effects['app/deleteApp'] ||
      state.loading.effects['app/getApp'],
  );
  const { userId } = useSelector(({ account }) => account);
  const [showCommonAppCreate, setShowCommonAppUpdate] = useState(false);
  const [showAppDelete, setShowAppDelete] = useState(false);
  const [deleteName, setDeleteName] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  async function deleteApp() {
    await form.validateFields();
    await dispatch({
      type: 'app/deleteApp',
      payload: {
        appId: id,
      },
    });
    msgIntl.success({
      id: 'msg.delete.ok',
    });
    setShowAppDelete(false);
    history.replace('/home');
    form.resetFields();
  }

  const menu = (
    <Menu>
      <Menu.Item key="rename" onClick={() => setShowCommonAppUpdate(true)}>
        <div className={styles.menuItem}>
          <FM id="dict.rename" defaultMessage="Rename" />
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" onClick={() => setShowAppDelete(true)}>
        <div className={styles.menuItem}>
          <FM id="dict.delete" defaultMessage="Delete" />
        </div>
      </Menu.Item>
    </Menu>
  );

  async function handleAppUpdate(appName: string) {
    await dispatch({
      type: 'app/updateApp',
      payload: {
        data: {
          name: appName,
          iconCss: '',
          currentUserId: userId,
        },
        appId: id,
      },
    });
    await dispatch({
      type: 'app/getApp',
      payload: { appId: id },
    });
    setShowCommonAppUpdate(false);
  }

  return (
    <NavigationBar
      hideLogo
      left={
        <div className={styles.appFuncBar}>
          <Tooltip
            title={<FM id="global.backhome" />}
            placement="bottomLeft"
            overlayClassName="tooltipStyle"
          >
            <Link to="/home">
              <div className={styles.homeButton}>
                <HomeFilled style={{ fontSize: 14 }} />
              </div>
            </Link>
          </Tooltip>
          <div className={styles.appName} onClick={handleAppNameClick}>
            <span>{name || <LoadingOutlined />} </span>
            <CaretDownOutlined style={{ fontSize: 10, marginLeft: 2 }} />
          </div>
          <Dropdown
            overlay={menu}
            placement="bottomCenter"
            trigger={['click']}
            overlayClassName={styles.settingStyle}
            onVisibleChange={onSettingsClick}
          >
            <SettingFilled style={{ color: '#AAB5C4', fontSize: 12 }} />
          </Dropdown>
          <AppCreateCommon
            visible={showCommonAppCreate}
            name={name}
            confirmLoading={confirmLoading}
            onCancel={() => setShowCommonAppUpdate(false)}
            onOk={handleAppUpdate}
          />
          <Modal
            visible={showAppDelete}
            title={<FM id="app.common.delete" />}
            onOk={deleteApp}
            confirmLoading={confirmLoading}
            onCancel={() => {
              form.resetFields();
              setShowAppDelete(false);
            }}
          >
            <Form form={form} initialValues={{ appName: '' }}>
              <Form.Item
                rules={[
                  { required: true, message: <FM id="appheader.validation.emptyinput" /> },
                  {
                    validator: (_, value) => {
                      if (value === name || !value) return Promise.resolve();
                      return Promise.reject(<FM id="appheader.validation.inproperappname" />);
                    },
                  },
                ]}
                name="appName"
                label={<FM id="app.common.name" />}
                labelCol={{ span: 4 }}
                wrapperCol={{ offset: 1, span: 15 }}
              >
                <Input
                  placeholder={name}
                  value={deleteName}
                  onChange={(e) => setDeleteName(e.target.value)}
                />
              </Form.Item>
              <div className={styles.remarkText}>
                <FM id="appheader.deleteapp.help" values={{ appName: name }} />
              </div>
            </Form>
          </Modal>
        </div>
      }
    />
  );
};
export default AppHeader;
