import React, { useState, useEffect } from 'react';
import { Form, Input, Modal, Button, Select, Spin } from 'antd';
import { useSelector, useDispatch, useParams } from 'dva';
import { useIntl, FormattedMessage as FM } from 'react-intl';
import { flatten, uniq } from 'lodash';

import CustomTag from '@/pages/Organization/components/CustomTag';
import { MemberInfoDto } from '@/domain/organization/data.d';
import { flattenData } from '@/domain/organization/utils';

import { msgIntl } from '@comp/i18n/MessageIntl';
import TreeSelectModal from '../TreeSelectModal';
import styles from './index.scss';

interface MemberModal {
  visible: boolean;
  onCancel: () => void;
  onDelete: (memberIds: string[]) => void;
  memberId: string | null;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const UpdateMemberModal: React.FC<MemberModal> = (props) => {
  const { visible, onCancel, memberId, onDelete } = props;
  const intl = useIntl();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { deptId: currentDeptId } = useParams();

  const [
    { depts },
    { defaultOrgId: currentOrgId },
    { roleGroups },
    updateMemberLoading,
    requestMemberLoading,
    getRolesLoading,
    deleteMembersLoading,
  ] = useSelector(({ organization, account, role, loading }) => [
    organization,
    account,
    role,
    loading.effects['organization/updateMember'],
    loading.effects['organization/requestMemberInfo'],
    loading.effects['role/getRoles'],
    loading.effects['organization/deleteMembers'],
  ]);
  const [member, setMember] = useState<Nullable<MemberInfoDto>>(null);
  const [deptModalVisible, setDeptModalVisible] = useState(false);
  const [selectedDeptIds, setSelectedDeptIds] = useState<string[]>([]);
  const allRoles = flatten(roleGroups.map((roleGroup) => roleGroup.children));

  useEffect(() => {
    if (memberId && visible) {
      dispatch<MemberInfoDto, { id: string }>({
        type: 'organization/requestMemberInfo',
        payload: {
          id: memberId,
        },
      })
        .then((memberInfo) => {
          setMember(memberInfo);
          form.setFieldsValue({
            name: memberInfo?.name,
            email: memberInfo?.email,
            roles: memberInfo?.roleNames ? uniq(memberInfo.roleNames.split(';')) : [],
          });
          if (memberInfo.departmentIds) {
            setSelectedDeptIds(memberInfo.departmentIds.split(';'));
          }
        })
        .catch((e) => {
          msgIntl.error({
            content: e,
          });
        });
    }
  }, [visible]); // fix: keep data fresh
  useEffect(() => {
    if (visible) {
      dispatch({ type: 'role/getRoles', payload: { id: currentOrgId } });
    }
  }, [visible]);

  // any for antd Form store
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateMember = (formState: { [key: string]: any }) => {
    if (memberId) {
      const deptIds = selectedDeptIds.filter((deptId) => deptId !== currentOrgId);
      dispatch({
        type: 'organization/updateMember',
        payload: {
          deptIds,
          id: memberId,
          roleIds: formState.roles.map(
            (roleName: string) => allRoles.find((_role) => _role.roleName === roleName)?.roleId,
          ),
          // name: formState.name,
          email: formState.email,
        },
      })
        .then(() => {
          onCancel();
          dispatch({
            type: 'organization/requestMembers',
            payload: {
              deptId: currentDeptId,
            },
          });
        })
        .catch((e) => {
          msgIntl.error({
            content: e,
          });
        });
    }
  };

  const getSelectDeptTag = () => {
    if (selectedDeptIds.length > 0) {
      return (
        <span className={styles.deptTag}>
          {flattenData(depts)
            .filter((flattenedDept) => selectedDeptIds.includes(flattenedDept.id))
            .map((flattenedDept) => (
              <CustomTag icon="cluster" key={flattenedDept.id} title={flattenedDept.name} />
            ))}
        </span>
      );
    }
    return null;
  };
  const modalTitle = (
    <span>
      <FM id="dict.edit" /> - {member?.name} (
      {member?.isAcceptInvited ? <FM id="org.common.joined" /> : <FM id="org.common.inviting" />})
    </span>
  );
  const renderRoleOptions = () => {
    return allRoles.map((role) => (
      <Select.Option key={role.roleId} value={role.roleName}>
        {role.roleName}
      </Select.Option>
    ));
  };
  return (
    <Modal
      // destroyOnClose
      title={modalTitle}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
      className={styles.updateMemberMdl}
    >
      {requestMemberLoading ? (
        <Spin />
      ) : (
        <Form {...layout} form={form} onFinish={handleUpdateMember}>
          <Form.Item
            label={<FM id="org.common.name" />}
            name="name"
            rules={[{ required: true }, { max: 12 }]}
          >
            <Input
              disabled
              placeholder={intl.formatMessage({ id: 'org.member.input.name.placeholder' })}
              id="name"
            />
          </Form.Item>
          <Form.Item
            label={<FM id="dict.email" />}
            name="email"
            rules={[
              {
                type: 'email',
                required: true,
              },
            ]}
          >
            <Input
              disabled
              id="email"
              placeholder={intl.formatMessage({ id: 'org.member.email.ph' })}
            />
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
          <Form.Item label={<FM id="role.name" />} name="roles">
            <Select id="roles" optionFilterProp="label" mode="multiple" loading={getRolesLoading}>
              {renderRoleOptions()}
            </Select>
          </Form.Item>
        </Form>
      )}

      <div className={styles.footerButtons}>
        <Button
          type="primary"
          loading={updateMemberLoading}
          onClick={() => {
            form.submit();
          }}
        >
          <span>
            <FM id="dict.modify" />
          </span>
        </Button>
        <Button
          danger
          loading={deleteMembersLoading}
          onClick={() => {
            if (member) {
              onDelete([member.id]);
              onCancel();
            }
          }}
        >
          <span>
            <FM id="dict.delete" />
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

export default UpdateMemberModal;
