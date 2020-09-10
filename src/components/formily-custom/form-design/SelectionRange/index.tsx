import React, { useState, useEffect, useMemo, ReactText } from 'react';
import { Button, Modal, Tabs } from 'antd';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import {
  PlusOutlined,
  PartitionOutlined,
  ClusterOutlined,
  HddOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'dva';
import { flatMap, forEach } from 'lodash';
import update from 'immutability-helper';

import FormTemplate from '@/domain/form/template/data.d';
import SearchableTag from '@comp/SearchableTag';
import {
  getSelectOptions,
  SelectionRangeTabType,
  getSelectedCtrl,
} from '@/domain/form/template/common';
import { flattenData } from '@/domain/organization/utils';
import DepartmentRange from './DepartmentRange';
import DynamicRange from './DynamicRange';

import styles from './index.scss';

const { TabPane } = Tabs;

interface SelectionRangeProps {
  value: FormTemplate.SelectionRange;
  onChange: (value: FormTemplate.SelectionRange) => void;
  isDept: boolean;
  title: React.ReactNode;
}
export interface CommonTreeDataType {
  key: string;
  title: string;
  hasChild?: boolean;
  icon?: React.ReactNode;
  children?: CommonTreeDataType[];
}

const initSelectionRange = {
  [SelectionRangeTabType.DEPT]: [],
  [SelectionRangeTabType.ROLE]: [],
  [SelectionRangeTabType.DEPT_CTRL]: [],
  [SelectionRangeTabType.OTHER]: [],
};

const SelectionRange: React.FC<SelectionRangeProps> = (props) => {
  const intl = useIntl();
  const { value: selectionRangeValue, onChange: handleChange, isDept, title } = props;
  const dispatch: Dva.Dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [
    depts,
    orgId,
    roleGroups,
    formItemSpecs,
    currentId,
  ] = useSelector(({ organization, account, role, formTemplate }) => [
    organization.depts,
    account.defaultOrgId,
    role.roleGroups,
    formTemplate.formItemSpecs,
    formTemplate.currentId,
  ]);
  const [activeKey, setActiveKey] = useState(SelectionRangeTabType.DEPT);
  const [selectionRange, setSelectionRange] = useState<FormTemplate.SelectionRange>(
    initSelectionRange,
  );
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    setSelectionRange(selectionRangeValue);
  }, []);

  useEffect(() => {
    dispatch({
      type: 'organization/requestDepts',
    });
    dispatch({
      type: 'role/getRoles',
      payload: { id: orgId },
    });
  }, []);

  const roleTreeData: CommonTreeDataType[] = useMemo(() => {
    const roles = flatMap(roleGroups, 'children');
    return roles.map((item) => ({
      key: item.roleId,
      title: item.roleName,
    }));
  }, [roleGroups]);

  const deptCtrlTreeData: CommonTreeDataType[] = useMemo(() => {
    const currentCode = getSelectedCtrl(currentId as string, formItemSpecs)?.code;
    const ownerDept = getSelectOptions(formItemSpecs, ['ownerDept']).map((item) => ({
      key: item.value,
      title: item.label,
    }));
    // 部门单选
    const deptSelect: { key: string; title: string }[] = [];
    // 部门多选
    const deptMultiSelect: { key: string; title: string }[] = [];
    return ownerDept.concat(deptSelect, deptMultiSelect).filter((item) => item.key !== currentCode);
  }, [formItemSpecs]);

  const otherTreeData: CommonTreeDataType[] = [
    {
      key: '-1',
      title: intl.formatMessage({ id: 'formtpl.schema.owner.modal.other.option' }),
      icon: <PartitionOutlined />,
    },
  ];

  const handleDeptSelect = (deptId: string) => {
    if (selectionRange[activeKey].includes(deptId)) {
      setSelectionRange({
        ...selectionRange,
        [activeKey]: selectionRange[activeKey].filter((item: ReactText) => item !== deptId),
      });
    } else {
      setSelectionRange({
        ...selectionRange,
        [activeKey]: [...selectionRange[activeKey], deptId],
      });
    }
  };

  const getTags = () => {
    const tagDataSource: { id: string; name?: React.ReactNode; icon?: React.ReactNode }[] = [];
    const flattenedDepts = flattenData(depts);
    forEach(selectionRange, (dataKeys, rangeType) => {
      switch (rangeType) {
        case SelectionRangeTabType.DEPT: {
          dataKeys.forEach((key) => {
            tagDataSource.push({
              id: key,
              name: flattenedDepts.find((dept) => dept.id === key)?.name,
              icon: <PartitionOutlined />,
            });
          });
          break;
        }
        case SelectionRangeTabType.ROLE: {
          dataKeys.forEach((key) =>
            tagDataSource.push({
              id: key,
              name: roleTreeData.find((group) => group.key === key)?.title,
              icon: <SolutionOutlined />,
            }),
          );
          break;
        }
        case SelectionRangeTabType.DEPT_CTRL: {
          dataKeys.forEach((key) =>
            tagDataSource.push({
              id: key,
              name: deptCtrlTreeData.find((deptCtrl) => deptCtrl.key === key)?.title,
              icon: <HddOutlined />,
            }),
          );
          break;
        }
        case SelectionRangeTabType.OTHER: {
          dataKeys.forEach((key) =>
            tagDataSource.push({
              id: key,
              name: otherTreeData.find((other) => other.key === key)?.title,
              icon: <ClusterOutlined />,
            }),
          );
          break;
        }
        default:
          break;
      }
    });
    return tagDataSource;
  };
  const handleDeleteTag = (deleteTagId: string) => {
    const filterKey = (data: string[]) => data.filter((key) => key !== deleteTagId);
    setSelectionRange(
      update(selectionRange, {
        dept: {
          $apply: filterKey,
        },
        role: {
          $apply: filterKey,
        },
        deptCtrl: {
          $apply: filterKey,
        },
        other: {
          $apply: filterKey,
        },
      }),
    );
  };

  const tags = getTags();

  return (
    <>
      <Button block onClick={() => setVisible(true)} className={styles.selectRangeButton}>
        <span className={styles.textStyle}>{tags.map((tag) => tag.name || '').join(';')}</span>
        <PlusOutlined />
      </Button>
      <Modal
        title={title}
        visible={visible}
        onOk={() => {
          handleChange(selectionRange);
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
        maskClosable={false}
        width={640}
        afterClose={() => {
          setActiveKey(SelectionRangeTabType.DEPT);
        }}
      >
        <SearchableTag
          style={{ height: 84, marginBottom: 5 }}
          tags={tags}
          searchName={searchKeyword}
          onSearch={(name) => setSearchKeyword(name)}
          onTagClose={handleDeleteTag}
        />
        <div className={styles.selectFrame}>
          <Tabs
            activeKey={activeKey}
            onChange={(key) => {
              if (key === activeKey) {
                return;
              }
              setActiveKey(key as SelectionRangeTabType);
              setSearchKeyword('');
            }}
          >
            <TabPane
              tab={<FM id="formtpl.schema.owner.modal.dept" />}
              key={SelectionRangeTabType.DEPT}
            >
              <DepartmentRange
                className={styles.range}
                searchKeyword={searchKeyword}
                depts={depts}
                selectedDeptIds={selectionRange.dept}
                onSelect={(_, nodeState) => {
                  handleDeptSelect(nodeState.node.key as string);
                }}
                onCheck={(_, nodeState) => {
                  handleDeptSelect(nodeState.node.key as string);
                }}
              />
            </TabPane>
            {!isDept && (
              <TabPane
                tab={<FM id="formtpl.schema.owner.modal.role" />}
                key={SelectionRangeTabType.ROLE}
              >
                <DynamicRange
                  className={styles.range}
                  treeDataSource={roleTreeData}
                  searchKeyword={searchKeyword}
                  selectTreeNodeIds={selectionRange.role}
                  onCheck={(_, nodeState) => {
                    handleDeptSelect(nodeState.node.key as string);
                  }}
                  onSelect={(_, nodeState) => {
                    handleDeptSelect(nodeState.node.key as string);
                  }}
                />
              </TabPane>
            )}
            <TabPane
              tab={<FM id="formtpl.schema.owner.modal.deptctrl" />}
              key={SelectionRangeTabType.DEPT_CTRL}
            >
              <DynamicRange
                className={styles.range}
                treeDataSource={deptCtrlTreeData}
                searchKeyword={searchKeyword}
                selectTreeNodeIds={selectionRange.deptCtrl}
                onCheck={(_, nodeState) => {
                  handleDeptSelect(nodeState.node.key as string);
                }}
                onSelect={(_, nodeState) => {
                  handleDeptSelect(nodeState.node.key as string);
                }}
              />
            </TabPane>
            <TabPane
              tab={<FM id="formtpl.schema.owner.modal.other" />}
              key={SelectionRangeTabType.OTHER}
            >
              <DynamicRange
                className={styles.range}
                treeDataSource={otherTreeData}
                searchKeyword={searchKeyword}
                selectTreeNodeIds={selectionRange.other}
                onCheck={(_, nodeState) => {
                  handleDeptSelect(nodeState.node.key as string);
                }}
                onSelect={(_, nodeState) => {
                  handleDeptSelect(nodeState.node.key as string);
                }}
              />
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    </>
  );
};

export default SelectionRange;
