import React, { useEffect, useMemo, ReactText, useState } from 'react';
import {
  Select,
  // Input,
  Tabs,
  Tree,
  Menu,
} from 'antd';
import { useSelector, useDispatch } from 'dva';
import { debounce } from 'lodash';

import { OwnerControl } from '@/domain/form/template/system/adapter/adapter-type';
import {
  FormattedMessage as FM,
  // useIntl
} from 'react-intl';
import { UserOutlined } from '@ant-design/icons';
import { TreeProps } from 'antd/lib/tree';

import { actions } from '@comp/formily-custom/form-record';
import { SelectionRangeTabType } from '@/domain/form/template/common';
import { MemberInfoDto } from '@/domain/organization/data';
import {
  RoleMember,
  // RoleDto
} from '@/domain/role/data';
import FormRecordData from '@/domain/form/instance/data';
import useSelectionRange from '@/domain/form/instance/hooks/useSelectionRange';
import { useFormEffects } from '@formily/antd';
import LoadingWave from '@comp/LoadingWave';
import styles from '../owner.scss';

const { TabPane } = Tabs;

// const { Search } = Input;
interface OwnerValue {
  userId: string;
  name: string;
}

interface MemberList extends OwnerValue {
  memberId: string;
}

interface OwnerProps {
  value: OwnerValue | null;
  onChange: (value: OwnerValue | null) => void;
  ownerControl: OwnerControl;
  /**
   * 创建或者更新
   *
   * @type {boolean}
   * @memberof OwnerProps
   */
  isCreate: boolean;
  /**
   * 当前用户所在部门
   *
   * @type {FormRecordData.OwnerDeptValue[]}
   * @memberof OwnerProps
   */
  ownerDepts?: FormRecordData.OwnerDeptValue[];
}

