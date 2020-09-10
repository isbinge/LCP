import React from 'react';
import { Tree, Empty } from 'antd';
import { TreeProps } from 'antd/lib/tree';

import { CommonTreeDataType } from '../index';

interface DynamicRangeProps {
  className: string;
  treeDataSource: CommonTreeDataType[];
  selectTreeNodeIds: string[];
  searchKeyword: string;
  onSelect: TreeProps['onSelect'];
  onCheck: TreeProps['onCheck'];
}

const DynamicRange: React.FC<DynamicRangeProps> = (props) => {
  const { treeDataSource, selectTreeNodeIds, searchKeyword, onSelect, onCheck, className } = props;

  const matchedTreeData = treeDataSource.filter((item) => item.title.includes(searchKeyword));
  return (searchKeyword && matchedTreeData.length === 0) || treeDataSource.length === 0 ? (
    <Empty />
  ) : (
    <Tree
      className={className}
      blockNode
      checkable
      checkStrictly
      checkedKeys={selectTreeNodeIds}
      treeData={searchKeyword ? matchedTreeData : treeDataSource}
      onCheck={onCheck}
      onSelect={onSelect}
    />
  );
};

export default DynamicRange;
