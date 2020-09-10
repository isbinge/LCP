import React from 'react';
import { ISchemaFieldComponentProps } from '@formily/antd';
import styles from './index.scss';

const CustomText: React.FC<ISchemaFieldComponentProps> = (props) => {
  const { style, value } = props;
  return (
    <div className={styles.container}>
      {/* <span className={styles.controlTitle}>{title}</span> */}
      <div className={styles.controlContent} style={style}>
        {value?.value || value?.name || value}
      </div>
    </div>
  );
};
export default CustomText;