const Owner: React.FC<OwnerProps> = (props) => {
  const { value: ownerValue, onChange: handleChange, ownerControl, ownerDepts, isCreate } = props;
  const dispatch = useDispatch();
  // const intl = useIntl();
  const [deptMemberList, setDeptMemberList] = useState<MemberList[]>([]);
  const [roleMemberList, setRoleMemberList] = useState<MemberList[]>([]);
  const [otherMemberList, setOtherMemberList] = useState<MemberList[]>([]);
  const [ctrlMemberList, setCtrlMemberList] = useState<MemberList[]>([]);
  const [defaultOrgId, isDeptLoading, isRoleLoading] = useSelector(({ account, loading }) => [
    account.defaultOrgId,
    loading.effects['organization/getDeptMembers'],
    loading.effects['role/getRoleMembers'],
  ]);
  const { unitSelectionRange: unitSelectionRangeString } = ownerControl;
  const { dispatch: uformDispatch } = actions;

  // 填充条件
  const filledMappings = useMemo(
    () => ({
      deptMappingField: ownerControl.deptMappingField || null,
      emailMappingField: ownerControl.emailMappingField || null,
      genderMappingField: ownerControl.genderMappingField || null,
      mobileMappingField: ownerControl.mobileMappingField || null,
    }),
    [ownerControl],
  );

  const {
    unitSelectionRange,
    deptTreeData,
    roleTreeData,
    otherTreeData,
    deptCtrlTreeData,
  } = useSelectionRange(unitSelectionRangeString, useFormEffects, ownerDepts);

  const fetchDeptMemberDebounce = debounce(
    (id: ReactText, setData: (members: MemberList[]) => void) => {
      dispatch<{ members: MemberInfoDto[] }>({
        type: 'organization/getDeptMembers',
        payload: { id, start: 0, length: 0 },
      }).then(({ members }) => {
        setData(
          members.map((member) => ({
            userId: member?.userId || '',
            name: member.name || '',
            memberId: member.id,
          })),
        );
      });
    },
    200,
  );

  const fetchRoleMemberDebounce = debounce((id: ReactText) => {
    dispatch<{ members: RoleMember[] }>({
      type: 'role/getRoleMembers',
      payload: { id, start: 0, length: 0 },
    }).then(({ members }) => {
      setRoleMemberList(
        members.map((member) => ({
          userId: member.userId,
          name: member.name || '',
          memberId: member.id,
        })),
      );
    });
  }, 200);

  useEffect(() => {
    if (isCreate) {
      dispatch<{ members: MemberInfoDto[] }>({
        type: 'organization/requestMembers',
        payload: { deptId: defaultOrgId },
      }).then((res) => {
        const userInfo = res.members.find((member) => member.userId === ownerValue?.userId);
        if (uformDispatch && userInfo) {
          uformDispatch('ownerValueChange', {
            // createRecord 自动获取当前用户
            payload: { memberId: userInfo.id, filledMappings, isAuto: true },
          });
        }
      });
    }
  }, []);

  const handleDeptsSelect: TreeProps['onSelect'] = (selectedKeys) => {
    if (selectedKeys[0]) {
      fetchDeptMemberDebounce(selectedKeys[0], setDeptMemberList);
    }
  };

  const handleOtherSelect: TreeProps['onSelect'] = (selectedKeys) => {
    if (selectedKeys[0]) {
      fetchDeptMemberDebounce(selectedKeys[0], setOtherMemberList);
    }
  };

  const hanldeCtrlSelect: TreeProps['onSelect'] = (selectedKeys) => {
    if (selectedKeys[0]) {
      fetchDeptMemberDebounce(selectedKeys[0], setCtrlMemberList);
    }
  };

  const handleRoleSelect: TreeProps['onSelect'] = (selectedKeys) => {
    if (selectedKeys[0]) {
      fetchRoleMemberDebounce(selectedKeys[0]);
    }
  };

  // 生成成员列表
  const generateList = (dataList: MemberList[]) =>
    dataList.length ? (
      <Menu selectedKeys={ownerValue ? [ownerValue?.userId] : undefined} className={styles.menu}>
        {dataList.map((member) => (
          <Menu.Item
            icon={<UserOutlined />}
            className={styles.menuItem}
            key={member.userId}
            onClick={() => {
              handleChange({
                userId: member.userId,
                name: member.name,
              });
              // 发生uform dispatch 填充
              if (uformDispatch) {
                uformDispatch('ownerValueChange', {
                  payload: { memberId: member.memberId, filledMappings, isAuto: false },
                });
              }
            }}
          >
            {member.name}
          </Menu.Item>
        ))}
      </Menu>
    ) : (
      <div className={styles.noPlaceholder}>
        <FM id="forminst.schema.owner.nomember" />
      </div>
    );

  const handleDeselect = () => {
    handleChange(null);
    // 发生uform dispatch 填充
    if (uformDispatch) {
      uformDispatch('ownerValueChange', {
        payload: { memberId: null, filledMappings, isAuto: false },
      });
    }
  };

  return (
    <Select
      mode="tags"
      value={(ownerValue && [ownerValue.name]) || []}
      dropdownClassName={styles.dorpDown}
      onDeselect={handleDeselect}
      dropdownRender={() => (
        <>
          {/* <Search
            placeholder={intl.formatMessage({ id: 'dict.search' })}
            className={styles.search}
            allowClear
          /> */}
          <Tabs className={styles.tabStyle} key={SelectionRangeTabType.DEPT}>
            {unitSelectionRange.dept && (
              <TabPane
                tab={<FM id="formtpl.schema.owner.modal.dept" />}
                key={SelectionRangeTabType.DEPT}
                className={styles.tabPaneStyle}
              >
                <Tree
                  className={styles.ownerTreeStyle}
                  onSelect={handleDeptsSelect}
                  defaultExpandedKeys={deptTreeData && [deptTreeData[0]?.key]}
                  treeData={deptTreeData}
                />
                <div className={styles.listWrapper}>
                  <LoadingWave size="medium" loading={!!isDeptLoading}>
                    {generateList(deptMemberList)}
                  </LoadingWave>
                </div>
              </TabPane>
            )}
            {unitSelectionRange.role?.length && (
              <TabPane
                tab={<FM id="formtpl.schema.owner.modal.role" />}
                key={SelectionRangeTabType.ROLE}
                className={styles.tabPaneStyle}
              >
                <Tree
                  className={styles.ownerTreeStyle}
                  onSelect={handleRoleSelect}
                  treeData={roleTreeData}
                />
                <div className={styles.listWrapper}>
                  <LoadingWave size="medium" loading={!!isRoleLoading}>
                    {generateList(roleMemberList)}
                  </LoadingWave>
                </div>
              </TabPane>
            )}
            {unitSelectionRange.deptCtrl?.length && (
              <TabPane
                tab={<FM id="formtpl.schema.owner.modal.deptctrl" />}
                key={SelectionRangeTabType.DEPT_CTRL}
                className={styles.tabPaneStyle}
              >
                <Tree
                  className={styles.ownerTreeStyle}
                  onSelect={hanldeCtrlSelect}
                  treeData={deptCtrlTreeData}
                />
                <div className={styles.listWrapper}>
                  <LoadingWave size="medium" loading={!!isDeptLoading}>
                    {generateList(ctrlMemberList)}
                  </LoadingWave>
                </div>
              </TabPane>
            )}

            {unitSelectionRange.other?.length && (
              <TabPane
                tab={<FM id="forminst.schema.owner.mydept" />}
                key={SelectionRangeTabType.OTHER}
                className={styles.tabPaneStyle}
              >
                <Tree
                  className={styles.ownerTreeStyle}
                  onSelect={handleOtherSelect}
                  treeData={otherTreeData}
                />
                <div className={styles.listWrapper}>
                  <LoadingWave size="medium" loading={!!isDeptLoading}>
                    {generateList(otherMemberList)}
                  </LoadingWave>
                </div>
              </TabPane>
            )}
          </Tabs>
        </>
      )}
    />
  );
};

export default Owner;
