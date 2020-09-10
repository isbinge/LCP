import React, { CSSProperties, useState, useEffect } from 'react';
import { Card, Tabs } from 'antd';
import { useSelector } from 'dva';
import { FormattedMessage as FM } from 'react-intl';

import FormProperties from './FormProperties';
import CompProperties from './CompProperties';

import styles from './index.scss';

interface FormControlProps {
  style?: CSSProperties;
}

/**
 * 表单设计 - 组件属性控制
 */
const FormControl: React.FC<FormControlProps> = (props) => {
  const [activeKey, setActiveKey] = useState('2');
  const currentId = useSelector(({ formTemplate }) => formTemplate.currentId);
  const handleChange = (key: string) => {
    setActiveKey(key);
  };
  useEffect(() => {
    if (currentId && currentId !== '') {
      setActiveKey('1');
    } else {
      setActiveKey('2');
    }
  }, [currentId]);

  return (
    <Card
      bordered={false}
      style={{ ...props.style }}
      className={styles.formItemControl}
      bodyStyle={{ padding: 0, height: '100%', display: 'flex' }}
    >
      <Tabs
        defaultActiveKey="1"
        tabBarStyle={{ margin: 0 }}
        activeKey={activeKey}
        onChange={handleChange}
        style={{ flex: 1 }}
      >
        <Tabs.TabPane
          tab={<FM id="formtpl.control.tab.compspec" />}
          key="1"
          style={{ overflowX: 'hidden', overflowY: 'auto' }}
          forceRender
        >
          <CompProperties />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<FM id="formtpl.control.tab.formspec" />} key="2">
          <FormProperties />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default FormControl;
