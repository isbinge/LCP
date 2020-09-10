import React from 'react';

import { LoadingAvatar, LoadingTitle } from '../PartialSkeloton';

import styles from './index.scss';

export const AppButtonSkeleton: React.FC<{ loading?: boolean }> = ({
  loading = false,
  children,
}) => (
  <>
    {loading
      ? [...Array(10)]
          .map((_, k) => k)
          .map(v => (
            <div className={styles.appButtonContainer} key={v}>
              <LoadingAvatar loading />
              <LoadingTitle loading width={50} style={{ marginLeft: 4 }} />
            </div>
          ))
      : children}
  </>
);

export default AppButtonSkeleton;
