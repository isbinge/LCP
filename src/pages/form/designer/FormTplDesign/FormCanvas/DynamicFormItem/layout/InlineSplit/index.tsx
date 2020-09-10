import React, { ReactElement } from 'react';
import { FormattedMessage as FM } from 'react-intl';
import styles from './index.scss';

interface CompProps {
  left?: ReactElement;
  right?: ReactElement;
}

const InlineSplit: React.FC<CompProps> = ({ left, right }) => (
  <div className={styles.container}>
    <div className={styles.subContainer}>
      {left || <FM id="formtpl.canvas.comp.inlinesplit.ph" />}
    </div>
    <div className={styles.subContainer}>
      {right || <FM id="formtpl.canvas.comp.inlinesplit.ph" />}
    </div>
  </div>
);

export default InlineSplit;
