import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Steps, message, Row, Col, Tabs, Checkbox, Result } from 'antd';
import { useDispatch, useSelector } from 'dva';
import LcpConst from '@/constants';
import { useLogger } from '@/utils/hooks/use-logger';
import { useInterval } from 'react-use';
import { LoadingOutlined } from '@ant-design/icons';
import { StepProps } from 'antd/lib/steps';
import { InputProps } from 'antd/lib/input';
import Emoji from '@comp/Emoji';
import { LoginStatus } from '..';

const { TabPane } = Tabs;

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

interface TwoFAInputProps extends Omit<InputProps, 'onChange'> {
  rule: RegExp;
  onChange?: (value: string) => void | undefined;
}

/**
 * Not compatitable with antd.Form
 */
const TwoFAInput: React.FC<TwoFAInputProps> = (props) => {
  const onChange: InputProps['onChange'] = (e) => {
    const { value: targetValue } = e.target;
    if ((props.rule instanceof RegExp && props.rule.test(targetValue)) || targetValue === '') {
      if (props.onChange) {
        props.onChange(targetValue);
      }
    }
  };

  return <Input {...props} onChange={onChange} />;
};

interface RegisterProps {
  email: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setStatus: (status: LoginStatus) => void;
}

const Register: React.FC<RegisterProps> = ({ email, visible, setVisible, setStatus }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formRegister] = Form.useForm();
  const dispatch = useDispatch();
  const [resendTminus, setResendTminus] = useState(LcpConst.ACCOUNT_REGISTER_RESEND_EMAIL_TMINUS);
  const [tminusFired, setTminusFired] = useState(false);
  const [veriCode, setVeriCodeValue] = useState<string>();
  const isRegistering = useSelector((state) => state.loading.effects['account/register']);
  const log = useLogger('register');

  useEffect(() => {
    formRegister.setFields([{ name: 'email', value: email }]);
  }, [email]);

  useInterval(
    () => {
      if (resendTminus > 0) {
        setResendTminus((prev) => prev - 1);
      } else {
        handleReset();
      }
    },
    tminusFired ? 1000 : null,
  );

  const handleVeriCodeChange = (value: string) => {
    setVeriCodeValue(value);
  };

  function handleReset() {
    setResendTminus(LcpConst.ACCOUNT_REGISTER_RESEND_EMAIL_TMINUS);
    setTminusFired(false);
  }

  function nextStep() {
    setCurrentStep((prev) => prev + 1);
  }

  function prevStep() {
    setCurrentStep((prev) => prev - 1);
  }

  function sendVeriCode() {
    setTminusFired(true);
    return dispatch({
      type: 'account/registerSendCode',
      payload: {
        email: formRegister.getFieldValue('email'),
      },
    });
  }

  function generateStatus(idx: number, loading?: boolean): Partial<StepProps> {
    if (idx === currentStep) {
      return {
        status: 'process',
        icon: loading && <LoadingOutlined />,
      };
    }
    if (idx < currentStep) {
      return {
        status: 'finish',
      };
    }
    return {
      status: 'wait',
    };
  }

  function handleRegister() {
    log('2facode', veriCode);
    if (!veriCode || (veriCode && !/^\w{6}$/g.test(veriCode))) {
      return;
    }
    formRegister.validateFields().then((values) => {
      log('step2', values);
      dispatch({
        type: 'account/register',
        payload: {
          name: values.name.trim(),
          email: values.email,
          authCode: veriCode,
          password: values.password,
          companyName: values.orgName || null,
        },
      })
        .then(() => nextStep())
        .catch(() => {
          message.error('Registering failed, check your verification code');
        });
    });
  }

  const stepFooters = [
    <Button
      type="primary"
      style={{ margin: 8 }}
      onClick={() => {
        formRegister.validateFields().then((values) => {
          log('step1', values);
          if (!tminusFired) {
            sendVeriCode();
            setTminusFired(true);
          }
          nextStep();
        });
      }}
    >
      Next
    </Button>,
    <>
      <Button style={{ margin: 8 }} onClick={() => prevStep()}>
        Previous
      </Button>
      <Button
        type="primary"
        onClick={handleRegister}
        disabled={isRegistering || (veriCode ?? '').length < 6}
        loading={isRegistering}
      >
        Register
      </Button>
    </>,
    <Button
      type="primary"
      style={{ margin: 8 }}
      onClick={() => {
        abortRegister(() => setStatus('login'));
      }}
    >
      Done
    </Button>,
  ];

  function abortRegister(cb?: Function) {
    if (cb) cb();
    setVisible(false);
    formRegister.resetFields();
    setCurrentStep(0);
  }

  return (
    <Modal
      title="Sign up"
      visible={visible}
      style={{ minWidth: 640 }}
      onCancel={() => abortRegister()}
      footer={<div className="steps-action">{stepFooters[currentStep]}</div>}
    >
      <Steps current={currentStep}>
        <Steps.Step title="Information" {...generateStatus(0)} />
        <Steps.Step title="Verification" {...generateStatus(1)} />
        <Steps.Step title="Completed" {...generateStatus(2, isRegistering)} />
      </Steps>
      <div className="steps-content">
        <Tabs defaultActiveKey="0" renderTabBar={() => <div />} activeKey={currentStep.toString()}>
          <TabPane key="0">
            <div style={{ marginTop: 16 }}>
              <Form
                {...formItemLayout}
                wrapperCol={{ span: 12 }}
                form={formRegister}
                initialValues={{ email }}
              >
                <Form.Item label="Email" name="email">
                  <div className="ant-form-text">{formRegister.getFieldValue('email')}</div>
                </Form.Item>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    { required: true, message: 'Please input your name' },
                    { max: 50, min: 2, message: 'Name must be between 2 and 50 characters' },
                    {
                      pattern: new RegExp('^(?!.*[_]{2,})[\\u4e00-\\u9fa5\\w\\s_-]*$', 'g'),
                      message:
                        'Name can only be characters, numbers, and non-continuous underscores',
                    },
                  ]}
                >
                  <Input placeholder="Your name" type="text" />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: 'Please input your password' },
                    { min: 6, max: 20, message: 'Password must be between 6 and 20 characters' },
                    {
                      pattern: new RegExp('^[0-9a-zA-Z$-/:-?{-~!"^_`[\\]]*$', 'g'),
                      message: 'Password can only be numbers, characters, and regular symbols',
                    },
                    ({ getFieldValue }) => ({
                      validator: async (_, value) => {
                        if (value === getFieldValue('name')) {
                          return Promise.reject('Password and the name can not be the same');
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input placeholder="Password" type="password" autoComplete="off" />
                </Form.Item>
                <Form.Item
                  label="Confirm password"
                  name="passwordConfirm"
                  rules={[
                    { required: true, message: 'Please input your password again' },
                    ({ getFieldValue }) => ({
                      validator: async (_, value) => {
                        if (value !== getFieldValue('password')) {
                          return Promise.reject('Passwords do not match');
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <Input placeholder="Confirm your password" type="password" autoComplete="off" />
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      Organization <em style={{ color: '#aaa' }}>(optional)</em>
                    </span>
                  }
                  name="orgName"
                  rules={[
                    { required: false },
                    {
                      max: 20,
                      min: 2,
                      message: 'If provided, organization name must be between 2-20 characters',
                    },
                  ]}
                >
                  <Input placeholder="Create your own organization" />
                </Form.Item>
                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value ? Promise.resolve() : Promise.reject('Should accept agreement'),
                    },
                  ]}
                  {...tailFormItemLayout}
                >
                  <Checkbox>
                    I have read the <a href="">agreement</a>
                  </Checkbox>
                </Form.Item>
              </Form>
            </div>
          </TabPane>
          <TabPane key="1">
            <div>
              <div style={{ marginTop: 16 }}>
                <div>
                  We&apos;ve sent you an email with the 6-word verification code, please check your
                  inbox
                </div>
                <div>
                  The code is valid in 10 minutes, if you did not recieve the email, check your junk
                  folder or request a{' '}
                  {tminusFired ? 'resend' : <a onClick={sendVeriCode}>resend</a>} after{' '}
                  {resendTminus} seconds
                </div>
              </div>
              <div style={{ padding: 24 }}>
                <Row justify="center">
                  <Col>
                    <TwoFAInput
                      autoComplete="off"
                      rule={/^\w+$/g}
                      placeholder="000000"
                      onPressEnter={handleRegister}
                      maxLength={6}
                      style={{
                        width: 220,
                        height: 60,
                        fontSize: 32,
                        textAlign: 'center',
                        fontFamily: 'courier, monospace',
                      }}
                      value={veriCode}
                      onChange={handleVeriCodeChange}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </TabPane>
          <TabPane key="2">
            <Result
              style={{ padding: '24px 16px' }}
              icon={<Emoji symbol="🚀" label="success" style={{ fontSize: 50 }} />}
              title={<span style={{ color: '#3f91f7' }}>Success!</span>}
              subTitle={
                <span style={{ fontSize: 14 }}>
                  Welcome, now you can login and try some amazing features!
                </span>
              }
            />
          </TabPane>
        </Tabs>
      </div>
    </Modal>
  );
};

export default Register;
