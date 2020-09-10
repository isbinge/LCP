import React, { useState } from 'react';
import { Form, Input, Modal, Button } from 'antd';
import { useSelector, useDispatch, useRouteMatch } from 'dva';
import { useIntl, FormattedMessage as FM } from 'react-intl';

import { SelectState } from '@/domain/select';
import CustomTag from '@/pages/Organization/components/CustomTag';
import { Member } from '@/domain/organization/data.d';
import { flattenData } from '@/domain/organization/utils';

import { msgIntl } from '@comp/i18n/MessageIntl';
import TreeSelectModal from '../TreeSelectModal';

import styles from './index.scss';

interface MemberInfo {
  visible: boolean;
  onCancel: () => void;
  currentMember?: Member;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const InviteMemberModal: React.FC<MemberInfo> = (props) => {
  const { visible, onCancel } = props;
  const intl = useIntl();
  const [form] = Form.useForm();
  const dispatch: Dva.Dispatch = useDispatch();
  const currentDeptId = useRouteMatch<{ orgId: string; deptId: string }>('/org/:orgId/dept/:deptId')
    ?.params?.deptId;
  const [
    { depts },
    { defaultOrgId: currentOrgId },
    inviteMemberLoading,
  ] = useSelector(({ organization, account, loading }: SelectState) => [
    organization,
    account,
    loading.effects['organization/inviteMember'],
  ]);
  const [deptModalVisible, setDeptModalVisible] = useState(false);
  const [selectedDeptIds, setSelectedDeptIds] = useState<string[]>([]);

  const resetForm = () => {
    form.resetFields();
    setSelectedDeptIds([]);
  };

  const handleInvite = (formState: { [key: string]: unknown }) => {
    const deptIds = selectedDeptIds.filter((deptId) => deptId !== currentOrgId);
    dispatch({
      type: 'organization/inviteMember',
      payload: {
        // name: formState.name,
        email: formState.email,
        deptIds,
      },
    })
      .then(() => {
        onCancel();
        resetForm();
        if (currentDeptId) {
          dispatch({
            type: 'organization/requestMembers',
            payload: {
              deptId: currentDeptId,
            },
          });
        }
      })
      .catch((e) => {
        msgIntl.error({ content: e });
      });
  };

  const getSelectDeptTag = () => {
    if (selectedDeptIds.length > 0) {
      return (
        <div>
          {flattenData(depts)
            .filter((flattenedDept) => selectedDeptIds.includes(flattenedDept.id))
            .map((flattenedDept) => (
              <CustomTag icon="cluster" key={flattenedDept.id} title={flattenedDept.name} />
            ))}
        </div>
      );
    }
    return null;
  };
  return (
    <Modal
      destroyOnClose
      title={<FM id="org.member.invite" />}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
    >
      <Form {...layout} form={form} onFinish={handleInvite}>
        {/* <Form.Item
          label={<FM id="org.common.name" />}
          name="name"
          rules={[
            {
              required: true,
              min: 2,
              max: 15,
              message: intl.formatMessage({ id: 'org.member.name.validation' }),
            },
          ]}
        >
          <Input
            placeholder={intl.formatMessage({ id: 'org.member.input.name.placeholder' })}
            id="name"
          />
        </Form.Item> */}
        {/* <Form.Item
        label={<FM id="org.common.mobile" />}
        name="mobile"
        rules={[{ required: phoneRequire }]}
        >
        <Input
            placeholder={intl.formatMessage({ id: 'org.member.input.require.ph' })}
            addonBefore={PrefixSelector}
            onChange={(e) => setEmailRequire(e.target.value === '')}
        />
        </Form.Item> */}
        <Form.Item
          label={<FM id="dict.email" />}
          name="email"
          rules={[
            {
              type: 'email',
              required: true,
              message: intl.formatMessage({ id: 'org.member.email.validation' }),
            },
          ]}
        >
          <Input id="email" placeholder={intl.formatMessage({ id: 'org.member.email.ph' })} />
        </Form.Item>
        <Form.Item label={<FM id="org.dept.name" />} name="departments">
          <div
            onClick={() => setDeptModalVisible(true)}
            data-display-dept={selectedDeptIds.length > 0}
            data-select-dept={selectedDeptIds.length <= 0}
            className={styles.departmentBlock}
          >
            {getSelectDeptTag()}
            {selectedDeptIds.length <= 0 && (
              <div className={styles.addDep}>
                <span className={styles.plus}>+</span>
                <span>
                  <FM id="org.dept.select" />
                </span>
              </div>
            )}
          </div>
        </Form.Item>
      </Form>
      <div className={styles.footerButtons}>
        <Button
          type="primary"
          loading={inviteMemberLoading}
          onClick={() => {
            form.submit();
          }}
        >
          <span>
            <FM id="org.common.invite" />
          </span>
        </Button>
        <Button
          onClick={() => {
            resetForm();
          }}
        >
          <span>
            <FM id="org.common.clear" />
          </span>
        </Button>
      </div>
      <TreeSelectModal
        multiple={false}
        visible={deptModalVisible}
        onConfirm={(keys) => {
          setSelectedDeptIds(keys);
          setDeptModalVisible(false);
        }}
        onCancel={() => {
          setDeptModalVisible(false);
        }}
        tabName={<FM id="org.name" />}
        treeDataSource={depts}
        title={<FM id="org.dept.name" />}
        defaultSelectedKeys={selectedDeptIds}
      />
    </Modal>
  );
};

export default InviteMemberModal;
