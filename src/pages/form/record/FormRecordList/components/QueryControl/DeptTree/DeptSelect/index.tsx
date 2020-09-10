import React from 'react';
import { Tree, Empty } from 'antd';
import { TreeProps } from 'antd/lib/tree';

import { Department } from '@/domain/organization/data.d';
import FormRecordData from '@/domain/form/instance/data.d';

import styles from './index.scss';

type SelectedUsersType = { id: string; name: string };

const generateTreeData = (data: Department[]): TreeProps['treeData'] =>
  data.map((item) => ({
    key: item.id,
    title: item.name,
    children: item.childrens ? generateTreeData(item.childrens) : [],
  }));

interface DeptUsersProps {
  depts: Department[];
  selectedDepts: SelectedUsersType[];
  setSelectDepts: React.Dispatch<React.SetStateAction<SelectedUsersType[]>>;
  onChange: (value: FormRecordData.QueryValueType) => void;
}

const DeptSelect: React.FC<DeptUsersProps> = ({
  onChange: handleValueChange,
  depts,
  selectedDepts,
  setSelectDepts,
}) => {
  const handleCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    if (Array.isArray(checkedKeys)) {
      handleValueChange(checkedKeys);
    }
    const deptList: SelectedUsersType[] = [];
    info.checkedNodes.forEach((node) => {
      if (typeof node.key === 'string' && typeof node.title === 'string') {
        deptList.push({
          id: node.key,
          name: node.title,
        });
      }
    });
    setSelectDepts(deptList);
  };

  return (
    <>
      {depts.length > 0 ? (
        <Tree
          checkable
          checkedKeys={selectedDepts.map((dept) => dept.id)}
          blockNode
          selectable={false}
          onCheck={handleCheck}
          treeData={generateTreeData(depts)}
        />
      ) : (
        <div className={styles.empty}>
          <Empty description="No Data" />
        </div>
      )}
    </>
  );
};

export default DeptSelect;
