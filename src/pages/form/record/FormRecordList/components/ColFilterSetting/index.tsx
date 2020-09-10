import React, { ReactText, ReactNode, useState, useEffect } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Dropdown, Card, Checkbox, Row, Button } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

import { FormattedMessage as FM } from 'react-intl';

import styles from './index.scss';

interface ElementProps {
  id: ReactText;
  title: ReactNode;
}

interface ColFilterSettingProps {
  visible: boolean;
  elements: ElementProps[];
  onClick?: (keys: ReactText[]) => void;
  selectedKeys: ReactText[];
  onVisibleChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const ColFilterSetting: React.FC<ColFilterSettingProps> = (props) => {
  const { onVisibleChange, visible, elements, onClick, selectedKeys } = props;
  const [selectedIds, setSelectedIds] = useState<ReactText[]>([]);
  const handleChange = (checkedValues: CheckboxValueType[]) => {
    setSelectedIds(checkedValues as ReactText[]);
  };
  const handleClick = () => {
    if (onClick) {
      onClick(selectedIds);
      onVisibleChange(false);
    }
  };
  useEffect(() => {
    if (visible) {
      setSelectedIds(selectedKeys);
    }
  }, [visible]);
  const menu = (
    <Card style={{ width: 220 }} bodyStyle={{ padding: '8px 12px' }}>
      <Checkbox.Group className={styles.group} value={selectedIds} onChange={handleChange}>
        {elements.map((el) => (
          <Row key={el.id}>
            <Checkbox className={styles.row} value={el.id}>
              {el.title}
            </Checkbox>
          </Row>
        ))}
      </Checkbox.Group>
      <Row justify="end">
        <Button type="primary" onClick={handleClick} size="small">
          <FM id="appdetail.formlist.filter.confirm" />
        </Button>
      </Row>
    </Card>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      visible={visible}
      onVisibleChange={onVisibleChange}
    >
      <MoreOutlined />
    </Dropdown>
  );
};

export default ColFilterSetting;
