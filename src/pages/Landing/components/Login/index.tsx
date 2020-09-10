import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'dva';
import { Form, Input, Popover, Button, Checkbox, Tabs, Row, Col } from 'antd';
import { LoginOutlined, LoadingOutlined } from '@ant-design/icons';
import { useHistoryR } from '@lib/react-router-dom';
import type { FormInstance } from 'antd/lib/form';
import { useInterval } from 'react-use';

import { useLogger } from '@/utils/hooks/use-logger';
import { localStorageGet } from '@/utils/local-storage';
import { isEmail } from '@/utils';
import LcpConst, { LocalStorageValue } from '@/constants';
import { LoginStatus } from '../..';

import styles from './index.scss';

interface LandingLoginProps {
  form: FormInstance;
  setVisible: (visible: boolean) => void;
  setStatus: (status: LoginStatus) => void;
  status: LoginStatus;
}

interface LoginSufficProps {
  icon?: ReactNode;
  loadingIcon?: ReactNode;
  condition: boolean;
  loading?: boolean;
  onClick: () => void;
}

type ValidationPopupType = 'login' | 'email' | 'reset-hint' | 'reset-code' | 'reset-new';

const rememberEmail = localStorageGet<LocalStorageValue.RememberEmail>(
  LcpConst.localStorage.REMEMBER_EMAIL,
);

