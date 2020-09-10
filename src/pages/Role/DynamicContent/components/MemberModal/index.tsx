import React, { useEffect, useState, useMemo } from 'react';
import { Modal, Checkbox, Row, Tree, Empty, Button } from 'antd';
import { useDispatch, useSelector } from 'dva';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Department, Member } from '@/domain/organization/data.d';
import { TreeProps } from 'antd/lib/tree';
import { intersection, uniqBy } from 'lodash';

import { FormattedMessage as FM, useIntl } from 'react-intl';

import SearchableTag from '@comp/SearchableTag';
import { msgIntl } from '@comp/i18n/MessageIntl';
import first from 'lodash/first';
import LoadingWave from '@comp/LoadingWave';
import styles from './index.scss';

// type User = { id: string; name: string };

interface MemberModalProps {
  visible: boolean;
  onCancel: () => void;
  selectedMembers: Member[];
  onOk: (users: Member[]) => void;
}

export interface DataSourceProps {
  id: string;
  name: string;
  childrens?: DataSourceProps[];
}

const generateTreeData = (data: Department[]): TreeProps['treeData'] =>
  data.map((item) => ({
    key: item.id,
    title: item.name,
    children: item.childrens ? generateTreeData(item.childrens) : [],
  }));

const isSelectedMembersIncludeAccountOfMember = (
  currSelectedMembers: Member[],
  members: Member[],
) => {
  const commonMemberIds = intersection(
    currSelectedMembers.map((member) => member.id),
    members.map((member) => member.id),
  );
  return commonMemberIds.length === members.length;
};

interface MemberListProps {
  members: Member[];
  onChange: (e: CheckboxChangeEvent) => void;
  selectedMemberIds: string[];
}

const MemberList: React.FC<MemberListProps> = (props) => {
  const { members, onChange, selectedMemberIds } = props;
  return (
    <Checkbox.Group value={selectedMemberIds}>
      {members.map((member) => (
        <Row key={member.id} className={styles.gutterRow}>
          <Checkbox onChange={onChange} value={member.id}>
            {member.name}
          </Checkbox>
        </Row>
      ))}
    </Checkbox.Group>
  );
};

