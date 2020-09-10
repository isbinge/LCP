import React, { useState, useEffect, ReactText } from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { Dropdown, Input, Tree, Empty, message } from 'antd';
import { TreeProps } from 'antd/lib/tree';

import { useDispatch, useSelector } from 'dva';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { CloseCircleOutlined, ContainerOutlined, FileOutlined } from '@ant-design/icons';
import { SelectState } from '@/domain/select';
import styles from './index.scss';

const { Search } = Input;
// const { TreeNode } = Tree;
interface TreeDataProps {
  title: string;
  value: string;
  key: string;
  parentId?: string;
  children?: TreeDataProps[];
}

export interface AssociationFormsProps {
  id: string;
  name: string;
  iconCss: string;
  canCheck: boolean;
  code?: string;
  parentId?: string;
  children?: AssociationFormsProps[];
}
/** 自定义custom-select-form
 *  用于关联表单选择表单使用
 */
const CustomSelectForm: React.FC<ISchemaFieldComponentProps> = (props) => {
  const { value: assocForm, onChange } = props;
  const intl = useIntl();
  const [searchValue, setSearchValue] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<ReactText[]>([assocForm.schemaCode]);
  const [dropVisible, setDropVisible] = useState(false);
  const [treeData, setTreeData] = useState<TreeDataProps[]>([]);
  const dispatch: Dva.Dispatch = useDispatch();
  const defaultOrgId = useSelector(({ account }: SelectState) => account.defaultOrgId);

  const transForm = (source: AssociationFormsProps[]): TreeDataProps[] =>
    source.map((sourceItem: AssociationFormsProps) => {
      let Icon = null;
      if (sourceItem.parentId && sourceItem.children) {
        Icon = <ContainerOutlined />;
      } else if (sourceItem.parentId && !sourceItem.children) {
        Icon = <FileOutlined />;
      }
      if (sourceItem.children) {
        return {
          title: sourceItem.name,
          value: sourceItem.id,
          key: sourceItem.code || sourceItem.id,
          icon: Icon,
          parentId: sourceItem.parentId,
          children: transForm(sourceItem.children),
        };
      }
      return {
        title: sourceItem.name,
        value: sourceItem.id,
        key: sourceItem.code || sourceItem.id,
        parentId: sourceItem.parentId,
        icon: Icon,
      };
    });

  const findNode = (data: TreeDataProps[], sValue: ReactText, t: TreeDataProps[] = []) => {
    data.forEach((item: TreeDataProps) => {
      if (item.key === sValue) {
        t.push(item);
      }
      if (item.children) {
        findNode(item.children, sValue, t);
      }
    });
    return t;
  };
  const dataFormat = (data: TreeDataProps[], t: TreeDataProps[] = []) => {
    data.forEach((item: TreeDataProps) => {
      if (item.children) {
        t.push(item);
        dataFormat(item.children, t);
      } else {
        t.push(item);
      }
    });
    return t;
  };
  const getParent = (sValue: ReactText) => {
    let parentName;
    let parentId;
    const dataList = dataFormat(treeData);
    dataList.forEach((item: TreeDataProps) => {
      if (item.children) {
        item.children.forEach((child: TreeDataProps) => {
          if (child.key === sValue) {
            parentName = item.title;
            parentId = item.value;
          }
        });
      }
    });
    return {
      name: parentName,
      id: parentId,
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSelect: TreeProps['onSelect'] = (selectedKeys) => {
    const parent = getParent(selectedKeys[0]);
    const node = findNode(treeData, selectedKeys[0])[0];
    if (!parent.id) {
      // 该节点时app
      if (expandedKeys.findIndex((key) => key === selectedKeys[0]) > -1) {
        setExpandedKeys(expandedKeys.filter((key) => key !== selectedKeys[0]));
      } else {
        setExpandedKeys([...expandedKeys, selectedKeys[0]]);
      }
    } else if (parent.id && node.children) {
      //  该节点为主表
      setDropVisible(false);
      onChange({ schemaCode: selectedKeys[0], schemaId: node.value, isChildSchema: false });
      //
    } else if (parent.id && !node.children) {
      setDropVisible(false);
      onChange({
        schemaCode: selectedKeys[0],
        schemaId: `${node.parentId}.${node.value}`,
        isChildSchema: true,
      });
    }
  };

  const onExpand = (texpandedKeys: ReactText[]) => {
    setExpandedKeys(texpandedKeys);
  };

  const handleVisibleChange = (flag: boolean) => {
    setDropVisible(flag);
  };

  const handleClick = () => {
    setDropVisible(true);
  };

  const searchRlt = (tsearchValue: string) => {
    const dataSource = dataFormat(treeData).filter(
      (item: TreeDataProps) =>
        item.title.indexOf(tsearchValue) > -1 && getParent(item.key).id && item.children,
    );
    if (dataSource.length > 0) {
      return dataSource.map((item: TreeDataProps) => {
        const index = item.title.indexOf(tsearchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + tsearchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#107fff' }}>{tsearchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        return (
          <div
            className={styles.menuItem}
            onClick={() => {
              onChange({
                schemaCode: item.key,
                schemaId: item.value,
                isChildSchema: item.value.includes('.'),
              });
              setDropVisible(false);
            }}
            key={item.key}
          >
            <div style={{ fontSize: 14, color: '#304265' }}>{title}</div>
            <div style={{ fontSize: 12 }}>{`${getParent(item.key).name}`}</div>
          </div>
        );
      });
    }
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  };

  const menu = (
    // <>
    <div className={styles.menu}>
      <Search
        style={{ margin: '8px 5px', width: 'calc(100% - 10px)', height: 32 }}
        placeholder={intl.formatMessage({ id: 'dict.search' })}
        value={searchValue}
        onChange={handleChange}
      />
      {searchValue ? (
        searchRlt(searchValue)
      ) : (
        <Tree
          blockNode
          selectedKeys={[assocForm.schemaCode]}
          expandedKeys={expandedKeys as string[]}
          showIcon
          onSelect={handleSelect}
          onExpand={onExpand}
          treeData={treeData}
        />
      )}
    </div>
    // </>
  );

  useEffect(() => {
    dispatch({
      type: 'formTemplate/getAssociationForms',
      payload: {
        companyId: defaultOrgId,
      },
    })
      .then((associationForms) => {
        if (associationForms) {
          setTreeData(transForm(associationForms));
        }
      })
      .catch((error) => {
        message.error({ content: error, key: 'error' });
      });
  }, []);

  return (
    <Dropdown
      placement="bottomCenter"
      visible={dropVisible}
      overlay={menu}
      trigger={['click']}
      overlayClassName={styles.overlayStyle}
      onVisibleChange={handleVisibleChange}
      getPopupContainer={() =>
        document.getElementById('form-design-comp-properties-area') as HTMLElement
      }
    >
      <div
        className={assocForm.schemaCode ? styles.button : styles.buttonPlaceholder}
        onClick={handleClick}
      >
        <span>
          {assocForm.schemaCode ? (
            findNode(treeData, assocForm.schemaCode)[0]?.title
          ) : (
            <FM id="formtpl.schema.assocform.selectform" />
          )}
        </span>
        <span className={styles.icon}>
          {assocForm.schemaCode ? (
            <CloseCircleOutlined
              onClick={() => onChange({ schemaCode: '', schemaId: '', isChildSchema: false })}
            />
          ) : null}
        </span>
      </div>
    </Dropdown>
  );
};

export default CustomSelectForm;