const LandingLogin: React.FC<LandingLoginProps> = ({ form, setVisible, setStatus, status }) => {
  const [formSendCode] = Form.useForm();
  const [formNewPasswd] = Form.useForm();
  const dispatch = useDispatch();
  const history = useHistoryR();
  const log = useLogger('login');
  const emailRef = useRef<Input>(null);
  const passwdRef = useRef<Input>(null);
  const timerRef = useRef<number>();
  const [resendTminus, setResendTminus] = useState(LcpConst.ACCOUNT_REGISTER_RESEND_EMAIL_TMINUS);
  const [tminusFired, setTminusFired] = useState(false);

  const [popoverState, setPopoverState] = useState<{
    visible: ValidationPopupType | null;
    content: ReactNode;
    delay: number;
  }>({
    visible: null,
    content: null,
    delay: 0,
  });

  const [
    isCheckingEmail,
    isLoggingIn,
    isCheckingResetCode,
    isResettingPasswd,
  ] = useSelector(({ loading }) => [
    loading.effects['account/checkEmail'],
    loading.effects['account/login'],
    loading.effects['account/resetPasswordCheckCode'],
    loading.effects['account/resetPassword'],
  ]);

  useEffect(() => {
    if (status === 'initial' && emailRef.current) {
      emailRef.current.focus();
    } else if (status === 'login' && passwdRef.current) {
      passwdRef.current.focus();
    }
  }, [status, emailRef.current, passwdRef.current]);

  useInterval(
    () => {
      if (resendTminus > 0) {
        setResendTminus((prev) => prev - 1);
      } else {
        handleResetTimer();
      }
    },
    tminusFired ? 1000 : null,
  );

  useEffect(() => {
    const { delay } = popoverState;
    if (popoverState.visible) {
      clearTimeout(timerRef.current);
      const timer = (setTimeout(() => {
        resetPopoverState();
        clearTimeout(timerRef.current);
      }, delay) as unknown) as number;
      timerRef.current = timer;
    }
  }, [popoverState.visible]);

  function handleResetTimer() {
    setResendTminus(LcpConst.ACCOUNT_REGISTER_RESEND_EMAIL_TMINUS);
    setTminusFired(false);
  }

  function handleFirePopover(type: ValidationPopupType, content: string, delay: number) {
    resetPopoverState();
    return setPopoverState((prev) => ({ ...prev, visible: type, content, delay }));
  }

  function resetPopoverState() {
    return setPopoverState((prev) => ({
      ...prev,
      visible: null,
      delay: 0,
    }));
  }
  async function handleResendResetCode() {
    if (tminusFired) {
      return Promise.resolve();
    }
    return dispatch({
      type: 'account/resetPasswordSendCode',
      payload: {
        email: form.getFieldValue('email'),
      },
    })
      .then(() => {
        setTminusFired(true);
        handleFirePopover('reset-hint', '📧 A verification email has been sent to you', 5000);
      })
      .catch(() => {
        handleFirePopover(
          'reset-hint',
          '❌ Getting verification code failed, please try again later',
          5000,
        );
      });
  }

  function handleSendResetCode() {
    setStatus('reset-passwd-verify');
    handleResendResetCode();
  }

  async function handleCheckResetCode() {
    return dispatch({
      type: 'account/resetPasswordCheckCode',
      payload: {
        code: formSendCode.getFieldValue('resetCode'),
        email: formSendCode.getFieldValue('resetEmail'),
      },
    })
      .then(() => {
        setStatus('reset-passwd-set-new');
      })
      .catch(() => {
        handleFirePopover('reset-code', '🤔 Sorry, the code is wrong, please check again', 5000);
      });
  }

  function handleResetPassword() {
    const ruleLength = new RegExp('^.{6,20}$', 'g');
    const ruleType = new RegExp('^[0-9a-zA-Z$-/:-?{-~!"^_`[\\]]{6,20}$', 'g');
    const { resetNewPasswd } = formNewPasswd.getFieldsValue();
    const { resetCode, resetEmail } = formSendCode.getFieldsValue();
    if (!ruleLength.test(resetNewPasswd)) {
      return handleFirePopover('reset-new', '🚫 Password must be 6-20 characters', 3000);
    }
    if (!ruleType.test(resetNewPasswd)) {
      return handleFirePopover(
        'reset-new',
        '🚫 Password can only be numbers, characters, and regular symbols',
        3000,
      );
    }
    return dispatch({
      type: 'account/resetPassword',
      payload: {
        password: resetNewPasswd,
        email: resetEmail,
        code: resetCode,
      },
    })
      .then(() => {
        setStatus('login');
        form.setFieldsValue({ email: resetEmail, password: resetNewPasswd });
        formSendCode.resetFields();
        formNewPasswd.resetFields();
        handleLogin(resetEmail, resetNewPasswd, form.getFieldValue('remember'));
      })
      .catch(() => {
        handleFirePopover('reset-hint', '❌ Resetting password failed, please try again', 5000);
      });
  }

  function handleCheckEmail() {
    if (isEmail(form.getFieldValue('email'))) {
      dispatch({
        type: 'account/checkEmail',
        payload: {
          email: form.getFieldValue('email'),
        },
      }).then((isRegistered) => {
        setStatus(isRegistered ? 'login' : 'signup');
      });
    } else {
      handleFirePopover('email', '🚫 Please input a valid email address', 3000);
    }
  }

  async function handleLogin(email: string, password: string, remember?: boolean) {
    return dispatch({
      type: 'account/login',
      payload: {
        data: {
          email,
          password,
        },
        rememberEmail: remember || false,
      },
    })
      .then(() => {
        dispatch({ type: 'account/redeemToken' }).then(() => {
          history.push('/home');
        });
      })
      .catch(() => {
        handleFirePopover('login', '🚫 Your email address and password do not match', 3000);
      });
  }

  function handleFormLogin() {
    if (form.getFieldValue('password')) {
      form.validateFields().then(({ rememberEmail: remember, ...values }) => {
        log('login form', values);
        handleLogin(values.email, values.password, remember);
      });
    } else {
      handleFirePopover('login', '👨🏻‍💻 Please input your password', 3000);
    }
  }

  const LoginSuffix: React.FC<LoginSufficProps> = ({
    loading,
    onClick,
    condition = true,
    icon,
    loadingIcon,
  }) => {
    if (loading) {
      return <>{loadingIcon || <LoadingOutlined />}</>;
    }
    if (condition) {
      return (
        <a
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
        >
          {icon || <LoginOutlined style={{ color: '#888' }} />}
        </a>
      );
    }
    return null;
  };

  return (
    <div className={styles.loginContainer} data-login-status={status}>
      <Popover
        visible={popoverState.visible === 'reset-hint'}
        content={popoverState.content}
        placement="top"
      >
        <Tabs
          defaultActiveKey="login"
          renderTabBar={() => <div />}
          activeKey={status.includes('reset-passwd') ? status : 'login'}
        >
          <Tabs.TabPane key="login">
            <Form
              className={styles.loginForm}
              form={form}
              initialValues={{
                rememberEmail: rememberEmail?.remember,
                email: rememberEmail?.email,
              }}
              onValuesChange={(values) => {
                if (values.email) {
                  form.resetFields(['password']);
                  setStatus('initial');
                }
              }}
            >
              <div>
                <Popover
                  content={popoverState.content}
                  visible={popoverState.visible === 'email'}
                  placement="topLeft"
                >
                  <div>
                    <Form.Item name="email">
                      <Input
                        ref={emailRef}
                        placeholder="Email address"
                        autoComplete="username"
                        spellCheck={false}
                        size="large"
                        suffix={
                          <LoginSuffix
                            loading={isCheckingEmail}
                            onClick={handleCheckEmail}
                            condition={status === 'initial'}
                          />
                        }
                        onPressEnter={handleCheckEmail}
                      />
                    </Form.Item>
                  </div>
                </Popover>

                {status === 'login' && (
                  <>
                    <Popover
                      content={
                        <div>
                          <div>{popoverState.content}</div>
                          <a
                            style={{
                              textAlign: 'center',
                              display: 'block',
                              textDecoration: 'underline',
                            }}
                            onClick={() => {
                              formSendCode.setFieldsValue({
                                resetEmail: form.getFieldValue('email'),
                              });
                              handleSendResetCode();
                            }}
                          >
                            Forgot?
                          </a>
                        </div>
                      }
                      visible={popoverState.visible === 'login'}
                      placement="bottom"
                    >
                      <Form.Item name="password" className={styles.password}>
                        <Input
                          ref={passwdRef}
                          type="password"
                          placeholder="Password"
                          size="large"
                          onPressEnter={handleFormLogin}
                          suffix={
                            <LoginSuffix
                              loading={isLoggingIn}
                              onClick={handleFormLogin}
                              condition={status === 'login'}
                            />
                          }
                        />
                      </Form.Item>
                    </Popover>
                    <Row justify="start">
                      <Col>
                        <Form.Item name="rememberEmail" noStyle valuePropName="checked">
                          <Checkbox>Remember email</Checkbox>
                        </Form.Item>
                      </Col>
                      <Col flex={1}>
                        <a
                          style={{ position: 'absolute', right: 0 }}
                          onClick={() => {
                            formSendCode.setFieldsValue({
                              resetEmail: form.getFieldValue('email'),
                            });
                            resetPopoverState();
                            handleSendResetCode();
                          }}
                        >
                          Forgot password?
                        </a>
                      </Col>
                    </Row>
                  </>
                )}
              </div>
              {status === 'signup' && (
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%' }}
                    onClick={() => {
                      setVisible(true);
                    }}
                  >
                    <span>SIGN UP</span>
                  </Button>
                </Form.Item>
              )}
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane key="reset-passwd-verify">
            <Form form={formSendCode}>
              <Form.Item name="resetEmail">
                <Input
                  placeholder="Email to reset password"
                  size="large"
                  disabled
                  autoComplete="off"
                  readOnly
                  suffix={
                    <LoginSuffix
                      icon={<span style={{ fontSize: 14 }}>resend</span>}
                      loadingIcon={
                        <span style={{ fontSize: 14, color: '#ccc' }}>{resendTminus}</span>
                      }
                      loading={tminusFired}
                      onClick={handleResendResetCode}
                      condition={!tminusFired}
                    />
                  }
                />
              </Form.Item>
              <Popover
                visible={popoverState.visible === 'reset-code'}
                content={popoverState.content}
                placement="bottom"
              >
                <Form.Item name="resetCode">
                  <Input
                    placeholder="Verification code"
                    size="large"
                    autoComplete="off"
                    maxLength={6}
                    suffix={
                      <LoginSuffix
                        loading={isCheckingResetCode}
                        condition={status === 'reset-passwd-verify'}
                        onClick={handleCheckResetCode}
                      />
                    }
                  />
                </Form.Item>
              </Popover>
              <Form.Item>
                <Button
                  type="primary"
                  style={{ width: '100%' }}
                  onClick={() => {
                    formSendCode.resetFields();
                    setStatus('login');
                  }}
                >
                  <span>BACK</span>
                </Button>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane key="reset-passwd-set-new">
            <Popover
              visible={popoverState.visible === 'reset-new'}
              content={popoverState.content}
              placement="bottom"
            >
              <Form form={formNewPasswd} onFinish={handleResetPassword}>
                <Form.Item name="resetNewPasswd">
                  <Input placeholder="New password" size="large" type="password" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%' }}
                    loading={isResettingPasswd || isLoggingIn}
                  >
                    <span>RESET AND LOGIN</span>
                  </Button>
                </Form.Item>
              </Form>
            </Popover>
          </Tabs.TabPane>
        </Tabs>
      </Popover>
    </div>
  );
};

export default LandingLogin;