const MemberModal: React.FC<MemberModalProps> = (props) => {
  const { visible, onCancel, selectedMembers: defaultSelectedMembers, onOk } = props;
  const intl = useIntl();
  const dispatch: Dva.Dispatch = useDispatch();

  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [accountsOfMember, setAccountsOfMember] = useState<Member[]>([]);
  const [depts, setDepts] = useState<Department[]>([]);
  const [searchName, setSearchName] = useState<Nullable<string>>(null);

  const getDeptMembersLoading = useSelector(
    ({ loading }) => loading.effects['organization/getDeptMembers'],
  );
  const [{ defaultOrgId }] = useSelector(({ account }) => [account]);

  const handleSelectMember = (e: CheckboxChangeEvent) => {
    const checkedMemberId = e.target.value;
    let selectedMembersList: Member[] = [];
    if (e.target.checked) {
      const checkedMember = accountsOfMember.find((member) => member.id === checkedMemberId);
      if (checkedMember) {
        selectedMembersList = [...selectedMembers, checkedMember];
      }
    } else {
      selectedMembersList = selectedMembers.filter((d) => d.id !== checkedMemberId);
    }
    setSelectedMembers(selectedMembersList);
  };

  const handleSelectAllMember = (e: CheckboxChangeEvent) => {
    const { checked } = e.target;

    let newSelectedMembers = [];
    if (checked) {
      newSelectedMembers = uniqBy([...selectedMembers, ...accountsOfMember], (member) => member.id);
    } else {
      newSelectedMembers = selectedMembers.filter(
        (member) => !accountsOfMember.map((_member) => _member.id).includes(member.id),
      );
    }
    setSelectedMembers(newSelectedMembers);
  };

  const fetchDeptMembers = (selectedDeptId: string) => {
    return dispatch({
      type: 'organization/getDeptMembers',
      payload: { id: selectedDeptId },
    }).then(({ members: membersDto }: { members: Member[] }) => {
      return membersDto;
    });
  };

  const handleSelectDept = (selectedDeptId: string) => {
    fetchDeptMembers(selectedDeptId)
      .then((membersDto) => {
        setAccountsOfMember(membersDto);
      })
      .catch((e) => {
        msgIntl.error({ content: e });
      });
  };

  const handleOk = () => {
    if (onOk) {
      onOk(selectedMembers);
    }
  };
  useEffect(() => {
    if (visible) {
      setSelectedMembers(defaultSelectedMembers);

      dispatch<{ orgId: Nullable<string> }, Department[]>({
        type: 'organization/requestDepts',
        payload: { orgId: defaultOrgId },
      })
        .then((departments) => {
          const defaultDepartment = first(departments);
          setDepts(departments);
          if (defaultDepartment) {
            fetchDeptMembers(defaultDepartment.id)
              .then((membersDto) => {
                setAccountsOfMember(membersDto);
              })
              .catch((e) => {
                msgIntl.error({ content: e });
              });
          }
        })
        .catch((e) => msgIntl.error({ content: e }));
    }
  }, [visible]);

  const indeterminate =
    !!selectedMembers.length && selectedMembers.length < accountsOfMember.length;

  const checkedAll = isSelectedMembersIncludeAccountOfMember(selectedMembers, accountsOfMember);

  const membersFilteredBySearchName = useMemo(
    () => accountsOfMember.filter((member) => member.name?.includes(searchName ?? '')),
    [accountsOfMember, searchName],
  );

  return (
    <Modal
      className={styles.container}
      title={<FM id="role.common.add.member" />}
      width={640}
      visible={visible}
      maskClosable={false}
      onCancel={onCancel}
      destroyOnClose
      footer={
        <div className={styles.footer}>
          <span>
            <FM id="role.system.member.select-count" values={{ count: selectedMembers.length }} />
          </span>
          <div>
            <Button onClick={onCancel}>
              <FM id="dict.cancel" />
            </Button>
            <Button onClick={handleOk} type="primary">
              <FM id="dict.confirm" />
            </Button>
          </div>
        </div>
      }
    >
      <SearchableTag
        style={{ height: 110 }}
        tags={selectedMembers}
        onTagClose={(removeMemberId: string) =>
          setSelectedMembers(selectedMembers.filter((member) => removeMemberId !== member.id))
        }
        onSearch={(name: string) => {
          setSearchName(name);
        }}
        placeholder={intl.formatMessage({ id: 'role.system.member.find.ph' })}
      />
      <div className={styles.content}>
        {(searchName && (
          <>
            {(membersFilteredBySearchName.length > 0 && (
              <MemberList
                members={membersFilteredBySearchName}
                onChange={handleSelectMember}
                selectedMemberIds={selectedMembers.map((member) => member.id)}
              />
            )) || (
              <span>
                <FM id="role.system.member.find-empty" />
              </span>
            )}
          </>
        )) || (
          <>
            <div className={styles.depts}>
              {depts.length > 0 ? (
                <Tree
                  defaultExpandAll
                  treeData={generateTreeData(depts)}
                  onSelect={(selectedDeptIds) => {
                    const selectedDeptId = first(selectedDeptIds);
                    if (selectedDeptId) {
                      handleSelectDept(String(selectedDeptId));
                    }
                  }}
                />
              ) : null}
            </div>
            <div className={styles.members} data-loading={getDeptMembersLoading}>
              <LoadingWave size="small" loading={getDeptMembersLoading}>
                {accountsOfMember.length > 0 ? (
                  <div className={styles.checkListWrapper}>
                    <Checkbox
                      indeterminate={indeterminate}
                      onChange={handleSelectAllMember}
                      checked={checkedAll}
                    >
                      <FM id="role.common.add.checkall" />
                    </Checkbox>
                    <MemberList
                      members={accountsOfMember}
                      onChange={handleSelectMember}
                      selectedMemberIds={selectedMembers.map((member) => member.id)}
                    />
                  </div>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </LoadingWave>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
export default MemberModal;
