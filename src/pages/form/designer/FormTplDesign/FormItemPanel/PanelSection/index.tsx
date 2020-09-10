import React, { CSSProperties, ReactNode } from 'react';

import { Card } from 'antd';
import styles from './index.scss';

interface PanelSectionProps {
  title: ReactNode;
  style?: CSSProperties;
}

/**
 * 左侧控件面板
 * 分组
 */
const PanelSection: React.FC<PanelSectionProps> = (props) => (
  <Card
    bordered={false}
    style={props.style}
    bodyStyle={{ padding: '12px' }}
    className={styles.card}
  >
    <div className={styles.title}>{props.title}</div>
    <div className={styles.itemGrid}>{props.children}</div>
  </Card>
);

export default PanelSection;
