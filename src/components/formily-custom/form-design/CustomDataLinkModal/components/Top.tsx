import React, { useState, useEffect, ReactText } from 'react';
import { Button, Dropdown, Input, Tree, Empty, message } from 'antd';
import { UpOutlined, DownOutlined, ContainerOutlined } from '@ant-design/icons';

import { AssociationFormsProps } from '@comp/formily-custom/form-design/CustomSelectForm';
import { useDispatch, useSelector } from 'dva';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { SelectState } from '@/domain/select';
import styles from '../index.scss';

interface TreeDataProps {
  title: string;
  key: string;
  // icon: string;
  code?: string;
  parentId?: string;
  children?: TreeDataProps[];
}
interface IProps {
  dataLinkSchemaCode: ReactText;
  setDataLinkSchemaCode: React.Dispatch<ReactText>;
}

const { Search } = Input;

const Top: React.FC<IProps> = (props) => {
  const { dataLinkSchemaCode: selectId, setDataLinkSchemaCode: setSelectId } = props;
  const intl = useIntl();
  const [dropVisible, setDropVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [treeData, setTreeData] = useState<TreeDataProps[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<ReactText[]>([selectId]);
  const dispatch: Dva.Dispatch = useDispatch();

  const defaultOrgId = useSelector(({ account }: SelectState) => account.defaultOrgId);

  const handleVisibleChange = (flag: boolean) => {
    setDropVisible(flag);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
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

  const list = dataFormat(treeData);
  const handleSelect = (selectedKeys: ReactText[]) => {
    const item = list.find((l) => l.key === selectedKeys[0]);
    if (item && item.parentId) {
      setDropVisible(false);
      setSelectId(selectedKeys[0] || '');
    } else if (expandedKeys.findIndex((key) => key === selectedKeys[0]) > -1) {
      setExpandedKeys(expandedKeys.filter((key) => key !== selectedKeys[0]));
    } else {
      setExpandedKeys([...expandedKeys, selectedKeys[0]]);
    }
  };

  const onExpand = (texpandedKeys: ReactText[]) => {
    setExpandedKeys(texpandedKeys);
  };

  const transForm = (source: AssociationFormsProps[]): TreeDataProps[] =>
    source.map((sourceItem: AssociationFormsProps) => {
      if (sourceItem.children && !sourceItem.parentId) {
        return {
          title: sourceItem.name,
          key: sourceItem.code || sourceItem.id,
          icon: sourceItem.parentId ? <ContainerOutlined /> : null,
          children: transForm(sourceItem.children),
        };
      }
      return {
        title: sourceItem.name,
        key: sourceItem.code || sourceItem.id,
        icon: sourceItem.parentId ? <ContainerOutlined /> : null,
        parentId: sourceItem.parentId || '',
      };
    });
  const searchRlt = (tsearchValue: string) => {
    const dataSource = list.filter(
      (item: TreeDataProps) => item.title.indexOf(tsearchValue) > -1 && item.parentId,
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
              setSelectId(item.key);
              setDropVisible(false);
            }}
            key={item.key}
          >
            <div style={{ fontSize: 14, color: '#304265' }}>{title}</div>
            <div style={{ fontSize: 12 }}>{list.find((l) => l.key === item.parentId)?.title}</div>
          </div>
        );
      });
    }
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  };

  const menu = (
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
          selectedKeys={[selectId] as string[]}
          expandedKeys={expandedKeys as string[]}
          showIcon
          onSelect={handleSelect}
          onExpand={onExpand}
          treeData={treeData}
        />
      )}
    </div>
  );

  useEffect(() => {
    dispatch({
      type: 'formTemplate/getLinkForms',
      payload: {
        companyId: defaultOrgId,
      },
    })
      .then((linkForms) => {
        if (linkForms) {
          setTreeData(transForm(linkForms));
        }
      })
      .catch((error) => {
        message.error({ content: error, key: 'error' });
      });
  }, [1]);
  const selectItem = list.find((l) => l.key === selectId);
  return (
    <div>
      <div className={styles.text}>
        <FM id="formtpl.schema.datalinkage.targetform" />
      </div>
      <Dropdown
        placement="bottomCenter"
        visible={dropVisible}
        overlay={menu}
        trigger={['click']}
        overlayClassName={styles.overlayStyle}
        onVisibleChange={handleVisibleChange}
      >
        <>
          <Button style={{ width: '100%' }} onClick={() => setDropVisible(true)}>
            <div className={styles.button}>
              {selectItem ? (
                <div className={styles.textSelect}>{selectItem.title}</div>
              ) : (
                <FM id="formtpl.schema.datalinkage.formselect" />
              )}
              {dropVisible ? <UpOutlined /> : <DownOutlined />}
            </div>
          </Button>
        </>
      </Dropdown>
    </div>
  );
};

export default Top;
