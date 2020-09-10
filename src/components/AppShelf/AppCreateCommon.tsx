import React from 'react';
import { Modal, Form, Input } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { useIntl, FormattedMessage as FM } from 'react-intl';

interface AppCreateCommon extends Omit<ModalProps, 'onOk'> {
  visible: boolean;
  onOk?: (appName: string) => void;
  name?: string;
}

const AppCreateCommon: React.FC<AppCreateCommon> = ({
  onOk,
  onCancel,
  visible,
  name,
  ...props
}) => {
  const intl = useIntl();
  const [form] = Form.useForm();

  return (
    <Modal
      onOk={() => {
        form.validateFields().then(values => {
          if (onOk) {
            onOk(values.appName);
          }
        });
      }}
      onCancel={e => {
        if (onCancel) {
          onCancel(e);
        }
      }}
      afterClose={() => {
        form.resetFields();
      }}
      title={<FM id={name ? 'home.appshelf.edit' : 'home.appshelf.create.commonapp'} />}
      visible={visible}
      {...props}
    >
      <Form form={form} initialValues={{ appName: name ?? '' }}>
        <Form.Item
          name="appName"
          rules={[
            { required: true, message: <FM id="appheader.validation.emptyinput" /> },
            { min: 2, max: 15, message: <FM id="appheader.validation.illegallength" /> },
          ]}
          label={<FM id="home.appshelf.create.appname" />}
          labelCol={{ span: 6 }}
          wrapperCol={{ offset: 1, span: 15 }}
        >
          <Input placeholder={intl.formatMessage({ id: 'home.appshelf.create.appname.ph' })} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppCreateCommon;
