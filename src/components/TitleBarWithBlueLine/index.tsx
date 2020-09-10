import React, { ReactNode } from 'react';

import styles from './index.scss';

interface BlueTitleProps {
  title: ReactNode;
  style?: React.CSSProperties;
}
/**
 * 带蓝色竖线的标题栏
 * @param title 标题
 * @param style 样式
 */
const TitleBarWithBlueLine: React.FC<BlueTitleProps> = ({ title, children, style }) => (
  <p className={styles.title} style={style}>
    {children || title}
  </p>
);

export default TitleBarWithBlueLine;
