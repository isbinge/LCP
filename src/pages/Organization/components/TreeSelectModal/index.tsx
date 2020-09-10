import React, { useState, ReactNode, useEffect, useMemo } from 'react';
import { Modal, Tree, Menu, Radio, Row, Button, Empty } from 'antd';

import { TreeProps } from 'antd/lib/tree';
import { ModalProps } from 'antd/lib/modal';
import { FormattedMessage as FM } from 'react-intl';

import SearchableTag from '@comp/SearchableTag';
import { flattenData } from '@/domain/organization/utils';

import styles from './index.scss';

interface TreeSelectModalProps extends ModalProps {
  visible: boolean;
  onConfirm: (keys: string[]) => void;
  onCancel: () => void;
  tabName?: ReactNode;
  title: ReactNode;
  treeDataSource: DataSource[];
  defaultSelectedKeys?: string[];
  multiple: boolean;
}

export interface DataSource {
  id: string;
  name?: string;
  childrens?: DataSource[];
}

const TreeSelectModal: React.FC<TreeSelectModalProps> = (props) => {
  const {
    visible,
    onConfirm,
    onCancel,
    tabName,
    title,
    defaultSelectedKeys,
    treeDataSource,
    multiple,
  } = props;

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [searchName, setSearchName] = useState<Nullable<string>>(null);

  useEffect(() => {
    if (defaultSelectedKeys) {
      setSelectedKeys(defaultSelectedKeys);
    }
  }, [defaultSelectedKeys]);

  const flattenedTreeDataSource = useMemo(() => flattenData(treeDataSource), [treeDataSource]);
  const itemsFilteredBySearchName = useMemo(
    () => flattenedTreeDataSource.filter((item) => item.name?.includes(searchName ?? '')),
    [flattenedTreeDataSource, searchName],
  );
  const handleSelect = (keys: string[]) => {
    setSelectedKeys(keys);
  };

  const handleRemove = (removeNodeId: string) => {
    setSelectedKeys(selectedKeys.filter((memberId) => memberId !== removeNodeId));
  };

  const handleSearch = (name: string) => {
    setSearchName(name);
  };

  const handleCancel = () => {
    setSelectedKeys(defaultSelectedKeys ?? []);
    onCancel();
  };

  const generateTreeData = (data: DataSource[] = treeDataSource): TreeProps['treeData'] => {
    const renderTreeNode = (nodeData: DataSource) => {
      const nodeNameElement = <span>{nodeData.name || ''}</span>;
      return (
        <span className={styles.treeNodeContainer}>
          {(multiple && nodeNameElement) || (
            <Radio
              checked={nodeData.id === selectedKeys[0]}
              onChange={() => {
                handleSelect([nodeData.id]);
              }}
            >
              {nodeNameElement}
            </Radio>
          )}
        </span>
      );
    };
    return data.map((item) => ({
      key: item.id,
      title: renderTreeNode(item),
      children:
        item.childrens && item.childrens?.length ? generateTreeData(item.childrens) : undefined,
    }));
  };

  const searchResults = itemsFilteredBySearchName.map((department) => (
    <Row key={department.id}>
      <Radio
        className={styles.radio}
        onChange={() => {
          handleSelect([department.id]);
        }}
        checked={department.id === selectedKeys[0]}
      >
        {department.name || ''}
      </Radio>
    </Row>
  ));
  return (
    <Modal
      destroyOnClose
      title={title}
      className={styles.container}
      visible={visible}
      onCancel={handleCancel}
      footer={
        <div>
          <Button onClick={handleCancel}>
            <FM id="dict.cancel" />
          </Button>
          <Button
            type="primary"
            loading={props.confirmLoading}
            disabled={!multiple && selectedKeys.length === 0}
            onClick={() => {
              onConfirm(selectedKeys);
            }}
          >
            <FM id="dict.confirm" />
          </Button>
        </div>
      }
    >
      <SearchableTag
        onSearch={handleSearch}
        onTagClose={handleRemove}
        tags={flattenedTreeDataSource.filter((item) => selectedKeys.includes(item.id))}
      />
      <div className={styles.treeWrapper}>
        {searchName ? (
          (itemsFilteredBySearchName.length > 0 && searchResults) || (
            <span>
              <FM id="org.dept.search-empty" />
            </span>
          )
        ) : (
          <div>
            {flattenedTreeDataSource.length > 0 ? (
              <>
                <Menu mode="horizontal" theme="light" defaultSelectedKeys={['0']}>
                  <Menu.Item key="0">{tabName}</Menu.Item>
                </Menu>
                <Tree
                  checkable={multiple}
                  className={styles.tree}
                  selectedKeys={selectedKeys}
                  onCheck={(checkedState) => {
                    if (!Array.isArray(checkedState)) {
                      handleSelect(checkedState.checked as string[]);
                    }
                  }}
                  checkedKeys={selectedKeys}
                  treeData={generateTreeData()}
                  checkStrictly
                  defaultExpandAll
                />
              </>
            ) : (
              <Empty />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
export default TreeSelectModal;
