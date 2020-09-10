import React from 'react';
import { FormattedMessage as FM } from 'react-intl';
import styles from './index.scss';

const AssociationAttribute = () => (
  <div>
    <span className={styles.info}>
      <FM id="formtpl.canvas.comp.assocfield.ph" />
    </span>
  </div>
);

export default AssociationAttribute;
