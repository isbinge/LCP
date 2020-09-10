import React, { useEffect, useState } from 'react';
import { FormattedMessage as FM } from 'react-intl';
import { Layout, Menu, Dropdown, Modal, Checkbox, Form, Input } from 'antd';
import { useParams, useDispatch, useSelector, useRouteMatch } from 'dva';
import { LinkR, useHistoryR } from '@lib/react-router-dom';
// import { DragDropContext, Droppable, DragDropContextProps } from 'react-beautiful-dnd';

import {
  ContainerOutlined,
  SettingFilled,
  PlusOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';

import LoadingWave from '@comp/LoadingWave';
import BlankCardGroup from '@comp/BlankCardGroup';
import HelmetTitle from '@comp/HelmetTitle';
import { msgIntl } from '@comp/i18n/MessageIntl';

import { FormTplList, GetAppDto } from '@/domain/app/data.d';
import FormTemplate from '@/domain/form/template/data.d';
import { useLogger } from '@/utils/hooks/use-logger';

import CreateBlankFormTpl from '@/assets/app/create-blank-form-template.svg';
import CreateReportkFormTpl from '@/assets/app/create-report-form.svg';
import CreateDashboard from '@/assets/app/create-dashboard.svg';

import AppHeader from './components/AppHeader';
import AppDrawer from './components/AppDrawer';

import styles from './index.scss';

const { Sider } = Layout;

export const FormNotFoundOrSelected = () => {
  const { appId } = useParams();
  return (
    <div className="flex-col-center vertical-filled">
      <FM id="appdetail.formlist.404.part1" />
      <LinkR to="/app/:appId/form-designer" values={{ appId }}>
        <FM id="appdetail.formlist.404.part2" />
      </LinkR>
    </div>
  );
};

// const reorder = (list: FormTplList, startIndex: number, endIndex: number) => {
//   const result = Array.from(list);
//   const [removed] = result.splice(startIndex, 1);
//   result.splice(endIndex, 0, removed);

//   return result;
// };

const appElements = [
  {
    title: 'Create a blank form template',
    image: CreateBlankFormTpl,
    desc: 'Collecting data, leave application (with workflow enabeld), etc.',
    to: '/app/:appId/form-designer',
  },
  {
    title: 'Create a report',
    image: CreateReportkFormTpl,
    desc: 'Making summary, dissemination, trending analysis, etc.',
    disabled: true,
  },
  {
    title: 'Create a dashboard',
    image: CreateDashboard,
    desc: 'Dashboard is good for data statistics, analysis and visualization',
    isNew: true,
    isBeta: true,
    disabled: true,
  },
];

const AppDetail: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const { appId } = useParams();
  const history = useHistoryR();
  const currentTplId = useRouteMatch<{ appId: string; templateId: string }>(
    '/app/:appId/form/:templateId',
  )?.params?.templateId;
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteChecked, setDeleteChecked] = useState(false);
  const [renameVisible, setRenameVisible] = useState(false);
  const [triggeredTpl, setTriggeredTpl] = useState<{ id?: string; name: string | null }>({
    name: null,
    id: currentTplId,
  });
  const [renameForm] = Form.useForm();
  const log = useLogger('app-detail', { preferGroup: false });

  const [
    { formTpls: formInstList, app },
    isDeletingTpl,
    isLoadingTpls,
    isRenameTpl,
  ] = useSelector(({ app: storeApp, loading }) => [
    storeApp,
    loading.effects['formTemplate/deleteFormTpl'],
    loading.effects['app/getFormTplList'],
    loading.effects['formTemplate/updateFormTplName'],
  ]);

  const fetchFormTplList = () =>
    dispatch<FormTplList>({ type: 'app/getFormTplList', payload: { appId } });

  useEffect(() => {
    setDrawerVisible(false);
    dispatch<GetAppDto>({ type: 'app/getApp', payload: { appId } });
    if (!currentTplId || !app) {
      fetchFormTplList().then((res) => {
        if (res.length > 0 && !currentTplId) {
          const [{ name, code: instanceId, id: templateId }] = res;
          log('auto-redirect to the form instance', name);
          history.replace('/app/:appId/form/:templateId/inst/:instanceId', {
            appId,
            templateId,
            instanceId,
          });
        }
      });
    }
    return () => {
      dispatch({ type: 'app/saveApp', payload: { app: null } });
    };
  }, [appId]);

  const handleDeleteFormTpl = async (formTplId?: string) => {
    if (!formTplId) {
      return;
    }
    await dispatch({ type: 'formTemplate/deleteFormTpl', payload: { formId: formTplId } });
    await fetchFormTplList();
    const currentIndex = formInstList.findIndex((form) => form.id === formTplId);
    const prevForm = formInstList[currentIndex - 1];
    setDeleteConfirmVisible(false);
    if (prevForm) {
      history.replace('/app/:appId/form/:templateId/inst/:instanceId', {
        appId,
        templateId: prevForm.id,
        instanceId: prevForm.code,
      });
    } else {
      history.replace('/app/:appId', { appId });
    }
  };

  /**
   * 表单实例操作菜单
   */
  const FormInstOptsMenu: React.FC<{ tplId: string; tplName: string }> = ({
    tplId,
    tplName,
    ...params
  }) => (
    // Parent props must be passed to Menu, or there's style issues.
    <Menu {...params}>
      <Menu.Item key="design">
        <LinkR
          to="/app/:appId/form-designer/:templateId/form-design"
          values={{
            appId,
            templateId: tplId,
          }}
        >
          <div className={styles.dropdownItem}>
            <FM id="appdetail.formlist.design" />
          </div>
        </LinkR>
      </Menu.Item>
      <Menu.Item key="rename">
        <a
          href="##"
          className={styles.dropdownItem}
          onClick={(e) => {
            e.preventDefault();
            setTriggeredTpl({ id: tplId, name: tplName });
            renameForm.setFieldsValue({ name: tplName });
            setRenameVisible(true);
          }}
        >
          <FM id="appdetail.formlist.rename" />
        </a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete">
        <a
          href="##"
          className={styles.dropdownItem}
          onClick={(e) => {
            e.preventDefault();
            setTriggeredTpl({ id: tplId, name: tplName });
            setDeleteConfirmVisible(true);
          }}
        >
          <FM id="dict.delete" />
        </a>
      </Menu.Item>
    </Menu>
  );

  // const onDragEnd: DragDropContextProps['onDragEnd'] = result => {
  //   if (!result.destination) {
  //     return;
  //   }
  //   const items = reorder(formInstList, result.source.index, result.destination.index);
  //   setFormInstList(items);
  // };

  return (
    <Layout className={styles.layout}>
      <HelmetTitle title={app?.name} />
      <AppHeader
        name={app?.name}
        id={app?.id}
        onAppNameClick={() => setDrawerVisible(!drawerVisible)}
        onSettingsClick={() => setDrawerVisible(false)}
      />
      {/* 删除表单模板 */}
      <Modal
        title={
          <FM
            id="appdetail.formlist.delete.title"
            values={{
              tplName: triggeredTpl.name && `: ${triggeredTpl.name}`,
            }}
          />
        }
        visible={deleteConfirmVisible}
        okButtonProps={{ disabled: !deleteChecked, danger: true }}
        confirmLoading={isDeletingTpl || isLoadingTpls}
        onOk={() => {
          handleDeleteFormTpl(triggeredTpl.id);
        }}
        onCancel={() => setDeleteConfirmVisible(false)}
        afterClose={() => setDeleteChecked(false)}
      >
        <p>
          <FM id="appdetail.formlist.delete.confirm" />
        </p>
        <Checkbox checked={deleteChecked} onChange={(e) => setDeleteChecked(e.target.checked)}>
          <FM id="appdetail.formlist.delete.check" />
        </Checkbox>
      </Modal>
      {/* 表单重命名 */}
      <Modal
        title={<FM id="appdetail.formlist.rename.title" />}
        visible={renameVisible}
        onCancel={() => setRenameVisible(false)}
        destroyOnClose={false}
        forceRender
        onOk={() => {
          renameForm.validateFields().then((values) => {
            if (triggeredTpl.id) {
              dispatch<FormTemplate.UpdateFormNamePayload>({
                type: 'formTemplate/updateFormTplName',
                payload: {
                  name: values.name,
                  formTplId: triggeredTpl.id,
                },
              }).then(() => {
                setRenameVisible(false);
                msgIntl.success({ id: 'appdetail.formlist.rename.success.message' });
              });
            }
          });
        }}
        okButtonProps={{
          loading: isRenameTpl,
        }}
        // afterClose={() => {
        //   renameForm.resetFields();
        // }}
      >
        <Form
          form={renameForm}
          layout="horizontal"
          name="rename-form"
          // initialValues={{ name: triggeredTpl.name }}
        >
          <Form.Item
            name="name"
            label={<FM id="formtpl.schema.form.formname" />}
            rules={[
              {
                required: true,
                max: 32,
                message: <FM id="appdetail.formlist.rename.rule.message" />,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <LoadingWave loading={isLoadingTpls && !deleteConfirmVisible}>
        <Layout className={styles.layoutHasSider}>
          <AppDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
          {formInstList.length === 0 ? (
            <BlankCardGroup elements={appElements} />
          ) : (
            <>
              <Sider
                theme="light"
                width={240}
                collapsedWidth={0}
                collapsed={collapsed}
                className={styles.sider}
              >
                <div className={styles.sider}>
                  <div className={styles.appDetailMenu}>
                    <Menu
                      className={styles.formTitleMenu}
                      theme="light"
                      mode="inline"
                      selectedKeys={currentTplId ? [currentTplId] : undefined}
                    >
                      {formInstList.map((form) => (
                        <Menu.Item
                          key={form.id}
                          style={{ paddingLeft: 0 }}
                          className={styles.menuItem}
                        >
                          <LinkR
                            style={{ display: 'flex', alignItems: 'center' }}
                            to="/app/:appId/form/:templateId/inst/:instanceId"
                            onClick={(e) => {
                              if (form.id === currentTplId) {
                                e.preventDefault();
                              }
                            }}
                            values={{
                              appId,
                              templateId: form.id,
                              instanceId: form.code,
                            }}
                            replace
                          >
                            <ContainerOutlined />
                            <span className={styles.navText}>{form.name}</span>
                            <div style={{ flex: 1 }} />
                            <Dropdown
                              overlay={<FormInstOptsMenu tplId={form.id} tplName={form.name} />}
                              placement="bottomCenter"
                              trigger={['click']}
                              overlayClassName={styles.settingStyle}
                            >
                              <SettingFilled
                                style={
                                  currentTplId === form.id
                                    ? { opacity: 1, color: '#AAB5C4' }
                                    : { color: '#AAB5C4' }
                                }
                                className={styles.icon}
                              />
                            </Dropdown>
                          </LinkR>
                        </Menu.Item>
                      ))}
                    </Menu>
                  </div>

                  <Menu className={styles.createMenu}>
                    <Menu.Divider />
                    <Menu.Item key="create" className={styles.menuItem}>
                      <LinkR
                        to="/app/:appId/form-designer"
                        values={{ appId }}
                        style={{ color: '#107fff' }}
                      >
                        <PlusOutlined />
                        <span className={styles.navText}>
                          <FM id="dict.newrecord" />
                        </span>
                      </LinkR>
                    </Menu.Item>
                  </Menu>
                </div>
              </Sider>
              {/* 内容区 */}
              <Layout className={styles.layoutContent}>
                {children}
                <div className={styles.bottomBar}>
                  {collapsed ? (
                    <MenuUnfoldOutlined
                      className="trigger"
                      style={{ fontSize: 20 }}
                      onClick={() => setCollapsed(!collapsed)}
                    />
                  ) : (
                    <MenuFoldOutlined
                      className="trigger"
                      style={{ fontSize: 20 }}
                      onClick={() => setCollapsed(!collapsed)}
                    />
                  )}
                  {currentTplId && collapsed && (
                    <span className={styles.formName}>{triggeredTpl.name}</span>
                  )}
                </div>
              </Layout>
            </>
          )}
        </Layout>
      </LoadingWave>
    </Layout>
  );
};

export default AppDetail;
