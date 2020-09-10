import React from 'react';
import { FormattedMessage as FM } from 'react-intl';
import styles from './index.scss';

const Autogen = () => (
  <div>
    <span className={styles.info}>
      <FM id="formtpl.canvas.common.gen-by-sys" />
    </span>
  </div>
);

export default Autogen;
