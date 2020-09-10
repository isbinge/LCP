import React from 'react';

import styles from './index.scss';
import { PanelBtnRenderPayload } from '../../../../FormItemPanel/PanelButton';

type Alignment = 'left' | 'center' | 'right' | 'middle';

interface GroupTitleProps {
  options?: PanelBtnRenderPayload;
  value: {
    data: {
      alignment: Alignment;
      name: string;
    };
  };
}

const GroupTitle: React.FC<GroupTitleProps> = ({ value }) => {
  let align: Alignment = value.data.alignment;
  if (align === 'middle') {
    align = 'center';
  }
  return (
    <div className={styles.title} style={{ textAlign: align }}>
      {value.data.name}
    </div>
  );
};

export default GroupTitle;
