import React, { useState } from 'react';
import { Divider } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { ISchemaFieldComponentProps } from '@formily/antd';
import { actions } from '@comp/formily-custom/form-record';
import styles from './index.scss';

const CustomGroupTitle: React.FC<ISchemaFieldComponentProps> = (props) => {
  const [visible, setVisible] = useState<Boolean>(true);
  const startOrEnd = props.alignment === 'left' ? 'flexStart' : 'flexEnd';
  const position = props.alignment === 'center' ? 'center' : startOrEnd;
  const titleStyle = {
    justifyContent: position,
    width: '98%',
  };
  const handleToggle = () => {
    const { dispatch: uformDispatch } = actions;
    if (uformDispatch) {
      uformDispatch('toggle', { payload: { ...props, visible } });
    }
    setVisible(!visible);
  };
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.title} style={titleStyle}>
          <span>{props.name}</span>
        </div>
        {visible ? <UpOutlined onClick={handleToggle} /> : <DownOutlined onClick={handleToggle} />}
      </div>
      <Divider />
    </div>
  );
};

export default CustomGroupTitle;
