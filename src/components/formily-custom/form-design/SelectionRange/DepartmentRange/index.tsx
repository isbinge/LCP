import React, { useMemo } from 'react';
import { Tree } from 'antd';
import { TreeProps } from 'antd/lib/tree';
import { ShopOutlined, PartitionOutlined } from '@ant-design/icons';
import { flatMapDeep } from 'lodash';

import { Department } from '@/domain/organization/data';

interface DepartmentTabProps {
  className: string;
  searchKeyword: string;
  depts: Department[];
  selectedDeptIds: React.ReactText[];
  onSelect: TreeProps['onSelect'];
  onCheck: TreeProps['onCheck'];
}

const flatMapData = (data: NonNullable<TreeProps['treeData']>) => {
  return flatMapDeep(data, (n) => {
    if (n.children) {
      const flatted = flatMapData(n.children);
      const retArr: OrArray<typeof n>[] = [n];
      if (flatted) {
        retArr.push(flatted);
      }
      return retArr;
    }
    return [n];
  });
};

const generateDeptTreeData = (
  data: Department[],
  checkedKeys: { id: string; disabled: boolean }[],
): TreeProps['treeData'] =>
  data.map((item) => ({
    key: item.id,
    title: item.name,
    icon: item.id === item.parentId ? <ShopOutlined /> : <PartitionOutlined />,
    disabled: checkedKeys.find((ck) => ck.id === item.id)?.disabled,
    children: item.childrens ? generateDeptTreeData(item.childrens, checkedKeys) : [],
  }));

function depthTraversalDepts(data: Department[], cb?: (department: Department) => void) {
  data.forEach((item) => {
    if (cb) {
      cb(item);
    }
    if (item.hasChild) {
      depthTraversalDepts(item.childrens as Department[], cb);
    }
  });
}
const getCheckedDeptIds = (data: Department[]) => {
  const checkedIds: string[] = [];
  depthTraversalDepts(data, (item) => {
    checkedIds.push(item.id);
  });
  return checkedIds;
};
const getDisabledDepartmentNodes = (data: Department[]) => {
  const disabledDepartmentNodes: { id: string; disabled: boolean }[] = [];
  depthTraversalDepts(data, (item) => {
    disabledDepartmentNodes.push({ id: item.id, disabled: true });
  });
  return disabledDepartmentNodes;
};

const DepartmentRange: React.FC<DepartmentTabProps> = (props) => {
  const {
    selectedDeptIds,
    onSelect,
    onCheck,
    depts,
    searchKeyword: filterKeyword,
    className,
  } = props;

  const [deptTreeData, checkedDeptIds, departmentNodeStates] = useMemo(() => {
    const tempDepartmentNodeStates: { id: string; disabled: boolean }[] = [];
    const tempCheckedDeptIds: string[] = [];

    const retrieveDepartmentState = (data: Department[]) =>
      data.forEach((item) => {
        tempDepartmentNodeStates.push({ id: item.id, disabled: false });
        if (selectedDeptIds.includes(item.id)) {
          // 节点被选中， 遍历子节点，假选中所有子节点
          tempCheckedDeptIds.push(item.id);
          if (item.childrens) {
            // pushDisabled(item.childrens);
            tempDepartmentNodeStates.push(
              ...getDisabledDepartmentNodes(item.childrens as Department[]),
            );
            tempCheckedDeptIds.push(...getCheckedDeptIds(item.childrens as Department[]));
          }
        } else if (item.hasChild) {
          // 节点未选中
          retrieveDepartmentState(item.childrens as Department[]);
        }
      });

    retrieveDepartmentState(depts);

    return [
      generateDeptTreeData(depts, tempDepartmentNodeStates),
      tempCheckedDeptIds,
      tempDepartmentNodeStates,
    ];
  }, [depts, selectedDeptIds]);

  const matchedDepts = useMemo(() => {
    return flatMapData(deptTreeData || [])
      .filter((item) => (item.title as string).includes(filterKeyword))
      .map((item) => ({
        key: item.key,
        title: item.title,
        disabled: departmentNodeStates.find((dept) => dept.id === item.key)?.disabled,
      }));
  }, [deptTreeData, filterKeyword]);

  return (
    <div>
      <Tree
        className={className}
        showIcon
        blockNode
        checkable
        checkStrictly
        defaultExpandedKeys={
          selectedDeptIds.length > 0 ? selectedDeptIds : deptTreeData && [deptTreeData[0]?.key]
        }
        checkedKeys={checkedDeptIds}
        treeData={filterKeyword ? matchedDepts : deptTreeData}
        onCheck={onCheck}
        onSelect={onSelect}
      />
    </div>
  );
};
export default DepartmentRange;
