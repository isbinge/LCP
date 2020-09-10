import React from 'react';
import { Modal, Input, Form } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { FormattedMessage as FM, useIntl } from 'react-intl';

interface OrgFormProps {
  visible: boolean;
  onCancel: () => void;
}

const CreateOrgModal: React.FC<OrgFormProps> = (props) => {
  const { visible, onCancel } = props;
  const intl = useIntl();
  const [createOrgLoading] = useSelector(({ loading }) => [
    loading.effects['organization/createOrg'],
  ]);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const handleCreateOrg = (values: { [key: string]: unknown }) => {
    const orgPayload = {
      // address: values.address,
      companyName: values.name,
      // email: values.email,
      // tel: values.tel,
      // currentUserId: userId,
    };
    dispatch({
      type: 'organization/createOrg',
      payload: orgPayload,
    }).then(() => {
      onCancel();
      form.resetFields();
    });
  };

  return (
    <Modal
      maskClosable={false}
      title={<FM id="org.create" />}
      confirmLoading={createOrgLoading}
      visible={visible}
      onCancel={onCancel}
      onOk={form.submit}
      width={550}
      afterClose={form.resetFields}
    >
      <Form form={form} onFinish={handleCreateOrg}>
        <Form.Item
          label={<FM id="org.create" />}
          name="name"
          style={{ padding: '0 15%' }}
          rules={[
            {
              required: true,
              max: 20,
              min: 2,
              message: intl.formatMessage({ id: 'org.create.validation' }),
            },
          ]}
        >
          <Input placeholder={intl.formatMessage({ id: 'org.create.ph' })} />
        </Form.Item>
        {/* <Form.Item label="Address" name="address" rules={[{ required: true }]}>
          <Input placeholder="Please enter address" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="Please enter email" />
        </Form.Item>
        <Form.Item label="Tel" name="tel" rules={[{ required: true }]}>
          <Input placeholder="Please enter telephone number" />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

CreateOrgModal.defaultProps = {
  visible: false,
};

export default CreateOrgModal;
