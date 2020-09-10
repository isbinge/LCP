import React, { useMemo, Suspense, useEffect } from 'react';
import { useParams, useRouteMatch, useSelector, useDispatch } from 'dva';
import { message, Modal } from 'antd';
import NavigationBar from '@comp/NavigationBar';
import { useHistoryR } from '@lib/react-router-dom';
import { LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import LoadingWave from '@comp/LoadingWave';

import { FormattedMessage as FM } from 'react-intl';
import LcpConst from '@/constants';
import styles from './index.scss';

const menu = {
  'form-design': { title: 'Form design' },
  // 'wf-design': { title: 'Workflow design', disabled: true },
  'rl-design': { title: 'List design' },
  // 'form-settings': { title: 'Form settings', disabled: true },
};

const FormDesignerLayout: React.FC = ({ children }) => {
  const { appId } = useParams();
  const history = useHistoryR();
  const dispatch = useDispatch();
  const matchedRoute = useRouteMatch<{ action: string; templateId: string }>({
    path: '/app/:appId/form-designer/:templateId/:action',
  });
  const [formTplName, formTplEdited, loadingFormTpl] = useSelector(({ formTemplate, loading }) => [
    formTemplate.formSpec.name,
    formTemplate.edited,
    loading.effects['formTemplate/getFormTpl'],
  ]);
  const pathAction = matchedRoute?.params?.action;
  const tplId = matchedRoute?.params?.templateId;

  useEffect(() => {
    return () => {
      dispatch({ type: 'formTemplate/reset' });
    };
  }, []);

  const renderTitle =
    pathAction === 'form-design' ? (
      <FM id="formtpl.schema.form.formname">
        {(text: string) => (
          <>
            <input
              placeholder={text}
              maxLength={32}
              type="text"
              autoComplete="off"
              value={formTplName}
              onChange={(e) => {
                dispatch({
                  type: 'formTemplate/updateTplName',
                  payload: { newName: e.target.value },
                });
              }}
            />
            <div>{formTplName || text}</div>
          </>
        )}
      </FM>
    ) : (
      formTplName
    );

  const memoizedCenter = useMemo(
    () => (
      <div className={styles.center}>
        <ul className={styles.actionList}>
          {Object.entries(menu).map(([action, v], k) => {
            return (
              <li
                key={v.title}
                className={styles.tab}
                // data-disabled={v.disabled}
                data-checked={pathAction === action || (k === 0 && !pathAction)}
              >
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    function switchRoute() {
                      history.replace('/app/:appId/form-designer/:templateId/:action', {
                        appId,
                        templateId: tplId ?? '',
                        action,
                      });
                    }
                    // 当前 Tab 不跳转
                    if (pathAction === action || (k === 0 && !pathAction)) {
                      return null;
                    }
                    // 非首 Tab 检测是否有 templateId
                    if (k > 0 || !pathAction) {
                      if (!tplId) {
                        return message.warn({
                          key: LcpConst.antdMsgKey.FORM_TPL_SAVE,
                          content: 'Please save your form template first',
                        });
                      }
                      if (formTplEdited) {
                        return Modal.confirm({
                          title: 'Saving confirm',
                          icon: <ExclamationCircleOutlined />,
                          content: 'You have edited the template without saving, save now?',
                          okText: 'Save and continue',
                          cancelText: 'Cancel',
                          onOk: async () => {
                            return dispatch({
                              type: 'formTemplate/updateFormTpl',
                              payload: {
                                templateId: tplId,
                                appId,
                              },
                            }).then(() => {
                              switchRoute();
                              return Promise.resolve();
                            });
                          },
                          onCancel() {},
                        });
                      }
                    }
                    if (action) {
                      switchRoute();
                    }
                    return null;
                  }}
                >
                  <span>{v.title}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    ),
    [appId, tplId, pathAction, formTplEdited],
  );

  return (
    <div key={appId} style={{ height: '100vh' }}>
      <NavigationBar
        center={memoizedCenter}
        hideLogo
        showGoBack
        left={
          <div className={styles.left}>
            {loadingFormTpl ? <LoadingOutlined style={{ marginLeft: 4 }} /> : renderTitle}
          </div>
        }
      />
      <Suspense
        fallback={
          <LoadingWave
            message={pathAction ? `Loading ${menu[pathAction].title}` : ''}
            filled
            msgAnimated
          />
        }
      >
        {children}
      </Suspense>
    </div>
  );
};

export default FormDesignerLayout;
