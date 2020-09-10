import { Tag } from 'antd';
import React, { ReactNode } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { UserOutlined, ClusterOutlined } from '@ant-design/icons';

import styles from './index.scss';

interface TagProps {
  id?: string;
  title?: ReactNode;
  icon?: 'user' | 'cluster';
  hasBorder?: boolean;
  fontSize?: number;
  color?: string;
  visible?: boolean;
  background?: string;
}

const getIcon = (color?: string, theme?: string) => {
  switch (theme) {
    case 'user':
      return <UserOutlined style={{ color }} />;
    case 'cluster':
      return <ClusterOutlined style={{ color }} />;
    default:
      return null;
  }
};

const CustomTag: React.FC<TagProps> = ({
  id,
  title,
  icon,
  hasBorder,
  fontSize: fontsize = 14,
  color = 'rgb(240,171,75)',
  visible = true,
  background = 'rgb(243, 246, 252)',
}) => {
  const border = hasBorder ? '1px' : '0px';
  return (
    <Tag
      visible={visible}
      style={{ border, fontSize: fontsize, background }}
      key={id || uuidv1()}
      className={styles.container}
    >
      {getIcon(color, icon)}
      <span style={{ color: '#666' }}>{title}</span>
    </Tag>
  );
};

export default CustomTag;
