import React from 'react';
import { FormItemSpec } from '@/domain/form/template/model';

import styles from './index.scss';

interface FieldsProps {
  subFormData: FormItemSpec;
}

const CustomFields: React.FC<FieldsProps> = (props) => {
  const { subFormData } = props;
  return (
    <div className={styles.container}>
      {subFormData &&
        subFormData.extraData?.map((item) => {
          const name = (item.compType === 'switch' && item.data.content) || item.data.name;
          return <span key={item.id}> {name} </span>;
        })}
    </div>
  );
};
export default CustomFields;
